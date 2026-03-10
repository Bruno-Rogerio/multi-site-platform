import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { MessagesClientView } from "./messages-client-view";

export default async function ClientMessagesPage() {
  const profile = await requireUserProfile(["client"]);

  const supabase = await createSupabaseServerAuthClient();
  let tickets: unknown[] = [];
  let sitePlan = "landing";

  if (supabase && profile.site_id) {
    const [ticketsResult, siteResult] = await Promise.all([
      supabase
        .from("support_tickets")
        .select("*, ticket_messages(count)")
        .eq("site_id", profile.site_id)
        .order("updated_at", { ascending: false }),
      supabase
        .from("sites")
        .select("plan")
        .eq("id", profile.site_id)
        .maybeSingle(),
    ]);
    tickets = ticketsResult.data ?? [];
    sitePlan = (siteResult.data?.plan as string | undefined) ?? "landing";
  }

  return <MessagesClientView tickets={tickets} sitePlan={sitePlan} />;
}
