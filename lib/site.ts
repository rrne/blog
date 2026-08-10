// 로컬은 localhost, 배포는 Vercel 환경변수 NEXT_PUBLIC_SITE_URL로 주입한다
export const site = {
  name: "hey-grace.dev",
  title: "신은혜 — 프론트엔드 엔지니어",
  author: "신은혜",
  description:
    "화면에서 시작해 API와 데이터까지, 프로덕션에서 실제로 터진 문제의 근본 원인을 기록합니다.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3012",
  github: "https://github.com/rrne",
} as const;
