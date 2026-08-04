import type { Metadata } from "next";
import Link from "next/link";
import { getSeriesList } from "@/lib/posts";

export const metadata: Metadata = {
  title: "시리즈",
  description: "여러 편으로 이어지는 글을 시리즈로 묶었습니다.",
};

export default function SeriesPage() {
  const seriesList = getSeriesList();
  const totalPosts = seriesList.reduce((sum, s) => sum + s.posts.length, 0);

  return (
    <div>
      <header className="pb-8">
        <h1 className="text-[1.2rem] font-semibold tracking-tight">시리즈</h1>
        <p className="mt-2.5 max-w-[32rem] text-[0.9rem] leading-relaxed text-neutral-600 dark:text-neutral-400">
          여러 편으로 이어지는 글을 시리즈로 묶었습니다. 시리즈마다 1편부터
          순서대로 읽을 수 있습니다.
        </p>
        {seriesList.length > 0 && (
          <p className="mt-3 font-mono text-[0.8rem] text-neutral-400">
            {seriesList.length}개 시리즈 · {totalPosts}편
          </p>
        )}
      </header>

      {seriesList.length === 0 ? (
        <p className="text-[0.9rem] text-neutral-500">아직 시리즈가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-11">
          {seriesList.map((series) => (
            <section key={series.name}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-[0.98rem] font-medium tracking-tight">
                  {series.name}
                </h2>
                <span className="shrink-0 font-mono text-[0.76rem] text-neutral-400">
                  {series.posts.length}편
                </span>
              </div>

              {series.description && (
                <p className="mt-1.5 text-[0.86rem] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {series.description}
                </p>
              )}

              <ol className="mt-3 border-t border-neutral-200 pt-1 dark:border-neutral-800">
                {series.posts.map((post, i) => (
                  <li key={post.slug}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="group flex items-baseline gap-3 py-2.5"
                    >
                      <span className="shrink-0 font-mono text-[0.76rem] text-neutral-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-[0.92rem] leading-snug group-hover:underline group-hover:decoration-neutral-300 group-hover:underline-offset-4">
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
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
