import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import { app as agents } from "./modules/agents";

export const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || "*",
		}),
	)
	.get("/health", () => ({ status: "ok" }))
	.use(agents);

