import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

/** 홈은 연도를 생략해 밀도를 높이고, 목록 페이지는 전체 날짜를 보여준다 */
function shortDate(iso: string): string {
  return iso.slice(5);
}

export function PostList({
  posts,
  dateFormat = "full",
}: {
  posts: PostMeta[];
  dateFormat?: "full" | "short";
}) {
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
              {dateFormat === "short" ? shortDate(post.date) : post.date}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function FeaturedPost({ post }: { post: PostMeta }) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <h3 className="text-[1.1rem] font-semibold leading-snug tracking-tight group-hover:underline group-hover:decoration-neutral-300 group-hover:underline-offset-4">
        {post.title}
        {post.draft && (
          <span className="ml-2 align-middle font-mono text-[0.7rem] font-normal uppercase tracking-wider text-amber-600">
            draft
          </span>
        )}
      </h3>
      {post.description && (
        <p className="mt-2.5 text-[0.9rem] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {post.description}
        </p>
      )}
      <div className="mt-3 flex items-center gap-2 font-mono text-[0.76rem] text-neutral-400">
        <time dateTime={post.date}>{post.date}</time>
        <span aria-hidden>·</span>
        <span>{post.readingMinutes} min</span>
      </div>
    </Link>
  );
}
