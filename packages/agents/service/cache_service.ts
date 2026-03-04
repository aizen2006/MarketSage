const cache = new Map<string, { value: string; storedAt: number }>();

export function cacheSet(key: string, value: string) {
	cache.set(key, { value, storedAt: Date.now() });
}

export function cacheGet(key: string): string | null {
	const entry = cache.get(key);
	return entry?.value ?? null;
}

export function cacheDelete(key: string): boolean {
	return cache.delete(key);
}

export function cacheHas(key: string): boolean {
	return cache.has(key);
}
