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
			.nullable()
			.describe("Number of results to return (defaults to 5)"),
	}),
	execute: async ({ query, top_k: rawTopK }) => {
		try {
			const top_k = rawTopK ?? 5;
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
		} catch (e) {
			const message = e instanceof Error ? e.message : String(e);
			return { error: `Qdrant unavailable: ${message}` };
		}
	},
});
