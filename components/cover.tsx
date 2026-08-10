import Image from "next/image";
import type { PostMeta } from "@/lib/posts";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * 글 대표 비주얼 — thumbnail이 있으면 이미지, 없으면 참고 사이트 OG 형식의
 * 타이틀 카드(검정 바탕 + 시안 태그 필 + 제목)를 그린다.
 * 실제 이미지처럼 라이트/다크 어디서나 같은 검정이어야 하므로
 * 테마 변수 대신 고정 색을 쓴다.
 */
function TitleCover({
  post,
  compact,
}: {
  post: PostMeta;
  compact?: boolean;
}) {
  const label = post.series ?? post.tags[0] ?? null;

  return (
    <div
      className="flex h-full w-full flex-col bg-[#0b0d10] text-[#e6e8eb]"
      aria-hidden
    >
      {!compact && (
        <div className="flex items-center justify-center gap-1.5 border-b border-white/10 py-[6%]">
          <span className="size-1.5 bg-[#67e8f9]" />
          <span className="font-mono text-[9px] tracking-wide text-[#e6e8eb]">
            {site.name}
          </span>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[6%] px-[8%] text-center">
        {label && !compact && (
          <span className="rounded-full border border-[#67e8f9]/60 px-2 py-px text-[8px] leading-relaxed text-[#67e8f9]">
            {label}
          </span>
        )}
        <span
          className={cn(
            "font-bold leading-snug tracking-tight",
            compact ? "line-clamp-3 text-[10px]" : "line-clamp-2 text-[13px]",
          )}
        >
          {post.title}
        </span>
      </div>

      {!compact && (
        <div className="flex items-center justify-center gap-1.5 border-t border-white/10 py-[5%] font-mono text-[8px] text-[#8b919a]">
          <span>{post.date}</span>
          <span aria-hidden>·</span>
          <span>{site.name}</span>
        </div>
      )}
    </div>
  );
}

export function PostCover({
  post,
  sizes,
  compact,
}: {
  post: PostMeta;
  sizes: string;
  /** 좁은 슬롯(홈 피처드 150px)용 — 제목만 보여준다 */
  compact?: boolean;
}) {
  if (post.thumbnail) {
    return (
      <Image
        src={post.thumbnail}
        alt=""
        fill
        sizes={sizes}
        className="object-cover"
      />
    );
  }
  return <TitleCover post={post} compact={compact} />;
}
