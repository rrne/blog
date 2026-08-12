"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Funnel, X } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { PostCover } from "@/components/cover";
import { cn } from "@/lib/utils";

type Sort = "recent" | "oldest" | "shortest";
type View = "list" | "cards";

const SORTS: { id: Sort; label: string }[] = [
  { id: "recent", label: "최신순" },
  { id: "oldest", label: "오래된순" },
  { id: "shortest", label: "짧은 글부터" },
];
const VIEWS: { id: View; label: string }[] = [
  { id: "list", label: "리스트" },
  { id: "cards", label: "카드" },
];

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

/** 세그먼트 컨트롤 — paper.100 배경 안에서 활성 조각만 밝게 */
function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <ul className="m-0 inline-flex list-none items-stretch overflow-hidden rounded-[6px] border border-line bg-paper-100 p-0">
      {options.map((opt) => (
        <li key={opt.id} className="flex">
          <button
            type="button"
            aria-pressed={value === opt.id}
            onClick={() => onChange(opt.id)}
            className={cn(
              "cursor-pointer px-2.5 py-1.5 text-[12.5px] transition-colors",
              value === opt.id
                ? "bg-paper-50 font-semibold text-ink-950"
                : "text-ink-600 hover:text-ink-950",
            )}
          >
            {opt.label}
          </button>
        </li>
      ))}
    </ul>
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
    <div className="flex flex-col gap-1.5 border-t border-line pt-3">
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

function PostRow({ post }: { post: PostMeta }) {
  return (
    <li className="border-t border-line last:border-b last:border-line">
      <Link
        href={`/posts/${post.slug}`}
        className="flex items-baseline justify-between gap-4 px-0.5 py-3 hover:[&_h3]:underline hover:[&_h3]:underline-offset-4"
      >
        <h3 className="min-w-0 text-[14px] font-normal leading-snug text-ink-950 transition-colors">
          {post.title}
        </h3>
        <span className="shrink-0 font-mono text-[12px] tabular-nums text-ink-500">
          {post.date}
        </span>
      </Link>
    </li>
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
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("recent");
  const [view, setView] = useState<View>("cards");
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
    const q = query.trim().toLowerCase();
    const list = posts.filter((p) => {
      if (q && !`${p.title} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q))
        return false;
      if (activeTags.length > 0 && !activeTags.every((t) => p.tags.includes(t)))
        return false;
      if (activeYear && !p.date.startsWith(activeYear)) return false;
      return true;
    });
    if (sort === "oldest") return [...list].reverse();
    if (sort === "shortest")
      return [...list].sort((a, b) => a.readingMinutes - b.readingMinutes);
    return list;
  }, [posts, query, sort, activeTags, activeYear]);

  const activeCount = activeTags.length + (activeYear ? 1 : 0);

  function clearAll() {
    setActiveTags([]);
    setActiveYear(null);
    setQuery("");
  }

  const rail = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-[6px] border border-line px-2.5 py-1.5">
        <span aria-hidden className="text-ink-400">
          ⌕
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목, 본문, 태그 검색…"
          aria-label="글 검색"
          className="w-0 min-w-0 flex-1 border-none bg-transparent text-[13px] text-ink-950 outline-none placeholder:text-ink-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="shrink-0 cursor-pointer font-mono text-[12px] text-ink-500 hover:text-ink-950"
          >
            지우기
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <GroupLabel>정렬</GroupLabel>
          <Segmented value={sort} options={SORTS} onChange={setSort} />
        </div>
        <div className="flex flex-col gap-2">
          <GroupLabel>뷰</GroupLabel>
          <Segmented value={view} options={VIEWS} onChange={setView} />
        </div>
      </div>

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
          필터를 풀거나 다른 검색어로 시도해보세요.
        </p>
      </div>
    ) : view === "list" ? (
      <ol className="m-0 list-none p-0">
        {filtered.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </ol>
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
