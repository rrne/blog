"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

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
      className="flex cursor-pointer items-center gap-2 rounded-full bg-paper-200 px-4 py-2 text-sm font-medium text-ink-800 transition-all hover:bg-paper-300"
    >
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      <span>{copied ? "복사됨" : "공유하기"}</span>
    </button>
  );
}
