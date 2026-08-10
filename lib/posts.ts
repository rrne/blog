import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

export type PostMeta = {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  draft: boolean
  readingMinutes: number
  series: string | null
  seriesOrder: number
  seriesDescription: string
}

export type Post = PostMeta & { content: string }

export type Series = {
  name: string
  /** 시리즈 소개. 어느 글에든 seriesDescription을 적으면 그 값을 쓴다 */
  description: string
  posts: PostMeta[]
  /** 시리즈의 첫 글 발행일 — 시리즈 목록 정렬에 쓴다 */
  startedAt: string
  updatedAt: string
}

type Frontmatter = {
  title?: string
  description?: string
  date?: string
  tags?: string[]
  draft?: boolean
  series?: string
  seriesOrder?: number
  seriesDescription?: string
}

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, '')
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), 'utf8')
  const { data, content } = matter(raw)
  const fm = data as Frontmatter

  if (!fm.title) throw new Error(`${fileName}: frontmatter에 title이 없습니다`)
  if (!fm.date) throw new Error(`${fileName}: frontmatter에 date가 없습니다`)

  return {
    slug,
    title: fm.title,
    description: fm.description ?? '',
    date: fm.date,
    tags: fm.tags ?? [],
    draft: fm.draft ?? false,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    series: fm.series ?? null,
    seriesOrder: fm.seriesOrder ?? 0,
    seriesDescription: fm.seriesDescription ?? '',
    content,
  }
}

function toMeta(post: Post): PostMeta {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    draft: post.draft,
    readingMinutes: post.readingMinutes,
    series: post.series,
    seriesOrder: post.seriesOrder,
    seriesDescription: post.seriesDescription,
  }
}

function allPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(readPostFile)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

// draft는 프로덕션 빌드에서만 숨긴다 — 로컬에선 초안 확인이 필요하다
function isVisible(post: Post): boolean {
  return !post.draft || process.env.NODE_ENV !== 'production'
}

export function getPosts(): PostMeta[] {
  return allPosts().filter(isVisible).map(toMeta)
}

export function getPost(slug: string): Post | null {
  return allPosts().find((p) => p.slug === slug && isVisible(p)) ?? null
}

/** 시리즈는 별도 데이터가 아니라 frontmatter에서 파생시킨다 (동기화 어긋남 방지) */
export function getSeriesList(): Series[] {
  const grouped = new Map<string, PostMeta[]>()

  for (const post of getPosts()) {
    if (!post.series) continue
    const list = grouped.get(post.series) ?? []
    list.push(post)
    grouped.set(post.series, list)
  }

  return [...grouped.entries()]
    .map(([name, posts]) => {
      // 1편부터 읽히도록 날짜 오름차순. 같은 날 발행된 편은 seriesOrder로 가린다
      const ordered = [...posts].sort((a, b) =>
        a.date !== b.date
          ? a.date < b.date
            ? -1
            : 1
          : a.seriesOrder - b.seriesOrder,
      )
      const dates = posts.map((p) => p.date).sort()
      return {
        name,
        description: posts.find((p) => p.seriesDescription)?.seriesDescription ?? '',
        posts: ordered,
        startedAt: dates[0],
        updatedAt: dates[dates.length - 1],
      }
    })
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}

export function getSeries(name: string): Series | null {
  return getSeriesList().find((s) => s.name === name) ?? null
}

/** 같은 시리즈 안에서의 이전/다음 글 */
export function getSeriesNeighbors(post: PostMeta): {
  series: Series | null
  prev: PostMeta | null
  next: PostMeta | null
} {
  if (!post.series) return { series: null, prev: null, next: null }
  const series = getSeries(post.series)
  if (!series) return { series: null, prev: null, next: null }

  const i = series.posts.findIndex((p) => p.slug === post.slug)
  return {
    series,
    prev: i > 0 ? series.posts[i - 1] : null,
    next: i >= 0 && i < series.posts.length - 1 ? series.posts[i + 1] : null,
  }
}

/** 발행 시간축 기준 이전/다음 글 (최신순 목록에서 prev=더 최신, next=더 과거가 아니라 읽기 흐름 기준: prev=이전에 나온 글) */
export function getAdjacentPosts(slug: string): {
  prev: PostMeta | null
  next: PostMeta | null
} {
  const posts = getPosts() // 최신순
  const i = posts.findIndex((p) => p.slug === slug)
  if (i < 0) return { prev: null, next: null }
  return {
    prev: posts[i + 1] ?? null, // 더 오래된 글
    next: posts[i - 1] ?? null, // 더 최신 글
  }
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of getPosts()) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}
