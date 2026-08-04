import type { EvaluateOptions } from 'next-mdx-remote-client/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'

export const mdxOptions: EvaluateOptions['mdxOptions'] = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    [
      rehypePrettyCode,
      {
        theme: { light: 'github-light', dark: 'github-dark' },
        keepBackground: false,
      },
    ],
  ],
}
