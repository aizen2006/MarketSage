import { QdrantClient } from "@qdrant/js-client-rest";
import { EmbeddingModel, FlagEmbedding } from "fastembed";

const VECTOR_SIZE = 384;

export const client = new QdrantClient({
	url: process.env.QDRANT_URL!,
	apiKey: process.env.QDRANT_API_KEY!,
});

let _model: Awaited<ReturnType<typeof FlagEmbedding.init>> | null = null;

async function getModel() {
	if (!_model) {
		_model = await FlagEmbedding.init({
			model: EmbeddingModel.BGESmallENV15,
		});
	}
	return _model;
}

export async function embedQuery(text: string): Promise<number[]> {
	const model = await getModel();
	return await model.queryEmbed(text);
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
	const model = await getModel();
	const vectors: number[][] = [];
	for await (const batch of model.embed(texts)) {
		for (const vec of batch) {
			vectors.push(Array.from(vec));
		}
	}
	return vectors;
}

export async function ensureCollection(name: string) {
	const collections = await client.getCollections();
	const exists = collections.collections.some((c) => c.name === name);
	if (!exists) {
		await client.createCollection(name, {
			vectors: { size: VECTOR_SIZE, distance: "Cosine" },
		});
	}
}
