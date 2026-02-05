import { NextResponse } from "next/server";

import { getCurrentUserProfile } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { classifyHost, resolveRequestHostname } from "@/lib/tenant/host";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_SLOTS = new Set(["logo_url", "hero_image_url", "dashboard_banner_url"]);

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
    return NextResponse.json({ error: "Tenant host cannot upload platform assets." }, { status: 403 });
  }

  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Only platform admins can upload platform assets." }, { status: 403 });
  }

  const formData = await request.formData();
  const slotRaw = formData.get("slot");
  const fileEntry = formData.get("file");
  const slot = typeof slotRaw === "string" ? slotRaw.trim() : "";

  if (!ALLOWED_SLOTS.has(slot)) {
    return NextResponse.json({ error: "Invalid upload slot." }, { status: 400 });
  }

  if (!(fileEntry instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }

  if (!fileEntry.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  if (fileEntry.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
  }

  const supabaseAdmin = createSupabaseAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY for upload." }, { status: 500 });
  }

  const bucket = process.env.SUPABASE_ASSETS_BUCKET ?? "site-assets";
  const safeName = sanitizeFileName(fileEntry.name);
  const path = `platform/${slot}/${Date.now()}-${safeName}`;
  const fileBuffer = await fileEntry.arrayBuffer();

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, fileBuffer, {
      contentType: fileEntry.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: "Could not upload image.", details: uploadError.message }, { status: 400 });
  }

  const { data: publicData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({
    ok: true,
    bucket,
    path,
    url: publicData.publicUrl,
  });
}
