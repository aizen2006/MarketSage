import { run, type StreamedRunResult } from "@openai/agents";
import Triage_Agent from "agents/triage_agent";
import Quick_Agent from "agents/quick_agent";
import Deep_Agent from "agents/deep_agent";

type ChatMode = "auto" | "quick" | "deep";

interface TriageDecision {
	mode: "quick" | "deep";
	context_note?: string;
}

export abstract class AgentsService {
	private static getAgent(mode: "quick" | "deep") {
		if (mode === "quick") return Quick_Agent;
		return Deep_Agent;
	}

	static async streamChat(
		mode: ChatMode,
		message: string,
		context: { userId?: string | number },
	): Promise<StreamedRunResult<any, any>> {
		if (mode === "quick" || mode === "deep") {
			return run(this.getAgent(mode), message, {
				stream: true,
				context,
				maxTurns: 25,
			});
		}

		// Auto mode: run triage first (non-streaming) to get routing decision,
		// then stream the chosen sub-agent.
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
			// If triage output can't be parsed, default to quick
		}

		return run(this.getAgent(routedMode), augmentedMessage, {
			stream: true,
			context,
			maxTurns: 25,
		});
	}
}
