import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

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
  const formData = await request.formData();
  const fileEntry = formData.get("file");
  const slot = typeof formData.get("slot") === "string" ? String(formData.get("slot")) : "general";

  if (!(fileEntry instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }

  if (!fileEntry.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  if (fileEntry.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Arquivo muito grande. Maximo 5MB." },
      { status: 400 },
    );
  }

  const supabaseAdmin = createSupabaseAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Erro de configuracao do servidor." },
      { status: 500 },
    );
  }

  const bucket = process.env.SUPABASE_ASSETS_BUCKET ?? "site-assets";
  const safeName = sanitizeFileName(fileEntry.name);
  // Store in onboarding-temp folder, will be moved to site folder after checkout
  const path = `onboarding-temp/${Date.now()}-${safeName}`;
  const fileBuffer = await fileEntry.arrayBuffer();

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, fileBuffer, {
      contentType: fileEntry.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: "Nao foi possivel enviar a imagem.", details: uploadError.message },
      { status: 400 },
    );
  }

  const { data: publicData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({
    ok: true,
    slot,
    url: publicData.publicUrl,
    path,
  });
}
