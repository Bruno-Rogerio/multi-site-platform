"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, BookOpen, X, ImageIcon, ExternalLink } from "lucide-react";
import { useToast } from "@/components/admin/toast-provider";
import type { Section } from "@/lib/tenant/types";

type BlogPost = {
  title: string;
  excerpt: string;
  imageUrl?: string;
  link?: string;
};

const EMPTY_POST: BlogPost = { title: "", excerpt: "", imageUrl: "", link: "" };

const INPUT_CLS =
  "w-full rounded-xl border border-white/15 bg-[#0B1020] px-3 py-2 text-sm text-[var(--platform-text)] placeholder:text-[var(--platform-text)]/25 outline-none transition focus:border-[#22D3EE]";

type Props = {
  siteId: string;
  blogSection: Section;
};

export function BlogPostsManager({ siteId, blogSection }: Props) {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>(
    Array.isArray(blogSection.content.posts)
      ? (blogSection.content.posts as BlogPost[])
      : [],
  );
  const [saving, setSaving] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<BlogPost>(EMPTY_POST);

  function openCreate() {
    setDraft(EMPTY_POST);
    setEditIndex(null);
    setModalOpen(true);
  }

  function openEdit(index: number) {
    setDraft({ ...posts[index] });
    setEditIndex(index);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditIndex(null);
    setDraft(EMPTY_POST);
  }

  async function savePost() {
    if (!draft.title.trim()) {
      toast("O título é obrigatório.", "error");
      return;
    }
    const next =
      editIndex !== null
        ? posts.map((p, i) => (i === editIndex ? draft : p))
        : [...posts, draft];

    await persistPosts(next);
    if (!saving) closeModal();
  }

  async function deletePost(index: number) {
    const next = posts.filter((_, i) => i !== index);
    await persistPosts(next);
  }

  async function persistPosts(next: BlogPost[]) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/sections?siteId=${encodeURIComponent(siteId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId: blogSection.id,
          order: blogSection.order,
          variant: blogSection.variant ?? "default",
          content: { ...blogSection.content, posts: next },
        }),
      });
      const data = await res.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (res.ok && data?.ok) {
        setPosts(next);
        toast("Posts salvos!", "success");
        closeModal();
      } else {
        toast(data?.error ?? "Erro ao salvar.", "error");
      }
    } catch {
      toast("Erro ao salvar.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--platform-text)]">Blog</h1>
          <p className="mt-1 text-sm text-[var(--platform-text)]/60">
            Gerencie os artigos exibidos na seção de blog do seu site.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          <Plus size={15} />
          Novo artigo
        </button>
      </div>

      {/* List */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#12182B] py-20">
          <BookOpen size={40} className="text-[var(--platform-text)]/20" />
          <p className="mt-4 text-sm font-medium text-[var(--platform-text)]/50">Nenhum artigo ainda</p>
          <p className="mt-1 text-xs text-[var(--platform-text)]/30">Clique em "Novo artigo" para adicionar.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-white/10 bg-[#12182B] overflow-hidden transition hover:border-white/20"
            >
              {/* Thumbnail */}
              {post.imageUrl ? (
                <div
                  className="h-36 w-full bg-center bg-cover"
                  style={{ backgroundImage: `url(${post.imageUrl})` }}
                />
              ) : (
                <div className="flex h-36 w-full items-center justify-center bg-white/[0.02]">
                  <ImageIcon size={28} className="text-[var(--platform-text)]/20" />
                </div>
              )}

              <div className="p-4">
                <p className="font-semibold text-sm text-[var(--platform-text)] line-clamp-2 leading-snug">
                  {post.title}
                </p>
                {post.excerpt && (
                  <p className="mt-1 text-xs text-[var(--platform-text)]/50 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                {post.link && (
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[10px] text-[#22D3EE] hover:underline"
                  >
                    <ExternalLink size={10} />
                    Ver link
                  </a>
                )}
              </div>

              {/* Action buttons */}
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  type="button"
                  onClick={() => openEdit(index)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B1020]/90 text-[var(--platform-text)]/70 backdrop-blur transition hover:text-[#22D3EE]"
                >
                  <Pencil size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => deletePost(index)}
                  disabled={saving}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B1020]/90 text-[var(--platform-text)]/70 backdrop-blur transition hover:text-rose-400 disabled:opacity-40"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#12182B] p-6 shadow-2xl">
            {/* Modal header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--platform-text)]">
                {editIndex !== null ? "Editar artigo" : "Novo artigo"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-[var(--platform-text)]/40 hover:text-[var(--platform-text)] transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                  Título <span className="text-rose-400">*</span>
                </label>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  placeholder="Título do artigo"
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                  Resumo
                </label>
                <textarea
                  value={draft.excerpt}
                  onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
                  placeholder="Breve descrição do artigo..."
                  rows={3}
                  className={INPUT_CLS + " resize-none"}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                  URL da imagem
                </label>
                <input
                  value={draft.imageUrl ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value }))}
                  placeholder="https://..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--platform-text)]/60">
                  Link do artigo
                </label>
                <input
                  value={draft.link ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, link: e.target.value }))}
                  placeholder="https://seu.blog/artigo"
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[var(--platform-text)]/60 transition hover:border-white/20 hover:text-[var(--platform-text)]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={savePost}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#3B82F6,#7C5CFF)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
              >
                {saving && <Loader2 size={13} className="animate-spin" />}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
