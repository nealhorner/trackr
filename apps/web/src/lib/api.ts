/** Fetch JSON from the Trackr API (`/api/v1/...`). Uses cookies when credentials included. */
export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiFetch(path, init);
  const body = (await res.json()) as {
    data?: T;
    error?: string;
    message?: string;
  };
  if (!res.ok) {
    throw new Error(body.message ?? res.statusText);
  }
  if (body.data === undefined) {
    throw new Error("Invalid API response");
  }
  return body.data;
}
