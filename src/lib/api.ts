export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init?.headers as Record<string, string>) || {}),
  };

  try {
    const rawAuth = localStorage.getItem('pilotgov_auth');
    if (rawAuth) {
      const parsed = JSON.parse(rawAuth);
      if (parsed?.token && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${parsed.token}`;
      }
    }
  } catch {
    // Ignore localStorage parse failure
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `Request to ${path} failed`;
    try {
      const data = await res.json();
      if (data?.message) {
        errorMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      }
    } catch {
      // Fallback to generic message
    }
    throw new ApiError(errorMsg, res.status);
  }

  return res.json() as Promise<T>;
}

