import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { Sidebar } from "@/components/sidebar";
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
      <body className="min-h-full">
        <Sidebar />
        <div className="lg:pl-60">
          <div className="mx-auto w-full max-w-[42rem] px-6 py-12 lg:py-16">
            <main>{children}</main>
            <footer className="mt-20 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-neutral-200 pt-6 text-[0.8rem] text-neutral-400 dark:border-neutral-800">
              <span>
                © {new Date().getFullYear()} {site.author}
              </span>
              <Link
                href="/about"
                className="transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                About
              </Link>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                GitHub
              </a>
              <a
                href="/rss.xml"
                className="transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                RSS
              </a>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
