import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { ContactMessagesView } from "@/components/admin/contact-messages-view";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

export default async function ClientContactsPage() {
  const profile = await requireUserProfile(["client"]);
  const supabase = await createSupabaseServerAuthClient();

  let messages: ContactMessage[] = [];
  if (supabase && profile.site_id) {
    const { data } = await supabase
      .from("contact_messages")
      .select("id, name, email, message, read, created_at")
      .eq("site_id", profile.site_id)
      .order("created_at", { ascending: false })
      .limit(200);
    messages = (data ?? []) as ContactMessage[];
  }

  return <ContactMessagesView messages={messages} />;
}
