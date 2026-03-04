import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { MessagesPlatformView } from "./messages-platform-view";

export default async function PlatformMessagesPage() {
  await requireUserProfile(["admin"]);

  const supabase = await createSupabaseServerAuthClient();
  let tickets: unknown[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("support_tickets")
      .select("*, sites(name), ticket_messages(count)")
      .order("sla_deadline", { ascending: true });
    tickets = data ?? [];
  }

  return <MessagesPlatformView tickets={tickets} />;
}
