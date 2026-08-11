"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { site } from "@/lib/site";
import { SearchDialog } from "@/components/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/posts", label: "글" },
  { href: "/about", label: "About" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-line bg-paper-50">
        <div className="px-5">
          <div className="mx-auto flex h-[52px] w-full max-w-[640px] items-center justify-between gap-2.5 md:gap-4">
            <Link
              href="/"
              className="font-mono text-[15px] font-medium text-ink-950 transition-opacity hover:opacity-70"
            >
              {site.name}
            </Link>

            <div className="flex items-center gap-2.5 md:gap-4">
              <nav aria-label="주요 메뉴" className="flex items-center gap-3.5 md:gap-5">
                {NAV.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative text-[13px] transition-colors",
                        active
                          ? "font-semibold text-accent-600 hover:text-accent-700"
                          : "text-ink-600 hover:text-ink-950",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label="검색"
                  className="flex min-w-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-line bg-transparent px-2 py-1.5 text-sm text-ink-500 transition-all hover:border-line-strong hover:text-ink-700 active:bg-paper-100 md:min-w-0 md:px-3"
                >
                  <Search className="size-4" aria-hidden />
                  <span className="hidden md:inline">검색</span>
                  <kbd className="hidden rounded-md bg-paper-100 px-1.5 py-0.5 font-mono text-xs text-ink-400 md:inline">
                    ⌘K
                  </kbd>
                </button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
