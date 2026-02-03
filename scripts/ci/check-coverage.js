#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

const envCoverageMin = process.env.COVERAGE_MIN_LINES
const minimum = envCoverageMin !== undefined ? Number(envCoverageMin) : 70
if (!Number.isFinite(minimum)) {
  console.error('COVERAGE_MIN_LINES must be a valid number')
  process.exit(1)
}

const coverageFiles = []
const ignored = new Set(['node_modules', '.git', 'dist', '.next'])

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) {
      continue
    }
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath)
      continue
    }
    if (entry.name === 'coverage-summary.json' && fullPath.includes('coverage')) {
      coverageFiles.push(fullPath)
    }
  }
}

walk(process.cwd())

if (coverageFiles.length === 0) {
  console.error('No coverage summary files found in the workspace')
  process.exit(1)
}

const failures = []
for (const coveragePath of coverageFiles) {
  const summary = JSON.parse(fs.readFileSync(coveragePath, 'utf8'))
  const lines = summary.total?.lines?.pct

  if (typeof lines !== 'number') {
    failures.push(`${coveragePath} is missing total line coverage metrics`)
    continue
  }

  if (lines < minimum) {
    failures.push(`${coveragePath} line coverage ${lines}% < ${minimum}%`)
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`All coverage summaries meet the ${minimum}% line threshold`)
