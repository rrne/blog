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
    <div className="px-5">
      <div className="mx-auto w-full max-w-[640px] pt-9 pb-12">
        <div className="mb-8">
          <h1 className="mb-2 text-[21px] font-bold text-accent-900">시리즈</h1>
          <p className="text-[14px] text-ink-600">
            여러 편으로 이어지는 글을 시리즈로 묶었습니다. 시리즈마다 1편부터
            순서대로 읽을 수 있습니다.
          </p>
          {seriesList.length > 0 && (
            <p className="mt-3 font-mono text-[12px] text-ink-500">
              {seriesList.length}개 시리즈 · {totalPosts}편
            </p>
          )}
        </div>

        {seriesList.length === 0 ? (
          <p className="text-[14px] text-ink-500">아직 시리즈가 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-11">
            {seriesList.map((series) => (
              <section key={series.name}>
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-[16px] font-semibold text-accent-900">
                    {series.name}
                  </h2>
                  <span className="shrink-0 font-mono text-[12px] text-ink-500">
                    {series.posts.length}편
                  </span>
                </div>
                {series.description && (
                  <p className="mt-1.5 text-[13px] text-ink-600">
                    {series.description}
                  </p>
                )}
                <div className="mt-3">
                  <PostList posts={series.posts} />
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
