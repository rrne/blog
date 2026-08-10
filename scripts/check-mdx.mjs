#!/usr/bin/env node
// 모든 글(draft 포함)의 MDX가 컴파일되는지 검사한다.
// 프로덕션 빌드는 draft를 제외하므로, 깨진 초안이 빌드 검증을 통과해
// 로컬 화면에서만 터지는 사각지대가 생긴다. 그걸 여기서 막는다.
// 사용: npm run check:mdx

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

async function main() {
  const files = fs.existsSync(POSTS_DIR)
    ? fs.readdirSync(POSTS_DIR).filter((f) => /\.mdx?$/.test(f))
    : [];

  let failed = 0;
  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { content } = matter(raw);
    try {
      await compile(content, { remarkPlugins: [remarkGfm] });
    } catch (err) {
      failed++;
      console.error(`\n✗ ${file}`);
      console.error(`  ${err.message.split("\n")[0]}`);
    }
  }

  console.log(`\nMDX 컴파일 검사 ${files.length}개 파일 — 실패 ${failed}건`);
  if (failed > 0) process.exit(1);
}

main();
