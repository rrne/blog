"use client";

import { useEffect, useRef } from "react";

/** 헤더 바로 아래 3px 진행바 — 스크롤 위치에 따라 폭이 찬다 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf = 0;
    function update() {
      raf = 0;
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const ratio = total > 0 ? Math.min(1, doc.scrollTop / total) : 0;
      if (bar) bar.style.width = `${ratio * 100}%`;
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-[52px] z-9 h-[3px] bg-transparent"
    >
      <div ref={barRef} className="h-full bg-accent-600 transition-[width] duration-100 ease-linear" />
    </div>
  );
}
