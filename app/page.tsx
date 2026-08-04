import Link from "next/link";
import { getPosts, getSeriesList } from "@/lib/posts";
import { site } from "@/lib/site";
import { PostList } from "@/components/post-list";

export default function Home() {
  const recent = getPosts().slice(0, 8);
  const seriesCount = getSeriesList().length;

  return (
    <div>
      <section className="max-w-[32rem] pb-14">
        <h1 className="text-[1.3rem] font-semibold tracking-tight">
          {site.author}
        </h1>
        <p className="mt-3.5 text-[0.94rem] leading-relaxed text-neutral-600 dark:text-neutral-400">
          숙박 예약 플랫폼에서 예약·결제·정산 도메인을 다룹니다. 프로덕션에서
          실제로 터진 것과, 그 근본 원인을 추적한 기록을 남깁니다.
        </p>
      </section>

      <section>
        <div className="flex items-baseline justify-between border-b border-neutral-200 pb-2 dark:border-neutral-800">
          <h2 className="font-mono text-[0.76rem] uppercase tracking-widest text-neutral-400">
            최근 글
          </h2>
          {recent.length > 0 && (
            <Link
              href="/posts"
              className="text-[0.82rem] text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50"
            >
              전체 보기
            </Link>
          )}
        </div>

        {recent.length > 0 ? (
          <div className="pt-1">
            <PostList posts={recent} />
          </div>
        ) : (
          <p className="py-8 text-[0.9rem] text-neutral-500">
            첫 글을 준비하고 있습니다.
          </p>
        )}
      </section>

      {seriesCount > 0 && (
        <section className="pt-12">
          <Link
            href="/series"
            className="text-[0.88rem] text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50"
          >
            시리즈 {seriesCount}개 →
          </Link>
        </section>
      )}
    </div>
  );
}
