import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { siteId?: string } | null;
  const siteId = body?.siteId;
  if (!siteId) return new Response(null, { status: 204 });

  const admin = createSupabaseAdminClient();
  if (admin) {
    try { await admin.from("page_view_logs").insert({ site_id: siteId }); } catch { /* ignore */ }
  }

  return new Response(null, { status: 204 });
}
