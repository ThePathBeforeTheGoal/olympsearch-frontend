// src/components/Providers.tsx
"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Если используешь Toaster — импортируй его здесь, иначе закомментируй
// import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <Toaster />  <-- раскомментируй если Toaster есть и это клиентский компонент */}
      {children}
    </QueryClientProvider>
  );
}
