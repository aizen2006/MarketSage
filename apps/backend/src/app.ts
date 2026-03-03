import Elysia from "elysia";
import { app as auth } from "./modules/auth/index";
import { app as apikeys } from "./modules/apikeys/index";
import { app as payments } from "./modules/payments/index";
import { app as user } from "./modules/user/index";

export const app = new Elysia()
	.use(auth)
	.use(apikeys)
	.use(payments)
	.use(user);