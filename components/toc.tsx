"use client";

import { useEffect, useState } from "react";
import { List, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string; level: number };

/**
 * 목차 — 데스크톱(lg+)은 우측 240px 고정 레일, 모바일은 우하단 플로팅 버튼 → 패널.
 * 목차 데이터는 렌더된 본문에서 직접 읽는다 (MDX 이중 파싱 방지).
 */
export function Toc() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    // 본문 페인트 이후에 헤딩을 수집한다 (effect 본문에서 동기 setState 금지 규칙 준수)
    const raf = requestAnimationFrame(() => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(
          "article .prose h2[id], article .prose h3[id]",
        ),
      );
      setHeadings(
        nodes.map((el) => ({
          id: el.id,
          // 헤딩 끝에 붙는 앵커 문자(#)는 목차 라벨에서 제외
          text: (el.textContent ?? "").replace(/#\s*$/, "").trim(),
          level: el.tagName === "H2" ? 2 : 3,
        })),
      );

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
              break;
            }
          }
        },
        { rootMargin: "-56px 0px -70% 0px" },
      );
      nodes.forEach((el) => observer?.observe(el));
    });
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, []);

  if (headings.length === 0) return null;

  const list = (
    <ul className="flex flex-col gap-1 border-l border-line">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "-ml-px block border-l py-0.5 text-[12.5px] leading-snug transition-colors",
              h.level === 3 ? "pl-6" : "pl-3.5",
              activeId === h.id
                ? "border-accent-600 text-accent-600"
                : "border-transparent text-ink-500 hover:text-ink-950",
            )}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* 데스크톱 우측 레일 */}
      <nav aria-label="목차" className="sticky top-[76px] hidden lg:block">
        <p className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-ink-400">
          목차
        </p>
        {list}
      </nav>

      {/* 모바일 플로팅 버튼 + 패널 */}
      <div className="block lg:hidden">
        <button
          type="button"
          aria-label={mobileOpen ? "목차 닫기" : "목차 열기"}
          onClick={() => setMobileOpen((v) => !v)}
          className="fixed right-6 bottom-20 z-39 flex size-12 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-paper-50 text-ink-600 shadow-sm transition-colors hover:border-accent-500 hover:text-accent-600"
        >
          {mobileOpen ? <X className="size-6" /> : <List className="size-6" />}
        </button>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30"
            onClick={() => setMobileOpen(false)}
            role="presentation"
          >
            <nav
              aria-label="목차"
              onClick={(e) => e.stopPropagation()}
              className="absolute right-4 bottom-36 max-h-[55dvh] w-64 overflow-y-auto rounded-[10px] border border-line bg-paper-50 p-4 shadow-lg"
            >
              <p className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-ink-400">
                목차
              </p>
              {list}
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
