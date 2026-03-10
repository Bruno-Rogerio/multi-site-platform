import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { classifyHost, resolveRequestHostname } from "@/lib/tenant/host";
import type { Section, SectionType } from "@/lib/tenant/types";

const VALID_SECTION_TYPES: SectionType[] = [
  "hero", "about", "services", "cta", "testimonials", "contact", "faq", "blog", "gallery", "events",
];

function buildDefaultContent(type: SectionType): Record<string, unknown> {
  switch (type) {
    case "hero":         return { eyebrow: "", title: "", subtitle: "", ctaLabel: "Entrar em contato", ctaHref: "", imageUrl: "" };
    case "about":        return { title: "Sobre", body: "", imageUrl: "" };
    case "services":     return { title: "Serviços", cards: [], imageUrl: "" };
    case "cta":          return { title: "Vamos conversar?", description: "", buttonLabel: "Entrar em contato", buttonHref: "" };
    case "testimonials": return { title: "Depoimentos", items: [] };
    case "contact":      return { title: "Contato", subtitle: "", socialLinks: [] };
    case "faq":          return { title: "Perguntas Frequentes", items: [] };
    case "blog":         return { title: "Blog", posts: [] };
    case "gallery":      return { title: "Galeria", images: [] };
    case "events":       return { title: "Agenda", events: [] };
    default:             return {};
  }
}

type HomePageRow = {
  id: string;
};

type SectionRow = {
  id: string;
  type: Section["type"];
  variant: string | null;
  order: number;
  content: Record<string, unknown> | null;
};

function normalizeSiteId(raw: string | null): string | null {
  const value = raw?.trim() ?? "";
  return value.length > 0 ? value : null;
}

async function resolveScopedSiteId(request: Request): Promise<{
  errorResponse: NextResponse | null;
  siteId: string | null;
}> {
  const requestUrl = new URL(request.url);
  const host = classifyHost(
    resolveRequestHostname(
      request.headers.get("x-forwarded-host"),
      request.headers.get("host"),
      requestUrl.hostname,
    ),
  );

  if (host.kind === "tenant") {
    return {
      errorResponse: NextResponse.json(
        { error: "Tenant host cannot access platform admin endpoints." },
        { status: 403 },
      ),
      siteId: null,
    };
  }

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return {
      errorResponse: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
      siteId: null,
    };
  }

  const requestedSiteId = normalizeSiteId(requestUrl.searchParams.get("siteId"));

  if (profile.role === "client") {
    if (!profile.site_id) {
      return {
        errorResponse: NextResponse.json(
          { error: "Client user is not linked to any site." },
          { status: 400 },
        ),
        siteId: null,
      };
    }

    if (requestedSiteId && requestedSiteId !== profile.site_id) {
      return {
        errorResponse: NextResponse.json(
          { error: "Client cannot access sections from another site." },
          { status: 403 },
        ),
        siteId: null,
      };
    }

    return { errorResponse: null, siteId: profile.site_id };
  }

  return { errorResponse: null, siteId: requestedSiteId };
}

async function getHomePageId(siteId: string) {
  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return { error: NextResponse.json({ error: "Supabase unavailable." }, { status: 500 }), pageId: null };
  }

  const { data: page, error } = await supabase
    .from("pages")
    .select("id")
    .eq("site_id", siteId)
    .eq("slug", "home")
    .maybeSingle<HomePageRow>();

  if (error || !page) {
    return {
      error: NextResponse.json(
        { error: "Home page not found for this site.", details: error?.message ?? null },
        { status: 404 },
      ),
      pageId: null,
    };
  }

  return { error: null, pageId: page.id, supabase };
}

export async function GET(request: Request) {
  const { errorResponse, siteId } = await resolveScopedSiteId(request);
  if (errorResponse) {
    return errorResponse;
  }

  if (!siteId) {
    return NextResponse.json({ sections: [] });
  }

  const homePage = await getHomePageId(siteId);
  if (homePage.error || !homePage.pageId || !homePage.supabase) {
    return homePage.error ?? NextResponse.json({ sections: [] });
  }

  const [sectionsResult, siteResult] = await Promise.all([
    homePage.supabase
      .from("sections")
      .select("id,type,variant,order,content")
      .eq("page_id", homePage.pageId)
      .order("order", { ascending: true }),
    homePage.supabase
      .from("sites")
      .select("theme_settings")
      .eq("id", siteId)
      .maybeSingle(),
  ]);

  if (sectionsResult.error) {
    return NextResponse.json(
      { error: "Could not load sections.", details: sectionsResult.error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({
    siteId,
    themeSettings: siteResult.data?.theme_settings ?? null,
    sections: (sectionsResult.data as SectionRow[] | null)?.map((section) => ({
      id: section.id,
      type: section.type,
      variant: section.variant ?? "default",
      order: section.order,
      content: section.content ?? {},
    })) ?? [],
  });
}

export async function PATCH(request: Request) {
  const { errorResponse, siteId } = await resolveScopedSiteId(request);
  if (errorResponse) {
    return errorResponse;
  }

  if (!siteId) {
    return NextResponse.json({ error: "Missing siteId." }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        sectionId?: string;
        order?: number;
        variant?: string;
        content?: Record<string, unknown>;
      }
    | null;

  if (!body?.sectionId) {
    return NextResponse.json({ error: "Missing sectionId." }, { status: 400 });
  }

  if (!body.content || typeof body.content !== "object") {
    return NextResponse.json({ error: "Invalid section content." }, { status: 400 });
  }

  const orderValue = Number.isFinite(body.order) ? Number(body.order) : 0;
  const variantValue = (body.variant ?? "default").trim() || "default";

  const homePage = await getHomePageId(siteId);
  if (homePage.error || !homePage.pageId || !homePage.supabase) {
    return homePage.error ?? NextResponse.json({ error: "Could not resolve home page." }, { status: 400 });
  }

  const { data, error } = await homePage.supabase
    .from("sections")
    .update({
      order: orderValue,
      variant: variantValue,
      content: body.content,
    })
    .eq("id", body.sectionId)
    .eq("page_id", homePage.pageId)
    .select("id,type,variant,order,content")
    .maybeSingle<SectionRow>();

  if (error || !data) {
    return NextResponse.json(
      { error: "Could not update section.", details: error?.message ?? "Section not found." },
      { status: 400 },
    );
  }

  // Sync socialLinks to theme_settings when the contact section is saved
  if (data.type === "contact" && Array.isArray(body.content.socialLinks)) {
    const { data: siteData } = await homePage.supabase
      .from("sites")
      .select("theme_settings")
      .eq("id", siteId)
      .maybeSingle();

    const currentSettings = (siteData?.theme_settings as Record<string, unknown>) ?? {};
    await homePage.supabase
      .from("sites")
      .update({ theme_settings: { ...currentSettings, socialLinks: body.content.socialLinks } })
      .eq("id", siteId);
  }

  return NextResponse.json({
    ok: true,
    section: {
      id: data.id,
      type: data.type,
      variant: data.variant ?? "default",
      order: data.order,
      content: data.content ?? {},
    },
  });
}

export async function POST(request: Request) {
  const { errorResponse, siteId } = await resolveScopedSiteId(request);
  if (errorResponse) return errorResponse;
  if (!siteId) return NextResponse.json({ error: "Missing siteId." }, { status: 400 });

  const body = (await request.json().catch(() => null)) as { type?: string } | null;
  const sectionType = body?.type as SectionType | undefined;

  if (!sectionType || !VALID_SECTION_TYPES.includes(sectionType)) {
    return NextResponse.json({ error: "Invalid section type." }, { status: 400 });
  }

  const homePage = await getHomePageId(siteId);
  if (homePage.error || !homePage.pageId || !homePage.supabase) {
    return homePage.error ?? NextResponse.json({ error: "Could not resolve home page." }, { status: 400 });
  }

  // Get max existing order
  const { data: existing } = await homePage.supabase
    .from("sections")
    .select("order")
    .eq("page_id", homePage.pageId)
    .order("order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? (existing[0].order as number) + 1 : 0;

  const { data, error } = await homePage.supabase
    .from("sections")
    .insert({
      page_id: homePage.pageId,
      type: sectionType,
      variant: "default",
      order: nextOrder,
      content: buildDefaultContent(sectionType),
    })
    .select("id,type,variant,order,content")
    .single<SectionRow>();

  if (error || !data) {
    return NextResponse.json(
      { error: "Could not create section.", details: error?.message ?? null },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    section: {
      id: data.id,
      type: data.type,
      variant: data.variant ?? "default",
      order: data.order,
      content: data.content ?? {},
    },
  });
}

export async function DELETE(request: Request) {
  const { errorResponse, siteId } = await resolveScopedSiteId(request);
  if (errorResponse) return errorResponse;
  if (!siteId) return NextResponse.json({ error: "Missing siteId." }, { status: 400 });

  const requestUrl = new URL(request.url);
  const sectionId = requestUrl.searchParams.get("sectionId");
  if (!sectionId) return NextResponse.json({ error: "Missing sectionId." }, { status: 400 });

  const homePage = await getHomePageId(siteId);
  if (homePage.error || !homePage.pageId || !homePage.supabase) {
    return homePage.error ?? NextResponse.json({ error: "Could not resolve home page." }, { status: 400 });
  }

  const { error } = await homePage.supabase
    .from("sections")
    .delete()
    .eq("id", sectionId)
    .eq("page_id", homePage.pageId);

  if (error) {
    return NextResponse.json({ error: "Could not delete section.", details: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
