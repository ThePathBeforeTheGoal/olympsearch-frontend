"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
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

const CATEGORIES = [
  { title: "Олимпиады",        slug: "olimpiady",        icon: "olympiady.png" },
  { title: "Конкурсы",         slug: "konkursy",         icon: "konkursy.png" },
  { title: "Хакатоны",         slug: "hakatony",         icon: "hakatony.png" },
  { title: "Челленджи",        slug: "challenges",       icon: "challenges.png" },
  { title: "Кейс-чемпионаты",  slug: "keys-chempionaty", icon: "keys.png" },
  { title: "Акселераторы",     slug: "akseleratory",     icon: "akseleratory.png" },
  { title: "Конференции",      slug: "konferentsii",     icon: "konferentsii.png" },
  { title: "Стажировки",       slug: "stazhirovki",      icon: "stazhirovki.png" },
  { title: "Гранты",           slug: "granty",           icon: "granty.png" },
  { title: "Мастер-классы",    slug: "master-klassy",    icon: "masterklassy.png" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const { data: olympiads = [] } = useQuery({
    queryKey: ["olympiads"],
    queryFn: fetchOlympiads,
    refetchInterval: 30000,
  });

  const filtered = search
    ? olympiads.filter((o) =>
        o.title.toLowerCase().includes(search.toLowerCase())
      )
    : olympiads;

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
        {/* Hero */}
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

        {/* Надпись */}
        <div className="text-center mb-8">
          <p className="text-white/70 italic text-lg">Выберите категорию</p>
        </div>

        {/* Категории */}
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`}>
                <div className="group cursor-pointer bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:border-purple-300/50 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                  <div className="p-8 text-center">

                    {/* МАГИЧЕСКИЙ КРУГ */}
                    <div className="relative mx-auto mb-5 w-24 h-24 group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-2xl scale-0 group-hover:scale-150 transition-transform duration-1000" />
                      <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-purple-300/30 ring-offset-4 ring-offset-transparent shadow-2xl">
                        <Image
                          src={`/icons/${cat.icon}`}
                          alt={cat.title}
                          fill
                          sizes="96px"
                          className="object-cover scale-105 transition-transform duration-700 group-hover:scale-110"
                          unoptimized
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-purple-300/20 mix-blend-overlay" />
                        <div className="absolute top-2 left-3 w-8 h-16 bg-white/30 rounded-full blur-xl -rotate-45" />
                      </div>
                    </div>

                    <h3 className="text-white font-black text-xl mb-2 tracking-tight">
                      {cat.title}
                    </h3>
                    <p className="text-purple-200/80 text-sm font-medium">
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