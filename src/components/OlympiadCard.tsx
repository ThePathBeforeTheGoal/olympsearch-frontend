// src/components/OlympiadCard.tsx
"use client";

import React from "react";
import type { Olympiad } from "@/lib/api";

export default function OlympiadCard({ item }: { item: Olympiad }) {
  return (
    <article className="glass-card p-6 h-80 flex flex-col justify-between">
      <div>
        <div className="bg-gray-300 border-2 border-dashed rounded-xl w-20 h-20 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-center mb-3">{item.title}</h3>
        {item.subjects && (
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {item.subjects.slice(0, 3).map((s: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-blue-900/50 rounded-full text-xs">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="text-center space-y-3">
        {item.prize && <div className="text-yellow-400">{item.prize}</div>}
        <a href={item.source_url || "#"} target="_blank" rel="noreferrer" className="text-blue-300">
          Источник
        </a>
      </div>
    </article>
  );
}
