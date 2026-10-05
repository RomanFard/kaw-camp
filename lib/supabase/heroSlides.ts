import { createClient } from "./client";

export type HeroSlideRow = {
  id: string;
  order_index: number;
  eyebrow: string;
  title_line1: string;
  title_line2: string;
  description: string;
  primary_label: string;
  primary_href: string;
  secondary_label: string;
  secondary_href: string;
  video: string;
  poster: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type HeroSlide = Omit<HeroSlideRow, "created_at" | "updated_at">;

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error loading hero slides:", error);
    return [];
  }
  return data as HeroSlide[];
}

export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error loading active hero slides:", error);
    return [];
  }
  return data as HeroSlide[];
}

export async function createHeroSlide(slide: Omit<HeroSlide, "id">) {
  const supabase = createClient();
  return supabase.from("hero_slides").insert(slide);
}

export async function updateHeroSlide(id: string, slide: Omit<HeroSlide, "id">) {
  const supabase = createClient();
  return supabase.from("hero_slides").update(slide).eq("id", id);
}

export async function deleteHeroSlide(id: string) {
  const supabase = createClient();
  return supabase.from("hero_slides").delete().eq("id", id);
}