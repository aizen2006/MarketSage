import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import { prisma } from "db";
import { app as auth } from "./modules/auth/index";
import { app as apikeys } from "./modules/apikeys/index";
import { app as payments } from "./modules/payments/index";
import { app as user } from "./modules/user/index";
import { app as agents } from "./modules/agents/index";

export const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || "*",
			credentials: true,
		}),
	)
	.get("/health", () => ({ status: "ok" }))
	.get("/health/db", async ({ set }) => {
		try {
			await prisma.$queryRaw`SELECT 1`;
			return { status: "ok" };
		} catch (e) {
			const message = e instanceof Error ? e.message : "Database unreachable";
			console.error("Core backend DB health check failed:", e);
			set.status = 503;
			return {
				status: "error",
				message,
			};
		}
	})
	.use(auth)
	.use(apikeys)
	.use(payments)
	.use(user)
	.use(agents);