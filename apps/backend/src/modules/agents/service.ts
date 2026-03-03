import { run, type StreamedRunResult } from "@openai/agents";
import Triage_Agent from "agents/triage_agent";
import Quick_Agent from "agents/quick_agent";
import Deep_Agent from "agents/deep_agent";

type ChatMode = "auto" | "quick" | "deep";

export abstract class AgentsService {
	private static getAgent(mode: ChatMode) {
		if (mode === "quick") return Quick_Agent;
		if (mode === "deep") return Deep_Agent;

		// default: auto / triage
		return Triage_Agent;
	}

	static async streamChat(
		mode: ChatMode,
		message: string,
		context: { userId?: string | number },
	): Promise<StreamedRunResult<any, any>> {
		const agent = this.getAgent(mode);

		const stream = await run(agent, message, {
			stream: true,
			context,
		});

		return stream;
	}
}