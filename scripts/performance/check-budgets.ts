// AI-META-BEGIN
// 
// AI-META: Build or utility script
// OWNERSHIP: scripts (build/deployment utilities)
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

#!/usr/bin/env node
/**
 * CI script for checking performance budgets
 */

import { BudgetChecker, DEFAULT_BUDGETS, calculateResourceSizes } from '../packages/capabilities/src/performance/monitoring/budgets'
import { BundleAnalyzer, parseWebpackStats } from '../packages/capabilities/src/performance/analysis/bundle-analyzer'
import * as fs from 'fs'
import * as path from 'path'

interface CheckOptions {
  statsFile?: string
  budgetFile?: string
  threshold?: number
  failOnWarning?: boolean
  verbose?: boolean
}

/**
 * Main function to check performance budgets in CI
 */
async function checkBudgets(options: CheckOptions = {}): Promise<void> {
  const {
    statsFile = './dist/stats.json',
    budgetFile = './performance-budgets.json',
    threshold = 100,
    failOnWarning = false,
    verbose = false,
  } = options

  console.log('🔍 Checking performance budgets...\n')

  try {
    // Load custom budgets if provided
    let budgets = DEFAULT_BUDGETS
    if (fs.existsSync(budgetFile)) {
      const customBudgets = JSON.parse(fs.readFileSync(budgetFile, 'utf-8'))
      budgets = customBudgets
      if (verbose) console.log(`✓ Loaded custom budgets from ${budgetFile}`)
    } else {
      if (verbose) console.log('ℹ Using default budgets')
    }

    // Initialize budget checker
    const checker = new BudgetChecker(budgets)

    // Check if stats file exists
    if (!fs.existsSync(statsFile)) {
      console.error(`❌ Stats file not found: ${statsFile}`)
      console.log('\nTo generate stats file, add to your build script:')
      console.log('  webpack: --json > stats.json')
      console.log('  vite: vite-plugin-bundle-stats')
      process.exit(1)
    }

    // Load and parse stats
    const stats = JSON.parse(fs.readFileSync(statsFile, 'utf-8'))
    const bundleData = parseWebpackStats(stats)

    if (verbose) {
      console.log(`✓ Loaded stats from ${statsFile}`)
      console.log(`  Total modules: ${bundleData.modules.length}\n`)
    }

    // Analyze bundle
    const analyzer = new BundleAnalyzer()
    const analysis = analyzer.analyzeBundle(bundleData)

    // Calculate resource sizes from bundle
    const resourceSizes = {
      total: analysis.size,
      javascript: analysis.size, // Simplified for webpack bundles
      css: 0,
      image: 0,
      font: 0,
      html: 0,
      media: 0,
      document: 0,
      other: 0,
    }

    // Check budgets
    const results = checker.checkBudgets(resourceSizes)

    // Print results
    console.log('📊 Budget Check Results:')
    console.log('━'.repeat(80))

    for (const result of results) {
      console.log(result.message)
    }

    console.log('━'.repeat(80))

    // Print summary
    const summary = checker.getSummary(results)
    console.log(`\n📈 Summary:`)
    console.log(`  Total budgets: ${summary.total}`)
    console.log(`  Passed: ${summary.passed} ✅`)
    console.log(`  Failed: ${summary.failed} ❌`)
    console.log(`  Warnings: ${summary.warnings} ⚠️`)
    console.log(`  Pass rate: ${summary.passRate.toFixed(1)}%\n`)

    // Print bundle analysis
    if (verbose) {
      console.log('📦 Bundle Analysis:')
      console.log(`  Size: ${(analysis.size / 1024).toFixed(2)} KB`)
      console.log(`  Gzipped: ${(analysis.gzipSize / 1024).toFixed(2)} KB`)
      console.log(`  Modules: ${analysis.modules.length}`)
      console.log(`  Large modules: ${analysis.largeModules.length}`)
      console.log(`  Duplicates: ${analysis.duplicates.length}\n`)

      // Print recommendations
      const recommendations = analyzer.generateRecommendations(analysis)
      if (recommendations.length > 0) {
        console.log('💡 Recommendations:')
        recommendations.forEach((rec) => console.log(`  • ${rec}`))
        console.log()
      }
    }

    // Save report
    const reportPath = path.join(path.dirname(statsFile), 'performance-report.json')
    const report = {
      timestamp: new Date().toISOString(),
      budgets: results,
      summary,
      analysis: {
        size: analysis.size,
        gzipSize: analysis.gzipSize,
        modules: analysis.modules.length,
        largeModules: analysis.largeModules.length,
        duplicates: analysis.duplicates.length,
      },
    }
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`💾 Report saved to ${reportPath}`)

    // Save HTML report if verbose
    if (verbose) {
      const htmlPath = path.join(path.dirname(statsFile), 'performance-report.html')
      const html = analyzer.generateHTMLReport(analysis)
      fs.writeFileSync(htmlPath, html)
      console.log(`📄 HTML report saved to ${htmlPath}`)
    }

    // Determine exit code
    const hasFailures = !checker.allBudgetsPassed(results)
    const hasWarnings = summary.warnings > 0

    if (hasFailures) {
      console.error('\n❌ Performance budget check failed!')
      process.exit(1)
    }

    if (failOnWarning && hasWarnings) {
      console.error('\n⚠️  Performance budget warnings detected!')
      process.exit(1)
    }

    console.log('\n✅ All performance budgets passed!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error checking performance budgets:')
    console.error(error)
    process.exit(1)
  }
}

// Parse CLI arguments
function parseArgs(): CheckOptions {
  const args = process.argv.slice(2)
  const options: CheckOptions = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--stats':
      case '-s':
        options.statsFile = args[++i]
        break
      case '--budgets':
      case '-b':
        options.budgetFile = args[++i]
        break
      case '--threshold':
      case '-t':
        options.threshold = parseInt(args[++i], 10)
        break
      case '--fail-on-warning':
      case '-w':
        options.failOnWarning = true
        break
      case '--verbose':
      case '-v':
        options.verbose = true
        break
      case '--help':
      case '-h':
        printHelp()
        process.exit(0)
        break
    }
  }

  return options
}

function printHelp(): void {
  console.log(`
Performance Budget Checker

Usage: node check-budgets.js [options]

Options:
  -s, --stats <path>        Path to webpack stats JSON file (default: ./dist/stats.json)
  -b, --budgets <path>      Path to custom budgets JSON file (default: ./performance-budgets.json)
  -t, --threshold <number>  Performance score threshold (0-100) (default: 100)
  -w, --fail-on-warning     Fail CI if warnings are detected
  -v, --verbose             Enable verbose output
  -h, --help                Show this help message

Examples:
  node check-budgets.js
  node check-budgets.js --stats ./build/stats.json --verbose
  node check-budgets.js --budgets ./custom-budgets.json --fail-on-warning

Budget Configuration:
  Create a performance-budgets.json file with custom budgets:
  
  [
    {
      "name": "Total Page Size",
      "resourceType": "total",
      "maxSize": 2097152,
      "warningThreshold": 0.8,
      "enforce": true
    }
  ]

Integration:
  Add to package.json scripts:
  "scripts": {
    "build:stats": "webpack --json > dist/stats.json",
    "check:performance": "node scripts/performance/check-budgets.js"
  }

  Add to CI workflow (.github/workflows/ci.yml):
  - name: Check Performance Budgets
    run: npm run build:stats && npm run check:performance
  `)
}

// Run if called directly
if (require.main === module) {
  const options = parseArgs()
  checkBudgets(options)
}

export { checkBudgets }
