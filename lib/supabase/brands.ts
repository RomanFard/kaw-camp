import { createClient } from "./client";

export type Brand = {
  id: string;
  name: string;
  logo: string;
  href: string;
  order_index: number;
  is_active: boolean;
};

export async function getAllBrands(): Promise<Brand[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) return [];
  return data as Brand[];
}

export async function getActiveBrands(): Promise<Brand[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });
  if (error) return [];
  return data as Brand[];
}

export async function createBrand(brand: Omit<Brand, "id">) {
  const supabase = createClient();
  return supabase.from("brands").insert(brand);
}

export async function updateBrand(id: string, brand: Omit<Brand, "id">) {
  const supabase = createClient();
  return supabase.from("brands").update(brand).eq("id", id);
}

export async function deleteBrand(id: string) {
  const supabase = createClient();
  return supabase.from("brands").delete().eq("id", id);
}