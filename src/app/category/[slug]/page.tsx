"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, Link2, Calendar, Users } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import type { Olympiad } from "@/types/Olympiad";
import { useState, useMemo } from "react";
import { useCategories } from "@/hooks/useCategories";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://olympsearch-api.onrender.com";

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

// Форматирование даты
const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function CategoryPage() {
  const { slug } = useParams() as { slug: string };
  const [search, setSearch] = useState("");

  // Получаем категории для получения названия
  const { data: categories = [] } = useCategories();
  
  // Получаем ID категории из маппинга
  const categoryId = CATEGORY_MAP[slug];
  
  // Находим категорию для отображения названия
  const currentCategory = useMemo(
    () => categories.find((c) => String(c.slug) === String(slug)),
    [categories, slug]
  );

  // Получаем все олимпиады и фильтруем на фронтенде
  const { data: allOlympiads = [], isLoading } = useQuery<Olympiad[]>({
    queryKey: ["olympiads", "all"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/olympiads/?limit=1000`, { 
          cache: "no-store" 
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.error("Error fetching olympiads:", e);
      }
      return [];
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });

  // Фильтруем олимпиады по category_id
  const categoryOlympiads = useMemo(() => {
    if (!categoryId) return [];
    return allOlympiads.filter((o) => o.category_id === categoryId);
  }, [allOlympiads, categoryId]);

  // Для заголовка используем название категории или slug
  const displayTitle = currentCategory?.title || 
    decodeURIComponent(slug).charAt(0).toUpperCase() + 
    decodeURIComponent(slug).slice(1);

  // Локальный фильтр поиска (по title)
  const filtered = categoryOlympiads.filter((o) => 
    o.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Header />
      <div className="fixed inset-0 gradient-bg" />
      <div className="relative z-10">
        <div className="text-center pt-20 pb-10 px-4">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#eeaef6] via-[#e7d8ff] to-white bg-clip-text text-transparent tracking-tight">
            {displayTitle}
          </h1>
          <p className="mt-4 text-white/70">
            Найдено: {categoryOlympiads.length} мероприятий
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[280px] rounded-xl bg-white/5 backdrop-blur animate-pulse" />
              ))
            ) : filtered.length === 0 ? (
              <div className="col-span-full text-center text-white/70 text-2xl py-20">
                {categoryId ? 
                  `В категории "${displayTitle}" пока нет мероприятий` : 
                  `Категория "${displayTitle}" не найдена`
                }
              </div>
            ) : (
              filtered.map((o, i) => (
                <div
                  key={o.id}
                  className="opacity-0 animate-fade-up"
                  style={{
                    animationDelay: `${i * 50 + 400}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  {/* КАРТОЧКА С УСЛОВНЫМ РАЗМЕРОМ */}
                  <div className={`
                    relative bg-white/15 backdrop-blur-xl rounded-xl border border-white/20 
                    hover:border-purple-400/30 hover:bg-white/20 transition-all duration-300 
                    hover:shadow-lg hover:shadow-purple-500/10
                    flex flex-col
                    ${o.logo_url ? 'min-h-[280px]' : 'min-h-[220px]'}
                    p-3
                  `}>
                    
                    {/* ЛОГОТИП - ПОКАЗЫВАЕМ ТОЛЬКО ЕСЛИ ЕСТЬ */}
                    {o.logo_url ? (
                      <div className="relative w-full h-16 mb-3 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={o.logo_url}
                          alt={o.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="h-2 mb-2 flex-shrink-0"></div> /* Пустой отступ для карточек без лого */
                    )}

                    {/* НАЗВАНИЕ СОБЫТИЯ */}
                    <div className="flex-grow min-h-0">
                      <h3 className="text-base font-black text-[#2a1b5c] mb-1 line-clamp-3 leading-tight">
                        {o.title}
                      </h3>

                      {/* ПРЕДМЕТЫ */}
                      {o.subjects?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {o.subjects.slice(0, 3).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-[#352e5c] text-white rounded text-xs font-medium"
                            >
                              {s}
                            </span>
                          ))}
                          {o.subjects.length > 3 && (
                            <span className="px-2 py-0.5 bg-[#352e5c]/60 text-white/80 rounded text-xs">
                              +{o.subjects.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* ПРИЗ/ОПИСАНИЕ */}
                      {o.prize && (
                        <p className="text-xs text-gray-800 line-clamp-2 mb-2">
                          {o.prize}
                        </p>
                      )}

                      {/* ДАТЫ */}
                      <div className="space-y-1 mb-2">
                        {(o.start_date || o.end_date) && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-700">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {o.start_date && formatDate(o.start_date)}
                              {o.start_date && o.end_date && ' - '}
                              {o.end_date && formatDate(o.end_date)}
                            </span>
                          </div>
                        )}
                        
                        {o.is_team !== null && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-700">
                            <Users className="w-3 h-3" />
                            <span>{o.is_team ? 'Командное' : 'Индивидуальное'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* КНОПКА "ПЕРЕЙТИ НА САЙТ" */}
                    <div className="pt-2 border-t border-white/10 flex-shrink-0">
                      <a
                        href={o.source_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 text-[#3a2b6b] hover:text-[#4c3a8b] text-sm font-semibold transition-colors w-full"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        Перейти на сайт
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}