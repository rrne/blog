"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type SearchEntry = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

/** 글 수가 수백 편이 되기 전까지는 정적 인덱스 + 클라이언트 필터로 충분하다 */
export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);

  // ⌘K / Ctrl+K 로 연다 (닫기·방향키·포커스는 CommandDialog가 처리)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenChange]);

  // 인덱스는 처음 열 때 한 번만 가져온다
  useEffect(() => {
    if (!open || entries) return;
    let alive = true;
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data) => alive && setEntries(data))
      .catch(() => alive && setEntries([]));
    return () => {
      alive = false;
    };
  }, [open, entries]);

  function go(slug: string) {
    onOpenChange(false);
    router.push(`/posts/${slug}`);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="글 검색"
      description="제목으로 글을 찾습니다"
    >
      <CommandInput placeholder="제목으로 검색" />
      <CommandList>
        <CommandEmpty>
          {entries === null ? "불러오는 중…" : "결과가 없습니다."}
        </CommandEmpty>
        {entries && entries.length > 0 && (
          <CommandGroup heading="글">
            {entries.map((entry) => (
              <CommandItem
                key={entry.slug}
                value={`${entry.title} ${entry.description}`}
                onSelect={() => go(entry.slug)}
                className="flex-col items-start gap-0.5"
              >
                <div className="flex w-full items-baseline justify-between gap-3">
                  <span className="truncate text-[0.9rem]">{entry.title}</span>
                  <time className="shrink-0 font-mono text-[0.74rem] text-muted-foreground">
                    {entry.date}
                  </time>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
