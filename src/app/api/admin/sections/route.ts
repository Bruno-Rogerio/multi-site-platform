import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { classifyHost, resolveRequestHostname } from "@/lib/tenant/host";
import type { Section } from "@/lib/tenant/types";

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

  const { data, error } = await homePage.supabase
    .from("sections")
    .select("id,type,variant,order,content")
    .eq("page_id", homePage.pageId)
    .order("order", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Could not load sections.", details: error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({
    siteId,
    sections: (data as SectionRow[] | null)?.map((section) => ({
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
