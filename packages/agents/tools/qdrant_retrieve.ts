import { tool } from "@openai/agents";
import { z } from "zod";
import { client, ensureCollection } from "../service/qdrant_service";

export const qdrant_retrieve = tool({
	name: "qdrant_retrieve",
	description: "Retrieve user memory entries by user_id from Qdrant.",
	parameters: z.object({
		user_id: z.string().describe("The user ID to retrieve memories for"),
		collection: z
			.string()
			.default("user_memories")
			.describe("Collection to search in (defaults to user_memories)"),
		limit: z
			.number()
			.default(10)
			.describe("Max entries to return (defaults to 10)"),
	}),
	execute: async ({ user_id, collection, limit }) => {
		await ensureCollection(collection);

		const result = await client.scroll(collection, {
			filter: {
				must: [{ key: "user_id", match: { value: user_id } }],
			},
			with_payload: true,
			limit,
		});

		return result.points.map((p) => ({
			id: p.id,
			...((p.payload as Record<string, unknown>) ?? {}),
		}));
	},
});
