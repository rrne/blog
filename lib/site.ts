// 로컬은 localhost, 배포는 Vercel 환경변수 NEXT_PUBLIC_SITE_URL로 주입한다
export const site = {
  name: "hey-grace.dev",
  title: "신은혜 — 프론트엔드 엔지니어",
  author: "신은혜",
  description:
    "고객의 사용성을 데이터로 검증하는 프론트엔드 엔지니어. 디자인 시스템부터 화면 너머의 데이터 흐름까지, 문제의 근본 원인을 기록합니다.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3012",
  github: "https://github.com/rrne",
} as const;
