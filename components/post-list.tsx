import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/posts/${post.slug}`}
            className="group flex items-baseline justify-between gap-4 py-2.5"
          >
            <span className="text-[0.94rem] leading-snug group-hover:underline group-hover:decoration-neutral-300 group-hover:underline-offset-4">
              {post.title}
              {post.draft && (
                <span className="ml-2 align-middle font-mono text-[0.68rem] uppercase tracking-wider text-amber-600">
                  draft
                </span>
              )}
            </span>
            <time
              dateTime={post.date}
              className="shrink-0 font-mono text-[0.76rem] text-neutral-400"
            >
              {post.date}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
