import { headers } from "next/headers";

import { classifyHost, resolveRequestHostname } from "./host";

export async function getRequestHostClassification() {
  const headerStore = await headers();
  const resolvedHostname = resolveRequestHostname(
    headerStore.get("x-forwarded-host"),
    headerStore.get("host"),
  );

  return classifyHost(resolvedHostname);
}
