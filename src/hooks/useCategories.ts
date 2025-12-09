import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/types/Category";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://olympsearch-api.onrender.com";

const FALLBACK: Category[] = [
  { id: 1000, title: "Олимпиады", slug: "olimpiady", icon: "olympiady.png", description: null, sort_order: 10, is_active: true },
  { id: 1001, title: "Конкурсы", slug: "konkursy", icon: "konkursy.png", description: null, sort_order: 20, is_active: true },
  { id: 1002, title: "Хакатоны", slug: "hakatony", icon: "hakatony.png", description: null, sort_order: 30, is_active: true },
  { id: 1003, title: "Челленджи", slug: "challenges", icon: "challenges.png", description: null, sort_order: 40, is_active: true },
  { id: 1004, title: "Кейс-чемпионаты", slug: "keys-chempionaty", icon: "keys.png", description: null, sort_order: 50, is_active: true },
  { id: 1005, title: "Акселераторы", slug: "akseleratory", icon: "akseleratory.png", description: null, sort_order: 60, is_active: true },
  { id: 1006, title: "Конференции", slug: "konferentsii", icon: "konferentsii.png", description: null, sort_order: 70, is_active: true },
  { id: 1007, title: "Стажировки", slug: "stazhirovki", icon: "stazhirovki.png", description: null, sort_order: 80, is_active: true },
  { id: 1008, title: "Гранты", slug: "granty", icon: "granty.png", description: null, sort_order: 90, is_active: true },
  { id: 1009, title: "Мастер-классы", slug: "master-klassy", icon: "masterklassy.png", description: null, sort_order: 100, is_active: true },
];

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000); // 6s timeout to avoid hanging builds
      try {
        const res = await fetch(`${API_URL}/api/v1/categories`, { signal: controller.signal });
        if (!res.ok) {
          // upstream temporarily failing — return empty array (do not use FALLBACK ids)
          return [];
        }
        return (await res.json()) as Category[];
      } catch (err) {
        // network error / timeout — return empty array
        return [];
      } finally {
        clearTimeout(timer);
      }
    },
    initialData: [],            // <<< changed: don't inject fake IDs that ломают маппинг
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
