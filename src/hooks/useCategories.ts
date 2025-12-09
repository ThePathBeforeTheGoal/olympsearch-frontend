// src/hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/types/Category";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://olympsearch-api.onrender.com";

// Маппинг slug → id
const CATEGORY_MAP: Record<string, number> = {
  'olimpiady': 1,
  'konkursy': 2,
  'hakatony': 3,
  'challenges': 4,
  'keys-chempionaty': 5,
  'akseleratory': 6,
  'konferentsii': 7,
  'stazhirovki': 8,
  'granty': 9,
  'master-klassy': 10,
};

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/categories`);
        if (res.ok) {
          const data = await res.json();
          
          // Если API вернуло данные, используем их
          if (Array.isArray(data) && data.length > 0) {
            return data.map(cat => ({
              ...cat,
              // Убедимся, что у категорий правильные id из маппинга
              id: CATEGORY_MAP[cat.slug] || cat.id
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
      
      // Fallback: создаем категории из маппинга
      return Object.entries(CATEGORY_MAP).map(([slug, id], index) => ({
        id,
        slug,
        title: getTitleFromSlug(slug),
        icon: `${slug}.png`,
        description: null,
        sort_order: (index + 1) * 10,
        is_active: true,
      }));
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// Вспомогательная функция для получения названия из slug
function getTitleFromSlug(slug: string): string {
  const map: Record<string, string> = {
    'olimpiady': 'Олимпиады',
    'konkursy': 'Конкурсы',
    'hakatony': 'Хакатоны',
    'challenges': 'Челленджи',
    'keys-chempionaty': 'Кейс-чемпионаты',
    'akseleratory': 'Акселераторы',
    'konferentsii': 'Конференции',
    'stazhirovki': 'Стажировки',
    'granty': 'Гранты',
    'master-klassy': 'Мастер-классы',
  };
  return map[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}