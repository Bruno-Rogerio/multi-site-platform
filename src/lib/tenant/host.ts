const HOST_PORT_REGEX = /:\d+$/;
const TENANT_SLUG_REGEX = /^[a-z0-9-]+$/;

const DEFAULT_PLATFORM_DOMAIN = "seudominio.com";
const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "admin",
  "api",
  "assets",
  "static",
  "cdn",
  "login",
]);

export function isReservedSubdomain(subdomain: string): boolean {
  return RESERVED_SUBDOMAINS.has(subdomain.toLowerCase().trim());
}

type HostClassification =
  | { kind: "platform"; hostname: string }
  | { kind: "tenant"; hostname: string; tenant: string }
  | { kind: "unknown"; hostname: string };

function splitHostHeader(rawHost: string | null): string[] {
  if (!rawHost) {
    return [];
  }

  return rawHost
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function getPlatformRootDomain(): string {
  return (
    process.env.PLATFORM_ROOT_DOMAIN ??
    process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ??
    DEFAULT_PLATFORM_DOMAIN
  )
    .toLowerCase()
    .trim();
}

function getSupportedRootDomains(): string[] {
  return [getPlatformRootDomain()].filter(Boolean);
}

export function normalizeHost(rawHost: string | null): string {
  if (!rawHost) {
    return "";
  }

  // Some proxies send multiple forwarded hosts: "hostA, hostB".
  // We always resolve based on the first host in the chain.
  const firstHost = rawHost.split(",")[0] ?? "";

  return firstHost
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(HOST_PORT_REGEX, "")
    .replace(/\.$/, "");
}

export function resolveRequestHostname(
  rawForwardedHost: string | null,
  rawHost: string | null,
  urlHostname?: string | null,
): string {
  const candidates = [
    ...(urlHostname ? [urlHostname] : []),
    ...splitHostHeader(rawForwardedHost),
    ...splitHostHeader(rawHost),
  ]
    .map((candidate) => normalizeHost(candidate))
    .filter(Boolean);

  if (candidates.length === 0) {
    return "";
  }

  const uniqueCandidates = Array.from(new Set(candidates));
  const tenantCandidate = uniqueCandidates.find(
    (candidate) => classifyHost(candidate).kind === "tenant",
  );

  return tenantCandidate ?? uniqueCandidates[0];
}

export function classifyHost(rawHost: string | null): HostClassification {
  const hostname = normalizeHost(rawHost);
  const rootDomains = getSupportedRootDomains();

  if (!hostname) {
    return { kind: "platform", hostname: "localhost" };
  }

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return { kind: "platform", hostname };
  }

  for (const rootDomain of rootDomains) {
    if (hostname === rootDomain) {
      return { kind: "platform", hostname };
    }

    for (const reservedSubdomain of RESERVED_SUBDOMAINS) {
      if (hostname === `${reservedSubdomain}.${rootDomain}`) {
        return { kind: "platform", hostname };
      }
    }

    const rootSuffix = `.${rootDomain}`;
    if (hostname.endsWith(rootSuffix)) {
      const subdomain = hostname.slice(0, -rootSuffix.length);
      if (subdomain && TENANT_SLUG_REGEX.test(subdomain)) {
        if (RESERVED_SUBDOMAINS.has(subdomain)) {
          return { kind: "platform", hostname };
        }

        return { kind: "tenant", hostname, tenant: subdomain };
      }
    }
  }

  if (hostname.endsWith(".localhost")) {
    const localSubdomain = hostname.replace(".localhost", "");
    if (localSubdomain && TENANT_SLUG_REGEX.test(localSubdomain)) {
      if (RESERVED_SUBDOMAINS.has(localSubdomain)) {
        return { kind: "platform", hostname };
      }

      return { kind: "tenant", hostname, tenant: localSubdomain };
    }
  }

  // Future extension point: custom domains can be resolved here.
  return { kind: "unknown", hostname };
}

export function buildTenantDomainCandidates(tenant: string): string[] {
  const normalizedTenant = tenant.toLowerCase().trim();
  if (!TENANT_SLUG_REGEX.test(normalizedTenant)) {
    return [];
  }

  return Array.from(
    new Set([
      `${normalizedTenant}.localhost`,
      ...getSupportedRootDomains().map((rootDomain) => `${normalizedTenant}.${rootDomain}`),
    ]),
  );
}
