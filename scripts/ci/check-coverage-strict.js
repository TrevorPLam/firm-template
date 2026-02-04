#!/usr/bin/env node
/**
 * Enhanced coverage checking script for 100% coverage enforcement.
 * 
 * This script:
 * 1. Walks all workspace packages and apps
 * 2. Collects coverage-summary.json files
 * 3. Enforces 100% line, branch, function, and statement coverage
 * 4. Reports detailed failures
 * 5. Provides actionable guidance
 */

const fs = require('fs')
const path = require('path')

const TARGET_COVERAGE = 100
const ALLOWED_EXCEPTIONS_FILE = path.join(__dirname, '../../docs/testing/99_EXCEPTIONS.md')

const ignored = new Set(['node_modules', '.git', 'dist', '.next', 'build', 'out', 'coverage'])

/**
 * Parse exceptions file to get list of allowed low-coverage files
 */
function parseExceptions() {
  if (!fs.existsSync(ALLOWED_EXCEPTIONS_FILE)) {
    return new Set()
  }
  
  const content = fs.readFileSync(ALLOWED_EXCEPTIONS_FILE, 'utf8')
  const exceptions = new Set()
  
  // Match code blocks with file paths
  const regex = /```[^\n]*\n([^`]+)```/g
  let match
  while ((match = regex.exec(content)) !== null) {
    const lines = match[1].split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('-')) {
        exceptions.add(trimmed)
      }
    }
  }
  
  return exceptions
}

/**
 * Walk directory tree and collect coverage-summary.json files
 */
function findCoverageSummaries(dir, results = []) {
  if (!fs.existsSync(dir)) {
    return results
  }
  
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) {
      continue
    }
    
    const fullPath = path.join(dir, entry.name)
    
    if (entry.isDirectory()) {
      findCoverageSummaries(fullPath, results)
    } else if (entry.name === 'coverage-summary.json' && fullPath.includes('coverage')) {
      results.push(fullPath)
    }
  }
  
  return results
}

/**
 * Check a single coverage summary file
 */
function checkCoverage(coveragePath, exceptions) {
  const summary = JSON.parse(fs.readFileSync(coveragePath, 'utf8'))
  const failures = []
  
  const metrics = ['lines', 'branches', 'functions', 'statements']
  
  for (const metric of metrics) {
    const pct = summary.total?.[metric]?.pct
    
    if (typeof pct !== 'number') {
      failures.push({
        file: coveragePath,
        metric,
        message: `Missing ${metric} coverage metric`,
      })
      continue
    }
    
    if (pct < TARGET_COVERAGE) {
      failures.push({
        file: coveragePath,
        metric,
        actual: pct,
        expected: TARGET_COVERAGE,
        message: `${metric} coverage ${pct}% < ${TARGET_COVERAGE}%`,
      })
    }
  }
  
  return failures
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Checking coverage across all workspaces...\n')
  
  const exceptions = parseExceptions()
  if (exceptions.size > 0) {
    console.log(`ℹ️  Loaded ${exceptions.size} exception(s) from ${ALLOWED_EXCEPTIONS_FILE}\n`)
  }
  
  const coverageFiles = findCoverageSummaries(process.cwd())
  
  if (coverageFiles.length === 0) {
    console.error('❌ No coverage summary files found!')
    console.error('   Run tests with coverage first: pnpm test')
    process.exit(1)
  }
  
  console.log(`📊 Found ${coverageFiles.length} coverage report(s)\n`)
  
  const allFailures = []
  
  for (const coveragePath of coverageFiles) {
    const relativePath = path.relative(process.cwd(), coveragePath)
    const failures = checkCoverage(coveragePath, exceptions)
    
    if (failures.length > 0) {
      allFailures.push({ path: relativePath, failures })
    }
  }
  
  if (allFailures.length === 0) {
    console.log('✅ All coverage checks passed!')
    console.log(`   All packages meet ${TARGET_COVERAGE}% coverage threshold\n`)
    process.exit(0)
  }
  
  // Report failures
  console.error('❌ Coverage failures detected:\n')
  
  for (const { path: filePath, failures } of allFailures) {
    console.error(`📄 ${filePath}`)
    for (const failure of failures) {
      if (failure.actual !== undefined) {
        console.error(`   ├─ ${failure.metric}: ${failure.actual}% (expected ${failure.expected}%)`)
      } else {
        console.error(`   ├─ ${failure.message}`)
      }
    }
    console.error('')
  }
  
  console.error('💡 To fix:')
  console.error('   1. Run tests with coverage in the failing package:')
  console.error('      cd <package> && pnpm test -- --coverage')
  console.error('   2. Open coverage/index.html to see uncovered lines')
  console.error('   3. Add tests to cover missing lines/branches')
  console.error('   4. If coverage cannot reach 100%, document in:')
  console.error(`      ${ALLOWED_EXCEPTIONS_FILE}\n`)
  
  process.exit(1)
}

main()
