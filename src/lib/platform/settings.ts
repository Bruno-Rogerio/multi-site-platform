import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  type PlatformBrandingSettings,
  DEFAULT_PLATFORM_BRANDING,
  buildSocialUrl,
  SOCIAL_META,
} from "@/lib/platform/branding-utils";

// Re-export everything so existing imports from this file keep working.
export type { PlatformBrandingSettings };
export { DEFAULT_PLATFORM_BRANDING, buildSocialUrl, SOCIAL_META };

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function getPlatformBrandingSettings(): Promise<PlatformBrandingSettings> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return DEFAULT_PLATFORM_BRANDING;

  const { data, error } = await supabase
    .from("platform_settings")
    .select("settings")
    .eq("id", 1)
    .maybeSingle<{ settings: Record<string, unknown> | null }>();

  if (error || !data?.settings) return DEFAULT_PLATFORM_BRANDING;

  const s = data.settings;
  return {
    brand_name: str(s.brand_name) || DEFAULT_PLATFORM_BRANDING.brand_name,
    tagline: str(s.tagline) || DEFAULT_PLATFORM_BRANDING.tagline,
    platform_description:
      str(s.platform_description) || DEFAULT_PLATFORM_BRANDING.platform_description,
    logo_url: str(s.logo_url),
    favicon_url: str(s.favicon_url),
    hero_image_url: str(s.hero_image_url),
    dashboard_banner_url: str(s.dashboard_banner_url),
    contact_email: str(s.contact_email),
    contact_phone: str(s.contact_phone),
    contact_whatsapp: str(s.contact_whatsapp),
    social_instagram: str(s.social_instagram),
    social_facebook: str(s.social_facebook),
    social_twitter: str(s.social_twitter),
    social_linkedin: str(s.social_linkedin),
    social_youtube: str(s.social_youtube),
    social_tiktok: str(s.social_tiktok),
    social_pinterest: str(s.social_pinterest),
    social_threads: str(s.social_threads),
    social_telegram: str(s.social_telegram),
    social_discord: str(s.social_discord),
    social_snapchat: str(s.social_snapchat),
    social_kwai: str(s.social_kwai),
    social_twitch: str(s.social_twitch),
    floating_button_1: str(s.floating_button_1),
    floating_button_2: str(s.floating_button_2),
  };
}
