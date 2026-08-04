import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import { PostList } from "@/components/post-list";

export const metadata: Metadata = {
  title: "Writing",
  description: "예약·결제·정산 도메인에서 기록한 글 목록",
};

export default function PostsPage() {
  const posts = getPosts();

  return (
    <div className="pb-4">
      <h1 className="pb-2 text-[1.2rem] font-semibold tracking-tight">Writing</h1>
      <p className="pb-8 text-[0.9rem] text-neutral-500">
        {posts.length}편
      </p>

      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p className="text-[0.9rem] text-neutral-500">아직 발행한 글이 없습니다.</p>
      )}
    </div>
  );
}
