// src/lib/supabaseClient.ts
"use client";

/**
 * Безопасная обёртка для создания браузерного Supabase клиента.
 * - Если env-переменные присутствуют — создаём реальный клиент через @supabase/ssr.
 * - Если переменных нет (например, на этапе сборки в Vercel) — возвращаем "stub"
 *   с минимальными методами, которые используются в приложении, чтобы сборка не падала.
 *
 * Это позволяет безопасно импортировать supabase в client-компонентах,
 * но при этом не вызывать исключение на этапе prerender/build.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  // окружение настроено — используем реальный клиент
  // импорт выполняем динамически, чтобы сборка не падала при отсутствии пакета
  // (и чтобы ошибки происходили только при реальном использовании)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createBrowserClient } = require("@supabase/ssr");
  _supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY) as SupabaseClient;
}

/**
 * Minimal safe stub implementing only те методы, которые используются в приложении.
 * Если ты используешь дополнительные возможности supabase (storage, from и т.д.),
 * добавь соответствующие заглушки.
 */
function createStub() {
  return {
    auth: {
      async getSession() {
        return { data: { session: null } };
      },
      onAuthStateChange(_: any, __?: any) {
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      async signInWithOtp(_: any) {
        return { error: new Error("Supabase not configured in this environment") };
      },
      async signOut() {
        return { error: null };
      },
    },
    // если где-то используется .from/.storage — можно добавить простые заглушки:
    from: () => ({ select: async () => ({ data: null, error: null }) }),
    storage: {
      from: () => ({ getPublicUrl: () => ({ publicURL: null }) }),
    },
  } as unknown as SupabaseClient;
}

export const supabase = (_supabase ?? createStub()) as unknown as SupabaseClient;
