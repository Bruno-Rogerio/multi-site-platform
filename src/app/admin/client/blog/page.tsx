import Link from "next/link";
import { BookOpen } from "lucide-react";

import { requireUserProfile } from "@/lib/auth/session";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server";
import { BlogPostsManager } from "@/components/admin/blog-posts-manager";
import type { Section } from "@/lib/tenant/types";

type SectionRow = {
  id: string;
  type: string;
  variant: string | null;
  order: number;
  content: Record<string, unknown> | null;
};

export default async function ClientBlogPage() {
  const profile = await requireUserProfile(["client"]);
  const supabase = await createSupabaseServerAuthClient();

  let blogSection: Section | null = null;
  let siteId = profile.site_id ?? "";

  if (supabase && profile.site_id) {
    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("site_id", profile.site_id)
      .eq("slug", "home")
      .maybeSingle<{ id: string }>();

    if (page?.id) {
      const { data } = await supabase
        .from("sections")
        .select("id,type,variant,order,content")
        .eq("page_id", page.id)
        .eq("type", "blog")
        .maybeSingle<SectionRow>();

      if (data) {
        blogSection = {
          id: data.id,
          type: "blog",
          variant: data.variant ?? "default",
          order: data.order,
          content: data.content ?? {},
        };
      }
    }
  }

  if (!blogSection) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <h1 className="mb-4 text-2xl font-bold text-[var(--platform-text)]">Blog</h1>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#12182B] py-20">
          <BookOpen size={40} className="text-[var(--platform-text)]/20" />
          <p className="mt-4 text-sm font-medium text-[var(--platform-text)]/50">
            Seção de blog não ativada
          </p>
          <p className="mt-1 text-xs text-[var(--platform-text)]/30">
            Ative a seção de blog no editor para poder gerenciar os artigos.
          </p>
          <Link
            href="/admin/client/editor?tab=extras"
            className="mt-6 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[#22D3EE] transition hover:border-[#22D3EE]/30 hover:bg-[#22D3EE]/5"
          >
            Ir para Extras →
          </Link>
        </div>
      </div>
    );
  }

  return <BlogPostsManager siteId={siteId} blogSection={blogSection} />;
}
