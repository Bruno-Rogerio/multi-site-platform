import { createSupabaseServerClient } from "@/lib/supabase/server";

import { buildTenantDomainCandidates, normalizeHost } from "./host";
import { defaultThemeSettings, type Section, type Site, type SitePlan } from "./types";

type SiteRow = {
  id: string;
  name: string;
  domain: string;
  plan: SitePlan;
  theme_settings: Partial<Site["themeSettings"]> | null;
  created_at: string;
};

type PageRow = {
  id: string;
  site_id: string;
  slug: string;
  title: string;
};

type SectionRow = {
  id: string;
  type: Section["type"];
  variant: string | null;
  content: Record<string, unknown> | null;
  order: number;
};

function mapSupabaseSite(siteRow: SiteRow, page: PageRow, sections: SectionRow[]): Site {
  return {
    id: siteRow.id,
    name: siteRow.name,
    domain: siteRow.domain,
    plan: siteRow.plan,
    createdAt: siteRow.created_at,
    themeSettings: {
      ...defaultThemeSettings,
      ...siteRow.theme_settings,
    },
    homePage: {
      id: page.id,
      siteId: page.site_id,
      slug: page.slug,
      title: page.title,
      sections: sections.map((section) => ({
        id: section.id,
        type: section.type,
        variant: section.variant ?? "default",
        order: section.order,
        content: section.content ?? {},
      })),
    },
  };
}

async function fetchSiteFromSupabase(candidates: string[]): Promise<Site | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  for (const domain of candidates) {
    const { data: siteRow, error: siteError } = await supabase
      .from("sites")
      .select("id,name,domain,plan,theme_settings,created_at")
      .eq("domain", domain)
      .maybeSingle<SiteRow>();

    if (siteError) {
      console.error("Error loading site by domain", domain, siteError.message);
      continue;
    }

    if (!siteRow) {
      continue;
    }

    const { data: pageRow, error: pageError } = await supabase
      .from("pages")
      .select("id,site_id,slug,title")
      .eq("site_id", siteRow.id)
      .eq("slug", "home")
      .maybeSingle<PageRow>();

    if (pageError || !pageRow) {
      console.error("Error loading home page for site", siteRow.id, pageError?.message);
      continue;
    }

    const { data: sectionRows, error: sectionError } = await supabase
      .from("sections")
      .select("id,type,variant,content,order")
      .eq("page_id", pageRow.id)
      .order("order", { ascending: true });

    if (sectionError) {
      console.error("Error loading sections for page", pageRow.id, sectionError.message);
      continue;
    }

    return mapSupabaseSite(siteRow, pageRow, (sectionRows as SectionRow[]) ?? []);
  }

  return null;
}

export async function getSiteByHost(hostHeader: string | null): Promise<Site | null> {
  const normalizedHost = normalizeHost(hostHeader);
  const candidates = [normalizedHost].filter(
    (candidate): candidate is string => Boolean(candidate),
  );
  return fetchSiteFromSupabase(candidates);
}

export async function getSiteByTenantSubdomain(tenant: string): Promise<Site | null> {
  const candidates = buildTenantDomainCandidates(tenant);
  if (candidates.length === 0) {
    return null;
  }

  return fetchSiteFromSupabase(candidates);
}
