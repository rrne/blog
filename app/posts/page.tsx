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
    <div className="px-5">
      <div className="mx-auto w-full max-w-[640px] pt-9 pb-12">
        <div className="mb-6">
          <h1 className="mb-2 text-[21px] font-bold text-accent-900">모든 노트</h1>
          <p className="font-mono text-[12px] text-ink-500">{posts.length}편</p>
        </div>

        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <p className="text-[14px] text-ink-500">아직 발행한 글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
