import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, locale: "ko_KR" },
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <div className="mx-auto flex min-h-dvh w-full max-w-[44rem] flex-col px-6">
          <header className="flex items-baseline justify-between py-10">
            <Link href="/" className="text-[0.95rem] font-medium tracking-tight">
              {site.author}
            </Link>
            <nav className="flex gap-5 text-[0.85rem] text-neutral-500">
              <Link href="/posts" className="transition-colors hover:text-neutral-950 dark:hover:text-neutral-50">
                Writing
              </Link>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-neutral-950 dark:hover:text-neutral-50"
              >
                GitHub
              </a>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="py-14 text-[0.8rem] text-neutral-400">
            © {new Date().getFullYear()} {site.author}
          </footer>
        </div>
      </body>
    </html>
  );
}
