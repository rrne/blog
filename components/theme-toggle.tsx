"use client";

import { Moon, Sun } from "lucide-react";

/**
 * 테마의 진실의 원천은 html 요소의 dark 클래스다 (ThemeScript가 초기값을 넣는다).
 * React state로 복제하지 않는다 — 아이콘 전환도 CSS가 처리한다.
 */
export function ThemeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="테마 전환 (라이트/다크)"
      title="테마 전환"
      className="text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
    >
      <Moon className="inline-flex size-4 dark:hidden" />
      <Sun className="hidden size-4 dark:inline-flex" />
    </button>
  );
}

/**
 * React 하이드레이션 전에 실행돼 첫 페인트부터 올바른 테마로 그린다.
 * useEffect로 클래스를 붙이면 라이트 → 다크로 깜빡인다.
 */
export function ThemeScript() {
  const code = `(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(!s&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
