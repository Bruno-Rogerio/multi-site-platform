import type { PlatformBrandingSettings } from "@/lib/platform/settings";
import { buildSocialUrl, SOCIAL_META } from "@/lib/platform/settings";

type Props = {
  branding: PlatformBrandingSettings;
};

type Button = { type: string; href: string; icon: string; label: string };

function getIcon(type: string): string {
  return SOCIAL_META[type]?.emoji ?? "💬";
}

export function FloatingSocialButtons({ branding }: Props) {
  const configured = [branding.floating_button_1, branding.floating_button_2]
    .filter(Boolean)
    .reduce<Button[]>((acc, type) => {
      let value: string;
      let href: string;
      let icon: string;
      let label: string;

      if (type === "whatsapp") {
        value = branding.contact_whatsapp;
        href = value ? `https://wa.me/${value.replace(/\D/g, "")}` : "";
        icon = "💬";
        label = "WhatsApp";
      } else if (type === "email") {
        value = branding.contact_email;
        href = value ? `mailto:${value}` : "";
        icon = "✉️";
        label = "E-mail";
      } else {
        value = branding[`social_${type}` as keyof PlatformBrandingSettings] as string ?? "";
        href = buildSocialUrl(type, value);
        icon = getIcon(type);
        label = SOCIAL_META[type]?.label ?? type;
      }

      if (href) acc.push({ type, href, icon, label });
      return acc;
    }, []);

  const FALLBACK: Button[] = [
    { type: "whatsapp", href: "https://wa.me/5511915194173", icon: "💬", label: "WhatsApp" },
    { type: "email", href: "mailto:contato@bsph.com.br", icon: "✉️", label: "E-mail" },
  ];

  const buttons = configured.length > 0 ? configured : FALLBACK;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {buttons.map((btn) => (
        <a
          key={btn.type}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          title={btn.label}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[#12182B]/90 text-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-sm transition hover:scale-110 hover:border-[#22D3EE]/50 hover:bg-[#22D3EE]/10"
        >
          {btn.icon}
        </a>
      ))}
    </div>
  );
}
