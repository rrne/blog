@AGENTS.md

## 시리즈 기능 — UI만 제거된 상태 (2026-08-11)

글이 적어 시리즈 UI를 걷어냈다. **글이 쌓이면 시리즈 UI를 다시 확장할 것.**

- 데이터 레이어는 전부 살아있다: frontmatter `series`/`seriesOrder`/`seriesDescription`,
  `lib/posts.ts`의 `Series` 타입·`getSeriesList()`·`getSeries()`·`getSeriesNeighbors()`.
  글에 series frontmatter를 적는 것도 여전히 유효하다.
- 제거된 UI (되살릴 목록): 헤더 내비 "시리즈" 항목, `/series` 페이지,
  `/posts` 시리즈 필터(+`?series=` 딥링크용 useSearchParams/Suspense),
  글 상세 상단 시리즈 뱃지, 검색 다이얼로그 시리즈 표시,
  search-index.json의 series 필드, 커버·OG 이미지 라벨의 series 우선순위
  (현재는 tags[0]만 사용).
