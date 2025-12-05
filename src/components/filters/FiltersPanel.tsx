// src/components/filters/FiltersPanel.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Filters = {
  subjects: string[];
  hasPrize: boolean;
  deadlineSoon: boolean;
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

  const [subjects, setSubjects] = useState<string[]>(
    (initialFilters.subjects as string[]) || []
  );
  const [hasPrize, setHasPrize] = useState<boolean>(
    initialFilters.hasPrize ?? false
  );
  const [deadlineSoon, setDeadlineSoon] = useState<boolean>(
    initialFilters.deadlineSoon ?? false
  );
  const [sort, setSort] = useState<string>(
    (initialFilters.sort as string) || "deadline_asc"
  );

  const [subjectQuery, setSubjectQuery] = useState("");

  const { data: availableSubjects = [] } = useQuery<string[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/v1/olympiads/subjects`);
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: Infinity,
  });

  const activeCount =
    subjects.length + (hasPrize ? 1 : 0) + (deadlineSoon ? 1 : 0);

  const STORAGE_KEY = "os_filters_v1";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && (!initialFilters || Object.keys(initialFilters).length === 0)) {
      try {
        const parsed = JSON.parse(raw || "{}");
        if (parsed) {
          setSubjects(parsed.subjects || []);
          setHasPrize(parsed.hasPrize || false);
          setDeadlineSoon(parsed.deadlineSoon || false);
          setSort(parsed.sort || "deadline_asc");
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const toSave = { subjects, hasPrize, deadlineSoon, sort };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {}
  }, [subjects, hasPrize, deadlineSoon, sort]);

  const filteredSubjects = useMemo(() => {
    if (!subjectQuery.trim()) return availableSubjects;
    const q = subjectQuery.trim().toLowerCase();
    return availableSubjects.filter((s) => s.toLowerCase().includes(q));
  }, [availableSubjects, subjectQuery]);

  const toggleSubject = (s: string) =>
    setSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const clearAll = () => {
    setSubjects([]);
    setHasPrize(false);
    setDeadlineSoon(false);
    setSort("deadline_asc");
    onChange?.({ subjects: [], hasPrize: false, deadlineSoon: false, sort: "deadline_asc" });
    setOpen(false);
  };

  const apply = () => {
    onChange?.({
      subjects,
      hasPrize,
      deadlineSoon,
      sort,
    });
    setOpen(false);
  };

  // panel classes (small / compact)
  const panelClass = open
    ? "fixed left-0 top-16 h-[calc(100vh-4rem)] w-full md:w-72 bg-white/6 backdrop-blur-3xl border-r border-white/10 z-40 transform translate-x-0 transition-transform duration-300"
    : "fixed left-0 top-16 h-[calc(100vh-4rem)] w-full md:w-72 bg-white/6 backdrop-blur-3xl border-r border-white/10 z-40 transform -translate-x-full transition-transform duration-300";

  return (
    <>
      {/* Small edge tab with triangle — no big label */}
      <button
        aria-expanded={open}
        aria-controls="os-filters-panel"
        title="Фильтры"
        onClick={() => setOpen((s) => !s)}
        className="fixed left-0 top-28 md:top-40 z-50 flex items-center justify-start p-0"
        style={{ transform: "translateX(-4px)" }} // nudge so tab sits on edge
      >
        <div
          className="w-8 h-12 md:w-10 md:h-14 flex items-center justify-center rounded-r-md bg-white/6 border-r border-white/10 shadow-sm hover:scale-105 transition"
          aria-hidden
        >
          {/* decorative triangle (CSS) */}
          <div style={{
            width: 0,
            height: 0,
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderLeft: "10px solid rgba(111,91,190,0.9)"
          }} />
        </div>

        {/* small badge on larger screens */}
        {activeCount > 0 && (
          <div className="hidden md:inline-flex ml-1 items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold">
            {activeCount}
          </div>
        )}
      </button>

      {/* Panel */}
      <aside
        id="os-filters-panel"
        className={panelClass}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full flex flex-col text-sm">
          {/* Header (compact) */}
          <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-sm bg-gradient-to-br from-[#eeaef6]/20 to-[#6f5bbe]/20">
                <Filter className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#eeaef6] via-[#e7d8ff] to-white">
                  Фильтры
                </h3>
                <div className="text-[11px] text-white/60">Уточните результаты</div>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md bg-white/8 hover:bg-white/12 transition"
              aria-label="Закрыть панель"
            >
              <ChevronLeft className="w-4 h-4 text-white/90" />
            </button>
          </div>

          {/* Content (compact spacing) */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {/* Subjects */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">Предметы</h4>
                <div className="text-[11px] text-white/60">{subjects.length} выбрано</div>
              </div>

              <div className="mb-2">
                <input
                  value={subjectQuery}
                  onChange={(e) => setSubjectQuery(e.target.value)}
                  placeholder="Поиск предмета..."
                  className="w-full px-3 py-2 rounded-xl bg-white/8 border border-white/10 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filteredSubjects.length === 0 && (
                  <div className="text-white/60 text-xs">Ничего не найдено</div>
                )}

                {filteredSubjects.map((s) => {
                  const active = subjects.includes(s);
                  const btnClass = active
                    ? "px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm"
                    : "px-2.5 py-1 rounded-full text-xs font-medium bg-white/6 text-white/90 hover:bg-white/10";
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSubject(s)}
                      className={btnClass}
                      aria-pressed={active}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Prize */}
            <section>
              <h4 className="text-sm font-semibold text-white mb-2">Призы</h4>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPrize}
                  onChange={(e) => setHasPrize(e.target.checked)}
                  className="w-4 h-4 rounded accent-yellow-400 mt-1"
                />
                <div>
                  <div className="text-sm text-white">Только с призами</div>
                  <div className="text-[11px] text-white/60">Показывать мероприятия с призом</div>
                </div>
              </label>
            </section>

            {/* Deadline */}
            <section>
              <h4 className="text-sm font-semibold text-white mb-2">Срочность</h4>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deadlineSoon}
                  onChange={(e) => setDeadlineSoon(e.target.checked)}
                  className="w-4 h-4 rounded accent-red-400 mt-1"
                />
                <div>
                  <div className="text-sm text-white">Дедлайн в ближайшие 14 дней</div>
                  <div className="text-[11px] text-white/60">Показывать только срочные</div>
                </div>
              </label>
            </section>

            {/* Sort */}
            <section>
              <h4 className="text-sm font-semibold text-white mb-2">Сортировка</h4>
              <div className="grid gap-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" name="sort" checked={sort === "deadline_asc"} onChange={() => setSort("deadline_asc")} className="w-3 h-3" />
                  <span className="text-white/90 text-sm">Ближайшие дедлайны</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="sort" checked={sort === "title"} onChange={() => setSort("title")} className="w-3 h-3" />
                  <span className="text-white/90 text-sm">По алфавиту</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="sort" checked={sort === "new"} onChange={() => setSort("new")} className="w-3 h-3" />
                  <span className="text-white/90 text-sm">Сначала новые</span>
                </label>
              </div>
            </section>
          </div>

          {/* Bottom area: small helper text + actions (Reset moved here) */}
          <div className="px-4 py-3 border-t border-white/8 bg-gradient-to-t from-transparent to-white/2">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-white/60">Уточните результаты поиска</div>
              <button
                onClick={() => {
                  clearAll();
                }}
                className="text-xs text-white/70 hover:text-white px-2 py-1 rounded-md"
              >
                Сбросить
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={apply}
                className="flex-1 py-2 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-[#eeaef6] to-[#6f5bbe] hover:shadow-md transition"
              >
                Применить
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md bg-white/6 text-white/90 hover:bg-white/8 text-sm"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
