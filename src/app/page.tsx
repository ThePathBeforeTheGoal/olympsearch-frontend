"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import FiltersPanel from "@/components/filters/FiltersPanel";
import { useOlympiadsQuery } from "@/hooks/useOlympiadsQuery";
import { useCategories } from "@/hooks/useCategories";
import type { Olympiad } from "@/types/Olympiad";
import type { Category } from "@/types/Category";

// Ваш статический список категорий (используем правильные пути)
const STATIC_CATEGORIES = [
  { title: "Олимпиады", slug: "olimpiady", icon: "/icons/olympiady.png" },
  { title: "Конкурсы", slug: "konkursy", icon: "/icons/konkursy.png" },
  { title: "Хакатоны", slug: "hakatony", icon: "/icons/hakatony.png" },
  { title: "Челленджи", slug: "challenges", icon: "/icons/challenges.png" },
  { title: "Кейс-чемпионаты", slug: "keys-chempionaty", icon: "/icons/keys.png" },
  { title: "Акселераторы", slug: "akseleratory", icon: "/icons/akseleratory.png" },
  { title: "Конференции", slug: "konferentsii", icon: "/icons/konferentsii.png" },
  { title: "Стажировки", slug: "stazhirovki", icon: "/icons/stazhirovki.png" },
  { title: "Гранты", slug: "granty", icon: "/icons/granty.png" },
  { title: "Мастер-классы", slug: "master-klassy", icon: "/icons/masterklassy.png" },
];

// Маппинг slug → id для категорий
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

// Маппинг id → title для подсчета
const CATEGORY_ID_TO_TITLE: Record<number, string> = {
  1: "Олимпиады",
  2: "Конкурсы",
  3: "Хакатоны",
  4: "Челленджи",
  5: "Кейс-чемпионаты",
  6: "Акселераторы",
  7: "Конференции",
  8: "Стажировки",
  9: "Гранты",
  10: "Мастер-классы",
};

// Маппинг slug → icon для получения правильных путей
const SLUG_TO_ICON: Record<string, string> = {
  'olimpiady': '/icons/olympiady.png',
  'konkursy': '/icons/konkursy.png',
  'hakatony': '/icons/hakatony.png',
  'challenges': '/icons/challenges.png',
  'keys-chempionaty': '/icons/keys.png',
  'akseleratory': '/icons/akseleratory.png',
  'konferentsii': '/icons/konferentsii.png',
  'stazhirovki': '/icons/stazhirovki.png',
  'granty': '/icons/granty.png',
  'master-klassy': '/icons/masterklassy.png',
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [panelFilters, setPanelFilters] = useState({
    subjects: [] as string[],
    hasPrize: false,
    deadlineSoon: false,
    sort: "deadline_asc" as string,
  });

  // Получаем все олимпиады с учетом фильтров
  const { data: olympiads = [] } = useOlympiadsQuery({
    search: search || undefined,
    subjects: panelFilters.subjects.length ? panelFilters.subjects : undefined,
    has_prize: panelFilters.hasPrize || undefined,
    deadline_days: panelFilters.deadlineSoon ? 14 : undefined,
    sort: panelFilters.sort,
  });

  const { data: categories = [], isLoading: catsLoading } = useCategories();

  // Формируем финальный список категорий
  const finalCategories: Category[] = useMemo(() => {
    if (categories && categories.length > 0) {
      // Используем категории из API
      return categories.map(cat => ({
        ...cat,
        id: CATEGORY_MAP[cat.slug] || cat.id,
        icon: SLUG_TO_ICON[cat.slug] || `/icons/${cat.slug}.png`
      })).filter(cat => cat.is_active);
    }
    
    // Fallback: статические категории с правильными id
    return STATIC_CATEGORIES.map((c, i) => ({
      id: CATEGORY_MAP[c.slug] || (10000 + i),
      title: c.title,
      slug: c.slug,
      icon: c.icon,
      description: null,
      sort_order: i,
      is_active: true,
    }));
  }, [categories]);

  // ПРАВИЛЬНЫЙ подсчет по категориям
  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Инициализируем все категории с 0
    finalCategories.forEach(cat => {
      counts[cat.title] = 0;
    });
    
    // Считаем олимпиады по category_id
    olympiads.forEach((olympiad: Olympiad) => {
      // Пытаемся найти категорию по ID
      const category = finalCategories.find(cat => cat.id === olympiad.category_id);
      
      if (category) {
        counts[category.title] = (counts[category.title] || 0) + 1;
      } else {
        // Если не нашли по ID, пробуем найти по названию через маппинг
        const categoryTitle = CATEGORY_ID_TO_TITLE[olympiad.category_id];
        if (categoryTitle && counts[categoryTitle] !== undefined) {
          counts[categoryTitle] = (counts[categoryTitle] || 0) + 1;
        }
      }
    });
    
    return counts;
  }, [olympiads, finalCategories]);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 gradient-bg pointer-events-none -z-10" />

      <Header />
      <FiltersPanel onChange={setPanelFilters} initialFilters={panelFilters} />

      <div className="relative z-10">
        {/* HERO */}
        <div className="relative z-100 text-center pt-16 pb-14 px-4">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-[#eeaef6] via-[#e7d8ff] to-white bg-clip-text text-transparent tracking-tight">
            OlympSearch
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-white font-medium opacity-0 animate-fade-up animation-delay-800">
            Олимпиады, хакатоны и мероприятия для студентов РФ
          </p>

          <div className="hidden md:flex items-center justify-center mt-10 opacity-0 animate-fade-up animation-delay-1500">
            <div className="relative w-10 h-10 mr-4">
              <div className="absolute inset-0 rounded-full border-4 border-t-white/30 border-r-white/30 border-b-white/20 border-l-white/20 animate-spin-slow" />
              <div className="absolute inset-2 rounded-full border-4 border-t-white/60 border-r-transparent border-b-transparent border-l-transparent animate-spin-slow-reverse" />
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

        {/* SEARCH */}
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
          <p className="text-white/70 italic text-lg">
            {search || panelFilters.subjects.length > 0 || panelFilters.hasPrize || panelFilters.deadlineSoon
              ? `Найдено мероприятий: ${olympiads.length}`
              : "Выберите категорию"
            }
          </p>
        </div>

        {/* CATEGORIES */}
        <div className="max-w-7xl mx-auto px-4 mb-16">
          {catsLoading ? (
            <div className="text-center text-white/70">Загрузка категорий...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {finalCategories
                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .map((cat) => {
                  const iconSrc = cat.icon || SLUG_TO_ICON[cat.slug] || "/icons/vercel.svg";
                  const count = countByCategory[cat.title] || 0;
                  
                  return (
                    <Link
                      key={cat.id}
                      href={`/category/${encodeURIComponent(cat.slug)}`}
                      className="group"
                    >
                      <div className="group cursor-pointer bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:border-purple-300/50 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                        <div className="p-4 sm:p-6 lg:p-8 text-center flex flex-col items-center justify-center h-full">
                          <div className="relative mb-3 sm:mb-5 w-16 h-16 sm:w-20 lg:w-24 sm:h-20 lg:h-24 group-hover:scale-110 transition-transform duration-500">
                            <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-2xl scale-0 group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-purple-300/30 ring-offset-4 ring-offset-transparent shadow-2xl">
                              <Image
                                src={iconSrc}
                                alt={cat.title}
                                fill
                                sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                                className="object-cover scale-105 transition-transform duration-700 group-hover:scale-110"
                                unoptimized
                              />
                              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-purple-300/20 mix-blend-overlay" />
                            </div>
                          </div>

                          <h3 className="text-white font-black text-sm sm:text-base lg:text-xl mb-1 leading-tight px-2">
                            {cat.title}
                          </h3>

                          <p className="text-purple-200/80 text-xs sm:text-sm font-medium">
                            Всего: {count}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}