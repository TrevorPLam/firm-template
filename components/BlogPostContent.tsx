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
