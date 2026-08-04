import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
}

export function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/posts/${post.slug}`} className="group block py-5">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[0.975rem] font-medium tracking-tight group-hover:underline group-hover:decoration-neutral-300 group-hover:underline-offset-4">
                {post.title}
                {post.draft && (
                  <span className="ml-2 align-middle text-[0.7rem] font-normal uppercase tracking-wider text-amber-600">
                    draft
                  </span>
                )}
              </h3>
              <time
                dateTime={post.date}
                className="shrink-0 font-mono text-[0.78rem] text-neutral-400"
              >
                {formatDate(post.date)}
              </time>
            </div>
            {post.description && (
              <p className="mt-1.5 text-[0.9rem] leading-relaxed text-neutral-500 dark:text-neutral-400">
                {post.description}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
