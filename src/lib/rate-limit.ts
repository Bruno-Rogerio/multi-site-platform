/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Works per server instance — adequate for MVP traffic on a single Vercel region.
 * For distributed rate limiting, replace with an Upstash Redis solution later.
 */

const store = new Map<string, { count: number; resetAt: number }>();

/**
 * Returns true if the request is within the allowed limit, false if rate-limited.
 *
 * @param ip      Client IP address (use getClientIp())
 * @param action  Identifier for the action being limited (e.g. "save-lead")
 * @param limit   Max number of requests allowed per window
 * @param windowMs  Window size in milliseconds
 */
export function checkRateLimit(
  ip: string,
  action: string,
  limit: number,
  windowMs: number,
): boolean {
  const key = `${action}:${ip}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}

/** Extracts the real client IP from a Next.js request (handles Vercel proxy headers). */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  );
}
