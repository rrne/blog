import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 블로그는 모든 방문자에게 같은 화면이고 자주 바뀌지 않으므로 전부 빌드 시점에 생성한다.
  // 동적 라우트가 하나라도 생기면 scripts/assert-static.mjs가 빌드를 실패시킨다.
  // (output: "export"를 쓰지 않는 이유 = Vercel의 이미지 최적화·헤더 기능을 유지하려고)
  outputFileTracingIncludes: {
    "/posts/[slug]": ["./content/posts/**"],
  },
};

export default nextConfig;
