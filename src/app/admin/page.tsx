import { redirect } from "next/navigation";

import { requireUserProfile } from "@/lib/auth/session";
import { getRequestHostClassification } from "@/lib/tenant/request-host";

export default async function AdminEntryPage() {
  const host = await getRequestHostClassification();
  if (host.kind === "tenant") {
    redirect("/");
  }

  const profile = await requireUserProfile(["admin", "client"]);
  if (profile.role === "admin") {
    redirect("/admin/platform");
  }

  redirect("/admin/client");
}
