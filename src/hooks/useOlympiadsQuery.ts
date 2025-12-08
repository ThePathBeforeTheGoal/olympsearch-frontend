// src/hooks/useOlympiadsQuery.ts
import { useQuery } from "@tanstack/react-query";
import type { Olympiad } from "@/types/Olympiad";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://olympsearch-api.onrender.com";

type Filters = {
  search?: string;
  subjects?: string[];
  level?: string;
  prize_min?: number;
  is_team?: boolean;
  has_prize?: boolean;
  deadline_days?: number;
  sort?: string;
  category?: string;
};

export const useOlympiadsQuery = (filters: Filters = {}) => {
  return useQuery<Olympiad[]>({
    queryKey: ["olympiads", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.search) params.append("q", filters.search);
      if (filters.subjects?.length) {
        filters.subjects.forEach((s) => params.append("subjects", s));
      }
      if (filters.level) params.append("level", filters.level);
      if (filters.prize_min) params.append("prize_min", filters.prize_min.toString());
      if (filters.is_team !== undefined) params.append("is_team", String(filters.is_team));
      if (filters.has_prize) params.append("has_prize", "true");
      if (filters.deadline_days) params.append("deadline_days", filters.deadline_days.toString());
      if (filters.sort) params.append("sort", filters.sort);
      if (filters.category) params.append("category", filters.category);

      const url = `${API_URL}/api/v1/olympiads/filter?${params.toString()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch olympiads");
      return res.json();
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
};
