import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

/** 홈은 연도를 생략해 밀도를 높이고(MM-DD), 목록 페이지는 전체 날짜를 보여준다 */
function shortDate(iso: string): string {
  return iso.slice(5);
}

export function PostList({
  posts,
  dateFormat = "full",
  underlineOnHover = true,
}: {
  posts: PostMeta[];
  dateFormat?: "full" | "short";
  /** 홈 목록만 밑줄 없이 색만 바뀐다 (참고 사이트 동일) */
  underlineOnHover?: boolean;
}) {
  return (
    <ol className="m-0 list-none p-0">
      {posts.map((post) => (
        <li
          key={post.slug}
          className="border-t border-line last:border-b last:border-line"
        >
          <Link
            href={`/posts/${post.slug}`}
            className={
              underlineOnHover
                ? "flex items-baseline justify-between gap-4 px-0.5 py-3 hover:[&_h3]:text-accent-600 hover:[&_h3]:underline"
                : "flex items-baseline justify-between gap-4 px-0.5 py-3 hover:[&_h3]:text-accent-600"
            }
          >
            <h3 className="min-w-0 text-[14px] font-normal leading-snug text-ink-950 transition-colors">
              {post.title}
              {post.draft && (
                <span className="ml-2 align-middle font-mono text-[11px] uppercase tracking-wider text-amber-600">
                  draft
                </span>
              )}
            </h3>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-ink-500">
              {dateFormat === "short" ? shortDate(post.date) : post.date}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** 피처드 카드 우측의 장식 도식 — 참고 사이트의 노드 다이어그램 스타일 */
function FeaturedDiagram() {
  return (
    <svg
      viewBox="0 0 150 92"
      aria-hidden
      focusable="false"
      className="block h-auto w-full"
    >
      <g className="stroke-accent-500 fill-none" strokeLinecap="round" strokeLinejoin="round">
        <line x1="40" y1="46" x2="62" y2="20" />
        <line x1="40" y1="46" x2="62" y2="46" />
        <line x1="40" y1="46" x2="62" y2="72" />
      </g>
      <rect x="12" y="34" width="28" height="24" rx="5" className="fill-paper-100 stroke-line" />
      <rect x="62" y="9" width="76" height="20" rx="5" className="fill-accent-50 stroke-accent-500" />
      <rect x="62" y="36" width="76" height="20" rx="5" className="fill-accent-50 stroke-accent-500" />
      <rect x="62" y="63" width="76" height="20" rx="5" className="fill-accent-50 stroke-accent-500" />
    </svg>
  );
}

export function FeaturedPost({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="mb-[26px] grid grid-cols-1 items-center gap-[18px] rounded-[10px] border border-line px-5 py-[18px] transition-colors hover:border-line-strong md:grid-cols-[minmax(0,1fr)_150px] [&:hover_h2]:text-accent-700"
    >
      <div className="min-w-0">
        <h2 className="mt-2.5 mb-[5px] text-[16px] font-semibold text-accent-900 transition-colors">
          {post.title}
        </h2>
        {post.description && (
          <p className="line-clamp-2 text-[13px] text-ink-600">
            {post.description}
          </p>
        )}
        <p className="mt-2.5 font-mono text-[12px] text-ink-500">
          {post.date} · {post.readingMinutes} min
        </p>
      </div>
      <div className="hidden w-[150px] max-w-full md:block">
        {post.thumbnail ? (
          <div className="relative aspect-[1.91/1] overflow-hidden rounded-[6px] bg-paper-100">
            <Image
              src={post.thumbnail}
              alt=""
              fill
              sizes="150px"
              className="object-cover"
            />
          </div>
        ) : (
          <FeaturedDiagram />
        )}
      </div>
    </Link>
  );
}
