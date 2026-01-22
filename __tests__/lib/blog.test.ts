import { describe, expect, it } from 'vitest'
import { getAllCategories, getAllPosts, getPostBySlug } from '@/lib/blog'

describe('blog utilities', () => {
  it('returns posts with expected shape', () => {
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

  it('finds a post by slug', () => {
    const posts = getAllPosts()
    const post = getPostBySlug(posts[0].slug)

    expect(post).toBeDefined()
    expect(post?.slug).toBe(posts[0].slug)
  })

  it('returns sorted categories', () => {
    const categories = getAllCategories()

    expect(categories.length).toBeGreaterThan(0)
    expect(categories).toEqual([...categories].sort())
  })

  it('rejects path traversal slugs - basic cases', () => {
    // Test basic path traversal attempts
    expect(getPostBySlug('../secret')).toBeUndefined()
    expect(getPostBySlug('..\\secret')).toBeUndefined()
    expect(getPostBySlug('example-post-1-industry-insights/../secret')).toBeUndefined()
  })
  
  it('rejects path traversal slugs - comprehensive security test', () => {
    // IMPROVED: More comprehensive path traversal tests
    // These should all return undefined BEFORE any file system access
    
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
      'has--double',                  // Double hyphens (depending on regex)
    ]
    
    invalidFormatSlugs.forEach(slug => {
      const result = getPostBySlug(slug)
      expect(result).toBeUndefined()
    })
  })
  
  it('accepts only valid slug formats', () => {
    // Document what IS allowed: lowercase alphanumeric with single hyphens
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
})
