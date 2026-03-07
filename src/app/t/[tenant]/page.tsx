import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { SectionRenderer } from "@/components/site/section-renderer";
import { getRequestHostClassification } from "@/lib/tenant/request-host";
import { SiteShell, buttonStyleClasses } from "@/components/site/site-shell";
import { getSiteByTenantSubdomain } from "@/lib/tenant/service";
import { AnimatedSection } from "@/components/site/animated-section";
import { SectionDivider } from "@/components/site/section-divider";
import { FloatingContactButtons } from "@/components/site/floating-contact-buttons";
import { PreviewBanner } from "@/components/site/preview-banner";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";

type TenantPageProps = {
  params: Promise<{ tenant: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: TenantPageProps): Promise<Metadata> {
  const { tenant } = await params;
  const site = await getSiteByTenantSubdomain(tenant);
  if (!site) return { title: "Site" };
  const title = site.themeSettings.seoTitle?.trim() || site.name;
  const description = site.themeSettings.seoDescription?.trim() || undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: site.name,
    },
  };
}

export default async function TenantPublicPage({ params }: TenantPageProps) {
  const { tenant } = await params;
  const host = await getRequestHostClassification();
  if (host.kind === "platform") {
    redirect("/");
  }
  if (host.kind === "tenant" && host.tenant !== tenant) {
    redirect("/");
  }

  const site = await getSiteByTenantSubdomain(tenant);

  if (!site) {
    notFound();
  }

  // Auth gate: draft sites are only visible to the registered owner
  const isDraft = site.themeSettings.onboardingDraft === true;
  if (isDraft) {
    const supabase = await createSupabaseServerAuthClient();
    const { data: { user } } = supabase
      ? await supabase.auth.getUser()
      : { data: { user: null } };

    if (!user) {
      // Redirecionar para login na plataforma passando a URL absoluta do tenant
      // como parâmetro return — /t/${tenant} no domínio da plataforma seria
      // interceptado pelo host classifier e redirecionaria para /.
      const rootDomain = process.env.PLATFORM_ROOT_DOMAIN ?? "bsph.com.br";
      const platformOrigin = `https://${rootDomain}`;
      const tenantUrl = `https://${tenant}.${rootDomain}`;
      redirect(`${platformOrigin}/login?return=${encodeURIComponent(tenantUrl)}`);
    }

    const ownerEmail = site.themeSettings.ownerEmail ?? "";
    const ownerUserId = site.themeSettings.ownerUserId ?? "";
    const isOwner =
      (ownerEmail && user.email?.toLowerCase() === ownerEmail.toLowerCase()) ||
      (ownerUserId && user.id === ownerUserId);

    if (!isOwner) {
      redirect("/");
    }
  }

  // Suspended sites show a generic unavailability page (no billing details exposed)
  if (site.themeSettings.suspended === true) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif" }}>
        <div style={{ textAlign: "center", padding: "48px 24px", maxWidth: 420 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 28 }}>
            ⏸
          </div>
          <h1 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 700, color: "#0f172a" }}>
            {site.name}
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: "#64748b", lineHeight: 1.6 }}>
            Este site está temporariamente indisponível.
          </p>
        </div>
      </div>
    );
  }

  // Track page view (fire-and-forget — does not block render)
  // At this point: isDraft is false and suspended check has already returned early
  if (!isDraft) {
    const platformOrigin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
      `https://${process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "bsph.com.br"}`;
    fetch(`${platformOrigin}/api/analytics/pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId: site.id }),
    }).catch(() => {});
  }

  const sectionsToRender = [...site.homePage.sections].sort((a, b) => a.order - b.order);

  if (sectionsToRender.length === 0) {
    notFound();
  }

  const buttonStyleClassName = buttonStyleClasses[site.themeSettings.buttonStyle];
  const motionStyle = site.themeSettings.motionStyle ?? "motion-fade";
  const dividerStyle = site.themeSettings.dividerStyle ?? "none";

  const isPreview = site.themeSettings.onboardingDraft === true;
  const previewExpiresAt = site.themeSettings.previewExpiresAt ?? new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  return (
    <SiteShell site={site}>
      {isPreview && (
        <PreviewBanner expiresAt={previewExpiresAt} siteId={site.id} />
      )}
      {sectionsToRender.map((section, index) => (
        <div key={section.id}>
          {index > 0 && <SectionDivider style={dividerStyle} />}
          <AnimatedSection animationStyle={motionStyle}>
            <SectionRenderer
              section={section}
              site={site}
              buttonStyleClassName={buttonStyleClassName}
              maxEventsPreview={3}
            />
          </AnimatedSection>
        </div>
      ))}
      {site.themeSettings.floatingButtonsEnabled !== false &&
        site.themeSettings.floatingLinks &&
        site.themeSettings.floatingLinks.length > 0 && (
          <FloatingContactButtons links={site.themeSettings.floatingLinks} />
        )}
    </SiteShell>
  );
}
