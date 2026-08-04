import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { getPost, getPosts, getSeriesNeighbors } from "@/lib/posts";
import { mdxOptions } from "@/lib/mdx";
import { Badge } from "@/components/ui/badge";

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

  const { series, prev, next } = getSeriesNeighbors(post);

  return (
    <article>
      <header className="pb-10">
        {series && (
          <Link
            href="/series"
            className="mb-2.5 block font-mono text-[0.76rem] text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            {series.name}
          </Link>
        )}
        <h1 className="text-[1.42rem] font-semibold leading-snug tracking-tight">
          {post.title}
        </h1>
        <div className="mt-3 flex items-center gap-3 font-mono text-[0.76rem] text-neutral-400">
          <time dateTime={post.date}>{post.date}</time>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes}분</span>
          {post.draft && (
            <>
              <span aria-hidden>·</span>
              <span className="uppercase tracking-wider text-amber-600">draft</span>
            </>
          )}
        </div>
      </header>

      <div className="prose">
        <MDXRemote source={post.content} options={{ mdxOptions }} />
      </div>

      {series && (prev || next) && (
        <nav className="mt-14 flex flex-col gap-2 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <span className="font-mono text-[0.72rem] uppercase tracking-widest text-neutral-400">
            {series.name}
          </span>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:justify-between sm:gap-6">
            {prev ? (
              <Link
                href={`/posts/${prev.slug}`}
                className="text-[0.88rem] text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50"
              >
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/posts/${next.slug}`}
                className="text-[0.88rem] text-neutral-600 transition-colors hover:text-neutral-950 sm:text-right dark:text-neutral-400 dark:hover:text-neutral-50"
              >
                {next.title} →
              </Link>
            )}
          </div>
        </nav>
      )}

      {post.tags.length > 0 && (
        <footer className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </footer>
      )}
    </article>
  );
}
