import type { PlatformBrandingSettings } from "@/lib/platform/settings";
import { buildSocialUrl, SOCIAL_META } from "@/lib/platform/settings";

type Props = {
  branding: PlatformBrandingSettings;
};

function getIcon(type: string): string {
  return SOCIAL_META[type]?.emoji ?? "💬";
}

export function FloatingSocialButtons({ branding }: Props) {
  const buttons = [branding.floating_button_1, branding.floating_button_2]
    .filter(Boolean)
    .map((type) => {
      const value = branding[`social_${type}` as keyof PlatformBrandingSettings] as string;
      if (!value) return null;
      return { type, href: buildSocialUrl(type, value), icon: getIcon(type), label: SOCIAL_META[type]?.label ?? type };
    })
    .filter(Boolean);

  if (buttons.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {buttons.map((btn) => (
        <a
          key={btn!.type}
          href={btn!.href}
          target="_blank"
          rel="noopener noreferrer"
          title={btn!.label}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[#12182B]/90 text-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-sm transition hover:scale-110 hover:border-[#22D3EE]/50 hover:bg-[#22D3EE]/10"
        >
          {btn!.icon}
        </a>
      ))}
    </div>
  );
}
