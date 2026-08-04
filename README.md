# hey-grace.dev

예약·결제·정산 도메인에서 겪은 프로덕션 이슈와 근본 원인을 기록하는 블로그.
포트폴리오 겸용.

## 스택

Next 16 (App Router, Turbopack) · React 19 · Tailwind 4 · MDX

## 로컬 실행

```bash
npm install
npm run dev        # http://localhost:3011
```

## 글 쓰기

글은 `content/posts/*.mdx` 하나가 곧 한 편이다. 파일명이 URL slug가 된다.

```bash
npm run new                    # 글감 큐에서 점수 최상위 항목으로 초안 생성
npm run new -- <idea-id>       # 특정 글감 지정
```

frontmatter:

```yaml
---
title: "제목"          # 필수 — 없으면 빌드 실패
description: "요약"
date: "2026-08-04"     # 필수
tags: ["automation"]
draft: true            # true면 프로덕션에 노출되지 않음
---
```

### draft가 이중 안전장치다

`draft: true`인 글은 **프로덕션 빌드에서 렌더되지 않는다**. 로컬에서는 보인다.
즉 머지가 곧 발행이 아니다. 발행은 `draft: false`로 바꾸는 별도의 행동이다.

## 민감정보 게이트

이 블로그의 글감은 대부분 실무 이슈에서 나온다. 그래서 발행 경로에 검사를 박아뒀다.

```bash
npm run check       # content/posts 전체 검사
```

- **차단(exit 1)** — 사내 고유명사가 남아있는 경우. CI에서 머지가 막힌다.
- **확인필요** — 티켓번호, 예약번호 형태의 코드, 이메일, 내부 URL, 전화번호,
  인프라 식별자, 커밋 SHA. 사람이 판단한다.

CI(`.github/workflows/ci.yml`)가 PR마다 이 검사 → typecheck → lint → build를 돌린다.

## 글감 큐

`content/ideas.json`이 백로그다. `score`는 포폴 가치(1–10),
`sensitivity`는 익명화 난이도, `status`는 `queued → drafting → drafted → published`.

## 배포

main에 push하면 Vercel이 프로덕션 배포한다. PR은 프리뷰 배포가 붙는다.

환경변수 `NEXT_PUBLIC_SITE_URL`이 메타데이터·RSS·sitemap의 절대 URL 기준이다
(`.env.example` 참고).
