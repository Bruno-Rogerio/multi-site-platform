import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { SiteShell } from "@/components/site/site-shell";
import { GallerySection } from "@/components/site/gallery-section";
import { getSiteByTenantSubdomain } from "@/lib/tenant/service";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ tenant: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant } = await params;
  const site = await getSiteByTenantSubdomain(tenant);
  const siteName = site?.themeSettings.seoTitle?.trim() || site?.name || "";
  return { title: siteName ? `Galeria | ${siteName}` : "Galeria" };
}

function EmptyPageState({ title, message }: { title: string; message: string }) {
  return (
    <section className="py-24 px-4 text-center">
      <h1 className="text-3xl font-black mb-3" style={{ color: "var(--site-text)" }}>
        {title}
      </h1>
      <p className="text-base" style={{ color: "var(--site-text)", opacity: 0.5 }}>
        {message}
      </p>
    </section>
  );
}

export default async function TenantGaleriaPage({ params }: Props) {
  const { tenant } = await params;
  const site = await getSiteByTenantSubdomain(tenant);
  if (!site) notFound();

  // Draft auth gate
  if (site.themeSettings.onboardingDraft === true) {
    const supabase = await createSupabaseServerAuthClient();
    const { data: { user } } = supabase
      ? await supabase.auth.getUser()
      : { data: { user: null } };

    if (!user) {
      const root = process.env.PLATFORM_ROOT_DOMAIN ?? "bsph.com.br";
      redirect(
        `https://${root}/login?return=${encodeURIComponent(`https://${tenant}.${root}/galeria`)}`,
      );
    }

    const ownerEmail = site.themeSettings.ownerEmail ?? "";
    const ownerUserId = site.themeSettings.ownerUserId ?? "";
    const isOwner =
      (ownerEmail && user.email?.toLowerCase() === ownerEmail.toLowerCase()) ||
      (ownerUserId && user.id === ownerUserId);
    if (!isOwner) redirect("/");
  }

  const section = site.homePage.sections.find((s) => s.type === "gallery");
  if (!section) redirect("/");

  const title = (section.content.title as string) || "Galeria";
  const subtitle = (section.content.subtitle as string) || "";
  const images = Array.isArray(section.content.images)
    ? (section.content.images as { url: string; alt: string; caption?: string }[])
    : [];

  return (
    <SiteShell site={site}>
      <div className="min-h-[60vh] pt-20">
        {images.length > 0 ? (
          <GallerySection title={title} subtitle={subtitle} images={images} variant={section.variant} />
        ) : (
          <EmptyPageState title={title} message="Nenhuma imagem publicada ainda." />
        )}
      </div>
    </SiteShell>
  );
}
