import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import { prisma } from "db";
import { app as auth } from "./modules/auth/index";
import { app as apikeys } from "./modules/apikeys/index";
import { app as payments } from "./modules/payments/index";
import { app as user } from "./modules/user/index";
import { app as agents } from "./modules/agents/index";

const defaultAllowedOrigins = [
	"http://localhost:3001",
	"http://127.0.0.1:3001",
	"http://localhost:3000",
	"http://127.0.0.1:3000",
];

function resolveAllowedOrigins() {
	const raw = process.env.CORS_ORIGIN?.trim();
	if (!raw || raw === "*") return defaultAllowedOrigins;
	return raw
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);
}

const allowedOrigins = resolveAllowedOrigins();

export const app = new Elysia()
	.use(
		cors({
			origin: allowedOrigins,
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