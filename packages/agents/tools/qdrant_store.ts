import { tool } from "@openai/agents";
import { z } from "zod";
import { client, embedQuery, ensureCollection } from "../service/qdrant_service";

export const qdrant_store = tool({
	name: "qdrant_store",
	description: "Store an embedded text payload in Qdrant.",
	parameters: z.object({
		collection: z.string().describe("Target Qdrant collection name"),
		text: z.string().describe("Text content to embed and store"),
		payload: z
			.record(z.string())
			.nullable()
			.describe("Additional metadata key-value pairs to attach (null if none)"),
	}),
	execute: async ({ collection, text, payload: rawPayload }) => {
		try {
			const payload = rawPayload ?? undefined;
			await ensureCollection(collection);

			const vector = await embedQuery(text);
			const id = crypto.randomUUID();

			await client.upsert(collection, {
				points: [
					{
						id,
						vector,
						payload: {
							text,
							stored_at: new Date().toISOString(),
							...payload,
						},
					},
				],
			});

			return { status: "stored", id, collection };
		} catch (e) {
			const message = e instanceof Error ? e.message : String(e);
			return { error: `Qdrant unavailable: ${message}` };
		}
	},
});
