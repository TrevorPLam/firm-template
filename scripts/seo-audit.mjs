import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..')
const APP_DIR = path.join(REPO_ROOT, 'app')
const COMPONENTS_DIR = path.join(REPO_ROOT, 'components')
const CONTENT_DIR = path.join(REPO_ROOT, 'content')
const DOCS_DIR = path.join(REPO_ROOT, 'docs')
const PUBLIC_DIR = path.join(REPO_ROOT, 'public')
const SITEMAP_FILE = path.join(APP_DIR, 'sitemap.ts')

const PAGE_SUFFIX = `page.tsx`
const INTERNAL_LINK_PATTERNS = [
  /href\s*=\s*["'](\/[^"']+)["']/g,
  /href\s*=\s*\{`(\/[^`]+)`\}/g,
  /\]\((\/[^)\s]+)\)/g,
]

export function readTextFile(filePath) {
  try {
    return { content: fs.readFileSync(filePath, 'utf8'), error: null }
  } catch (error) {
    return { content: null, error }
  }
}

export function walkFiles(dir, extensions) {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath, extensions))
      continue
    }
    if (extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath)
    }
  }
  return files
}

export function normalizePathname(link) {
  if (!link.startsWith('/')) return link
  const cleaned = link.split(/[?#]/)[0]
  if (cleaned !== '/' && cleaned.endsWith('/')) {
    return cleaned.slice(0, -1)
  }
  return cleaned
}

export function extractInternalLinks(content) {
  if (!content) return []
  const links = new Set()
  for (const pattern of INTERNAL_LINK_PATTERNS) {
    let match
    while ((match = pattern.exec(content)) !== null) {
      const link = match[1]
      if (!link || link.includes('${')) continue
      if (link.startsWith('/')) {
        links.add(normalizePathname(link))
      }
    }
  }
  return Array.from(links)
}

function segmentToPattern(segment) {
  if (segment.startsWith('[[...') && segment.endsWith(']]')) return '(?:.*)?'
  if (segment.startsWith('[...') && segment.endsWith(']')) return '.+'
  if (segment.startsWith('[') && segment.endsWith(']')) return '[^/]+'
  return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function getRouteInfo(pageFile, appDir) {
  const relativePath = path.relative(appDir, pageFile)
  if (!relativePath.endsWith(PAGE_SUFFIX)) return null
  const routePath = relativePath.replace(`${path.sep}${PAGE_SUFFIX}`, '')
  const segments = routePath === 'page.tsx' ? [] : routePath.split(path.sep)
  if (segments.length === 0) {
    return { route: '/', isDynamic: false, pattern: '^/$' }
  }
  const route = `/${segments.join('/')}`.replace(/\/$/, '')
  const isDynamic = segments.some((segment) => segment.includes('['))
  const pattern = `^/${segments.map(segmentToPattern).join('/')}$`
  return { route, isDynamic, pattern }
}

export function buildRouteMatchers(pageFiles, appDir) {
  const staticRoutes = new Set()
  const matchers = []
  for (const file of pageFiles) {
    const info = getRouteInfo(file, appDir)
    if (!info) continue
    if (info.isDynamic) {
      matchers.push({ regex: new RegExp(info.pattern), source: info.route })
    } else {
      staticRoutes.add(info.route)
    }
  }
  return { staticRoutes, matchers }
}

export function parseSitemapPaths(content) {
  if (!content) return []
  const paths = new Set()
  const templateRegex = /`\$\{baseUrl\}([^`]+)?`/g
  let match
  while ((match = templateRegex.exec(content)) !== null) {
    const suffix = match[1] ?? ''
    const pathValue = suffix.trim() === '' ? '/' : suffix
    paths.add(normalizePathname(pathValue))
  }
  if (/url:\s*baseUrl/.test(content)) {
    paths.add('/')
  }
  return Array.from(paths)
}

function fileUsesMetadata(content) {
  return /export\s+(const\s+metadata|async\s+function\s+generateMetadata|function\s+generateMetadata)/.test(
    content,
  )
}

function hasDescription(content) {
  return /description\s*:/.test(content)
}

export function findMissingMetaDescriptions(pageFiles, appDir) {
  const issues = []
  for (const file of pageFiles) {
    const { content, error } = readTextFile(file)
    if (error || !content) {
      issues.push({ file, issue: 'Unable to read metadata for page.' })
      continue
    }
    const info = getRouteInfo(file, appDir)
    if (!info) continue
    if (info.route === '/' && !fileUsesMetadata(content)) continue
    if (!fileUsesMetadata(content)) {
      issues.push({ file, issue: 'Missing metadata export for page.' })
      continue
    }
    if (!hasDescription(content)) {
      issues.push({ file, issue: 'Missing metadata description.' })
    }
  }
  return issues
}

export function findStructuredDataIssues(files) {
  const issues = []
  for (const file of files) {
    const { content } = readTextFile(file)
    if (!content || !content.includes('application/ld+json')) continue
    if (!content.includes('JSON.stringify')) {
      issues.push({ file, issue: 'JSON-LD script missing JSON.stringify usage.' })
    }
  }
  return issues
}

function isRouteMatch(link, staticRoutes, matchers) {
  if (staticRoutes.has(link)) return true
  return matchers.some((matcher) => matcher.regex.test(link))
}

function isPublicAsset(link, publicDir) {
  if (!link.startsWith('/')) return false
  const assetPath = path.join(publicDir, link.replace(/^\//, ''))
  return fs.existsSync(assetPath)
}

export function findBrokenLinks(files, routeMatchers, publicDir) {
  const issues = []
  for (const file of files) {
    const { content } = readTextFile(file)
    const links = extractInternalLinks(content ?? '')
    for (const link of links) {
      if (isRouteMatch(link, routeMatchers.staticRoutes, routeMatchers.matchers)) continue
      if (isPublicAsset(link, publicDir)) continue
      issues.push({ file, issue: `Broken internal link: ${link}` })
    }
  }
  return issues
}

export function findMissingSitemapEntries(staticRoutes, sitemapPaths) {
  const missing = []
  for (const route of staticRoutes) {
    if (!sitemapPaths.includes(route)) {
      missing.push(route)
    }
  }
  return missing
}

export function runSeoAudit(rootDir = REPO_ROOT) {
  const appDir = path.join(rootDir, 'app')
  const contentDir = path.join(rootDir, 'content')
  const componentsDir = path.join(rootDir, 'components')
  const docsDir = path.join(rootDir, 'docs')
  const publicDir = path.join(rootDir, 'public')
  const sitemapPath = path.join(appDir, 'sitemap.ts')
  const pageFiles = walkFiles(appDir, [PAGE_SUFFIX])
  const routeMatchers = buildRouteMatchers(pageFiles, appDir)
  const contentFiles = walkFiles(contentDir, ['.md', '.mdx'])
  const uiFiles = walkFiles(componentsDir, ['.tsx'])
  const docFiles = walkFiles(docsDir, ['.md', '.mdx'])
  const linkFiles = [...pageFiles, ...contentFiles, ...uiFiles, ...docFiles]
  const metadataIssues = findMissingMetaDescriptions(pageFiles, appDir)
  const structuredDataIssues = findStructuredDataIssues([...pageFiles, ...uiFiles])
  const linkIssues = findBrokenLinks(linkFiles, routeMatchers, publicDir)
  const sitemapFile = readTextFile(sitemapPath)
  const sitemapPaths = parseSitemapPaths(sitemapFile.content ?? '')
  const sitemapMissing = findMissingSitemapEntries(routeMatchers.staticRoutes, sitemapPaths)
  const issues = [
    ...metadataIssues,
    ...structuredDataIssues,
    ...linkIssues,
    ...sitemapMissing.map((route) => ({
      file: sitemapPath,
      issue: `Missing sitemap entry for ${route}.`,
    })),
  ]
  if (!sitemapFile.content) {
    issues.push({ file: sitemapPath, issue: 'Missing app/sitemap.ts file.' })
  }
  return { issues, summary: { metadataIssues, structuredDataIssues, linkIssues, sitemapMissing } }
}

function reportIssues(issues) {
  if (issues.length === 0) {
    console.log('SEO audit passed. No issues found.')
    return
  }
  console.log(`SEO audit found ${issues.length} issue(s):`)
  for (const issue of issues) {
    console.log(`- ${issue.file}: ${issue.issue}`)
  }
}

function isMain() {
  const entry = process.argv[1]
  if (!entry) return false
  return import.meta.url === new URL(entry, 'file:').href
}

if (isMain()) {
  const { issues } = runSeoAudit()
  reportIssues(issues)
  if (issues.length > 0) {
    process.exitCode = 1
  }
}
