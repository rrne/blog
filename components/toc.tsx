"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string; level: number };

/**
 * 데스크톱(lg+) 우측 목차 레일.
 * 목차 데이터는 렌더된 본문에서 직접 읽는다 — MDX를 이중 파싱하지 않기 위해.
 */
export function Toc() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

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
          text: el.textContent ?? "",
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

  return (
    <nav aria-label="목차" className="sticky top-[76px] hidden lg:block">
      <p className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-ink-400">
        목차
      </p>
      <ul className="flex flex-col gap-1 border-l border-line">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
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
    </nav>
  );
}
