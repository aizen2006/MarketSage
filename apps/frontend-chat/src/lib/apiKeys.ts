const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export type ApiKey = {
  id: string;
  userId: string;
  apikey: string;
  disabled: boolean;
};

type ApiKeysResponse = {
  apiKeys: ApiKey[];
};

async function handleJsonResponse<T>(res: Response): Promise<T> {
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore JSON parse errors
  }

  if (!res.ok) {
    const message =
      data?.message ||
      `Request failed with status ${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  return data as T;
}

export async function fetchApiKeys(): Promise<ApiKey[]> {
  const res = await fetch(`${API_BASE}/apikeys/`, {
    method: "GET",
    credentials: "include",
  });

  const data = await handleJsonResponse<ApiKeysResponse>(res);
  return data.apiKeys ?? [];
}

export async function createApiKey(): Promise<ApiKey> {
  const res = await fetch(`${API_BASE}/apikeys/create`, {
    method: "POST",
    credentials: "include",
  });

  return handleJsonResponse<ApiKey>(res);
}

export async function toggleApiKey(
  apiKeyId: string,
  disabled: boolean,
): Promise<void> {
  const res = await fetch(`${API_BASE}/apikeys/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ apiKeyId, disabled }),
  });

  await handleJsonResponse<{
    message: string;
  }>(res);
}

