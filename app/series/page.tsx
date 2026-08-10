import type { Metadata } from "next";
import { getSeriesList } from "@/lib/posts";
import { PostList } from "@/components/post-list";

export const metadata: Metadata = {
  title: "시리즈",
  description: "여러 편으로 이어지는 글을 시리즈로 묶었습니다.",
};

export default function SeriesPage() {
  const seriesList = getSeriesList();
  const totalPosts = seriesList.reduce((sum, s) => sum + s.posts.length, 0);

  return (
    <div className="mx-auto w-full max-w-[640px] px-8 py-10 md:py-16">
      <header className="mb-8">
        <h1 className="mb-2 text-[21px] font-bold text-ink-950">시리즈</h1>
        <p className="text-[14px] leading-relaxed text-ink-600">
          여러 편으로 이어지는 글을 시리즈로 묶었습니다. 시리즈마다 1편부터
          순서대로 읽을 수 있습니다.
        </p>
        {seriesList.length > 0 && (
          <p className="mt-2.5 font-mono text-[12px] tabular-nums text-ink-500">
            {seriesList.length}개 시리즈 · {totalPosts}편
          </p>
        )}
      </header>

      {seriesList.length === 0 ? (
        <p className="text-[14px] text-ink-500">아직 시리즈가 없습니다.</p>
      ) : (
        <div>
          {seriesList.map((series) => (
            <section key={series.name} className="mb-[34px] last:mb-0">
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <h2 className="min-w-0">
                  <span className="inline-block rounded-[6px] bg-accent-50 px-[9px] py-0.5 text-[12px] leading-snug text-accent-600">
                    {series.name}
                  </span>
                </h2>
                <span className="shrink-0 font-mono text-[12px] tabular-nums text-ink-500">
                  {series.posts.length}편
                </span>
              </div>
              {series.description && (
                <p className="mb-2 text-[13px] text-ink-600">
                  {series.description}
                </p>
              )}
              <PostList posts={series.posts} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
