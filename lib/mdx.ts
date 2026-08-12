import type { EvaluateOptions } from 'next-mdx-remote-client/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'

export const mdxOptions: EvaluateOptions['mdxOptions'] = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: 'append',
        // 앵커(#)는 섹션 타이틀(h2)에만 — h3 소제목에는 붙이지 않는다
        test: (node: { tagName?: string }) => node.tagName === 'h2',
        properties: { className: ['heading-anchor'], ariaLabel: '이 섹션 링크' },
        content: { type: 'text', value: '#' },
      },
    ],
    [
      rehypePrettyCode,
      {
        theme: { light: 'github-light', dark: 'github-dark' },
        keepBackground: false,
      },
    ],
  ],
}
