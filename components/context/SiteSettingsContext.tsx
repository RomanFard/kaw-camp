"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getSiteSettings,
  type SiteSettings,
} from "@/lib/supabase/siteSettings";

// ─── مقادیر پیش‌فرض ───
const DEFAULTS: Omit<SiteSettings, "id"> = {
  accent_color: "#E84C4C",
  accent_hover: "#D63F3F",
  bg_variant: "sparks",
  bg_color: "#E84C4C",
  bg_particle_count: 60,
  bg_quality: "auto",
  bg_only_dark: true,
  snow_wind_strength: 1,
};

type SiteSettingsContextType = {
  settings: Omit<SiteSettings, "id">;
  loading: boolean;
  refresh: () => Promise<void>;
};

const SiteSettingsContext = createContext<
  SiteSettingsContextType | undefined
>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  // ─── مقدار اولیه از localStorage (اگه موجود باشه) ───
  const [settings, setSettings] = useState<Omit<SiteSettings, "id">>(() => {
    if (typeof window === "undefined") return DEFAULTS;
    try {
      const cached = localStorage.getItem("kaw-site-settings");
      if (cached) return { ...DEFAULTS, ...JSON.parse(cached) };
    } catch {}
    return DEFAULTS;
  });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const result = await getSiteSettings();
    if (result) {
      const { id, ...rest } = result;
      setSettings(rest);

      // ─── ذخیره در localStorage برای دفعه بعد ───
      try {
        localStorage.setItem("kaw-site-settings", JSON.stringify(rest));
      } catch {}
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // ─── اعمال CSS Variables ───
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", settings.accent_color);
    root.style.setProperty("--accent-hover", settings.accent_hover);
  }, [settings.accent_color, settings.accent_hover]);

  return (
    <SiteSettingsContext.Provider
      value={{ settings, loading, refresh: load }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx)
    throw new Error(
      "useSiteSettings must be used within SiteSettingsProvider"
    );
  return ctx;
}