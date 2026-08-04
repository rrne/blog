import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { FeaturedPost, PostList } from "@/components/post-list";

export default function Home() {
  const posts = getPosts();
  // 대표 자리는 실제 발행된 글만 — 로컬에서도 배포 후와 같은 화면을 보려면 draft를 제외한다
  const featured = posts.find((p) => !p.draft);
  const rest = posts.filter((p) => p.slug !== featured?.slug);

  return (
    <div>
      <section className="max-w-[32rem] pb-14">
        <h1 className="text-[1.3rem] font-semibold tracking-tight">
          {site.author}
        </h1>
        <p className="mt-3 text-[0.94rem] leading-relaxed text-neutral-600 dark:text-neutral-400">
          예약·결제·정산 도메인을 다루는 백엔드 엔지니어.
          <br />
          프로덕션에서 실제로 터진 것과 그 근본 원인을 기록합니다.
        </p>
        <div className="mt-4 flex gap-3 font-mono text-[0.78rem] text-neutral-400">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            github
          </a>
          <a
            href="/rss.xml"
            className="transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            rss
          </a>
        </div>
      </section>

      {featured ? (
        <>
          <section className="border-t border-neutral-200 py-8 dark:border-neutral-800">
            <FeaturedPost post={featured} />
          </section>

          {rest.length > 0 && (
            <section className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
              <PostList posts={rest.slice(0, 12)} dateFormat="short" />
            </section>
          )}

          <div className="pt-6">
            <Link
              href="/posts"
              className="text-[0.86rem] text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50"
            >
              모든 글 →
            </Link>
          </div>
        </>
      ) : (
        <p className="border-t border-neutral-200 py-10 text-[0.9rem] text-neutral-500 dark:border-neutral-800">
          첫 글을 준비하고 있습니다.
        </p>
      )}
    </div>
  );
}
