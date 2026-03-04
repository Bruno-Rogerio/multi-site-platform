"use client";

import Image from "next/image";

type BlogPost = {
  title: string;
  excerpt: string;
  imageUrl?: string;
  link?: string;
};

type BlogSectionProps = {
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
};

export function BlogSection({
  title = "Blog",
  subtitle,
  posts = [],
}: BlogSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2
            className="text-3xl font-black tracking-tight"
            style={{ color: "var(--site-text)" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="mt-3 text-base leading-relaxed"
              style={{ color: "var(--site-text)", opacity: 0.6 }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Posts grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <article
              key={i}
              className="group flex flex-col overflow-hidden rounded-[var(--site-radius,16px)] border transition-all hover:-translate-y-1"
              style={{
                borderColor: "var(--site-border)",
                backgroundColor: "var(--site-surface)",
                boxShadow: "var(--site-shadow)",
              }}
            >
              {post.imageUrl && (
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <h3
                  className="text-base font-bold leading-snug"
                  style={{ color: "var(--site-text)" }}
                >
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p
                    className="mt-2 line-clamp-3 text-sm leading-relaxed"
                    style={{ color: "var(--site-text)", opacity: 0.65 }}
                  >
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-4">
                  {post.link ? (
                    <a
                      href={post.link}
                      className="text-sm font-semibold transition-opacity hover:opacity-70"
                      style={{ color: "var(--site-primary)" }}
                    >
                      Ler mais →
                    </a>
                  ) : (
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--site-primary)" }}
                    >
                      Ler mais →
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
