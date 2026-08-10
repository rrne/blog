import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import { PostList } from "@/components/post-list";

export const metadata: Metadata = {
  title: "글",
  description: "예약·결제·정산 도메인에서 기록한 글 전체",
};

export default function PostsPage() {
  const posts = getPosts();

  return (
    <div className="mx-auto w-full max-w-[1200px] px-8 py-10 md:py-16">
      <header className="mb-[30px] flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
        <h1 className="text-[21px] font-bold text-ink-950">모든 노트</h1>
        <span className="font-mono text-[12px] tabular-nums text-ink-500">
          {posts.length}편
        </span>
      </header>

      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p className="text-[14px] text-ink-500">아직 발행한 글이 없습니다.</p>
      )}
    </div>
  );
}
