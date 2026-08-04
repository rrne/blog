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
}

export type Post = PostMeta & { content: string }

type Frontmatter = {
  title?: string
  description?: string
  date?: string
  tags?: string[]
  draft?: boolean
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
    content,
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
  return allPosts()
    .filter(isVisible)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      tags: post.tags,
      draft: post.draft,
      readingMinutes: post.readingMinutes,
    }))
}

export function getPost(slug: string): Post | null {
  return allPosts().find((p) => p.slug === slug && isVisible(p)) ?? null
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
