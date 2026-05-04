import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata = {
  title: "Blog — Ding Ren",
  description: "Thoughts on tech, startups, and the things I'm building.",
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-pixel text-5xl text-(--fg) mb-2">Blog</h1>
      <p className="text-(--fg-muted) mb-12">
        Lessons about tech, startups, and the things I&apos;m building.
      </p>

      {posts.length === 0 ? (
        <p className="text-(--fg-muted)">No posts yet. Check back soon.</p>
      ) : (
        <ul>
          {posts.map((post, i) => (
            <li key={post.slug}>
              {i > 0 && <hr className="border-(--border)" />}
              <Link href={`/blog/${post.slug}`} className="block py-8 group">
                <p className="text-xs text-(--fg-muted) mb-2">
                  {formatDate(post.date)} · {post.readTime} min read
                </p>
                <h2 className="font-pixel text-3xl text-(--fg) mb-2 group-hover:text-(--accent) transition">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-(--fg-muted) text-sm leading-relaxed">
                    {post.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
