import Elysia from "elysia";
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
	// --- JSON (non-streaming) endpoints ---
	.post(
		"/auto/json",
		async ({ body, userId, set }) => {
			try {
				const result = await AgentsService.chatJson("auto", body.message, {
					userId: String(userId),
				});
				return { response: result.response, mode: result.mode };
			} catch (e) {
				const msg = e instanceof Error ? e.message : "Agent error";
				console.error("Auto agent JSON error", {
					mode: "auto",
					promptPreview: body.message.slice(0, 100),
					message: msg,
					stack: e instanceof Error ? e.stack : undefined,
				});
				set.status = 500;
				return { error: { code: "INTERNAL_ERROR", message: msg } };
			}
		},
		{ body: AgentsModel.chatBodySchema },
	)
	.post(
		"/quick/json",
		async ({ body, userId, set }) => {
			try {
				const result = await AgentsService.chatJson("quick", body.message, {
					userId: String(userId),
				});
				return { response: result.response, mode: result.mode };
			} catch (e) {
				const msg = e instanceof Error ? e.message : "Agent error";
				console.error("Quick agent JSON error", {
					mode: "quick",
					promptPreview: body.message.slice(0, 100),
					message: msg,
					stack: e instanceof Error ? e.stack : undefined,
				});
				set.status = 500;
				return { error: { code: "INTERNAL_ERROR", message: msg } };
			}
		},
		{ body: AgentsModel.chatBodySchema },
	)
	.post(
		"/deep/json",
		async ({ body, userId, set }) => {
			try {
				const result = await AgentsService.chatJson("deep", body.message, {
					userId: String(userId),
				});
				return { response: result.response, mode: result.mode };
			} catch (e) {
				const msg = e instanceof Error ? e.message : "Agent error";
				console.error("Deep agent JSON error", {
					mode: "deep",
					promptPreview: body.message.slice(0, 100),
					message: msg,
					stack: e instanceof Error ? e.stack : undefined,
				});
				set.status = 500;
				return { error: { code: "INTERNAL_ERROR", message: msg } };
			}
		},
		{ body: AgentsModel.chatBodySchema },
	)
	.post(
		"/title",
		async ({ body, set }) => {
			try {
				const title = await AgentsService.generateTitle(body.message);
				return { title };
			} catch (e) {
				const msg = e instanceof Error ? e.message : "Title generation failed";
				console.error("Title agent error", { message: msg });
				set.status = 500;
				return { error: { code: "INTERNAL_ERROR", message: msg } };
			}
		},
		{ body: AgentsModel.titleBodySchema },
	);
