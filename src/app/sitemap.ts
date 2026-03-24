import type { MetadataRoute } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ROOT = process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "bsph.com.br";
  const base = `https://${ROOT}`;

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                        lastModified: new Date(), priority: 1.0, changeFrequency: "daily"   },
    { url: `${base}/quero-comecar`,     lastModified: new Date(), priority: 0.9, changeFrequency: "weekly"  },
    { url: `${base}/premium`,           lastModified: new Date(), priority: 0.8, changeFrequency: "weekly"  },
    { url: `${base}/termos`,            lastModified: new Date(), priority: 0.3, changeFrequency: "yearly"  },
    { url: `${base}/privacidade`,       lastModified: new Date(), priority: 0.3, changeFrequency: "yearly"  },
  ];

  const admin = createSupabaseAdminClient();
  if (!admin) return staticPages;

  // Active tenant sites (not draft, not suspended)
  const { data: sites } = await admin
    .from("sites")
    .select("domain, created_at, theme_settings")
    .order("created_at", { ascending: false });

  const tenantEntries: MetadataRoute.Sitemap = (sites ?? [])
    .filter((s) => {
      const ts = s.theme_settings as Record<string, unknown> | null ?? {};
      return ts.onboardingDraft !== true && ts.suspended !== true;
    })
    .map((s) => ({
      url: `https://${s.domain}`,
      lastModified: new Date(s.created_at as string),
      priority: 0.7,
      changeFrequency: "weekly" as const,
    }));

  return [...staticPages, ...tenantEntries];
}
