// src/components/Header.tsx - временная замена
"use client";

import React from "react";
import Link from "next/link";
import { User } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-2 bg-white/10 backdrop-blur-lg border-b border-white/20">
      <Link href="/" className="flex items-center gap-3">
        <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-[#eeaef6] via-[#e7d8ff] to-white bg-clip-text text-transparent tracking-tight">
          OlympSearch
        </h1>
      </Link>

      <div className="flex items-center gap-3">
        {/* ВРЕМЕННО ЗАБЛОКИРОВАННАЯ КНОПКА */}
        <div 
          className="p-2 rounded-full bg-white/5 border border-white/10 cursor-not-allowed opacity-50"
          title="Авторизация временно недоступна"
        >
          <User className="w-5 h-5 text-white/40" />
        </div>
      </div>
    </header>
  );
}