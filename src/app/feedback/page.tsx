"use client";

import { useState } from "react";

export default function FeedbackPage() {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Пока простой локальный UX — отправка реализуется позже
    setSent(true);
    setText("");
  };

  return (
    <main className="min-h-screen p-6 md:p-16 text-white">
      <h1 className="text-3xl font-bold mb-6">Предложить улучшение</h1>

      {sent ? (
        <div className="text-white/80">Спасибо! Ваше предложение принято.</div>
      ) : (
        <form onSubmit={submit} className="max-w-xl">
          <textarea
            className="w-full bg-white/6 backdrop-blur p-4 rounded-md text-white placeholder-white/60 mb-4"
            rows={6}
            placeholder="Опишите идею или проблему..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition">
            Отправить
          </button>
        </form>
      )}
    </main>
  );
}
