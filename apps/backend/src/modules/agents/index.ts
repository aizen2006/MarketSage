import Elysia, { t, sse } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AgentsModel } from "./model";
import { AgentsService } from "./service";

export const app = new Elysia({ prefix: "/agents" })
	.use(
		jwt({
			name: "jwt",
			secret: process.env.JWT_SECRET!,
		}),
	)
	// auth: decode JWT from "auth" cookie and inject userId
	.resolve(async ({ cookie: { auth }, status, jwt }) => {
		if (!auth) {
			return status(401);
		}
		const decoded = await jwt.verify(auth.value as string);
		if (!decoded || !decoded.userId) {
			return status(401);
		}

		return {
			userId: decoded.userId as number,
		};
	})

	// --- Auto mode (triage agent) ---
	.get(
		"/auto",
		async function* ({ query, userId }) {
			try {
				const runStream = await AgentsService.streamChat("auto", query.message, {
					userId: String(userId),
				});

				for await (const chunk of runStream.toTextStream()) {
					yield sse(chunk);
				}

				await runStream.completed;
			} catch {
				yield sse({
					event: "error",
					data: {
						message: "Error while streaming auto chat",
					},
				});
			}
		},
		{
			query: AgentsModel.chatQuerySchema,
			response: t.Any(),
		},
	)

	// --- Quick mode (quick agent) ---
	.get(
		"/quick",
		async function* ({ query, userId }) {
			try {
				const runStream = await AgentsService.streamChat("quick", query.message, {
					userId: String(userId),
				});

				for await (const chunk of runStream.toTextStream()) {
					yield sse(chunk);
				}

				await runStream.completed;
			} catch {
				yield sse({
					event: "error",
					data: {
						message: "Error while streaming quick chat",
					},
				});
			}
		},
		{
			query: AgentsModel.chatQuerySchema,
			response: t.Any(),
		},
	)

	// --- Deep mode (deep agent) ---
	.get(
		"/deep",
		async function* ({ query, userId }) {
			try {
				const runStream = await AgentsService.streamChat("deep", query.message, {
					userId: String(userId),
				});

				for await (const chunk of runStream.toTextStream()) {
					yield sse(chunk);
				}

				await runStream.completed;
			} catch {
				yield sse({
					event: "error",
					data: {
						message: "Error while streaming deep chat",
					},
				});
			}
		},
		{
			query: AgentsModel.chatQuerySchema,
			response: t.Any(),
		},
	);
