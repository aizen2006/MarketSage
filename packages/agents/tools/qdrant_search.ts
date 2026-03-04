import { tool } from "@openai/agents";
import { z } from "zod";
import { client, embedQuery, ensureCollection } from "../service/qdrant_service";

export const qdrant_search = tool({
	name: "qdrant_search",
	description: "Semantic search in a Qdrant collection.",
	parameters: z.object({
		collection: z.string().describe("Qdrant collection to search in"),
		query: z.string().describe("Natural-language search query"),
		top_k: z
			.number()
			.default(5)
			.describe("Number of results to return (defaults to 5)"),
	}),
	execute: async ({ collection, query, top_k }) => {
		await ensureCollection(collection);

		const queryVector = await embedQuery(query);

		const results = await client.query(collection, {
			query: queryVector,
			with_payload: true,
			limit: top_k,
		});

		return results.points.map((p) => ({
			id: p.id,
			score: p.score,
			...((p.payload as Record<string, unknown>) ?? {}),
		}));
	},
});
