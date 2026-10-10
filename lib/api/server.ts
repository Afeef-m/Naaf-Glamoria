const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("API URL is not defined");
}

export async function serverFetch<T>(
  endpoint: string,
  revalidate?: number
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    next: revalidate ? { revalidate } : undefined,
  });

  if (!res.ok) {
    throw new Error(`Server API Error: ${res.status}`);
  }

  return res.json();
}