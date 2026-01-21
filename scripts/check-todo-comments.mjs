#!/usr/bin/env node
/**
 * Check for TODO/FIXME/XXX/HACK comments in code.
 *
 * This script scans source files for TODO-style comments and reports them.
 * It's used in CI to flag potential technical debt.
 *
 * Usage:
 *   node scripts/check-todo-comments.mjs
 *
 * Exit codes:
 *   0 - No TODO comments found (or only in allowed files)
 *   1 - TODO comments found in source files
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const TODO_PATTERNS = [
  /TODO:/gi,
  /FIXME:/gi,
  /XXX:/gi,
  /HACK:/gi,
  /NOTE:/gi, // Sometimes used for temporary notes
]

// Files/directories to ignore
const IGNORE_PATTERNS = [
  /^node_modules/,
  /^\.git/,
  /^\.next/,
  /^\.vercel/,
  /^dist/,
  /^build/,
  /^coverage/,
  /^\.github/,
  /^githubactions/,
  /^docs\/ARCHIVE/,
  /^P[0-3]TODO\.md$/,
  /^TODO_ARCHIVE_\d{4}-\d{2}-\d{2}\.md$/,
  /^TODOCOMPLETED\.md$/,
  /^CHANGELOG\.md$/,
  /^package-lock\.json$/,
]

// File extensions to check
const SOURCE_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
])

/**
 * Check if a file path should be ignored.
 */
function shouldIgnore(filePath) {
  return IGNORE_PATTERNS.some((pattern) => pattern.test(filePath))
}

/**
 * Recursively find all source files.
 */
function findSourceFiles(dir, fileList = []) {
  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = join(dir, file)
    const relativePath = filePath.replace(process.cwd() + '/', '')

    if (shouldIgnore(relativePath)) {
      continue
    }

    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      findSourceFiles(filePath, fileList)
    } else if (SOURCE_EXTENSIONS.has(extname(file))) {
      fileList.push(filePath)
    }
  }

  return fileList
}

/**
 * Check a file for TODO comments.
 */
function checkFile(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const issues = []

  lines.forEach((line, index) => {
    TODO_PATTERNS.forEach((pattern) => {
      if (pattern.test(line)) {
        // Skip if it's a JSDoc comment with @todo (allowed)
        if (line.includes('@todo') || line.includes('@deprecated')) {
          return
        }

        issues.push({
          file: filePath.replace(process.cwd() + '/', ''),
          line: index + 1,
          content: line.trim(),
        })
      }
    })
  })

  return issues
}

/**
 * Main execution.
 */
function main() {
  const sourceFiles = findSourceFiles(process.cwd())
  const allIssues = []

  for (const file of sourceFiles) {
    const issues = checkFile(file)
    allIssues.push(...issues)
  }

  if (allIssues.length === 0) {
    console.log('✅ No TODO/FIXME/XXX/HACK comments found in source files')
    process.exit(0)
  }

  console.log(`⚠️  Found ${allIssues.length} TODO-style comment(s) in source files:\n`)

  // Group by file
  const byFile = {}
  for (const issue of allIssues) {
    if (!byFile[issue.file]) {
      byFile[issue.file] = []
    }
    byFile[issue.file].push(issue)
  }

  // Print grouped by file
  for (const [file, issues] of Object.entries(byFile)) {
    console.log(`📄 ${file}`)
    for (const issue of issues) {
      console.log(`   Line ${issue.line}: ${issue.content.substring(0, 80)}`)
    }
    console.log()
  }

  console.log(
    '💡 Consider moving actionable items to P0TODO.md, P1TODO.md, P2TODO.md, P3TODO.md or creating tasks for them.\n'
  )
  console.log(
    '   Note: This is a warning, not an error. Some TODO comments may be intentional.'
  )

  // Exit with warning (non-zero) but don't fail CI
  // CI can choose to treat this as error or warning
  process.exit(1)
}

main()
