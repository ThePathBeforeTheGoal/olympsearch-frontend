// src/hooks/useFavorites.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/apiClient";

const API_BASE_PATH = "/api/v1";

export const useFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await fetchWithAuth(`${API_BASE_PATH}/favorites`);
      if (!res.ok) {
        // если нет токена — бекенд вернёт 401, обработаем красиво
        const txt = await res.text().catch(() => null);
        throw new Error(txt || "Failed to fetch favorites");
      }
      return res.json();
    },
    // Только на клиенте (ssr не нужен)
    enabled: typeof window !== "undefined",
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (olympiad_id: number) => {
      const res = await fetchWithAuth(`${API_BASE_PATH}/favorites/add`, {
        method: "POST",
        body: JSON.stringify({ olympiad_id }),
      });
      if (!res.ok) {
        const error = await res.text().catch(() => null);
        throw new Error(error || "Failed to add favorite");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (olympiad_id: number) => {
      // На бэке может быть POST /favorites/remove или DELETE /favorites/:id
      // Здесь делаем POST /favorites/remove — подправьте, если у вас иная сигнатура
      const res = await fetchWithAuth(`${API_BASE_PATH}/favorites/remove`, {
        method: "POST",
        body: JSON.stringify({ olympiad_id }),
      });
      if (!res.ok) {
        const error = await res.text().catch(() => null);
        throw new Error(error || "Failed to remove favorite");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};
