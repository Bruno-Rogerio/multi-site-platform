import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { PipelineBoard } from "@/components/admin/pipeline-board";

type DraftRow = {
  id: string;
  status: string;
  created_at: string;
  payload: Record<string, unknown> | null;
};

export default async function PlatformPipelinePage() {
  await requireUserProfile(["admin"]);
  const supabase = await createSupabaseServerAuthClient();

  let drafts: DraftRow[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("onboarding_drafts")
      .select("id,status,created_at,payload")
      .order("created_at", { ascending: false });
    drafts = (data as DraftRow[] | null) ?? [];
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--platform-text)]">Pipeline de onboarding</h1>
        <p className="mt-1 text-sm text-[var(--platform-text)]/60">
          Acompanhe o funil de cadastro dos clientes.
        </p>
      </div>

      <PipelineBoard drafts={drafts} />
    </div>
  );
}
