// src/types/Category.ts
export type Category = {
  id: number;
  title: string;
  slug: string;
  icon: string | null;
  description?: string | null;
  sort_order: number;
  is_active: boolean;
};