"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Funnel, X } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { PostCover } from "@/components/cover";
import { cn } from "@/lib/utils";

type Item = { id: string; label: string; count: number };

function countBy(values: string[]): Item[] {
  const map = new Map<string, number>();
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
  return [...map.entries()]
    .map(([id, count]) => ({ id, label: id, count }))
    .sort((a, b) => b.count - a.count);
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-0.5 block font-mono text-[11px] uppercase tracking-widest text-ink-400">
      {children}
    </span>
  );
}

/** 필터 그룹 — 전체 폭 행 버튼 + 우측 개수 배지 (참고 사이트 실측 스타일) */
function FilterGroup({
  label,
  items,
  active,
  onToggle,
}: {
  label: string;
  items: Item[];
  active: string[];
  onToggle: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5 border-t border-line pt-3 first:border-t-0 first:pt-0">
      <GroupLabel>{label}</GroupLabel>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {items.map((item) => {
          const isActive = active.includes(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => onToggle(item.id)}
                className={cn(
                  "flex w-full cursor-pointer items-baseline justify-between gap-2 rounded-[6px] px-2 py-1 text-left text-sm transition-colors hover:bg-paper-200 hover:text-ink-950",
                  isActive
                    ? "bg-paper-200 font-semibold text-ink-950"
                    : "font-normal text-ink-700",
                )}
              >
                <span className="min-w-0 truncate">{item.label}</span>
                <span className="inline-flex min-w-5 items-center justify-center rounded-[2rem] bg-paper-300 px-1.5 text-xs font-medium tabular-nums text-ink-600">
                  {item.count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="flex flex-col gap-2 overflow-hidden rounded-[10px] border border-line p-4 transition-colors hover:border-line-strong [&:hover_h3]:underline [&:hover_h3]:underline-offset-4"
    >
      <div className="relative -mx-4 -mt-4 mb-1 aspect-[1.91/1] overflow-hidden bg-paper-100">
        <PostCover
          post={post}
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
        />
      </div>
      <h3 className="text-[14px] font-semibold leading-snug text-ink-950 transition-colors">
        {post.title}
      </h3>
      {post.description && (
        <p className="line-clamp-2 text-[13px] text-ink-600">{post.description}</p>
      )}
      <p className="mt-auto pt-1 font-mono text-[12px] tabular-nums text-ink-500">
        {post.date}
      </p>
    </Link>
  );
}

export function PostsArchive({ posts }: { posts: PostMeta[] }) {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const tagItems = useMemo(
    () =>
      countBy(posts.flatMap((p) => p.tags))
        .slice(0, 12)
        .map((i) => ({ ...i, label: `#${i.id}` })),
    [posts],
  );
  const yearItems = useMemo(
    () => countBy(posts.map((p) => p.date.slice(0, 4))),
    [posts],
  );

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (activeTags.length > 0 && !activeTags.every((t) => p.tags.includes(t)))
        return false;
      if (activeYear && !p.date.startsWith(activeYear)) return false;
      return true;
    });
  }, [posts, activeTags, activeYear]);

  const activeCount = activeTags.length + (activeYear ? 1 : 0);

  function clearAll() {
    setActiveTags([]);
    setActiveYear(null);
  }

  const rail = (
    <div className="flex flex-col gap-4">
      <FilterGroup
        label="태그"
        items={tagItems}
        active={activeTags}
        onToggle={(id) =>
          setActiveTags((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
          )
        }
      />
      <FilterGroup
        label="연도"
        items={yearItems}
        active={activeYear ? [activeYear] : []}
        onToggle={(id) => setActiveYear((prev) => (prev === id ? null : id))}
      />

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="self-start cursor-pointer text-sm font-medium text-accent-600 underline decoration-transparent underline-offset-2 transition-colors hover:decoration-accent-600"
        >
          모두 지우기
        </button>
      )}
    </div>
  );

  const results =
    filtered.length === 0 ? (
      <div className="border-t border-line py-14 text-center">
        <p className="text-[14px] text-ink-950">조건에 맞는 글이 없습니다.</p>
        <p className="mt-1.5 text-[13px] text-ink-500">
          필터를 풀어보세요.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    );

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <aside className="hidden self-start md:sticky md:top-[76px] md:block">
          {rail}
        </aside>
        <div className="min-w-0">{results}</div>
      </div>

      {/* 모바일: 하단 필터 버튼 + 패널 */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label={`필터 열기${activeCount > 0 ? ` (${activeCount}개 적용 중)` : ""}`}
          className="fixed bottom-6 left-1/2 z-40 flex h-10 -translate-x-1/2 cursor-pointer items-center gap-2 rounded-[6px] border border-line bg-paper-200 px-3.5 pr-3.5 text-sm font-medium text-ink-800 transition-colors hover:border-line-strong hover:bg-paper-300"
        >
          <Funnel className="size-4" />
          <span>필터</span>
          {activeCount > 0 && (
            <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[2rem] bg-accent-600 px-[5px] text-xs font-semibold tabular-nums text-paper-50">
              {activeCount}
            </span>
          )}
        </button>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setMobileOpen(false)}
            role="presentation"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 max-h-[75dvh] overflow-y-auto rounded-t-[14px] border-t border-line bg-paper-50 p-5"
              role="dialog"
              aria-modal="true"
              aria-label="글 필터"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[14px] font-semibold text-ink-950">
                  글 필터
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="닫기"
                  className="cursor-pointer text-ink-500 hover:text-ink-950"
                >
                  <X className="size-5" />
                </button>
              </div>
              {rail}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
