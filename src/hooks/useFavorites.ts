// src/hooks/useFavorites.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@supabase/auth-helpers-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useFavorites = () => {
  const user = useUser();
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/favorites`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (olympiad_id: number) =>
      fetch(`${API_URL}/api/v1/favorites/add`, {
        method: "POST",
        body: JSON.stringify({ olympiad_id }),
        headers: { "Content-Type": "application/json" },
      }).then(res => {
        if (!res.ok) throw new Error("Limit or error");
        return res.json();
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });
};