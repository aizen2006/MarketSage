import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import { prisma } from "db";
import { app as agents } from "./modules/agents";

export const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || "*",
		}),
	)
	.get("/health", () => ({ status: "ok" }))
	.get("/health/db", async ({ set }) => {
		try {
			await prisma.$queryRaw`SELECT 1`;
			return { status: "ok" };
		} catch (e) {
			const message = e instanceof Error ? e.message : "Database unreachable";
			console.error("API backend DB health check failed:", e);
			set.status = 503;
			return {
				status: "error",
				message,
			};
		}
	})
	.use(agents);

