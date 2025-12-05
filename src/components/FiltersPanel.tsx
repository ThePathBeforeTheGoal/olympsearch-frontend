// src/components/filters/FiltersPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Filters = {
  subjects: string[];
  hasPrize: boolean;
  deadlineSoon: boolean;
  search: string;
  sort: string;
};

export default function FiltersPanel({
  onChange,
  initialFilters = {},
}: {
  onChange: (f: Filters) => void;
  initialFilters?: Partial<Filters>;
}) {
  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState<string[]>(initialFilters.subjects || []);
  const [hasPrize, setHasPrize] = useState(initialFilters.hasPrize || false);
  const [deadlineSoon, setDeadlineSoon] = useState(initialFilters.deadlineSoon || false);
  const [sort, setSort] = useState(initialFilters.sort || "deadline_asc");

  // Динамически грузим предметы из базы
  const { data: availableSubjects = [] } = useQuery<string[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/v1/olympiads/subjects`);
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 600000, // раз в 10 минут, чтобы не долбить бэк
  });

  useEffect(() => {
    onChange({ subjects, hasPrize, deadlineSoon, search: "", sort });
  }, [subjects, hasPrize, deadlineSoon, sort]);

  return (
    <>
      {/* Кнопка на мобилке */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-4 shadow-2xl shadow-purple-500/50 hover:scale-110 transition md:hidden"
      >
        <Filter className="w-6 h-6" />
        { (subjects.length > 0 || hasPrize || deadlineSoon) && 
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {subjects.length + (hasPrize ? 1 : 0) + (deadlineSoon ? 1 : 0)}
          </span>
        }
      </button>

      {/* Панель */}
      <div className={`fixed inset-0 z-50 transition-all ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/70 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />

        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-purple-900/90 via-black/95 to-black/90 backdrop-blur-2xl border-l border-white/20 transition-transform ${open ? "translate-x-0" : "translate-x-full"} md:translate-x-0 md:static md:w-80`}>
          <div className="p-6 overflow-y-auto h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Фильтры { (subjects.length > 0 || hasPrize || deadlineSoon) && `(${subjects.length + (hasPrize ? 1 : 0) + (deadlineSoon ? 1 : 0)})`}
              </h2>
              <button onClick={() => setOpen(false)} className="md:hidden">
                <X className="w-8 h-8 text-white/70" />
              </button>
            </div>

            {/* Предметы */}
            {availableSubjects.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Предметы</h3>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                  {availableSubjects.map(s => (
                    <label key={s} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition">
                      <input
                        type="checkbox"
                        checked={subjects.includes(s)}
                        onChange={(e) => {
                          if (e.target.checked) setSubjects(prev => [...prev, s]);
                          else setSubjects(prev => prev.filter(x => x !== s));
                        }}
                        className="w-5 h-5 rounded accent-purple-500"
                      />
                      <span className="text-white/90 text-sm">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Призы */}
            <div className="mb-8">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg p-3 transition">
                <input
                  type="checkbox"
                  checked={hasPrize}
                  onChange={(e) => setHasPrize(e.target.checked)}
                  className="w-6 h-6 rounded accent-yellow-400"
                />
                <span className="text-white text-lg">Только с призами</span>
              </label>
            </div>

            {/* Дедлайн */}
            <div className="mb-8">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg p-3 transition">
                <input
                  type="checkbox"
                  checked={deadlineSoon}
                  onChange={(e) => setDeadlineSoon(e.target.checked)}
                  className="w-6 h-6 rounded accent-red-400"
                />
                <span className="text-white text-lg">Скоро дедлайн (14 дней)</span>
              </label>
            </div>

            {/* Сортировка */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Сортировка</h3>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-4 focus:ring-purple-500/50"
              >
                <option value="deadline_asc">Сначала ближайшие дедлайны</option>
                <option value="deadline_desc">Сначала дальние дедлайны</option>
                <option value="title">По алфавиту</option>
                <option value="new">Сначала новые</option>
              </select>
            </div>

            {/* Кнопка сброса */}
            {(subjects.length > 0 || hasPrize || deadlineSoon || sort !== "deadline_asc") && (
              <button
                onClick={() => {
                  setSubjects([]);
                  setHasPrize(false);
                  setDeadlineSoon(false);
                  setSort("deadline_asc");
                }}
                className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white/80 font-medium transition"
              >
                Сбросить все фильтры
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}