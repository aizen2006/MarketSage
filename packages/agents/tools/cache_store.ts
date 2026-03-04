import { tool } from "@openai/agents";
import { z } from "zod";
import { cacheSet, cacheGet } from "../service/cache_service";

export const cache_store = tool({
	name: "cache_store",
	description: "Store cached analysis by key.",
	parameters: z.object({
		key: z.string().describe("Cache key to store the value under"),
		value: z.string().describe("The analysis/data to cache"),
	}),
	execute: async ({ key, value }) => {
		cacheSet(key, value);
		return { status: "cached", key };
	},
});

export const cache_retrieve = tool({
	name: "cache_retrieve",
	description: "Retrieve a previously cached analysis by key.",
	parameters: z.object({
		key: z.string().describe("Cache key to look up"),
	}),
	execute: async ({ key }) => {
		const value = cacheGet(key);
		if (value === null) {
			return { status: "miss", key };
		}
		return { status: "hit", key, value };
	},
});
