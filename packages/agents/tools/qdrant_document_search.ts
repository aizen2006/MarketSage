import { tool } from "@openai/agents";
import { z } from "zod";
import { client, embedQuery, ensureCollection } from "../service/qdrant_service";

const COLLECTION = "financial_documents";

export const qdrant_document_search = tool({
	name: "qdrant_document_search",
	description:
		"Search the financial_documents collection for semantically similar chunks.",
	parameters: z.object({
		query: z.string().describe("Natural-language search query"),
		top_k: z
			.number()
			.default(5)
			.describe("Number of results to return (defaults to 5)"),
	}),
	execute: async ({ query, top_k }) => {
		await ensureCollection(COLLECTION);

		const queryVector = await embedQuery(query);

		const results = await client.query(COLLECTION, {
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
