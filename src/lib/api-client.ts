const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: { "Content-Type": "application/json", ...options?.headers }, ...options });
  const payload = (await response.json()) as { success: boolean; data?: T; error?: { message: string } };
  if (!response.ok || !payload.success) throw new Error(payload.error?.message ?? "API request failed");
  return payload.data as T;
}

export { API_BASE_URL };
