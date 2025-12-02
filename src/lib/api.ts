import type { Olympiad } from "@/types/Olympiad";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = {
  getAll: async (): Promise<Olympiad[]> => {
    const res = await fetch(`${BASE}/api/v1/olympiads/`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  },
};
