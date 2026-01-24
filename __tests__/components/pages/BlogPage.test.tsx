import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BlogPage from '@/app/blog/page'
import { getAllCategories, getAllPosts, getPostsByCategory } from '@/lib/blog'
import { logError } from '@/lib/logger'

vi.mock('@/lib/blog', () => ({
  getAllPosts: vi.fn(),
  getAllCategories: vi.fn(),
  getPostsByCategory: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
}))

const mockedGetAllPosts = vi.mocked(getAllPosts)
const mockedGetAllCategories = vi.mocked(getAllCategories)
const mockedGetPostsByCategory = vi.mocked(getPostsByCategory)
const mockedLogError = vi.mocked(logError)

const samplePost = {
  slug: 'example-post-1-industry-insights',
  title: 'Scaling Client Operations',
  description: 'A sample post description.',
  date: '2026-01-01',
  author: 'Your Firm Team',
  category: 'Operations',
  readingTime: '3 min read',
  content: 'Example content.',
  featured: false,
}

const marketingPost = {
  ...samplePost,
  slug: 'example-post-2-marketing-strategy',
  title: 'Marketing Strategy That Converts',
  category: 'Marketing',
}

describe('BlogPage', () => {
  beforeEach(() => {
    // WHY: reset mocks between tests so each scenario is deterministic.
    vi.clearAllMocks()
  })

  it('test_happy_renders_blog_posts', async () => {
    // WHY: happy path should show a real post and category badge.
    mockedGetAllPosts.mockReturnValue([samplePost])
    mockedGetAllCategories.mockReturnValue([samplePost.category])

    const element = await BlogPage()
    render(element)

    expect(screen.getByRole('heading', { name: /industry insights & strategies/i }))
      .toBeInTheDocument()
    expect(screen.getByText(samplePost.title)).toBeInTheDocument()
    // WHY: category appears in both the filter link and the post badge.
    expect(screen.getAllByText(samplePost.category)).toHaveLength(2)
  })

  it('test_empty_shows_no_posts_message', async () => {
    // WHY: empty state should guide users when no content exists.
    mockedGetAllPosts.mockReturnValue([])
    mockedGetAllCategories.mockReturnValue([])

    const element = await BlogPage()
    render(element)

    expect(
      screen.getByText(/no blog posts yet\. check back soon for valuable insights!/i)
    ).toBeInTheDocument()
  })

  it('test_error_shows_safe_fallback', async () => {
    // WHY: malformed MDX should not crash the page; show a safe fallback instead.
    const malformedError = new Error('Malformed frontmatter')
    mockedGetAllPosts.mockImplementation(() => {
      throw malformedError
    })

    const element = await BlogPage()
    render(element)

    expect(
      screen.getByText(/issue loading blog posts/i)
    ).toBeInTheDocument()
    expect(mockedLogError).toHaveBeenCalledWith(
      'blog-listing-load-failed',
      malformedError,
      { source: 'app/blog/page' }
    )
  })

  it('filters posts by the selected category and marks it active', async () => {
    mockedGetAllPosts.mockReturnValue([samplePost, marketingPost])
    mockedGetAllCategories.mockReturnValue(['Marketing', 'Operations'])
    mockedGetPostsByCategory.mockReturnValue([samplePost])

    const element = await BlogPage({ searchParams: { category: 'Operations' } })
    render(element)

    expect(mockedGetPostsByCategory).toHaveBeenCalledWith('Operations', [
      samplePost,
      marketingPost,
    ])
    expect(screen.getByText(samplePost.title)).toBeInTheDocument()
    expect(screen.queryByText(marketingPost.title)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Operations' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'All Posts' })).not.toHaveAttribute('aria-current')
  })

  it('ignores unknown categories and shows all posts', async () => {
    mockedGetAllPosts.mockReturnValue([samplePost, marketingPost])
    mockedGetAllCategories.mockReturnValue(['Marketing', 'Operations'])

    const element = await BlogPage({ searchParams: { category: 'Unknown' } })
    render(element)

    expect(mockedGetPostsByCategory).not.toHaveBeenCalled()
    expect(screen.getByText(samplePost.title)).toBeInTheDocument()
    expect(screen.getByText(marketingPost.title)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'All Posts' })).toHaveAttribute('aria-current', 'page')
  })
})
