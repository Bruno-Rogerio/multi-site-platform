import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { SectionRenderer } from "@/components/site/section-renderer";
import { getRequestHostClassification } from "@/lib/tenant/request-host";
import { SiteShell, buttonStyleClasses } from "@/components/site/site-shell";
import { getSiteByTenantSubdomain } from "@/lib/tenant/service";
import { AnimatedSection } from "@/components/site/animated-section";
import { SectionDivider } from "@/components/site/section-divider";
import { FloatingWhatsApp } from "@/components/site/floating-whatsapp";

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

  const sectionsToRender = [...site.homePage.sections].sort((a, b) => a.order - b.order);

  if (sectionsToRender.length === 0) {
    notFound();
  }

  const buttonStyleClassName = buttonStyleClasses[site.themeSettings.buttonStyle];
  const motionStyle = site.themeSettings.motionStyle ?? "motion-fade";
  const dividerStyle = site.themeSettings.dividerStyle ?? "none";

  return (
    <SiteShell site={site}>
      {sectionsToRender.map((section, index) => (
        <div key={section.id}>
          {index > 0 && <SectionDivider style={dividerStyle} />}
          <AnimatedSection animationStyle={motionStyle}>
            <SectionRenderer
              section={section}
              site={site}
              buttonStyleClassName={buttonStyleClassName}
            />
          </AnimatedSection>
        </div>
      ))}
      {site.themeSettings.whatsappUrl && (
        <FloatingWhatsApp url={site.themeSettings.whatsappUrl} />
      )}
    </SiteShell>
  );
}
