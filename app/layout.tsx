import type { Metadata } from "next";
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
            <footer className="mt-20 text-[0.8rem] text-neutral-400">
              © {new Date().getFullYear()} {site.author}
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
