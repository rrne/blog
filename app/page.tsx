import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { PostList } from "@/components/post-list";

export default function Home() {
  const recent = getPosts().slice(0, 5);

  return (
    <div className="pb-4">
      <section className="max-w-[34rem] pb-16">
        <h1 className="text-[1.35rem] font-semibold tracking-tight">
          {site.author}
        </h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-neutral-600 dark:text-neutral-400">
          숙박 예약 플랫폼에서 예약·결제·정산 도메인을 다룹니다. 프로덕션에서
          실제로 터진 것과, 그 근본 원인을 추적한 기록을 남깁니다.
        </p>
      </section>

      <section>
        <div className="flex items-baseline justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
          <h2 className="text-[0.8rem] font-medium uppercase tracking-widest text-neutral-400">
            Writing
          </h2>
          {recent.length > 0 && (
            <Link
              href="/posts"
              className="text-[0.85rem] text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50"
            >
              전체 보기
            </Link>
          )}
        </div>

        {recent.length > 0 ? (
          <PostList posts={recent} />
        ) : (
          <p className="py-10 text-[0.9rem] text-neutral-500">
            첫 글을 준비하고 있습니다.
          </p>
        )}
      </section>
    </div>
  );
}
