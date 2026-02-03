import { notFound, redirect } from "next/navigation";

import { SectionRenderer } from "@/components/site/section-renderer";
import { getRequestHostClassification } from "@/lib/tenant/request-host";
import { SiteShell, buttonStyleClasses } from "@/components/site/site-shell";
import { getSiteByTenantSubdomain } from "@/lib/tenant/service";
import type { Section } from "@/lib/tenant/types";

type TenantPageProps = {
  params: Promise<{ tenant: string }>;
};

export const dynamic = "force-dynamic";

function getFirstSection(sections: Section[], type: Section["type"]): Section | null {
  return sections.find((section) => section.type === type) ?? null;
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

  const orderedSections = [...site.homePage.sections].sort((a, b) => a.order - b.order);
  const heroSection = getFirstSection(orderedSections, "hero");
  const servicesSection = getFirstSection(orderedSections, "services");
  const ctaSection =
    getFirstSection(orderedSections, "cta") ?? getFirstSection(orderedSections, "contact");
  const sectionsToRender = [heroSection, servicesSection, ctaSection].filter(
    (section): section is Section => section !== null,
  );

  if (sectionsToRender.length === 0) {
    notFound();
  }

  const buttonStyleClassName = buttonStyleClasses[site.themeSettings.buttonStyle];

  return (
    <SiteShell site={site}>
      {sectionsToRender.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          site={site}
          buttonStyleClassName={buttonStyleClassName}
        />
      ))}
    </SiteShell>
  );
}
