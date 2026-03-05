import Elysia from "elysia";
import { cors } from "@elysiajs/cors";
import { app as auth } from "./modules/auth/index";
import { app as apikeys } from "./modules/apikeys/index";
import { app as payments } from "./modules/payments/index";
import { app as user } from "./modules/user/index";
import { app as agents } from "./modules/agents/index";

export const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || "*",
		}),
	)
	.get("/health", () => ({ status: "ok" }))
	.use(auth)
	.use(apikeys)
	.use(payments)
	.use(user)
	.use(agents);