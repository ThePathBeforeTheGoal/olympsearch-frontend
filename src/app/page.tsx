"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, Trophy, Link2 } from "lucide-react";
import { useState } from "react";

type Olympiad = {
  id: number;
  title: string;
  slug: string;
  subjects?: string[];
  prize?: string;
  source_url?: string;
  is_active: boolean;
};

const fetchOlympiads = async (): Promise<Olympiad[]> => {
const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/olympiads/`,
  { cache: "no-store" } // ← всегда делать живой запрос, а не кешировать старый ответ
);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function Home() {
  const [search, setSearch] = useState("");
  const { data: olympiads = [], isLoading } = useQuery({
    queryKey: ["olympiads"],
    queryFn: fetchOlympiads,
    refetchInterval: 30000,
  });

  const filtered = olympiads.filter((o: Olympiad) =>
    o.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Фон */}
      <div className="fixed inset-0 gradient-bg" />

      <div className="relative z-10">
        {/* Hero */}
        <div className="text-center pt-20 pb-16 px-4">
          <h1 className="text-7xl md:text-9xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            {"OlympSearch".split("").map((letter, i) => (
              <span
                key={i}
                className="inline-block animate-char"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </h1>

          <p className="mt-8 text-2xl md:text-3xl text-blue-100 font-light italic opacity-0 animate-fade-up animation-delay-1000">
            Олимпиады, хакатоны и мероприятия для студентов РФ
          </p>

          <div className="flex items-center justify-center mt-10 opacity-0 animate-fade-up animation-delay-1500">
            <div className="relative w-10 h-10 mr-4">
              <div className="absolute inset-0 rounded-full border-4 border-t-white/30 border-r-white/30 border-b-white/20 border-l-white/20 animate-spin-slow"></div>
              <div className="absolute inset-2 rounded-full border-4 border-t-white/60 border-r-transparent border-b-transparent border-l-transparent animate-spin-slow-reverse"></div>
            </div>
            <p className="text-xl md:text-2xl font-medium text-cyan-300">
              Живое обновление • Реальные данные
            </p>
          </div>
        </div>

        {/* Поиск */}
        <div className="max-w-2xl mx-auto px-4 mb-12">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60 w-6 h-6" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              className="w-full pl-14 pr-6 py-3 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 text-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 transition"
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
                    <div key={i} className="h-96 rounded-3xl bg-white/5 backdrop-blur animate-pulse" />
                  ))
              : filtered.map((o: Olympiad, i: number) => (
                  <div
                    key={o.id}
                    className="opacity-0 animate-fade-up"
                    style={{ animationDelay: `${i * 50 + 400}ms`, animationFillMode: "forwards" }}
                  >
                    <div className="glass-card p-6 h-96 flex flex-col">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32 mb-5 flex items-center justify-center text-gray-500 text-sm">
                        Логотип олимпиады
                      </div>

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
                          Перейти на сайт олимпиады
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