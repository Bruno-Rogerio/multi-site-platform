import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// POST /api/analytics/platform-pageview
// Body: { path: string }
// Fire-and-forget — does not block rendering
export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { path?: string } | null;
  const path = body?.path?.trim();
  if (!path) return new Response(null, { status: 204 });

  const admin = createSupabaseAdminClient();
  if (admin) {
    const { error } = await admin.from("platform_page_views").insert({ path });
    if (error) console.error("[platform-pageview]", error.message);
  }

  return new Response(null, { status: 204 });
}
