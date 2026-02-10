import { PlatformBrandingEditor } from "@/components/admin/platform-branding-editor";
import { requireUserProfile } from "@/lib/auth/session";

export default async function PlatformBrandingPage() {
  await requireUserProfile(["admin"]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Branding da plataforma</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Gerencie logo, imagens institucionais e identidade visual do SaaS.
        </p>
      </div>

      <PlatformBrandingEditor />
    </div>
  );
}
