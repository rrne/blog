"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { SearchDialog } from "@/components/search-dialog";

const NAV = [
  { href: "/posts", label: "글" },
  { href: "/series", label: "시리즈" },
  { href: "/about", label: "About" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside
        className="
          lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 lg:border-r lg:border-neutral-200
          lg:dark:border-neutral-800 lg:px-8 lg:py-12
          flex flex-col gap-8 border-b border-neutral-200 px-6 py-6
          dark:border-neutral-800 lg:border-b-0
        "
      >
        <Link href="/" className="text-[0.95rem] font-semibold tracking-tight">
          {site.name}
        </Link>

        <nav className="flex gap-5 text-[0.9rem] lg:flex-col lg:gap-2.5">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "text-neutral-950 dark:text-neutral-50"
                    : "text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            group hidden items-center justify-between gap-2 rounded-md border
            border-neutral-200 px-2.5 py-1.5 text-[0.82rem] text-neutral-500
            transition-colors hover:border-neutral-300 dark:border-neutral-800
            dark:hover:border-neutral-700 lg:flex
          "
        >
          <span>검색</span>
          <kbd className="font-mono text-[0.72rem] text-neutral-400">⌘K</kbd>
        </button>

        <div className="mt-auto hidden text-[0.8rem] text-neutral-400 lg:block">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            GitHub
          </a>
          <span className="mx-2">·</span>
          <a
            href="/rss.xml"
            className="transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            RSS
          </a>
        </div>
      </aside>

      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
