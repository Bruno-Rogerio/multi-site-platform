import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json(
      { error: "Informe ?domain=subdominio.bsph.com.br" },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Admin indisponivel" }, { status: 500 });
  }

  const { data: site, error: siteError } = await admin
    .from("sites")
    .select("id,name,domain,plan,theme_settings,created_at")
    .eq("domain", domain)
    .maybeSingle();

  if (siteError) {
    return NextResponse.json({ error: siteError.message }, { status: 500 });
  }

  if (!site) {
    return NextResponse.json({ error: "Site nao encontrado", domain }, { status: 404 });
  }

  const { data: pages } = await admin
    .from("pages")
    .select("id,slug,title")
    .eq("site_id", site.id);

  const pageIds = (pages ?? []).map((p: { id: string }) => p.id);

  const { data: sections } = await admin
    .from("sections")
    .select("id,page_id,type,variant,order,content")
    .in("page_id", pageIds.length > 0 ? pageIds : ["none"])
    .order("order", { ascending: true });

  return NextResponse.json({
    site: {
      id: site.id,
      name: site.name,
      domain: site.domain,
      plan: site.plan,
    },
    themeSettings: site.theme_settings,
    pages: pages ?? [],
    sections: (sections ?? []).map((s: Record<string, unknown>) => ({
      id: s.id,
      type: s.type,
      variant: s.variant,
      order: s.order,
      contentKeys: s.content ? Object.keys(s.content as Record<string, unknown>) : [],
      content: s.content,
    })),
  });
}
