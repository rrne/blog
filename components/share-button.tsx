"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

/** 모바일은 시스템 공유 시트, 데스크톱은 URL 복사 */
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // 사용자가 시트를 닫은 경우 — 복사로 폴백하지 않는다
        return;
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-mono text-[12px] text-ink-500 transition-all hover:border-line-strong hover:text-ink-700"
    >
      {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
      {copied ? "복사됨" : "공유하기"}
    </button>
  );
}
