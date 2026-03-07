import { Agent, run } from "@openai/agents";
import Triage_Agent from "agents/triage_agent";
import Quick_Agent from "agents/quick_agent";
import Deep_Agent from "agents/deep_agent";

type ChatMode = "auto" | "quick" | "deep";

const Title_Agent = Agent.create({
	name: "titleAgent",
	instructions: `You generate very short conversation titles for a finance chat app. Given the user's first message, reply with ONLY a 3-6 word title. No quotes, no punctuation at the end, no explanation. Examples: "AAPL revenue last quarter", "Compare NVDA and AMD", "Portfolio risk overview".`,
	model: "gpt-4o-mini",
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
		return mode === "deep" ? 14 : 25;
	}

	private static async routeAuto(
		message: string,
		context: { userId?: string | number },
	): Promise<{ routedMode: "quick" | "deep"; augmentedMessage: string }> {
		const triageResult = await run(Triage_Agent as any, message, {
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
		if (mode === "quick" || mode === "deep") {
			const result = await run(this.getAgent(mode), message, {
				context,
				maxTurns: this.maxTurnsFor(mode),
			});
			const raw = result.finalOutput;
			const text =
				typeof raw === "string"
					? raw
					: (raw && typeof raw === "object" && "response" in raw
							? (raw as { response: unknown }).response
							: String(raw ?? ""));
			return { response: String(text), mode };
		}

		const { routedMode, augmentedMessage } = await this.routeAuto(message, context);

		const result = await run(this.getAgent(routedMode), augmentedMessage, {
			context,
			maxTurns: this.maxTurnsFor(routedMode),
		});
		const raw = result.finalOutput;
		const text =
			typeof raw === "string"
				? raw
				: (raw && typeof raw === "object" && "response" in raw
						? (raw as { response: unknown }).response
						: String(raw ?? ""));
		return { response: String(text), mode: "auto" };
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
