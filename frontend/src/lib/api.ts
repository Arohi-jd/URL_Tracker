const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function apiRequest(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'API Error');
  }
  return res.json();
}
