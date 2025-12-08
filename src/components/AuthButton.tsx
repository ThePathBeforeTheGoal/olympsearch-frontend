// src/components/AuthButton.tsx — С ЛОГАМИ ДЛЯ ДЕБАГА
"use client";

import React from "react";
import { User } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import AuthModal from "@/components/AuthModal";

export default function AuthButton() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);

  console.log("AuthButton рендерится. user:", user ? "есть" : "нет");
  console.log("Текущее состояние open:", open);

  if (user) {
    const name = user.user_metadata?.full_name || user.email || "Пользователь";
    const initials = name
      .split(" ")
      .map((s: string) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <div className="relative">
        <button
          onClick={() => {
            console.log("Клик по аватарке — открываем/закрываем дропдаун");
            setOpen((prev) => !prev);
          }}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/6 border border-white/20 hover:bg-white/10 transition"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6f5bbe] flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
          <span className="hidden md:block text-sm text-white/90">{name}</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-2 z-50">
            <a href="/favorites" className="block px-3 py-2 rounded hover:bg-white/10 text-white/90 text-sm">
              Избранное
            </a>
            <a href="/pro" className="block px-3 py-2 rounded hover:bg-white/10 text-white/90 text-sm">
              PRO
            </a>
            <button
              onClick={() => {
                console.log("Нажата кнопка Выйти");
                signOut();
              }}
              className="w-full text-left px-3 py-2 rounded hover:bg-white/10 text-red-400 text-sm"
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    );
  }

  // НЕЗАЛОГИНЕННЫЙ ПОЛЬЗОВАТЕЛЬ
  return (
    <>
      <button
        onClick={() => {
          console.log("КНОПКА АВТОРИЗАЦИИ НАЖАТА — ОТКРЫВАЕМ МОДАЛКУ");
          setOpen(true);
        }}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        aria-label="Войти"
      >
        <User className="w-5 h-5 text-white" />
      </button>

      {/* Модалка */}
      <AuthModal open={open} onClose={() => {
        console.log("Закрываем модалку по крестику или оверлею");
        setOpen(false);
      }} />
    </>
  );
}