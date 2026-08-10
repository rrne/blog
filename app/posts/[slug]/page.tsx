import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import {
  getAdjacentPosts,
  getPost,
  getPosts,
  getSeriesNeighbors,
} from "@/lib/posts";
import { mdxOptions } from "@/lib/mdx";
import { ReadingProgress } from "@/components/reading-progress";
import { Toc } from "@/components/toc";
import { ShareButton } from "@/components/share-button";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { series } = getSeriesNeighbors(post);
  const { prev, next } = getAdjacentPosts(slug);

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto w-full max-w-[1080px] bg-paper-50 px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 items-start gap-0 lg:grid-cols-[1fr_240px] lg:gap-16">
          <article className="mx-auto w-full min-w-0 max-w-[680px] lg:mx-0">
            <header>
              {series && (
                <Link
                  href="/series"
                  className="font-mono text-[12px] text-accent-600 hover:underline"
                >
                  {series.name}
                </Link>
              )}
              <h1 className="mt-3 mb-1.5 text-[22px] font-bold leading-snug text-accent-900">
                {post.title}
              </h1>
              <p className="mb-2.5 font-mono text-[12px] tabular-nums text-ink-500">
                {post.date} · {post.readingMinutes} min
                {post.draft && (
                  <span className="ml-2 uppercase tracking-wider text-amber-600">
                    draft
                  </span>
                )}
              </p>
              {post.description && (
                <p className="mb-[22px] text-[14px] leading-relaxed text-ink-600">
                  {post.description}
                </p>
              )}
            </header>

            <div className="prose">
              <MDXRemote source={post.content} options={{ mdxOptions }} />
            </div>

            <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
              <ShareButton title={post.title} />
            </div>

            {(prev || next) && (
              <nav
                aria-label="이전/다음 글"
                className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {prev ? (
                  <Link
                    href={`/posts/${prev.slug}`}
                    className="group rounded-[10px] border border-line px-4 py-3 transition-colors hover:border-line-strong"
                  >
                    <span className="font-mono text-[11px] text-ink-400">
                      ← 이전 글
                    </span>
                    <span className="mt-1 line-clamp-1 block text-[13px] text-ink-950 transition-colors group-hover:text-accent-600">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <span aria-hidden />
                )}
                {next && (
                  <Link
                    href={`/posts/${next.slug}`}
                    className="group rounded-[10px] border border-line px-4 py-3 text-right transition-colors hover:border-line-strong"
                  >
                    <span className="font-mono text-[11px] text-ink-400">
                      다음 글 →
                    </span>
                    <span className="mt-1 line-clamp-1 block text-[13px] text-ink-950 transition-colors group-hover:text-accent-600">
                      {next.title}
                    </span>
                  </Link>
                )}
              </nav>
            )}
          </article>

          <Toc />
        </div>
      </div>
    </>
  );
}
