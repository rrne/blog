import type { Metadata } from "next";
import Link from "next/link";
import { JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { Header } from "@/components/header";
import { ThemeScript } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, locale: "ko_KR" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={cn("h-full antialiased", jetbrains.variable)}
      style={{ ["--font-pretendard" as string]: "'Pretendard Variable'" }}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main className="w-full flex-1">{children}</main>
        <footer className="mt-16 border-t border-line py-5">
          <div className="px-5">
            <div className="mx-auto flex w-full max-w-[640px] flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[12px] text-ink-500">
                © 2025 {site.author}
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/about"
                  className="font-mono text-[12px] text-ink-500 transition-colors hover:text-ink-950"
                >
                  About
                </Link>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[12px] text-ink-500 transition-colors hover:text-ink-950"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
