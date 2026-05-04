import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ChevronLeft } from "lucide-react";
import {
  getAllPosts,
  getPostBySlug,
  getAdjacentPosts,
  formatDate,
} from "@/lib/blog";

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="font-pixel text-4xl text-(--fg) mt-10 mb-4" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="font-pixel text-3xl text-(--fg) mt-10 mb-4" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-pixel text-2xl text-(--fg) mt-8 mb-3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-(--fg) leading-7 mb-5 text-[0.9375rem]" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-[#c9a45c] underline underline-offset-2 hover:text-[#e0bb7a] transition"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside text-(--fg) mb-5 space-y-1.5 text-[0.9375rem]" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside text-(--fg) mb-5 space-y-1.5 text-[0.9375rem]" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-2 border-(--border) pl-4 text-(--fg-muted) italic my-5" {...props} />
  ),
  hr: () => <hr className="border-(--border) my-8" />,
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-(--bg-elev) text-(--accent) px-1.5 py-0.5 rounded text-[0.875em] font-mono" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-(--bg-elev) border border-(--border) rounded-lg p-4 overflow-x-auto mb-5 text-sm" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-(--fg)" {...props} />
  ),
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Ding Ren`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      {/* Back chevron */}
      <Link
        href="/blog"
        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-(--fg-muted) hover:text-(--fg) hover:bg-white/10 transition mb-8"
      >
        <ChevronLeft size={14} />
      </Link>

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm text-(--fg-muted) mb-4">
          {formatDate(post.date)}&nbsp;&nbsp;·&nbsp;&nbsp;{post.readTime} min read
        </p>
        <h1 className="font-pixel text-5xl text-(--fg) leading-tight mb-5">
          {post.title}
        </h1>
        {post.description && (
          <p className="text-(--fg-muted) text-lg leading-relaxed">
            {post.description}
          </p>
        )}
      </div>

      {/* Content */}
      <article>
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>

      {/* Post navigation */}
      <hr className="border-(--border) mt-12 mb-8" />
      <div className="flex justify-between items-start">
        {prev ? (
          <Link href={`/blog/${prev.slug}`} className="group max-w-[45%]">
            <p className="text-xs text-(--fg-muted) mb-1">Older</p>
            <p className="text-(--fg) group-hover:text-(--accent) transition text-sm">
              {prev.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link href={`/blog/${next.slug}`} className="group text-right max-w-[45%]">
            <p className="text-xs text-(--fg-muted) mb-1">Newer</p>
            <p className="text-(--fg) group-hover:text-(--accent) transition text-sm">
              {next.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Back link */}
      <hr className="border-(--border) mt-8 mb-6" />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-(--fg-muted) hover:text-(--fg) transition"
      >
        <ChevronLeft size={14} />
        Back to all posts
      </Link>
    </main>
  );
}
