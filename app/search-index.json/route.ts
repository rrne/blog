import { getPosts } from "@/lib/posts";

// 빌드 시점에 정적 JSON으로 만들어 CDN에서 서빙한다 (검색용 서버 없음)
export const dynamic = "force-static";

export function GET() {
  const index = getPosts()
    .filter((p) => !p.draft)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      series: p.series,
    }));

  return Response.json(index);
}
