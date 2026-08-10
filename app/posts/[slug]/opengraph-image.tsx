import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getPost, getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

/**
 * 글별 og:image — 카드 커버(TitleCover)와 같은 형식의 1200x630 PNG를
 * 빌드 시점에 생성한다. 폰트는 네트워크 의존을 없애려고 리포에 커밋해뒀다.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

const fontData = fs.readFileSync(
  path.join(process.cwd(), "assets/Pretendard-Bold.otf"),
);

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? site.name;
  const label = post?.series ?? post?.tags[0] ?? null;
  const date = post?.date ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#111111",
          color: "#eeeeee",
          fontFamily: "Pretendard",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "36px 0",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div style={{ width: 12, height: 12, background: "#eeeeee" }} />
          <div style={{ fontSize: 26, letterSpacing: 1 }}>{site.name}</div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 34,
            padding: "0 96px",
            textAlign: "center",
          }}
        >
          {label && (
            <div
              style={{
                display: "flex",
                border: "2px solid rgba(238,238,238,0.5)",
                borderRadius: 9999,
                padding: "6px 22px",
                fontSize: 24,
                color: "#eeeeee",
              }}
            >
              {label}
            </div>
          )}
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.35,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "30px 0",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            fontSize: 22,
            color: "#8b919a",
          }}
        >
          <div>{date}</div>
          <div>·</div>
          <div>{site.name}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Pretendard", data: fontData, weight: 700 }],
    },
  );
}
