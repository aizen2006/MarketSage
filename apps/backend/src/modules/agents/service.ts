import { Agent, run } from "@openai/agents";
import { randomUUID } from "crypto";
import Triage_Agent from "agents/triage_agent";
import Quick_Agent from "agents/quick_agent";
import Deep_Agent from "agents/deep_agent";
import { upsert_data, semantic_search } from "../../utils/pinecone";

type ChatMode = "auto" | "quick" | "deep";

const RAG_TOP_K = 5;

// Extract the plain text response from an agent's structured finalOutput.
function extractText(raw: unknown): string {
	return typeof raw === "string"
		? raw
		: raw && typeof raw === "object" && "response" in raw
			? String((raw as { response: unknown }).response)
			: String(raw ?? "");
}

// RAG retrieval: semantic search over prior research before the chat runs.
// Returns a context block to append to the prompt, or "" if nothing useful.
async function retrieveContext(
	message: string,
	userId?: string | number,
): Promise<string> {
	try {
		// Scope retrieval to this user's own prior research (per-user memory).
		const filter =
			userId != null ? { userId: String(userId) } : undefined;
		const hits = await semantic_search(message, RAG_TOP_K, ["text"], filter);
		if (hits.length === 0) return "";
		const blocks = hits.map((h, i) => {
			const text =
				typeof h.fields.text === "string"
					? h.fields.text
					: JSON.stringify(h.fields);
			return `[${i + 1}] (relevance ${h.score.toFixed(3)})\n${text}`;
		});
		return `\n\n[Retrieved context from prior research — use only if relevant, treat as memory not ground truth]\n${blocks.join("\n\n")}`;
	} catch (e) {
		// RAG is best-effort: never fail the chat because retrieval is down.
		console.error("RAG retrieval failed; continuing without context", e);
		return "";
	}
}

// RAG persistence: embed and store the completed analysis for future retrieval.
async function storeAnalysis(
	message: string,
	response: string,
	mode: ChatMode,
	userId?: string | number,
): Promise<void> {
	if (!response.trim()) return;
	try {
		await upsert_data([
			{
				id: randomUUID(),
				text: `Q: ${message}\n\nA: ${response}`,
				metadata: {
					mode,
					userId: userId != null ? String(userId) : "anonymous",
					query: message.slice(0, 500),
					createdAt: new Date().toISOString(),
				},
			},
		]);
	} catch (e) {
		console.error("RAG store failed; continuing", e);
	}
}

const Title_Agent = Agent.create({
	name: "titleAgent",
	instructions: `You generate very short conversation titles for a finance chat app. Given the user's first message, reply with ONLY a 3-6 word title. No quotes, no punctuation at the end, no explanation. Examples: "AAPL revenue last quarter", "Compare NVDA and AMD", "Portfolio risk overview".`,
	model: "gpt-5.4-mini",
});

interface TriageDecision {
	mode: "quick" | "deep";
	context_note?: string;
}

export abstract class AgentsService {

	private static getAgent(mode: "quick" | "deep") {
		// Cast to avoid cross-package generic incompatibilities while preserving runtime behavior.
		if (mode === "quick") return Quick_Agent as any;
		return Deep_Agent as any;
	}

	private static maxTurnsFor(mode: "quick" | "deep") {
		return mode === "quick" ? 14 : 25;
	}

	private static async routeAuto(
		message: string,
		context: { userId?: string | number },
	): Promise<{ routedMode: "quick" | "deep"; augmentedMessage: string }> {
		
		const triageResult = await run(Triage_Agent, message, {
			context,
			maxTurns: 25,
		});

		let routedMode: "quick" | "deep" = "quick";
		let augmentedMessage = message;

		try {
			const raw = triageResult.finalOutput;
			const parsed: TriageDecision =
				typeof raw === "string" ? JSON.parse(raw) : raw;
			routedMode = parsed.mode === "deep" ? "deep" : "quick";
			if (parsed.context_note) {
				augmentedMessage = `${message}\n\n[Routing context: ${parsed.context_note}]`;
			}
		} catch {
			// default to quick if triage output is malformed
		}

		return { routedMode, augmentedMessage };
	}

	static async chatJson(
		mode: ChatMode,
		message: string,
		context: { userId?: string | number },
	): Promise<{ response: string; mode: ChatMode }> {
		// RAG: semantic search over this user's prior research BEFORE invoking the agent.
		const ragContext = await retrieveContext(message, context.userId);

		if (mode === "quick" || mode === "deep") {
			const result = await run(this.getAgent(mode), `${message}${ragContext}`, {
				context,
				maxTurns: this.maxTurnsFor(mode),
			});
			const text = extractText(result.finalOutput);
			// RAG: persist the completed analysis for future retrieval.
			await storeAnalysis(message, text, mode, context.userId);
			return { response: text, mode };
		}

		const { routedMode, augmentedMessage } = await this.routeAuto(message, context);

		const result = await run(
			this.getAgent(routedMode),
			`${augmentedMessage}${ragContext}`,
			{
				context,
				maxTurns: this.maxTurnsFor(routedMode),
			},
		);
		const text = extractText(result.finalOutput);
		await storeAnalysis(message, text, "auto", context.userId);
		return { response: text, mode: "auto" };
	}

	static async generateTitle(firstMessage: string): Promise<string> {
		const result = await run(Title_Agent as any, firstMessage, {
			maxTurns: 1,
		});
		const raw = result.finalOutput;
		const title =
			typeof raw === "string"
				? raw
				: raw != null && typeof raw === "object" && "response" in (raw as object)
					? String((raw as { response: unknown }).response)
					: String(raw ?? "New conversation");
		return title.trim().slice(0, 80) || "New conversation";
	}
}
