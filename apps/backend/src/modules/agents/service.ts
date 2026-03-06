import { run } from "@openai/agents";
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
}
