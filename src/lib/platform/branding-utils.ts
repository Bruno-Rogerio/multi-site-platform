/** Pure branding utilities — safe to import in client and server components. */

export type PlatformBrandingSettings = {
  // Identity
  brand_name: string;
  tagline: string;
  platform_description: string;
  logo_url: string;
  favicon_url: string;
  // Images
  hero_image_url: string;
  dashboard_banner_url: string;
  // Contact
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  // Social networks
  social_instagram: string;
  social_facebook: string;
  social_twitter: string;
  social_linkedin: string;
  social_youtube: string;
  social_tiktok: string;
  social_pinterest: string;
  social_threads: string;
  social_telegram: string;
  social_discord: string;
  social_snapchat: string;
  social_kwai: string;
  social_twitch: string;
  // Floating buttons (social network keys, e.g. "whatsapp", "instagram", or "")
  floating_button_1: string;
  floating_button_2: string;
};

export const DEFAULT_PLATFORM_BRANDING: PlatformBrandingSettings = {
  brand_name: "BuildSphere",
  tagline: "Seu site profissional em minutos",
  platform_description:
    "Plataforma para criação de sites profissionais para autônomos e prestadores de serviço.",
  logo_url: "",
  favicon_url: "",
  hero_image_url: "",
  dashboard_banner_url: "",
  contact_email: "",
  contact_phone: "",
  contact_whatsapp: "",
  social_instagram: "",
  social_facebook: "",
  social_twitter: "",
  social_linkedin: "",
  social_youtube: "",
  social_tiktok: "",
  social_pinterest: "",
  social_threads: "",
  social_telegram: "",
  social_discord: "",
  social_snapchat: "",
  social_kwai: "",
  social_twitch: "",
  floating_button_1: "",
  floating_button_2: "",
};

/** Build a shareable/clickable URL for a given social network type + raw value. */
export function buildSocialUrl(type: string, value: string): string {
  if (!value) return "";
  const v = value.trim().replace(/^@/, "");
  switch (type) {
    case "instagram": return `https://instagram.com/${v}`;
    case "facebook": return value.startsWith("http") ? value : `https://facebook.com/${v}`;
    case "twitter": return `https://x.com/${v}`;
    case "linkedin": return value.startsWith("http") ? value : `https://linkedin.com/in/${v}`;
    case "youtube": return value.startsWith("http") ? value : `https://youtube.com/@${v}`;
    case "tiktok": return `https://tiktok.com/@${v}`;
    case "pinterest": return value.startsWith("http") ? value : `https://pinterest.com/${v}`;
    case "threads": return `https://threads.net/@${v}`;
    case "whatsapp": return `https://wa.me/${v.replace(/\D/g, "")}`;
    case "telegram": return value.startsWith("http") ? value : `https://t.me/${v}`;
    case "discord": return value.startsWith("http") ? value : `https://discord.gg/${v}`;
    case "snapchat": return `https://snapchat.com/add/${v}`;
    case "kwai": return value.startsWith("http") ? value : `https://kwai.com/@${v}`;
    case "twitch": return `https://twitch.tv/${v}`;
    default: return value.startsWith("http") ? value : `https://${value}`;
  }
}

export const SOCIAL_META: Record<string, { label: string; placeholder: string; emoji: string; prefix: string }> = {
  instagram: { label: "Instagram", placeholder: "seuperfil", emoji: "📸", prefix: "instagram.com/" },
  facebook: { label: "Facebook", placeholder: "suapagina", emoji: "📘", prefix: "facebook.com/" },
  twitter: { label: "X (Twitter)", placeholder: "seuperfil", emoji: "🐦", prefix: "x.com/" },
  linkedin: { label: "LinkedIn", placeholder: "in/seuperfil", emoji: "💼", prefix: "linkedin.com/" },
  youtube: { label: "YouTube", placeholder: "seucanal", emoji: "▶️", prefix: "youtube.com/@" },
  tiktok: { label: "TikTok", placeholder: "seuperfil", emoji: "🎵", prefix: "tiktok.com/@" },
  pinterest: { label: "Pinterest", placeholder: "seuperfil", emoji: "📌", prefix: "pinterest.com/" },
  threads: { label: "Threads", placeholder: "seuperfil", emoji: "🧵", prefix: "threads.net/@" },
  telegram: { label: "Telegram", placeholder: "username", emoji: "✈️", prefix: "t.me/" },
  discord: { label: "Discord", placeholder: "discord.gg/...", emoji: "🎮", prefix: "" },
  snapchat: { label: "Snapchat", placeholder: "username", emoji: "👻", prefix: "snapchat.com/add/" },
  kwai: { label: "Kwai", placeholder: "URL do perfil", emoji: "🎬", prefix: "" },
  twitch: { label: "Twitch", placeholder: "username", emoji: "🟣", prefix: "twitch.tv/" },
};
