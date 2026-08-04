import type { Metadata } from "next";
import Link from "next/link";
import { getSeriesList } from "@/lib/posts";

export const metadata: Metadata = {
  title: "시리즈",
  description: "하나의 주제를 여러 편에 걸쳐 파고든 연작",
};

export default function SeriesPage() {
  const seriesList = getSeriesList();

  return (
    <div>
      <header className="pb-8">
        <h1 className="text-[1.2rem] font-semibold tracking-tight">시리즈</h1>
        <p className="mt-1.5 text-[0.85rem] text-neutral-500">
          하나의 주제를 여러 편에 걸쳐 끝까지 파고든 기록
        </p>
      </header>

      {seriesList.length === 0 ? (
        <p className="text-[0.9rem] text-neutral-500">
          아직 시리즈가 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {seriesList.map((series) => (
            <section key={series.name}>
              <div className="flex items-baseline justify-between gap-4 border-b border-neutral-200 pb-2 dark:border-neutral-800">
                <h2 className="text-[0.98rem] font-medium tracking-tight">
                  {series.name}
                </h2>
                <span className="shrink-0 font-mono text-[0.74rem] text-neutral-400">
                  {series.posts.length}편
                </span>
              </div>

              <ol className="pt-1">
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
