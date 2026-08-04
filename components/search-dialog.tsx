"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type SearchEntry = {
  slug: string;
  title: string;
  description: string;
  date: string;
  series: string | null;
};

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // ⌘K / Ctrl+K 로 열고 Esc로 닫는다
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
      if (e.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenChange]);

  if (!open) return null;
  // key로 매번 새로 마운트해 query/cursor가 초기값에서 시작하게 한다
  return <SearchPanel onClose={() => onOpenChange(false)} />;
}

/** 글 수가 수백 편이 되기 전까지는 정적 인덱스 + 클라이언트 필터로 충분하다 */
function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data) => alive && setEntries(data))
      .catch(() => alive && setEntries([]));
    return () => {
      alive = false;
    };
  }, []);

  const results = useMemo(() => {
    if (!entries) return [];
    const q = query.trim().toLowerCase();
    if (!q) return entries.slice(0, 8);
    return entries
      .filter((e) =>
        `${e.title} ${e.description} ${e.series ?? ""}`.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [entries, query]);

  const active = Math.min(cursor, Math.max(results.length - 1, 0));

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[12vh]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="글 검색"
      >
        <input
          ref={inputRef}
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setCursor(Math.min(active + 1, results.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setCursor(Math.max(active - 1, 0));
            }
            if (e.key === "Enter" && results[active]) {
              onClose();
              router.push(`/posts/${results[active].slug}`);
            }
          }}
          placeholder="제목으로 검색"
          className="w-full border-b border-neutral-200 bg-transparent px-4 py-3.5 text-[0.95rem] outline-none placeholder:text-neutral-400 dark:border-neutral-800"
        />

        <ul className="max-h-80 overflow-y-auto py-1.5">
          {entries === null && (
            <li className="px-4 py-3 text-[0.88rem] text-neutral-400">
              불러오는 중…
            </li>
          )}
          {entries !== null && results.length === 0 && (
            <li className="px-4 py-3 text-[0.88rem] text-neutral-400">
              결과가 없습니다.
            </li>
          )}
          {results.map((entry, i) => (
            <li key={entry.slug}>
              <Link
                href={`/posts/${entry.slug}`}
                onClick={onClose}
                onMouseEnter={() => setCursor(i)}
                className={`block px-4 py-2.5 ${
                  i === active ? "bg-neutral-100 dark:bg-neutral-900" : ""
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-[0.9rem]">{entry.title}</span>
                  <time className="shrink-0 font-mono text-[0.74rem] text-neutral-400">
                    {entry.date}
                  </time>
                </div>
                {entry.series && (
                  <span className="mt-0.5 block text-[0.76rem] text-neutral-400">
                    {entry.series}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex gap-3 border-t border-neutral-200 px-4 py-2 font-mono text-[0.72rem] text-neutral-400 dark:border-neutral-800">
          <span>↑↓ 이동</span>
          <span>↵ 열기</span>
          <span>esc 닫기</span>
        </div>
      </div>
    </div>
  );
}
