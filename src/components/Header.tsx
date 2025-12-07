// src/components/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-2 bg-white/10 backdrop-blur-lg border-b border-white/20">
      {/* Левый блок — название */}
      <Link href="/" className="flex items-center gap-3">
        <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-[#eeaef6] via-[#e7d8ff] to-white bg-clip-text text-transparent tracking-tight">
          OlympSearch
        </h1>
      </Link>

      {/* Правый блок — кнопка авторизации */}
      <div className="flex items-center gap-3">
        {/* здесь можно добавить иконки уведомлений, поиск, и т.д. */}
        <AuthButton />
      </div>
    </header>
  );
}
