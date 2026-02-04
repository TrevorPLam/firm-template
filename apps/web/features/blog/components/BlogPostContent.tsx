// AI-META-BEGIN
// 
// AI-META: React component: BlogPostContent
// OWNERSHIP: apps/web (marketing website)
// ENTRYPOINTS: Imported by pages and other components
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Props and styling: generally safe. Logic changes: test thoroughly
// TESTS: Run: pnpm test (Vitest), pnpm type-check (TypeScript)
// 
// AI-META-END

import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import VideoPlayer from '@/components/VideoPlayer'

interface BlogPostContentProps {
  content: string
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <div className="prose prose-lg max-w-none mt-12">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypePrettyCode,
                {
                  theme: 'github-dark',
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
        components={{
          // Provide video embeds in MDX without requiring custom wrappers.
          VideoPlayer,
        }}
      />
    </div>
  )
}
