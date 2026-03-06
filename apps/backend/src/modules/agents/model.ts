import { t, type UnwrapSchema } from "elysia";

export const AgentsModel = {
	chatQuerySchema: t.Object({
		// /agents/chat?message=...
		message: t.String(),
	}),
	chatBodySchema: t.Object({
		message: t.String(),
	}),
} as const;

export type AgentsModel = {
	[k in keyof typeof AgentsModel]: UnwrapSchema<(typeof AgentsModel)[k]>;
};