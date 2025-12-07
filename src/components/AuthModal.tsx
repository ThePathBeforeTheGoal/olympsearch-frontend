// src/components/AuthModal.tsx
"use client";

import React from "react";
import { useAuth } from "@/context/AuthProvider";
import { Mail } from "lucide-react";

export default function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = React.useState<string>("");
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = React.useState<string | null>(null);

  const send = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setError(null);
    setStatus("sending");
    try {
      await signInWithEmail(email);
      setStatus("sent");
    } catch (err: unknown) {
      // безопасно нормализуем ошибку без any
      const message = (err instanceof Error ? err.message : String(err)) || "Ошибка отправки письма";
      setError(message);
      setStatus("error");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-70 max-w-md w-full p-6 glass-card">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-white/70 hover:text-white"
          aria-label="Close auth modal"
        >
          ✕
        </button>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#eeaef6] via-[#e7d8ff] to-white">
            Привет! Добро пожаловать в OlympSearch ✨
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Остался один клик — подтвердите почту, чтобы получать напоминания и персональные фичи.
          </p>
        </div>

        {status === "sent" ? (
          <div className="p-4 rounded-md bg-white/5 text-sm text-white/80">
            <p className="mb-2">Письмо отправлено — проверьте почту.</p>
            <p className="text-xs text-white/60">Если письмо не пришло, проверьте папку «Спам» или попробуйте ещё раз.</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-md text-sm font-semibold text-white bg-white/6 hover:bg-white/10 transition"
              >
                Закрыть
              </button>
              <a
                href={`mailto:${email}`}
                className="px-4 py-2 rounded-md text-sm font-semibold inline-flex items-center gap-2 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white"
              >
                Открыть почту
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={send} className="space-y-4">
            <label className="block text-sm text-white/80">Email</label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-4 py-3 rounded-xl bg-white/6 border border-white/10 text-white placeholder-white/60 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-xl inline-flex items-center gap-2 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white font-semibold hover:shadow-lg transition"
              >
                <Mail className="w-4 h-4" />
                Отправить
              </button>
            </div>

            {status === "error" && error && (
              <div className="text-sm text-red-400">{error}</div>
            )}

            <div className="text-xs text-white/60">
              Мы пришлём ссылку для входа — без пароля. Если вы не регистрировались, просто проигнорируйте письмо.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
