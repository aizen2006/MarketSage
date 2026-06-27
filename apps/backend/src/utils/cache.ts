import {
	writeBulkKeyPair,
	getBulkKeyPair,
	deleteBulkKeyPair,
} from "./cloudflare";

/**
 * Per-user response cache backed by Cloudflare KV.
 *
 * All KV access is best-effort: if KV is unreachable or errors, we fall back to
 * the producer (DB) so caching can never break a route.
 */

export type CacheResource =
	| "credits"
	| "usageLog"
	| "transactions"
	| "conversations"
	| "insights"
	| "apikeys";

/** TTLs in seconds, keyed by resource. */
export const TTL: Record<CacheResource, number> = {
	credits: 60,
	usageLog: 120,
	transactions: 300,
	conversations: 60,
	insights: 120,
	apikeys: 300,
};

export function cacheKey(
	userId: number | string,
	resource: CacheResource,
): string {
	return `user:${userId}:${resource}`;
}

/**
 * Returns the cached value for `key` if present, otherwise runs `producer`,
 * caches its result with `ttlSeconds`, and returns it.
 */
export async function cached<T>(
	key: string,
	ttlSeconds: number,
	producer: () => Promise<T>,
): Promise<T> {
	// 1. Try cache.
	try {
		const values = await getBulkKeyPair([key]);
		const raw = values?.[key];
		if (raw !== null && raw !== undefined) {
			return (typeof raw === "string" ? JSON.parse(raw) : raw) as T;
		}
	} catch (e) {
		console.error(`Cache read failed for "${key}":`, e);
	}

	// 2. Miss (or read error): produce fresh value.
	const value = await producer();

	// 3. Best-effort write-through.
	try {
		await writeBulkKeyPair([
			{ key, value: JSON.stringify(value), expiration_ttl: ttlSeconds },
		]);
	} catch (e) {
		console.error(`Cache write failed for "${key}":`, e);
	}

	return value;
}

/** Best-effort cache invalidation. Never throws. */
export async function invalidate(keys: string[]): Promise<void> {
	if (!keys.length) return;
	try {
		await deleteBulkKeyPair(keys);
	} catch (e) {
		console.error(`Cache invalidation failed for ${keys.join(", ")}:`, e);
	}
}
