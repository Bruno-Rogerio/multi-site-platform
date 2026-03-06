import { redirect } from "next/navigation";

export default function ClientAppearancePage() {
  redirect("/admin/client/editor?tab=aparencia");
}
