import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { getPost, getPosts } from "@/lib/posts";
import { mdxOptions } from "@/lib/mdx";

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

  return (
    <article className="pb-8">
      <header className="pb-10">
        <h1 className="text-[1.45rem] font-semibold leading-snug tracking-tight">
          {post.title}
        </h1>
        <div className="mt-3 flex items-center gap-3 font-mono text-[0.78rem] text-neutral-400">
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

      {post.tags.length > 0 && (
        <footer className="mt-14 flex flex-wrap gap-2 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-[0.78rem] text-neutral-500 dark:border-neutral-800"
            >
              {tag}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}
