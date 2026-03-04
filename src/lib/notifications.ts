import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type NotificationType =
  | "ticket_new"
  | "ticket_message"
  | "ticket_status_changed"
  | "sla_warning";

/**
 * Creates a notification for a single user via the admin client (bypasses RLS).
 * Fire-and-forget safe — logs errors but does not throw.
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  ticketId?: string,
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    body,
    ...(ticketId ? { ticket_id: ticketId } : {}),
  });

  if (error) {
    console.error("[Notifications] Failed to create notification:", error.message);
  }
}

/**
 * Bulk-creates the same notification for multiple users.
 */
export async function createNotificationForMany(
  userIds: string[],
  type: NotificationType,
  title: string,
  body: string,
  ticketId?: string,
): Promise<void> {
  if (userIds.length === 0) return;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  const rows = userIds.map((userId) => ({
    user_id: userId,
    type,
    title,
    body,
    ...(ticketId ? { ticket_id: ticketId } : {}),
  }));

  const { error } = await supabase.from("notifications").insert(rows);
  if (error) {
    console.error("[Notifications] Failed to bulk-create notifications:", error.message);
  }
}

/**
 * Returns the IDs of all platform admin users.
 */
export async function getAdminUserIds(): Promise<string[]> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("role", "admin");

  if (error || !data) return [];
  return data.map((row) => row.id as string);
}
