import { createClient } from "./client";

export type CategoryPhoto = {
  id: string;
  category_key: string;
  photo: string;
  order_index: number;
  is_active: boolean;
};

export async function getAllCategoryPhotos(): Promise<CategoryPhoto[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("category_photos")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) return [];
  return data as CategoryPhoto[];
}

export async function getActiveCategoryPhotos(): Promise<CategoryPhoto[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("category_photos")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });
  if (error) return [];
  return data as CategoryPhoto[];
}

export async function upsertCategoryPhoto(photo: Omit<CategoryPhoto, "id">) {
  const supabase = createClient();
  return supabase
    .from("category_photos")
    .upsert(photo, { onConflict: "category_key" });
}

export async function deleteCategoryPhoto(id: string) {
  const supabase = createClient();
  return supabase.from("category_photos").delete().eq("id", id);
}