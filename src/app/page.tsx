"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import Footer from "@/components/Footer";
import FiltersPanel from "@/components/filters/FiltersPanel";
import { useOlympiadsQuery } from "@/hooks/useOlympiadsQuery";
import { useCategories } from "@/hooks/useCategories";
import type { Olympiad } from "@/types/Olympiad";

export default function Home() {
  const [search, setSearch] = useState("");
  const [panelFilters, setPanelFilters] = useState({
    subjects: [] as string[],
    hasPrize: false,
    deadlineSoon: false,
    sort: "deadline_asc" as string,
  });

  const { data: olympiads = [] } = useOlympiadsQuery({
    search: search || undefined,
    subjects: panelFilters.subjects.length ? panelFilters.subjects : undefined,
    has_prize: panelFilters.hasPrize || undefined,
    deadline_days: panelFilters.deadlineSoon ? 14 : undefined,
    sort: panelFilters.sort,
  });

  const { data: categories = [], isLoading: catsLoading } = useCategories();

  // Счётчик по категориям
  const countByCategory = olympiads.reduce((acc, o) => {
    const cat = categories.find(c => c.id === o.category_id);
    const title = cat?.title || "Другое";
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* ФОН */}
      <div className="fixed inset-0 gradient-bg pointer-events-none -z-10" />
      
      <Header />
      <FiltersPanel onChange={setPanelFilters} initialFilters={panelFilters} />

      <div className="relative z-10">
        {/* Hero */}
        <div className="relative z-100 text-center pt-16 pb-14 px-4">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-[#eeaef6] via-[#e7d8ff] to-white bg-clip-text text-transparent tracking-tight">
            OlympSearch
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-white font-medium opacity-0 animate-fade-up animation-delay-800">
            Олимпиады, хакатоны и мероприятия для студентов РФ
          </p>

          {/* Спиннеры и текст */}
          <div className="hidden md:flex items-center justify-center mt-10 opacity-0 animate-fade-up animation-delay-1500">
            <div className="relative w-10 h-10 mr-4">
              <div className="absolute inset-0 rounded-full border-4 border-t-white/30 border-r-white/30 border-b-white/20 border-l-white/20 animate-spin-slow"></div>
              <div className="absolute inset-2 rounded-full border-4 border-t-white/60 border-r-transparent border-b-transparent border-l-transparent animate-spin-slow-reverse"></div>
            </div>
            <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-[#eeaef6] via-[#f7e8ff] to-white bg-clip-text text-transparent opacity-0 animate-fade-up animation-delay-1300">
              Живое обновление & реальные данные
            </p>
          </div>
          <div className="md:hidden text-center mt-8 opacity-0 animate-fade-up animation-delay-1300">
            <p className="text-lg font-semibold bg-gradient-to-r from-[#eeaef6] via-[#f7e8ff] to-white bg-clip-text text-transparent">
              Живое обновление & реальные данные
            </p>
          </div>
        </div>

        {/* Поиск */}
        <div className="max-w-2xl mx-auto px-4 mb-10">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60 w-6 h-6" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-white/70 italic text-lg">Выберите категорию</p>
        </div>

        {/* Категории из БД */}
        <div className="max-w-7xl mx-auto px-4 mb-16">
          {catsLoading ? (
            <div className="text-center text-white/70">Загрузка категорий...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories
                .filter(c => c.is_active)
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((cat) => (
                  <Link key={cat.id} href={`/category/${cat.slug}`}>
                    <div className="group cursor-pointer bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:border-purple-300/50 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                      <div className="p-4 sm:p-6 lg:p-8 text-center flex flex-col items-center justify-center h-full">
                        <div className="relative mb-3 sm:mb-5 w-16 h-16 sm:w-20 lg:w-24 sm:h-20 lg:h-24 group-hover:scale-110 transition-transform duration-500">
                          <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-2xl scale-0 group-hover:scale-150 transition-transform duration-1000" />
                          <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-purple-300/30 ring-offset-4 ring-offset-transparent shadow-2xl">
                            {cat.icon ? (
                              <Image
                                src={`/icons/${cat.icon}`}
                                alt={cat.title}
                                fill
                                sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                                className="object-cover scale-105 transition-transform duration-700 group-hover:scale-110"
                                unoptimized
                              />
                            ) : (
                              <div className="bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                                {cat.title[0]}
                              </div>
                            )}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-purple-300/20 mix-blend-overlay" />
                          </div>
                        </div>

                        <h3 className="text-white font-black text-sm sm:text-base lg:text-xl mb-1 leading-tight px-2">
                          {cat.title}
                        </h3>

                        <p className="text-purple-200/80 text-xs sm:text-sm font-medium">
                          Всего: {countByCategory[cat.title] || 0}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}