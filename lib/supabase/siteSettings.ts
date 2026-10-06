import { createClient } from "./client";

export type SiteSettings = {
  id: string;
  accent_color: string;
  accent_hover: string;
  bg_variant: "sparks" | "night" | "snow" | "none";
  bg_color: string;
  bg_particle_count: number;
  bg_quality: "auto" | "high" | "medium" | "low";
  bg_only_dark: boolean;
  snow_wind_strength: number;
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as SiteSettings;
}

export async function updateSiteSettings(
  id: string,
  data: Omit<SiteSettings, "id">
) {
  const supabase = createClient();
  return supabase
    .from("site_settings")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
}