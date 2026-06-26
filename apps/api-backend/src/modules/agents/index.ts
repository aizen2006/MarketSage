import Elysia, { t, sse } from "elysia";
import { apiKeyAuth } from "../auth/apiKeyAuth";
import { AgentsService, type ChatMode } from "./service";
import { BillingService } from "../billing/service";

const ChatBodySchema = t.Object({
	prompt: t.String(),
});

const ChatQuerySchema = t.Object({
	prompt: t.String(),
});

type Mode = ChatMode;

const CALL_COST: Record<Mode, number> = {
	quick: 1,
	deep: 1,
	auto: 1,
};

function getCost(mode: Mode): number {
	return CALL_COST[mode] ?? 1;
}

/** Return a short user-facing message for known errors; otherwise generic. */
function sanitizeAgentErrorMessage(e: unknown, generic: string): string {
	const msg = e && typeof e === "object" && "message" in e && typeof (e as any).message === "string"
		? (e as any).message
		: "";
	if (msg.includes("FMP_API_KEY") || msg.includes("OPENAI") || msg.includes("API key") || msg.includes("api key")) {
		return "Configuration error: check API keys (OpenAI, FMP). See server logs for details.";
	}
	return generic;
}

export const app = new Elysia({ prefix: "/v1/agents" })
	.use(apiKeyAuth)

	// --- JSON endpoints ---
	.post(
		"/quick",
		async ({ body, userId, apiKeyId, set }) => {
			try {
				const result = await BillingService.withBilling(
					String(userId),
					String(apiKeyId),
					getCost("quick"),
					() =>
						AgentsService.runOnce("quick", body.prompt, {
							userId: String(userId),
							apiKeyId: String(apiKeyId),
						}),
				);

				return {
					response: (result as any).response ?? String(result),
					mode: "quick" as const,
				};
			} catch (e: any) {
				if (e?.code === "INSUFFICIENT_CREDITS" || e?.message === "INSUFFICIENT_CREDITS") {
					set.status = 402;
					return {
						error: {
							code: "INSUFFICIENT_CREDITS",
							message: "Not enough credits to run quick agent",
						},
					};
				}

				console.error("Quick agent error", e);
				console.error("Quick agent error details", { message: e?.message, stack: e?.stack });
				set.status = 500;
				return {
					error: {
						code: "INTERNAL_ERROR",
						message: sanitizeAgentErrorMessage(e, "Error while running quick agent"),
					},
				};
			}
		},
		{
			body: ChatBodySchema,
			response: t.Any(),
		},
	)
	.post(
		"/deep",
		async ({ body, userId, apiKeyId, set }) => {
			try {
				const result = await BillingService.withBilling(
					String(userId),
					String(apiKeyId),
					getCost("deep"),
					() =>
						AgentsService.runOnce("deep", body.prompt, {
							userId: String(userId),
							apiKeyId: String(apiKeyId),
						}),
				);

				return {
					response: (result as any).response ?? String(result),
					mode: "deep" as const,
				};
			} catch (e: any) {
				if (e?.code === "INSUFFICIENT_CREDITS" || e?.message === "INSUFFICIENT_CREDITS") {
					set.status = 402;
					return {
						error: {
							code: "INSUFFICIENT_CREDITS",
							message: "Not enough credits to run deep agent",
						},
					};
				}

				console.error("Deep agent error", e);
				console.error("Deep agent error details", { message: e?.message, stack: e?.stack });
				set.status = 500;
				return {
					error: {
						code: "INTERNAL_ERROR",
						message: sanitizeAgentErrorMessage(e, "Error while running deep agent"),
					},
				};
			}
		},
		{
			body: ChatBodySchema,
			response: t.Any(),
		},
	)
	.post(
		"/auto",
		async ({ body, userId, apiKeyId, set }) => {
			try {
				const result = await BillingService.withBilling(
					String(userId),
					String(apiKeyId),
					getCost("auto"),
					() =>
						AgentsService.runOnce("auto", body.prompt, {
							userId: String(userId),
							apiKeyId: String(apiKeyId),
						}),
				);

				return {
					response: (result as any).response ?? String(result),
					mode: "auto" as const,
				};
			} catch (e: any) {
				if (e?.code === "INSUFFICIENT_CREDITS" || e?.message === "INSUFFICIENT_CREDITS") {
					set.status = 402;
					return {
						error: {
							code: "INSUFFICIENT_CREDITS",
							message: "Not enough credits to run auto agent",
						},
					};
				}

				console.error("Auto agent error", e);
				console.error("Auto agent error details", { message: e?.message, stack: e?.stack });
				set.status = 500;
				return {
					error: {
						code: "INTERNAL_ERROR",
						message: sanitizeAgentErrorMessage(e, "Error while running auto agent"),
					},
				};
			}
		},
		{
			body: ChatBodySchema,
			response: t.Any(),
		},
	)

	// --- Streaming endpoints (SSE) ---
	.get(
		"/quick/stream",
		async function* ({ query, userId, apiKeyId, set }) {
			try {
				await BillingService.chargeUpfront(
					String(userId),
					String(apiKeyId),
					getCost("quick"),
				);
			} catch (e: any) {
				if (e?.code === "INSUFFICIENT_CREDITS" || e?.message === "INSUFFICIENT_CREDITS") {
					set.status = 402;
					yield sse({
						event: "error",
						data: {
							code: "INSUFFICIENT_CREDITS",
							message: "Not enough credits to run quick agent",
						},
					});
					return;
				}

				console.error("Quick agent stream (chargeUpfront) error", e);
				console.error("Quick agent stream error details", { message: e?.message, stack: e?.stack });
				set.status = 500;
				yield sse({
					event: "error",
					data: {
						code: "INTERNAL_ERROR",
						message: "Error while starting quick agent stream",
					},
				});
				return;
			}

			try {
				const stream = await AgentsService.stream("quick", query.prompt, {
					userId: String(userId),
					apiKeyId: String(apiKeyId),
				});

				for await (const chunk of stream.toTextStream()) {
					yield sse(chunk);
				}

				await stream.completed;
			} catch (e: any) {
				console.error("Quick agent stream (streaming) error", e);
				console.error("Quick agent stream error details", { message: e?.message, stack: e?.stack });
				yield sse({
					event: "error",
					data: {
						code: "INTERNAL_ERROR",
						message: "Error while streaming quick agent",
					},
				});
			}
		},
		{
			query: ChatQuerySchema,
			response: t.Any(),
		},
	)
	.get(
		"/deep/stream",
		async function* ({ query, userId, apiKeyId, set }) {
			try {
				await BillingService.chargeUpfront(
					String(userId),
					String(apiKeyId),
					getCost("deep"),
				);
			} catch (e: any) {
				if (e?.code === "INSUFFICIENT_CREDITS" || e?.message === "INSUFFICIENT_CREDITS") {
					set.status = 402;
					yield sse({
						event: "error",
						data: {
							code: "INSUFFICIENT_CREDITS",
							message: "Not enough credits to run deep agent",
						},
					});
					return;
				}

				console.error("Deep agent stream (chargeUpfront) error", e);
				console.error("Deep agent stream error details", { message: e?.message, stack: e?.stack });
				set.status = 500;
				yield sse({
					event: "error",
					data: {
						code: "INTERNAL_ERROR",
						message: "Error while starting deep agent stream",
					},
				});
				return;
			}

			try {
				const stream = await AgentsService.stream("deep", query.prompt, {
					userId: String(userId),
					apiKeyId: String(apiKeyId),
				});

				for await (const chunk of stream.toTextStream()) {
					yield sse(chunk);
				}

				await stream.completed;
			} catch (e: any) {
				console.error("Deep agent stream (streaming) error", e);
				console.error("Deep agent stream error details", { message: e?.message, stack: e?.stack });
				yield sse({
					event: "error",
					data: {
						code: "INTERNAL_ERROR",
						message: "Error while streaming deep agent",
					},
				});
			}
		},
		{
			query: ChatQuerySchema,
			response: t.Any(),
		},
	)
	.get(
		"/auto/stream",
		async function* ({ query, userId, apiKeyId, set }) {
			try {
				await BillingService.chargeUpfront(
					String(userId),
					String(apiKeyId),
					getCost("auto"),
				);
			} catch (e: any) {
				if (e?.code === "INSUFFICIENT_CREDITS" || e?.message === "INSUFFICIENT_CREDITS") {
					set.status = 402;
					yield sse({
						event: "error",
						data: {
							code: "INSUFFICIENT_CREDITS",
							message: "Not enough credits to run auto agent",
						},
					});
					return;
				}

				console.error("Auto agent stream (chargeUpfront) error", e);
				console.error("Auto agent stream error details", { message: e?.message, stack: e?.stack });
				set.status = 500;
				yield sse({
					event: "error",
					data: {
						code: "INTERNAL_ERROR",
						message: "Error while starting auto agent stream",
					},
				});
				return;
			}

			try {
				const stream = await AgentsService.stream("auto", query.prompt, {
					userId: String(userId),
					apiKeyId: String(apiKeyId),
				});

				for await (const chunk of stream.toTextStream()) {
					yield sse(chunk);
				}

				await stream.completed;
			} catch (e: any) {
				console.error("Auto agent stream (streaming) error", e);
				console.error("Auto agent stream error details", { message: e?.message, stack: e?.stack });
				yield sse({
					event: "error",
					data: {
						code: "INTERNAL_ERROR",
						message: "Error while streaming auto agent",
					},
				});
			}
		},
		{
			query: ChatQuerySchema,
			response: t.Any(),
		},
	);

