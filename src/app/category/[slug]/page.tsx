"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, Link2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Header from "@/components/Header";
import { useParams, useRouter } from "next/navigation";
import type { Olympiad } from "@/types/Olympiad";

const fetchOlympiads = async (): Promise<Olympiad[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/olympiads/`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  // безопасное приведение к строке
const categorySlug = Array.isArray(params.slug)
  ? params.slug[0]
  : params.slug || "";

  const [search, setSearch] = useState("");

  const { data: olympiads = [], isLoading } = useQuery({
    queryKey: ["olympiads"],
    queryFn: fetchOlympiads,
    refetchInterval: 30000,
  });

  // Фильтр по категории
const filteredByCategory = olympiads.filter(
  (o) => o.category?.toLowerCase() === categorySlug.toLowerCase()
);
  // Фильтр поиска поверх категории
  const filtered = filteredByCategory.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase())
  );

  // Автоперенаправление на карточку, если есть точное совпадение
  const exactMatch = olympiads.find(
    (o) => o.title.toLowerCase() === search.toLowerCase()
  );
  if (exactMatch) {
    router.push(`/olympiad/${exactMatch.slug}`);
  }

  // Для красивого заголовка категории
  const categoryTitle =
    categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Header />
      <div className="fixed inset-0 gradient-bg" />

      <div className="relative z-10">
        {/* Заголовок категории */}
        <div className="text-center pt-20 pb-10 px-4">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#eeaef6] via-[#e7d8ff] to-white bg-clip-text text-transparent tracking-tight">
            {categoryTitle}
          </h1>
        </div>

        {/* Поиск */}
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

        {/* Карточки */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isLoading
              ? Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-96 rounded-3xl bg-white/5 backdrop-blur animate-pulse"
                    />
                  ))
              : filtered.map((o: Olympiad, i: number) => (
                  <div
                    key={o.id}
                    className="opacity-0 animate-fade-up"
                    style={{
                      animationDelay: `${i * 50 + 400}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <div className="glass-card p-6 h-96 flex flex-col">
                      {o.logo_url ? (
                        <div className="relative w-full h-32 mb-5 bg-white/10 rounded-xl overflow-hidden border border-white/20">
                          <Image
                            src={o.logo_url}
                            alt={`${o.title} логотип`}
                            fill
                            sizes="25vw"
                            className="object-contain p-4"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32 mb-5 flex items-center justify-center text-gray-500 text-sm">
                          Логотип олимпиады
                        </div>
                      )}

                      <div className="flex-1 overflow-hidden">
                        <h3 className="text-xl font-bold text-center mb-3 line-clamp-2">
                          {o.title}
                        </h3>

                        {o.subjects && o.subjects.length > 0 && (
                          <div className="flex flex-wrap gap-2 justify-center mb-4">
                            {o.subjects.slice(0, 4).map((s, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                              >
                                {s}
                              </span>
                            ))}
                            {o.subjects.length > 4 && (
                              <span className="text-xs text-gray-600">
                                +{o.subjects.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        {o.prize && (
                          <p className="text-center text-sm text-gray-700 line-clamp-2 mt-3">
                            {o.prize}
                          </p>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <a
                          href={o.source_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                        >
                          <Link2 className="w-4 h-4" />
                          Перейти на сайт
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
