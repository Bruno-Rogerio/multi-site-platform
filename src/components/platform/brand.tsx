import Image from "next/image";

import { getPlatformBrandingSettings, type PlatformBrandingSettings } from "@/lib/platform/settings";

type BrandProps = {
  compact?: boolean;
  settings?: PlatformBrandingSettings;
};

export async function Brand({ compact = false, settings }: BrandProps) {
  const branding = settings ?? (await getPlatformBrandingSettings());
  const brandName = branding.brand_name?.trim() || "BuildSphere";

  return (
    <div className="inline-flex items-center gap-3">
      {branding.logo_url ? (
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/25 bg-black/10 shadow-[0_0_20px_rgba(59,130,246,0.35)]">
          <Image
            src={branding.logo_url}
            alt={brandName}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="relative h-10 w-10 rounded-full bg-[radial-gradient(circle_at_35%_30%,#22D3EE,#3B82F6_45%,#7C5CFF_80%)] shadow-[0_0_20px_rgba(59,130,246,0.45)]">
          <div className="absolute inset-[2px] rounded-full border border-white/35" />
        </div>
      )}
      <p className={`font-semibold tracking-tight ${compact ? "text-lg" : "text-2xl"} bg-[linear-gradient(135deg,#EAF0FF,#3B82F6,#7C5CFF,#22D3EE)] bg-clip-text text-transparent`}>
        {brandName}
      </p>
    </div>
  );
}
