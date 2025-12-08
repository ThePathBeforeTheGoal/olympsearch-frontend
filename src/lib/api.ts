// src/lib/api.ts
import type { Olympiad } from "@/types/Olympiad";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://olympsearch-api.onrender.com";

export const api = {
  getAll: async (): Promise<Olympiad[]> => {
    const res = await fetch(`${API_URL}/api/v1/olympiads/`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  },
};
