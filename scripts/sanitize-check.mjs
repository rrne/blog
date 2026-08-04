#!/usr/bin/env node
// 회사 고유정보가 글에 남아있는지 검사한다.
// 발행 차단이 목적이므로 위험 패턴은 넓게 잡고, 오탐은 사람이 판단한다.
// 사용: node scripts/sanitize-check.mjs [파일...]   (인자 없으면 content/posts 전체)

import fs from "node:fs";
import path from "node:path";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

// 사내 고유명사 — 발행 전 반드시 치환돼야 하는 것들
const FORBIDDEN_TERMS = [
  "handys", "핸디스",
  "plott", "플롯",
  "urbanstay", "어반스테이", "어스앱",
  "staz", "스타즈",
  "yolo-api", "yolo-front",
  "plottduck",
  "handys.co.kr",
];

const PATTERNS = [
  {
    name: "Linear 티켓번호",
    re: /\bSTA-\d{3,5}\b/g,
    hint: "티켓번호는 제거하거나 '내부 티켓'으로 일반화",
  },
  {
    name: "예약번호로 보이는 코드",
    re: /\b(?=[A-Z0-9]{7,8}\b)(?=.*\d)[A-Z0-9]+\b/g,
    hint: "실제 예약번호는 제거. 예시가 필요하면 명백한 더미로 대체",
    // 흔한 기술 약어 오탐 제외
    allow: /^(HTTP\d?|HTML5|OAUTH2|UTF8|SHA256|SHA512|MD5|BASE64|JWT|CSS3|ES2015|ES2020|ES2022|ISO8601|RFC3339|POSTGRES|MYSQL8)$/,
  },
  {
    name: "사내 이메일",
    re: /[\w.+-]+@(?!example\.|gmail\.|users\.noreply\.)[\w-]+\.[\w.]+/g,
    hint: "실제 이메일은 제거하거나 example.com으로 대체",
  },
  {
    name: "내부 호스트/URL",
    re: /https?:\/\/[\w.-]*(sandbox|dev-|internal|\.local)[\w./-]*/gi,
    hint: "내부 URL은 제거",
  },
  {
    name: "한국 휴대폰번호",
    re: /\b01[016-9][-\s.]?\d{3,4}[-\s.]?\d{4}\b/g,
    hint: "전화번호 제거",
  },
  {
    name: "AWS 리소스 식별자",
    re: /\b(arn:aws:[\w:/-]+|i-[0-9a-f]{8,17}|vpc-[0-9a-f]{8,17})\b/g,
    hint: "인프라 식별자 제거",
  },
  {
    name: "커밋 SHA (7자 이상)",
    re: /\b[0-9a-f]{7,40}\b/g,
    hint: "사내 리포 커밋 해시는 의미가 없으니 제거",
    allow: /^[0-9]+$/, // 순수 숫자는 제외
    minHexLetters: 2,
  },
];

function checkContent(text) {
  const findings = [];

  const lower = text.toLowerCase();
  for (const term of FORBIDDEN_TERMS) {
    if (lower.includes(term.toLowerCase())) {
      findings.push({
        severity: "block",
        name: "사내 고유명사",
        match: term,
        hint: "익명화 필요 (예: '국내 숙박 예약 플랫폼')",
      });
    }
  }

  for (const p of PATTERNS) {
    const matches = text.match(p.re) ?? [];
    const seen = new Set();
    for (const m of matches) {
      if (seen.has(m)) continue;
      if (p.allow?.test(m)) continue;
      if (p.minHexLetters) {
        const letters = (m.match(/[a-f]/g) ?? []).length;
        if (letters < p.minHexLetters) continue;
      }
      seen.add(m);
      findings.push({ severity: "review", name: p.name, match: m, hint: p.hint });
    }
  }

  return findings;
}

function main() {
  const args = process.argv.slice(2);
  const files = args.length
    ? args
    : fs.existsSync(POSTS_DIR)
      ? fs.readdirSync(POSTS_DIR).filter((f) => /\.mdx?$/.test(f)).map((f) => path.join(POSTS_DIR, f))
      : [];

  if (files.length === 0) {
    console.log("검사할 파일이 없습니다.");
    return;
  }

  let blockCount = 0;
  let reviewCount = 0;

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const findings = checkContent(text);
    if (findings.length === 0) continue;

    console.log(`\n${path.relative(process.cwd(), file)}`);
    for (const f of findings) {
      const tag = f.severity === "block" ? "차단" : "확인";
      console.log(`  [${tag}] ${f.name}: "${f.match}"`);
      console.log(`         → ${f.hint}`);
      if (f.severity === "block") blockCount++;
      else reviewCount++;
    }
  }

  console.log(
    `\n검사 ${files.length}개 파일 — 차단 ${blockCount}건, 확인필요 ${reviewCount}건`,
  );

  // 사내 고유명사가 남아있으면 실패로 끝낸다 (CI에서 머지 차단)
  if (blockCount > 0) {
    console.error("\n사내 고유명사가 남아있어 발행할 수 없습니다.");
    process.exit(1);
  }
}

main();
