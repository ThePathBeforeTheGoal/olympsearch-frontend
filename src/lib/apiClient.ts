// src/lib/apiClient.ts
import { supabase } from "@/lib/supabaseClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchWithAuth(path: string, init?: RequestInit) {
  const res = await supabase.auth.getSession();
  const token = res.data?.session?.access_token ?? null;

  const headers = new Headers((init?.headers as HeadersInit) || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const isFormData = init?.body instanceof FormData;
  if (!headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const url = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? path : "/" + path}`;

  return fetch(url, {
    ...init,
    credentials: "same-origin",
    headers,
  });
}
