import { createClient } from "./client";

export async function getAppContent<T>(key: string): Promise<T | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("app_content")
    .select("data")
    .eq("key", key)
    .maybeSingle();
  if (error || !data) return null;
  return data.data as T;
}

export async function setAppContent<T>(key: string, value: T) {
  const supabase = createClient();
  return supabase.from("app_content").upsert(
    { key, data: value, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
}