#!/usr/bin/env node
// 블로그는 전 페이지가 빌드 시점에 생성돼야 한다.
// 실수로 동적 렌더링이 끼어들면 CDN 캐싱을 잃고 함수 호출 비용이 붙는데,
// 빌드는 그대로 성공해서 조용히 넘어간다. 그걸 막는 게 이 스크립트다.
// 사용: npm run build 후 node scripts/assert-static.mjs

import fs from "node:fs";
import path from "node:path";

const MANIFEST = path.join(process.cwd(), ".next/prerender-manifest.json");
const APP_MANIFEST = path.join(process.cwd(), ".next/app-path-routes-manifest.json");

if (!fs.existsSync(APP_MANIFEST)) {
  console.error("빌드 산출물이 없습니다. npm run build를 먼저 실행하세요.");
  process.exit(1);
}

const appRoutes = JSON.parse(fs.readFileSync(APP_MANIFEST, "utf8"));
const prerender = fs.existsSync(MANIFEST)
  ? JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
  : { routes: {}, dynamicRoutes: {} };

const prerendered = new Set([
  ...Object.keys(prerender.routes ?? {}),
  ...Object.keys(prerender.dynamicRoutes ?? {}),
]);

// 프레임워크 내부 라우트는 검사 대상이 아니다
const IGNORED = new Set(["/_not-found", "/favicon.ico"]);

const dynamic = [];
for (const [file, route] of Object.entries(appRoutes)) {
  if (IGNORED.has(route) || route.startsWith("/_")) continue;
  if (!prerendered.has(route)) dynamic.push({ route, file });
}

if (dynamic.length > 0) {
  console.error("\n정적으로 생성되지 않은 라우트가 있습니다:\n");
  for (const d of dynamic) {
    console.error(`  ${d.route}   (${d.file})`);
  }
  console.error(
    "\ncookies()/headers()/searchParams 사용이나 no-store fetch가 원인일 수 있습니다.",
  );
  console.error("동적 렌더링이 의도라면 이 스크립트의 IGNORED에 추가하세요.\n");
  process.exit(1);
}

console.log(`전 라우트 정적 생성 확인 — ${Object.keys(appRoutes).length}개`);
