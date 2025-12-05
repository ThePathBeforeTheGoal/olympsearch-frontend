"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, Link2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";

type Olympiad = {
  id: number;
  title: string;
  slug: string;
  category: string;
  subjects?: string[];
  prize?: string;
  source_url?: string;
  is_active: boolean;
  logo_url?: string | null;
};

const fetchOlympiads = async (): Promise<Olympiad[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/olympiads/`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

// ТОЧНО ТВОИ 9 КАТЕГОРИЙ (как ты просила)
const CATEGORIES = [
  { title: "Олимпиады",        slug: "olimpiady",        icon: "olympiady.png" },
  { title: "Конкурсы",         slug: "konkursy",         icon: "konkursy.png" },
  { title: "Хакатоны",         slug: "hakatony",         icon: "hakatony.png" },
  { title: "Кейс-чемпионаты",  slug: "keys-chempionaty", icon: "keys.png" },
  { title: "Акселераторы",     slug: "akseleratory",     icon: "akseleratory.png" },
  { title: "Конференции",      slug: "konferentsii",     icon: "konferentsii.png" },
  { title: "Стажировки",       slug: "stazhirovki",      icon: "stazhirovki.png" },
  { title: "Гранты",           slug: "granty",           icon: "granty.png" },
  { title: "Мастер-классы",    slug: "master-klassy",    icon: "masterklassy.png" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const { data: olympiads = [], isLoading } = useQuery({
    queryKey: ["olympiads"],
    queryFn: fetchOlympiads,
    refetchInterval: 30000,
  });

  // Глобальный поиск
  const filtered = search
    ? olympiads.filter((o) =>
        o.title.toLowerCase().includes(search.toLowerCase())
      )
    : olympiads;

  // Считаем количество мероприятий по категориям
  const countByCategory = olympiads.reduce((acc, o) => {
    const cat = o.category || "Олимпиады";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Header />
      <div className="fixed inset-0 gradient-bg" />

      <div className="relative z-10">
        {/* Hero — полностью оставляем */}
        <div className="relative z-100 text-center pt-16 pb-14 px-4">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-[#eeaef6] via-[#e7d8ff] to-white bg-clip-text text-transparent tracking-tight">
            OlympSearch
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-white font-medium opacity-0 animate-fade-up animation-delay-800">
            Олимпиады, хакатоны и мероприятия для студентов РФ
          </p>
          <div className="flex items-center justify-center mt-10 opacity-0 animate-fade-up animation-delay-1500">
            <div className="relative w-10 h-10 mr-4">
              <div className="absolute inset-0 rounded-full border-4 border-t-white/30 border-r-white/30 border-b-white/20 border-l-white/20 animate-spin-slow"></div>
              <div className="absolute inset-2 rounded-full border-4 border-t-white/60 border-r-transparent border-b-transparent border-l-transparent animate-spin-slow-reverse"></div>
            </div>
            <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-[#eeaef6] via-[#f7e8ff] to-white bg-clip-text text-transparent opacity-0 animate-fade-up animation-delay-1300">
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

        {/* Надпись "Выберите категорию" */}
        <div className="text-center mb-8">
          <p className="text-white/70 italic text-lg">Выберите категорию</p>
        </div>

        {/* Сетка категорий — твои 9 */}
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`}>
                <div className="group cursor-pointer bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all hover:scale-105">
                  <div className="p-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center overflow-hidden">
                      <Image
                        src={`/icons/${cat.icon}`}
                        alt={cat.title}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{cat.title}</h3>
                    <p className="text-white/60 text-sm">
                      Всего в каталоге: {countByCategory[cat.title] || 0}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}