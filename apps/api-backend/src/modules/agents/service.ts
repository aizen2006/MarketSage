import { run, type StreamedRunResult } from "@openai/agents";
import { randomUUID } from "crypto";
import Triage_Agent from "agents/triage_agent";
import Quick_Agent from "agents/quick_agent";
import Deep_Agent from "agents/deep_agent";
import { upsert_data, semantic_search } from "../../utils/pinecone";

export type ChatMode = "auto" | "quick" | "deep";

type AgentContext = {
	userId: string;
	apiKeyId: string;
};

const RAG_TOP_K = 5;

// Extract the plain text response from an agent's structured finalOutput.
function extractText(raw: unknown): string {
	return typeof raw === "string"
		? raw
		: raw && typeof raw === "object" && "response" in raw
			? String((raw as { response: unknown }).response)
			: String(raw ?? "");
}

// RAG retrieval: semantic search over this user's prior research before the
// chat runs. Returns a context block to append to the prompt, or "" if empty.
async function retrieveContext(
	prompt: string,
	userId?: string,
): Promise<string> {
	try {
		// Scope retrieval to this user's own prior research (per-user memory).
		const filter = userId ? { userId } : undefined;
		const hits = await semantic_search(prompt, RAG_TOP_K, ["text"], filter);
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
	prompt: string,
	response: string,
	mode: ChatMode,
	userId?: string,
): Promise<void> {
	if (!response.trim()) return;
	try {
		await upsert_data([
			{
				id: randomUUID(),
				text: `Q: ${prompt}\n\nA: ${response}`,
				metadata: {
					mode,
					userId: userId ?? "anonymous",
					query: prompt.slice(0, 500),
					createdAt: new Date().toISOString(),
				},
			},
		]);
	} catch (e) {
		console.error("RAG store failed; continuing", e);
	}
}

export abstract class AgentsService {
	private static getAgent(mode: ChatMode) {
		if (mode === "quick") return Quick_Agent;
		if (mode === "deep") return Deep_Agent;

		// default: auto / triage
		return Triage_Agent;
	}

	static async runOnce(
		mode: ChatMode,
		prompt: string,
		context: AgentContext,
	): Promise<unknown> {
		const agent = this.getAgent(mode);

		// RAG: semantic search over prior research BEFORE invoking the agent.
		const ragContext = await retrieveContext(prompt, context.userId);

		const result = await run(agent, `${prompt}${ragContext}`, {
			context,
		});

		// RAG: persist the completed analysis for future retrieval.
		await storeAnalysis(prompt, extractText(result.finalOutput), mode, context.userId);

		return result.finalOutput;
	}

	static async stream(
		mode: ChatMode,
		prompt: string,
		context: AgentContext,
	): Promise<StreamedRunResult<AgentContext, any>> {
		const agent = this.getAgent(mode);

		// RAG: semantic search over prior research BEFORE invoking the agent.
		const ragContext = await retrieveContext(prompt, context.userId);

		const stream = await run(agent, `${prompt}${ragContext}`, {
			stream: true,
			context,
		});

		// RAG: persist the analysis once streaming completes (non-blocking).
		stream.completed
			.then(() =>
				storeAnalysis(prompt, extractText(stream.finalOutput), mode, context.userId),
			)
			.catch(() => {});

		return stream;
	}
}
