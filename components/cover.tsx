import Image from "next/image";
import type { PostMeta } from "@/lib/posts";
import { cn } from "@/lib/utils";

/**
 * 글 대표 비주얼 — thumbnail이 있으면 이미지, 없으면 OG 형식 타이틀 카드.
 * 카드가 전부 똑같아 보이지 않도록 slug 해시로 액센트 색·배경 글로우
 * 위치·정렬을 글마다 다르게 뽑는다. 해시 기반이라 같은 글은 항상 같은
 * 모습 (Math.random을 쓰면 SSR/하이드레이션이 어긋난다).
 * 배경은 테마를 따른다 — 라이트는 화이트, 다크는 다크 네이비. 사이트의
 * 모노톤 paper 토큰과 달리 커버만 네이비를 쓰므로 고정 색으로 지정한다.
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
  const label = post.tags[0] ?? null;

  return (
    <div
      className="flex h-full w-full flex-col bg-[#fafafa] text-[#26282c] dark:bg-[#0f172a] dark:text-[#e2e8f0]"
      aria-hidden
    >
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col justify-center gap-[6%] px-[8%]",
          leftAlign && !compact ? "items-start text-left" : "items-center text-center",
        )}
      >
        {label && !compact && (
          <span className="rounded-full border border-black/30 px-2 py-px text-[8px] leading-relaxed dark:border-white/50">
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
