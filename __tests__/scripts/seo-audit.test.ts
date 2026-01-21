import fs from 'fs'
import os from 'os'
import path from 'path'
import { describe, expect, it } from 'vitest'

import {
  buildRouteMatchers,
  extractInternalLinks,
  findMissingMetaDescriptions,
  parseSitemapPaths,
  readTextFile,
} from '../../scripts/seo-audit.mjs'

const createTempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'seo-audit-'))

describe('seo-audit helpers', () => {
  it('test_extract_internal_links_handles_empty_input', () => {
    expect(extractInternalLinks('')).toEqual([])
  })

  it('test_extract_internal_links_handles_large_input', () => {
    const links = Array.from({ length: 200 }, (_, index) => `/path-${index}`)
    const content = links.map((link) => `<a href="${link}">Link</a>`).join('\n')
    const result = extractInternalLinks(content)
    expect(result).toHaveLength(links.length)
  })

  it('test_build_route_matchers_handles_static_and_dynamic_routes', () => {
    const tempDir = createTempDir()
    const appDir = path.join(tempDir, 'app')
    fs.mkdirSync(path.join(appDir, 'blog', '[slug]'), { recursive: true })
    fs.mkdirSync(path.join(appDir, 'about'), { recursive: true })
    fs.writeFileSync(path.join(appDir, 'page.tsx'), '// home')
    fs.writeFileSync(path.join(appDir, 'about', 'page.tsx'), '// about')
    fs.writeFileSync(path.join(appDir, 'blog', '[slug]', 'page.tsx'), '// blog')

    const pageFiles = [
      path.join(appDir, 'page.tsx'),
      path.join(appDir, 'about', 'page.tsx'),
      path.join(appDir, 'blog', '[slug]', 'page.tsx'),
    ]
    const { staticRoutes, matchers } = buildRouteMatchers(pageFiles, appDir)
    expect(staticRoutes.has('/')).toBe(true)
    expect(staticRoutes.has('/about')).toBe(true)
    expect(matchers.some((matcher) => matcher.regex.test('/blog/example'))).toBe(true)
  })

  it('test_parse_sitemap_paths_extracts_template_urls', () => {
    const content = `
      const staticPages = [
        { url: baseUrl },
        { url: \`\${baseUrl}/about\` },
        { url: \`\${baseUrl}/services\` },
      ]
    `
    const paths = parseSitemapPaths(content)
    expect(paths).toEqual(expect.arrayContaining(['/', '/about', '/services']))
  })

  it('test_find_missing_meta_descriptions_detects_missing_description', () => {
    const tempDir = createTempDir()
    const appDir = path.join(tempDir, 'app')
    const aboutDir = path.join(appDir, 'about')
    fs.mkdirSync(aboutDir, { recursive: true })
    fs.writeFileSync(
      path.join(aboutDir, 'page.tsx'),
      `export const metadata = { title: 'About' }`,
    )
    const issues = findMissingMetaDescriptions([path.join(aboutDir, 'page.tsx')], appDir)
    expect(issues).toHaveLength(1)
  })

  it('test_read_text_file_reports_missing_file_error', () => {
    const result = readTextFile('/does-not-exist.md')
    expect(result.content).toBeNull()
    expect(result.error).toBeTruthy()
  })
})
