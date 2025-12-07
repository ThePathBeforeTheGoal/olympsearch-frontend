// src/types/Olympiad.ts
export type Olympiad = {
  id: number;
  title: string;
  slug: string;
  description: string | null;

  // Связи
  organizer_id: number;
  category_id: number;

  level: string | null;
  subjects: string[];
  is_team: boolean | null;

  start_date: string | null;
  end_date: string | null;
  registration_deadline: string | null;

  prize: string | null;
  source_url: string | null;
  content_hash: string | null;
  is_active: boolean;

  parsed_at: string;
  created_at: string;
  updated_at: string;
  logo_url: string | null;
};