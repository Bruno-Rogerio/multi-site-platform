"use client";

import { createBrowserClient } from "@supabase/ssr";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!url || !anonKey) {
    return null;
  }

  if (!browserClient) {
    // Definir cookie no domínio raiz com ponto (ex: .bsph.com.br) para que a
    // sessão seja compartilhada entre a plataforma e todos os subdomínios.
    // Em localhost não aplicamos para não quebrar o dev local.
    const rootDomain = process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN ?? "";
    const cookieDomain =
      rootDomain && !rootDomain.startsWith("localhost")
        ? `.${rootDomain}`
        : undefined;

    browserClient = createBrowserClient(url, anonKey, {
      cookieOptions: cookieDomain ? { domain: cookieDomain } : undefined,
    });
  }

  return browserClient;
}
