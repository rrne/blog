import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { Sidebar } from "@/components/sidebar";
import { ThemeScript } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, locale: "ko_KR" },
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={cn(
        "h-full font-sans antialiased",
        geistSans.variable,
        geistMono.variable,
      )}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full">
        <Sidebar />
        <div className="lg:pl-60">
          <div className="mx-auto w-full max-w-[42rem] px-6 py-12 lg:py-16">
            <main>{children}</main>
            <footer className="mt-20 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-6 text-[0.8rem] text-neutral-400">
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
