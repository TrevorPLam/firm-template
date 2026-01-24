/**
 * Blog post management module.
 *
 * @module lib/blog
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: File-based blog CMS. Reads MDX files from content/blog/
 * at build time (SSG). No runtime filesystem access in production.
 *
 * **EDGE RUNTIME WARNING**: This file uses Node.js `fs` module.
 * Routes using this MUST set `export const dynamic = 'force-static'`
 * or will fail on Cloudflare Pages edge runtime.
 *
 * **DATA FLOW**:
 * ```
 * content/blog/*.mdx → getAllPosts() → BlogPost[]
 *                   → getPostBySlug(slug) → BlogPost | undefined
 * ```
 *
 * **FRONTMATTER SCHEMA** (see content/AGENTS.md for details):
 * ```yaml
 * title: string        # Required
 * description: string  # Required, used for SEO meta
 * date: YYYY-MM-DD     # Required, used for sorting
 * author: string       # Optional, defaults to team name
 * category: string     # Optional, defaults to "General"
 * featured: boolean    # Optional, shows on homepage
 * ```
 *
 * **AI ITERATION HINTS**:
 * - Adding frontmatter field? Update BlogPost interface AND content/AGENTS.md
 * - Posts sorted by date descending (newest first)
 * - Featured posts: filter with `posts.filter(p => p.featured)`
 * - Empty blog/ folder returns [] (doesn't throw)
 *
 * **CONSUMERS**:
 * - app/blog/page.tsx — listing page
 * - app/blog/[slug]/page.tsx — individual post
 * - app/sitemap.ts — sitemap generation
 * - lib/search.ts — search index
 *
 * **POTENTIAL IMPROVEMENTS**:
 * - [x] Add caching layer for dev mode (5 minute TTL, cleared between tests)
 * - [ ] Add frontmatter validation with Zod
 * - [ ] Add prev/next post navigation helpers
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Purpose:**
 * - Parse MDX blog posts from the filesystem
 * - Extract frontmatter metadata
 * - Calculate reading time
 * - Provide sorted, filtered access to posts
 *
 * **Data Source:**
 * - Location: `content/blog/*.mdx`
 * - Format: MDX files with YAML frontmatter
 * - Parsed at: Build time (SSG)
 *
 * **Frontmatter Schema:**
 * ```yaml
 * ---
 * title: string        # Required: Post title
 * description: string  # Required: SEO description
 * date: string         # Required: YYYY-MM-DD format
 * author: string       # Optional: Defaults to "Your Firm Team"
 * category: string     # Optional: Defaults to "General"
 * featured: boolean    # Optional: Defaults to false
 * ---
 * ```
 *
 * **Usage:**
 * ```typescript
 * import { getAllPosts, getPostBySlug } from '@/lib/blog'
 *
 * // Get all posts sorted by date
 * const posts = getAllPosts()
 *
 * // Get single post
 * const post = getPostBySlug('my-post-slug')
 * ```
 *
 * @see content/AGENTS.md for content authoring guidelines
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { z } from 'zod'

/** Absolute path to blog content directory */
const postsDirectory = path.join(process.cwd(), 'content/blog')
const slugAllowlist = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const dateFormat = /^\d{4}-\d{2}-\d{2}$/

/**
 * In-memory cache for blog posts in development mode.
 * Cache is only active when NODE_ENV !== 'production'.
 * 
 * Cache invalidation:
 * - Time-based: 5 minute TTL
 * - Manual: Set cache to null to clear
 */
interface BlogCache {
  posts: BlogPost[]
  timestamp: number
}

let blogCache: BlogCache | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

/**
 * Check if cache is valid (not expired and not in production).
 */
function isCacheValid(): boolean {
  if (process.env.NODE_ENV === 'production') {
    return false // Never use cache in production
  }
  
  if (!blogCache) {
    return false
  }
  
  const now = Date.now()
  const isExpired = now - blogCache.timestamp > CACHE_TTL
  
  return !isExpired
}

/**
 * Clear the blog post cache.
 * Useful for testing or manual cache invalidation.
 */
export function clearBlogCache(): void {
  blogCache = null
}

const blogFrontmatterSchema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  date: z
    .string()
    .min(1, 'Required')
    .regex(dateFormat, 'Expected YYYY-MM-DD'),
  author: z.string().optional().default('Your Firm Team'),
  category: z.string().optional().default('General'),
  featured: z.boolean().optional().default(false),
})

const blogPostSchema = z.object({
  slug: z
    .string()
    .regex(slugAllowlist, 'Invalid slug format'),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().regex(dateFormat, 'Expected YYYY-MM-DD'),
  author: z.string().min(1),
  category: z.string().min(1),
  readingTime: z.string().min(1),
  content: z.string(),
  featured: z.boolean().optional(),
})

/**
 * Blog post data structure.
 * 
 * @property slug - URL-safe identifier (derived from filename)
 * @property title - Post title from frontmatter
 * @property description - SEO description from frontmatter
 * @property date - Publication date (YYYY-MM-DD)
 * @property author - Author name (defaults to team name)
 * @property category - Post category for filtering
 * @property readingTime - Calculated reading time (e.g., "5 min read")
 * @property content - Raw MDX content (without frontmatter)
 * @property featured - Whether to show on homepage
 */
export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  readingTime: string
  content: string
  featured?: boolean
}

function isValidSlug(slug: string): boolean {
  // WHY: Strict allowlist blocks traversal attempts and enforces predictable slug format.
  return slugAllowlist.test(slug)
}

function formatFrontmatterError(filePath: string, error: z.ZodError): string {
  const details = error.issues
    .map((issue) => {
      const field = issue.path.length > 0 ? issue.path.join('.') : 'frontmatter'
      return `${field}: ${issue.message}`
    })
    .join('; ')

  return `Invalid frontmatter in ${filePath}: ${details}`
}

function parseFrontmatter(data: unknown, filePath: string) {
  const result = blogFrontmatterSchema.safeParse(data)

  if (!result.success) {
    throw new Error(formatFrontmatterError(filePath, result.error))
  }

  return result.data
}

/**
 * Get all blog posts sorted by date (newest first).
 * 
 * **Behavior:**
 * - Reads all .mdx files from content/blog/
 * - Parses frontmatter with gray-matter
 * - Calculates reading time
 * - Returns empty array if directory doesn't exist
 * 
 * **Performance:**
 * - Called at build time for SSG
 * - Results are cached by Next.js during build
 * - In development: Uses in-memory cache with 5 minute TTL
 * 
 * @returns Array of blog posts sorted by date descending
 * 
 * @example
 * const posts = getAllPosts()
 * // Use in getStaticProps or generateStaticParams
 */
export function getAllPosts(): BlogPost[] {
  // Check cache first (development only)
  if (isCacheValid() && blogCache) {
    return blogCache.posts
  }

  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      const frontmatter = parseFrontmatter(data, fullPath)

      const post = {
        slug,
        title: frontmatter.title,
        description: frontmatter.description,
        date: frontmatter.date,
        author: frontmatter.author,
        category: frontmatter.category,
        readingTime: readingTime(content).text,
        content,
        featured: frontmatter.featured,
      }

      return blogPostSchema.parse(post) as BlogPost
    })

  // Sort posts by date
  const sortedPosts = allPosts.sort((a, b) => (a.date > b.date ? -1 : 1))
  
  // Update cache (development only)
  if (process.env.NODE_ENV !== 'production') {
    blogCache = {
      posts: sortedPosts,
      timestamp: Date.now(),
    }
  }
  
  return sortedPosts
}

/**
 * Get a single blog post by its slug.
 * 
 * @param slug - URL slug (filename without .mdx extension)
 * @returns BlogPost object or undefined if not found
 * 
 * @example
 * const post = getPostBySlug('seo-basics-small-business')
 * if (!post) {
 *   notFound() // Next.js 404
 * }
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  if (!isValidSlug(slug)) {
    return undefined // WHY: Reject invalid input before any filesystem access.
  }

  const fullPath = path.join(postsDirectory, `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return undefined // WHY: Explicit missing-file handling keeps behavior predictable.
  }

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const frontmatter = parseFrontmatter(data, fullPath)

    const post = {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      author: frontmatter.author,
      category: frontmatter.category,
      readingTime: readingTime(content).text,
      content,
      featured: frontmatter.featured,
    }

    return blogPostSchema.parse(post) as BlogPost
  } catch {
    return undefined // WHY: I/O or parse failures should degrade gracefully for callers.
  }
}

/**
 * Get posts marked as featured.
 * Used for homepage highlights.
 * 
 * @returns Array of posts where featured === true
 */
export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.featured)
}

/**
 * Get posts by category.
 * 
 * @param category - Category name to filter by (case-sensitive)
 * @param posts - Optional preloaded posts to avoid duplicate filesystem reads
 * @returns Array of posts in the specified category
 */
export function getPostsByCategory(category: string, posts: BlogPost[] = getAllPosts()): BlogPost[] {
  return posts.filter((post) => post.category === category)
}

/**
 * Get all unique categories.
 * Categories are extracted from post frontmatter.
 * 
 * @returns Sorted array of unique category names
 */
export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categories = posts.map((post) => post.category)
  return Array.from(new Set(categories)).sort()
}
