"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, Link2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCategories } from "@/hooks/useCategories";
import OlympiadCard from "@/components/OlympiadCard";
import type { Olympiad } from "@/types/Olympiad";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://olympsearch-api.onrender.com";

export default function CategoryPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: categories = [] } = useCategories();

  const category = categories.find(c => c.slug === slug);

  const { data: olympiads = [], isLoading } = useQuery<Olympiad[]>({
    queryKey: ["olympiads", "category", slug],
    queryFn: async () => {
      if (!category) return [];
      const res = await fetch(`${API_URL}/api/v1/olympiads/filter?category_id=${category.id}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!category,
  });

  const filtered = olympiads.filter(o =>
    o.title.toLowerCase().includes(search.toLowerCase())
  );

  // Редирект при точном совпадении
  if (search && filtered.length === 1) {
    router.push(`/olympiad/${filtered[0].slug}`);
  }

  const categoryTitle = category?.title || slug;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Header />
      <div className="fixed inset-0 gradient-bg" />

      <div className="relative z-10">
        <div className="text-center pt-20 pb-10 px-4">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#eeaef6] via-[#e7d8ff] to-white bg-clip-text text-transparent tracking-tight">
            {categoryTitle}
          </h1>
        </div>

        <div className="max-w-2xl mx-auto px-4 mb-12">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60 w-6 h-6" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              className="w-full pl-12 pr-4 py-2 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 text-base text-white placeholder:text-sm placeholder:text-white/60 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isLoading
              ? Array(8).fill(0).map((_, i) => (
                  <div key={i} className="h-96 rounded-3xl bg-white/5 backdrop-blur animate-pulse" />
                ))
              : filtered.length === 0
              ? <div className="col-span-full text-center text-white/70 text-2xl py-20">
                  В этой категории пока нет мероприятий
                </div>
              : filtered.map((o, i) => (
                  <div
                    key={o.id}
                    className="opacity-0 animate-fade-up"
                    style={{ animationDelay: `${i * 50 + 400}ms`, animationFillMode: "forwards" }}
                  >
                    <OlympiadCard item={o} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}