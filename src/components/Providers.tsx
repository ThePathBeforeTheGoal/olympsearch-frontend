// src/components/Providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthProvider";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>   {/* ← ЭТА СТРОЧКА ВСЁ ВКЛЮЧИТ */}
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}