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
			.nullable()
			.describe("Collection to search in (defaults to user_memories)"),
		limit: z
			.number()
			.nullable()
			.describe("Max entries to return (defaults to 10)"),
	}),
	execute: async ({ user_id, collection: rawCollection, limit: rawLimit }) => {
		try {
			const collection = rawCollection ?? "user_memories";
			const limit = rawLimit ?? 10;
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
		} catch (e) {
			const message = e instanceof Error ? e.message : String(e);
			return { error: `Qdrant unavailable: ${message}` };
		}
	},
});
