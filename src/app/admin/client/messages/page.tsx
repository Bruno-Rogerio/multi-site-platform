import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { MessagesClientView } from "./messages-client-view";

export default async function ClientMessagesPage() {
  const profile = await requireUserProfile(["client"]);

  const supabase = await createSupabaseServerAuthClient();
  let tickets: unknown[] = [];

  if (supabase && profile.site_id) {
    const { data } = await supabase
      .from("support_tickets")
      .select("*, ticket_messages(count)")
      .eq("site_id", profile.site_id)
      .order("updated_at", { ascending: false });
    tickets = data ?? [];
  }

  return <MessagesClientView tickets={tickets} />;
}
