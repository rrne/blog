import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { getAdjacentPosts, getPost, getPosts } from "@/lib/posts";
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

  const { prev, next } = getAdjacentPosts(slug);

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto w-full max-w-[1080px] bg-paper-50 px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 items-start gap-0 lg:grid-cols-[1fr_240px] lg:gap-16">
          <article className="mx-auto w-full min-w-0 max-w-[680px] lg:mx-0">
            <header>
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

            <div className="mt-14 flex justify-end border-t border-line pt-6">
              <ShareButton title={post.title} />
            </div>
          </article>

          <Toc />
        </div>
      </div>

      {(prev || next) && (
        <div className="mx-auto w-full max-w-[1080px] px-8">
          <nav
            aria-label="이전/다음 글"
            className="mb-8 flex flex-col items-stretch justify-between gap-3 md:flex-row"
          >
            {prev ? (
              <Link
                href={`/posts/${prev.slug}`}
                className="flex flex-1 flex-col gap-1 rounded-[10px] border border-line p-4 transition-colors hover:border-line-strong"
              >
                <span className="font-mono text-[12px] text-ink-500">
                  ← 이전 글
                </span>
                <span className="line-clamp-2 text-[14px] font-medium text-accent-600">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span className="flex-1" aria-hidden />
            )}
            {next ? (
              <Link
                href={`/posts/${next.slug}`}
                className="flex flex-1 flex-col gap-1 rounded-[10px] border border-line p-4 transition-colors hover:border-line-strong md:items-end md:text-right"
              >
                <span className="font-mono text-[12px] text-ink-500">
                  다음 글 →
                </span>
                <span className="line-clamp-2 text-[14px] font-medium text-accent-600">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span className="flex-1" aria-hidden />
            )}
          </nav>
        </div>
      )}
    </>
  );
}
