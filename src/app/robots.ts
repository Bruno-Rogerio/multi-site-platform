import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const ROOT = process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "bsph.com.br";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/t/", "/auth/"],
      },
    ],
    sitemap: `https://${ROOT}/sitemap.xml`,
  };
}
