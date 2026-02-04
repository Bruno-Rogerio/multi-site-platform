import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import type { MediaSlot } from "@/lib/media/presets";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { classifyHost, resolveRequestHostname } from "@/lib/tenant/host";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function normalizeSiteId(raw: FormDataEntryValue | null): string | null {
  if (typeof raw !== "string") {
    return null;
  }
  const value = raw.trim();
  return value.length > 0 ? value : null;
}

function sanitizeFileName(rawFileName: string): string {
  const extension = rawFileName.includes(".") ? rawFileName.split(".").pop() ?? "bin" : "bin";
  const base = rawFileName.replace(/\.[^/.]+$/, "");
  const safeBase = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${safeBase || "asset"}.${extension.toLowerCase()}`;
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const host = classifyHost(
    resolveRequestHostname(
      request.headers.get("x-forwarded-host"),
      request.headers.get("host"),
      requestUrl.hostname,
    ),
  );

  if (host.kind === "tenant") {
    return NextResponse.json(
      { error: "Tenant host cannot upload platform assets." },
      { status: 403 },
    );
  }

  const profile = await getCurrentUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const formData = await request.formData();
  const siteId = normalizeSiteId(formData.get("siteId"));
  const sectionType = typeof formData.get("sectionType") === "string" ? String(formData.get("sectionType")) : "section";
  const slot = typeof formData.get("slot") === "string" ? String(formData.get("slot")) : sectionType;
  const fileEntry = formData.get("file");

  if (!siteId) {
    return NextResponse.json({ error: "Missing siteId." }, { status: 400 });
  }

  if (profile.role === "client" && profile.site_id !== siteId) {
    return NextResponse.json(
      { error: "Client cannot upload assets for another site." },
      { status: 403 },
    );
  }

  if (!(fileEntry instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }

  if (!fileEntry.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  if (fileEntry.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 5MB." },
      { status: 400 },
    );
  }

  const supabaseAdmin = createSupabaseAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Missing SUPABASE_SERVICE_ROLE_KEY for upload." },
      { status: 500 },
    );
  }

  const bucket = process.env.SUPABASE_ASSETS_BUCKET ?? "site-assets";
  const safeName = sanitizeFileName(fileEntry.name);
  const path = `${siteId}/${sectionType}/${Date.now()}-${safeName}`;
  const fileBuffer = await fileEntry.arrayBuffer();

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, fileBuffer, {
      contentType: fileEntry.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      {
        error: "Could not upload image.",
        details: uploadError.message,
      },
      { status: 400 },
    );
  }

  const { data: publicData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({
    ok: true,
    bucket,
    path,
    slot: slot as MediaSlot,
    url: publicData.publicUrl,
  });
}
