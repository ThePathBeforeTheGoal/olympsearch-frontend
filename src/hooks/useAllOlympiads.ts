// src/hooks/useAllOlympiads.ts
import { useQuery } from "@tanstack/react-query";
import type { Olympiad } from "@/types/Olympiad";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://olympsearch-api.onrender.com";

export const useAllOlympiads = () => {
  return useQuery<Olympiad[]>({
    queryKey: ["olympiads", "all"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/olympiads/?limit=1000`, { 
          cache: "no-store" 
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.error("Error fetching all olympiads:", e);
      }
      return [];
    },
    staleTime: 1000 * 60, // 1 минута
    refetchOnWindowFocus: false,
  });
};