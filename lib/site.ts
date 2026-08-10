// 로컬은 localhost, 배포는 Vercel 환경변수 NEXT_PUBLIC_SITE_URL로 주입한다
export const site = {
  name: "hey-grace.dev",
  title: "신은혜 — 프론트엔드 엔지니어",
  author: "신은혜",
  description:
    "디자인과 구현 사이의 간극을 줄이는 프론트엔드 엔지니어. 작은 어색함 하나까지 파고들어, 좋은 사용자 경험의 기준을 시스템으로 만듭니다.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3012",
  github: "https://github.com/rrne",
} as const;
