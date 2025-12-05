// src/components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white/6 backdrop-blur-xl border-t border-white/10 text-white py-10 px-6 md:px-16 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Соцсети */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-lg mb-2">Мы в соцсетях</h4>
          <div className="flex gap-4">
            <a
              href="https://vk.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="VK"
              className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:scale-105 transition"
            >
              <Image src="/icons/vk.svg" alt="VK" width={24} height={24} />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:scale-105 transition"
            >
              <Image src="/icons/telegram.svg" alt="Telegram" width={24} height={24} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:scale-105 transition"
            >
              <Image src="/icons/youtube.svg" alt="YouTube" width={24} height={24} />
            </a>
          </div>
        </div>

        {/* О сайте */}
        <div>
          <h4 className="font-semibold text-lg mb-2">О сайте</h4>
          <p className="text-sm text-white/70 leading-relaxed">
            OlympSearch — каталог олимпиад, хакатонов и студенческих мероприятий РФ.
            Мы собираем актуальные анонсы и даём прямые ссылки на организаторов.
            Проект в статусе MVP — содержание будет расширяться.
          </p>
        </div>

        {/* Документы и обратная связь */}
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-lg mb-2">Информация</h4>
          <Link href="/documents" className="text-sm text-white/70 hover:text-white transition">
            Документы
          </Link>
          <Link href="/rules" className="text-sm text-white/70 hover:text-white transition">
            Правила использования
          </Link>
          <Link href="/feedback" className="text-sm text-white/70 hover:text-white transition">
            Предложить улучшение
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 border-t border-white/6 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs text-white/50">
          © {new Date().getFullYear()} OlympSearch — каталог мероприятий для студентов РФ
        </div>

        <div className="text-xs text-white/50">
          Проект в статусе MVP — юридическая информация будет добавлена позднее.
        </div>
      </div>
    </footer>
  );
}
