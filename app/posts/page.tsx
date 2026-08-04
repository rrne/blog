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
    <div>
      <header className="pb-6">
        <h1 className="text-[1.2rem] font-semibold tracking-tight">모든 노트</h1>
        <p className="mt-1.5 font-mono text-[0.8rem] text-neutral-400">
          {posts.length}편
        </p>
      </header>

      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p className="text-[0.9rem] text-neutral-500">아직 발행한 글이 없습니다.</p>
      )}
    </div>
  );
}
