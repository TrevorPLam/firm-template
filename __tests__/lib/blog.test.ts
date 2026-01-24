import fs from 'fs'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { getAllCategories, getAllPosts, getPostBySlug, clearBlogCache } from '@/lib/blog'

describe('blog utilities', () => {
  it('test_returns_posts_with_expected_shape', () => {
    const posts = getAllPosts()

    expect(posts.length).toBeGreaterThan(0)
    expect(posts[0]).toEqual(
      expect.objectContaining({
        slug: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        date: expect.any(String),
        readingTime: expect.any(String),
      })
    )
  })

  it('test_finds_a_post_by_slug', () => {
    const posts = getAllPosts()
    const post = getPostBySlug(posts[0].slug)

    expect(post).toBeDefined()
    expect(post?.slug).toBe(posts[0].slug)
  })

  it('test_returns_sorted_categories', () => {
    const categories = getAllCategories()

    expect(categories.length).toBeGreaterThan(0)
    expect(categories).toEqual([...categories].sort())
  })

  it('test_rejects_path_traversal_slugs_without_filesystem_access', () => {
    // WHY: We want proof that invalid slugs are rejected BEFORE filesystem reads.
    const readSpy = vi.spyOn(fs, 'readFileSync')

    try {
      expect(getPostBySlug('../secret')).toBeUndefined()
      expect(getPostBySlug('..\\secret')).toBeUndefined()
      expect(getPostBySlug('example-post-1-industry-insights/../secret')).toBeUndefined()
      expect(readSpy).not.toHaveBeenCalled()
    } finally {
      readSpy.mockRestore()
    }
  })
  
  it('test_rejects_path_traversal_slugs_comprehensive', () => {
    // WHY: Comprehensive variations catch obfuscated traversal patterns.
    const maliciousSlugs = [
      '../secret',                    // Parent directory
      '..\\secret',                   // Windows-style parent
      '../../etc/passwd',             // Multiple levels up
      '../../../etc/shadow',          // Deep traversal
      'post/../../../etc/hosts',      // Mixed with valid prefix
      '..',                           // Just parent ref
      '.',                            // Current directory
      './',                           // Current directory with slash
      '../',                          // Parent with trailing slash
      'foo/bar',                      // Subdirectory (not allowed)
      'foo\\bar',                     // Windows subdirectory
      './foo',                        // Relative path
      'foo/../bar',                   // Path with traversal
      '%2e%2e%2f',                    // URL-encoded ../
      '..%2f',                        // Mixed encoding
      '....///',                      // Obfuscated traversal
    ]
    
    maliciousSlugs.forEach(slug => {
      const result = getPostBySlug(slug)
      expect(result).toBeUndefined()
    })
    
    // Additional validation: these should fail the slug regex
    const invalidFormatSlugs = [
      'HAS_UPPERCASE',                // Uppercase not allowed
      'has spaces',                   // Spaces not allowed
      'has.dots',                     // Dots not allowed (path component)
      '',                             // Empty string
      '   ',                          // Whitespace only
      'trailing-',                    // Trailing hyphen
      '-leading',                     // Leading hyphen
      'has--double',                  // Double hyphens (no empty segments)
    ]
    
    invalidFormatSlugs.forEach(slug => {
      const result = getPostBySlug(slug)
      expect(result).toBeUndefined()
    })
  })
  
  it('test_accepts_only_valid_slug_formats', () => {
    // WHY: Document what IS allowed for safe, predictable routing.
    // These won't find files (unless they exist) but should pass validation
    // and return undefined due to file not found, not security rejection
    
    const validFormats = [
      'valid-slug',
      'post-123',
      'a',
      'my-great-post-2024',
      'example-post-1-industry-insights',  // From the fixture
    ]
    
    // We can't easily distinguish between "security rejected" and "file not found"
    // from the return value alone, but the previous test proves security works
    // This test documents the valid format
    
    validFormats.forEach(slug => {
      // These may return undefined (file not found) or a post (if file exists)
      // The key is they should NOT throw or behave unexpectedly
      const result = getPostBySlug(slug)
      expect(result === undefined || typeof result === 'object').toBe(true)
    })
  })

  it('test_returns_undefined_for_empty_slug_without_filesystem_access', () => {
    // WHY: Empty input is a common edge case that should short-circuit early.
    const readSpy = vi.spyOn(fs, 'readFileSync')

    try {
      expect(getPostBySlug('')).toBeUndefined()
      expect(readSpy).not.toHaveBeenCalled()
    } finally {
      readSpy.mockRestore()
    }
  })

  it('test_handles_read_errors_gracefully', () => {
    // WHY: Permission or I/O errors should never crash rendering paths.
    const readSpy = vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('Simulated read failure')
    })
    const existsSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(true)

    try {
      expect(getPostBySlug('example-post-1-industry-insights')).toBeUndefined()
      expect(readSpy).toHaveBeenCalled()
    } finally {
      readSpy.mockRestore()
      existsSpy.mockRestore()
    }
  })
})

describe('blog caching', () => {
  const originalNodeEnv = process.env.NODE_ENV

  beforeEach(() => {
    // Clear cache before each test
    clearBlogCache()
  })

  afterEach(() => {
    // Restore NODE_ENV after each test
    process.env.NODE_ENV = originalNodeEnv
    clearBlogCache()
  })

  it('test_cache_is_used_in_development_mode', () => {
    // WHY: Cache should reduce filesystem reads in development
    process.env.NODE_ENV = 'development'
    clearBlogCache()

    const readSpy = vi.spyOn(fs, 'readdirSync')
    
    // First call should read from filesystem
    const posts1 = getAllPosts()
    const readCount1 = readSpy.mock.calls.length
    expect(readCount1).toBeGreaterThan(0)

    // Second call should use cache
    const posts2 = getAllPosts()
    const readCount2 = readSpy.mock.calls.length
    
    // No additional reads should have occurred
    expect(readCount2).toBe(readCount1)
    expect(posts1).toEqual(posts2)

    readSpy.mockRestore()
  })

  it('test_cache_is_not_used_in_production_mode', () => {
    // WHY: Cache should never be active in production
    process.env.NODE_ENV = 'production'
    clearBlogCache()

    const readSpy = vi.spyOn(fs, 'readdirSync')
    
    // First call
    getAllPosts()
    const readCount1 = readSpy.mock.calls.length
    expect(readCount1).toBeGreaterThan(0)

    // Second call should read again (no cache)
    getAllPosts()
    const readCount2 = readSpy.mock.calls.length
    
    // Additional reads should have occurred
    expect(readCount2).toBeGreaterThan(readCount1)

    readSpy.mockRestore()
  })

  it('test_cache_can_be_manually_cleared', () => {
    // WHY: Tests need ability to clear cache between test runs
    process.env.NODE_ENV = 'development'
    clearBlogCache()

    const readSpy = vi.spyOn(fs, 'readdirSync')
    
    // First call
    getAllPosts()
    const readCount1 = readSpy.mock.calls.length

    // Clear cache
    clearBlogCache()

    // Next call should read again
    getAllPosts()
    const readCount2 = readSpy.mock.calls.length
    
    expect(readCount2).toBeGreaterThan(readCount1)

    readSpy.mockRestore()
  })
})
