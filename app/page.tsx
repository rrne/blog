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
    <div className="px-5">
      <div className="mx-auto w-full max-w-[640px] pt-9 pb-12">
        <div className="mb-[30px]">
          <h1 className="mb-2 text-[21px] font-bold text-accent-900">
            {site.author}
          </h1>
          <p className="text-[14px] text-ink-600">
            예약·결제·정산 도메인을 다루는 백엔드 엔지니어.
            <br />
            프로덕션에서 실제로 터진 것과 그 근본 원인을 기록합니다.
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line px-[11px] py-[3px] font-mono text-[12px] text-ink-600 transition-colors hover:border-line-strong hover:text-ink-950"
            >
              github
            </a>
          </div>
        </div>

        {featured ? (
          <>
            <FeaturedPost post={featured} />
            {rest.length > 0 && (
              <PostList posts={rest.slice(0, 12)} dateFormat="short" />
            )}
            <Link
              href="/posts"
              className="mt-3.5 inline-block text-[13px] text-accent-600 hover:underline"
            >
              모든 글 →
            </Link>
          </>
        ) : (
          <p className="border-t border-line py-10 text-[14px] text-ink-500">
            첫 글을 준비하고 있습니다.
          </p>
        )}
      </div>
    </div>
  );
}
