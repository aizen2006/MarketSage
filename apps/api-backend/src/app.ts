import Elysia from "elysia";
import { app as agents } from "./modules/agents";

export const app = new Elysia().use(agents);

