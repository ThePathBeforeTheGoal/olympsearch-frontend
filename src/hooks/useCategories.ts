// src/hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/types/Category";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/v1/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
    staleTime: 1000 * 60 * 60, // 1 час
    refetchOnWindowFocus: false,
  });
};
