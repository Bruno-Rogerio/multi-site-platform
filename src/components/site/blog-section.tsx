"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type BlogPost = {
  title: string;
  excerpt: string;
  imageUrl?: string;
  link?: string;
  body?: string;
};

type BlogSectionProps = {
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
  variant?: string;
};

function BlogDrawer({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col overflow-y-auto shadow-2xl"
        style={{ backgroundColor: "var(--site-bg, #fff)", borderLeft: "1px solid var(--site-border)" }}
      >
        <div className="flex items-center justify-between border-b p-4" style={{ borderColor: "var(--site-border)" }}>
          <h2 className="text-base font-bold leading-tight pr-4" style={{ color: "var(--site-text)" }}>{post.title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:opacity-70"
            style={{ backgroundColor: "color-mix(in srgb, var(--site-text) 10%, transparent)", color: "var(--site-text)" }}
          >
            <X size={16} />
          </button>
        </div>
        {post.imageUrl && (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1 p-6">
          {post.excerpt && (
            <p className="text-base leading-relaxed font-medium" style={{ color: "var(--site-text)", opacity: 0.75 }}>{post.excerpt}</p>
          )}
          {post.body && (
            <div
              className="prose prose-sm mt-5 max-w-none"
              style={{ color: "var(--site-text)" }}
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export function BlogSection({ title = "Blog", subtitle, posts = [], variant = "grid" }: BlogSectionProps) {
  const [openPost, setOpenPost] = useState<BlogPost | null>(null);

  if (posts.length === 0) return null;

  function handlePostClick(post: BlogPost) {
    if (post.body) {
      setOpenPost(post);
    } else if (post.link) {
      window.open(post.link, "_blank");
    }
  }

  const PostCard = ({ post, featured = false }: { post: BlogPost; featured?: boolean }) => (
    <article
      onClick={() => handlePostClick(post)}
      className={`group flex flex-col overflow-hidden rounded-[var(--site-radius,16px)] border transition-all hover:-translate-y-1 ${post.body || post.link ? "cursor-pointer" : ""}`}
      style={{
        borderColor: "var(--site-border)",
        backgroundColor: "var(--site-surface)",
        boxShadow: "var(--site-shadow)",
      }}
    >
      {post.imageUrl && (
        <div className={`relative w-full overflow-hidden ${featured ? "aspect-[21/9]" : "aspect-[16/9]"}`}>
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className={`font-bold leading-snug ${featured ? "text-xl" : "text-base"}`} style={{ color: "var(--site-text)" }}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p className={`mt-2 leading-relaxed ${featured ? "text-base line-clamp-4" : "line-clamp-3 text-sm"}`} style={{ color: "var(--site-text)", opacity: 0.65 }}>
            {post.excerpt}
          </p>
        )}
        <div className="mt-4">
          <span className="text-sm font-semibold transition-opacity group-hover:opacity-70" style={{ color: "var(--site-primary)" }}>
            Ler mais →
          </span>
        </div>
      </div>
    </article>
  );

  // ── LIST ──
  if (variant === "list") {
    return (
      <section id="blog" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            {title && <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--site-text)" }}>{title}</h2>}
            {subtitle && <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--site-text)", opacity: 0.6 }}>{subtitle}</p>}
          </div>
          <div className="space-y-4">
            {posts.map((post, i) => (
              <article
                key={i}
                onClick={() => handlePostClick(post)}
                className={`group flex gap-4 overflow-hidden rounded-[var(--site-radius,16px)] border p-4 transition-all hover:shadow-md ${post.body || post.link ? "cursor-pointer" : ""}`}
                style={{ borderColor: "var(--site-border)", backgroundColor: "var(--site-surface)" }}
              >
                {post.imageUrl && (
                  <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl">
                    <Image src={post.imageUrl} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="font-bold leading-snug text-sm" style={{ color: "var(--site-text)" }}>{post.title}</h3>
                  {post.excerpt && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed" style={{ color: "var(--site-text)", opacity: 0.65 }}>{post.excerpt}</p>
                  )}
                  <span className="mt-2 text-xs font-semibold transition-opacity group-hover:opacity-70" style={{ color: "var(--site-primary)" }}>
                    Ler mais →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
        {openPost && <BlogDrawer post={openPost} onClose={() => setOpenPost(null)} />}
      </section>
    );
  }

  // ── MAGAZINE ──
  if (variant === "magazine") {
    const [featured, ...rest] = posts;
    return (
      <section id="blog" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            {title && <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--site-text)" }}>{title}</h2>}
            {subtitle && <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--site-text)", opacity: 0.6 }}>{subtitle}</p>}
          </div>
          <div className="space-y-6">
            <PostCard post={featured} featured />
            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, i) => <PostCard key={i} post={post} />)}
              </div>
            )}
          </div>
        </div>
        {openPost && <BlogDrawer post={openPost} onClose={() => setOpenPost(null)} />}
      </section>
    );
  }

  // ── GRID (default) ──
  return (
    <section id="blog" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          {title && <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--site-text)" }}>{title}</h2>}
          {subtitle && <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--site-text)", opacity: 0.6 }}>{subtitle}</p>}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => <PostCard key={i} post={post} />)}
        </div>
      </div>
      {openPost && <BlogDrawer post={openPost} onClose={() => setOpenPost(null)} />}
    </section>
  );
}
