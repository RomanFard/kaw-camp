import { createClient } from "./client";

export type AboutSection = {
  id: string;
  badge: string;
  title_line1: string;
  title_line2: string;
  paragraph_1: string;
  paragraph_2: string;
  image: string;
  stat_1_value: string;
  stat_1_label: string;
  stat_2_value: string;
  stat_2_label: string;
  stat_3_value: string;
  stat_3_label: string;
  primary_label: string;
  primary_href: string;
  secondary_label: string;
  secondary_href: string;
};

export async function getAboutSection(): Promise<AboutSection | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("about_section")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as AboutSection;
}

export async function updateAboutSection(
  id: string,
  data: Omit<AboutSection, "id">
) {
  const supabase = createClient();
  return supabase
    .from("about_section")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
}