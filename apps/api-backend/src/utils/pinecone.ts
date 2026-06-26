import { Pinecone, type RecordMetadata } from '@pinecone-database/pinecone';
import 'dotenv/config';

const NAMESPACE = 'finance';
// The index field that integrated embedding reads and embeds. Must match the
// `fieldMap` configured when the index was created (createIndexForModel).
const TEXT_FIELD = 'text';

const pcindex = process.env.PINECONE_INDEX;
if (!pcindex) {
    throw new Error('PINECONE_INDEX is not set in environment');
}

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});
const index = pc.index({ name: pcindex });

export interface FinanceRecord {
    /** Stable unique id for the record (used for upsert/overwrite). */
    id: string;
    /** The text that the index embeds and stores for semantic retrieval. */
    text: string;
    /** Optional extra fields stored alongside the record (e.g. ticker, type). */
    metadata?: RecordMetadata;
}

/**
 * Upsert finance records into the `finance` namespace using integrated
 * embedding — Pinecone embeds the `text` field server-side, so no OpenAI call
 * is needed here. Requires an index created with an integrated embedding model.
 */
export async function upsert_data(records: FinanceRecord[]): Promise<void> {
    if (records.length === 0) return;

    const integratedRecords = records.map((r) => ({
        id: r.id,
        [TEXT_FIELD]: r.text,
        ...r.metadata,
    }));

    await index.namespace(NAMESPACE).upsertRecords({ records: integratedRecords });
}

export interface SearchResult {
    id: string;
    score: number;
    /** The selected record fields returned for the hit (text + metadata). */
    fields: Record<string, unknown>;
}

/**
 * Semantic search over the `finance` namespace using integrated embedding.
 * The query text is embedded by the index itself via `searchRecords`.
 */
export async function semantic_search(
    query: string,
    topK = 5,
    fields: string[] = [TEXT_FIELD],
    filter?: object,
): Promise<SearchResult[]> {
    const response = await index.namespace(NAMESPACE).searchRecords({
        query: {
            topK,
            inputs: { text: query },
            ...(filter ? { filter } : {}),
        },
        fields,
    });

    return response.result.hits.map((hit) => ({
        id: hit._id,
        score: hit._score,
        fields: hit.fields as Record<string, unknown>,
    }));
}
