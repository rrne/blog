#!/usr/bin/env node
// 글감 큐에서 다음 글감을 꺼내 초안 스켈레톤을 만든다.
// 사용: npm run new              → score 최상위 queued 글감
//       npm run new -- <id>      → 특정 글감 지정

import fs from "node:fs";
import path from "node:path";

const IDEAS_PATH = path.join(process.cwd(), "content/ideas.json");
const POSTS_DIR = path.join(process.cwd(), "content/posts");

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function main() {
  const wanted = process.argv[2];
  const db = JSON.parse(fs.readFileSync(IDEAS_PATH, "utf8"));

  const candidates = db.ideas.filter((i) =>
    wanted ? i.id === wanted : i.status === "queued",
  );
  if (candidates.length === 0) {
    console.error(wanted ? `글감 '${wanted}'을 찾을 수 없습니다.` : "queued 상태인 글감이 없습니다.");
    process.exit(1);
  }

  const idea = candidates.sort((a, b) => b.score - a.score)[0];
  const target = path.join(POSTS_DIR, `${idea.id}.mdx`);

  if (fs.existsSync(target)) {
    console.error(`이미 존재합니다: ${path.relative(process.cwd(), target)}`);
    process.exit(1);
  }

  const skeleton = `---
title: "${idea.title}"
description: "${idea.angle}"
date: "${today()}"
tags: []
draft: true
---

{/* 민감도: ${idea.sensitivity} — ${idea.notes} */}
{/* 발행 전: npm run check 로 사내 정보 잔존 여부 확인 */}

## 무슨 일이 있었나

<!-- 증상. 관측된 사실만. 원인 추정은 아래로 미룬다. -->

## 처음 세운 가설과 그게 틀린 이유

<!-- 그럴듯했지만 틀린 가설. 이 섹션이 글의 가치를 만든다. -->

## 실제 원인

<!-- 어떻게 확인했는지(측정·집계·재현)를 함께 쓴다. -->

## 무엇을 바꿨나

<!-- 코드 변경. 왜 그 방법을 골랐는지. -->

## 남은 것

<!-- 안 고친 것과 그 이유. 정직하게. -->
`;

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.writeFileSync(target, skeleton);

  idea.status = "drafting";
  fs.writeFileSync(IDEAS_PATH, JSON.stringify(db, null, 2) + "\n");

  console.log(`초안 생성: ${path.relative(process.cwd(), target)}`);
  console.log(`글감 '${idea.id}' → drafting`);
  if (idea.sensitivity === "high") {
    console.log(`\n⚠️  민감도 high — ${idea.notes}`);
  }
}

main();
