import { run, type StreamedRunResult } from "@openai/agents";
import Triage_Agent from "agents/triage_agent";
import Quick_Agent from "agents/quick_agent";
import Deep_Agent from "agents/deep_agent";

export type ChatMode = "auto" | "quick" | "deep";

type AgentContext = {
	userId: string;
	apiKeyId: string;
};

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

		const result = await run(agent, prompt, {
			context,
		});

		return result.finalOutput;
	}

	static async stream(
		mode: ChatMode,
		prompt: string,
		context: AgentContext,
	): Promise<StreamedRunResult<AgentContext, any>> {
		const agent = this.getAgent(mode);

		const stream = await run(agent, prompt, {
			stream: true,
			context,
		});

		return stream;
	}
}

