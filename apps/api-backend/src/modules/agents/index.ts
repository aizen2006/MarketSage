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

				set.status = 500;
				return {
					error: {
						code: "INTERNAL_ERROR",
						message: "Error while running quick agent",
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

				set.status = 500;
				return {
					error: {
						code: "INTERNAL_ERROR",
						message: "Error while running deep agent",
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

				set.status = 500;
				return {
					error: {
						code: "INTERNAL_ERROR",
						message: "Error while running auto agent",
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
			} catch {
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
			} catch {
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
			} catch {
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

