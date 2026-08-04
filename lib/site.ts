// 로컬은 localhost, 배포는 Vercel 환경변수 NEXT_PUBLIC_SITE_URL로 주입한다
export const site = {
  name: "hey-grace.dev",
  title: "Grace — 예약·정산 도메인 엔지니어",
  author: "Grace",
  description:
    "프로덕션에서 실제로 터진 것과 그 근본 원인을 기록합니다. 예약, 결제, 정산 도메인.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3011",
  github: "https://github.com/rrne",
} as const;
