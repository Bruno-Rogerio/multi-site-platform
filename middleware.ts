import { type NextRequest, NextResponse } from "next/server";

import { classifyHost, resolveRequestHostname } from "@/lib/tenant/host";

const PLATFORM_ONLY_PREFIXES = ["/admin", "/login", "/publicar", "/quero-comecar"];

function isPlatformOnlyPath(pathname: string): boolean {
  return PLATFORM_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const resolvedHostname = resolveRequestHostname(
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
    request.nextUrl.hostname,
  );
  const host = classifyHost(resolvedHostname);

  if (host.kind === "tenant") {
    // Internal tenant routes (/t/[tenant]) are not public URLs.
    if (pathname.startsWith("/t/")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }

    // Tenant domains cannot access platform auth/admin routes.
    if (isPlatformOnlyPath(pathname)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }

    // Rewrite tenant host requests to internal route space.
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname =
      pathname === "/" ? `/t/${host.tenant}` : `/t/${host.tenant}${pathname}`;

    return NextResponse.rewrite(rewriteUrl);
  }

  if (host.kind === "platform") {
    // Platform host should not expose internal tenant route namespace.
    if (pathname.startsWith("/t/")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Unknown hosts remain in platform flow for now.
  // Future: map custom domains to tenants here.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip API and static assets to avoid rewriting framework internals.
    "/((?!api|assets|_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
