import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PlatformBrandingSettings = {
  brand_name: string;
  logo_url: string;
  hero_image_url: string;
  dashboard_banner_url: string;
};

const DEFAULT_PLATFORM_BRANDING: PlatformBrandingSettings = {
  brand_name: "BuildSphere",
  logo_url: "",
  hero_image_url: "",
  dashboard_banner_url: "",
};

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function getPlatformBrandingSettings(): Promise<PlatformBrandingSettings> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return DEFAULT_PLATFORM_BRANDING;
  }

  const { data, error } = await supabase
    .from("platform_settings")
    .select("settings")
    .eq("id", 1)
    .maybeSingle<{ settings: Record<string, unknown> | null }>();

  if (error || !data?.settings) {
    return DEFAULT_PLATFORM_BRANDING;
  }

  return {
    brand_name: toStringValue(data.settings.brand_name) || DEFAULT_PLATFORM_BRANDING.brand_name,
    logo_url: toStringValue(data.settings.logo_url),
    hero_image_url: toStringValue(data.settings.hero_image_url),
    dashboard_banner_url: toStringValue(data.settings.dashboard_banner_url),
  };
}
