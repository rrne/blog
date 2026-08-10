import Image from "next/image";
import type { PostMeta } from "@/lib/posts";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * 글 대표 비주얼 — thumbnail이 있으면 이미지, 없으면 OG 형식 타이틀 카드.
 * 카드가 전부 똑같아 보이지 않도록 slug 해시로 액센트 색·배경 글로우
 * 위치·정렬을 글마다 다르게 뽑는다. 해시 기반이라 같은 글은 항상 같은
 * 모습 (Math.random을 쓰면 SSR/하이드레이션이 어긋난다).
 * 실제 이미지처럼 라이트/다크 어디서나 같은 검정이어야 하므로 테마 변수
 * 대신 고정 색을 쓴다.
 */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function variantOf(slug: string) {
  const h = hash(slug);
  return {
    // 3분의 1 확률로 좌측 정렬 — 전부 가운데면 단조롭다
    leftAlign: (h >> 6) % 3 === 0,
  };
}

function TitleCover({ post, compact }: { post: PostMeta; compact?: boolean }) {
  const { leftAlign } = variantOf(post.slug);
  const label = post.series ?? post.tags[0] ?? null;

  return (
    <div
      className="flex h-full w-full flex-col bg-[#111111] text-[#e6e8eb]"
      aria-hidden
    >
      {!compact && (
        <div className="flex items-center justify-center gap-1.5 border-b border-white/10 py-[6%]">
          <span className="size-1.5 bg-[#eeeeee]" />
          <span className="font-mono text-[9px] tracking-wide text-[#e6e8eb]">
            {site.name}
          </span>
        </div>
      )}

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col justify-center gap-[6%] px-[8%]",
          leftAlign && !compact ? "items-start text-left" : "items-center text-center",
        )}
      >
        {label && !compact && (
          <span className="rounded-full border border-white/50 px-2 py-px text-[8px] leading-relaxed text-[#eeeeee]">
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
