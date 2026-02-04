# Performance Monitoring

Comprehensive performance monitoring system with budget enforcement, Core Web Vitals tracking, regression detection, and bundle analysis.

## Features

- **Performance Budgets**: Enforce size limits for JavaScript, CSS, images, and total page weight
- **Core Web Vitals**: Track LCP, FID, CLS, FCP, TTFB, and INP metrics
- **Regression Detection**: Compare metrics against baselines and detect performance degradation
- **Bundle Analysis**: Identify large modules, duplicates, and tree-shaking opportunities
- **CI/CD Integration**: Automated performance checks in continuous integration pipelines
- **Real-time Monitoring**: Track performance metrics in production

## Installation

```bash
npm install @firm/capabilities
```

## Quick Start

### Basic Performance Monitoring

```typescript
import { createPerformanceMonitor } from '@firm/capabilities/performance'

const monitor = createPerformanceMonitor({
  enableWebVitals: true,
  reportEndpoint: '/api/performance',
  onAlert: (alert) => {
    console.warn('Performance Alert:', alert.message)
  },
})

// Run performance check
const report = await monitor.check()
console.log('Performance Score:', report.score)
```

### Budget Enforcement

```typescript
import { BudgetChecker, DEFAULT_BUDGETS } from '@firm/capabilities/performance'

const checker = new BudgetChecker([
  {
    name: 'JavaScript Bundle',
    resourceType: 'javascript',
    maxSize: 350 * 1024, // 350KB
    warningThreshold: 0.75,
    enforce: true,
  },
  ...DEFAULT_BUDGETS,
])

// Check budgets against actual sizes
const results = checker.checkBudgets({
  javascript: 400 * 1024, // 400KB
  css: 50 * 1024,
  total: 2 * 1024 * 1024,
})

results.forEach((result) => {
  console.log(result.message)
})
```

### Core Web Vitals Tracking

```typescript
import { WebVitalsTracker, sendToAnalytics } from '@firm/capabilities/performance'

const tracker = new WebVitalsTracker()
tracker.initialize()

// Subscribe to vitals updates
tracker.onReport((report) => {
  console.log(`${report.name}: ${report.value}ms (${report.rating})`)

  // Send to analytics
  sendToAnalytics(report, '/api/analytics/vitals')
})

// Get current vitals
const vitals = tracker.getVitals()
console.log('LCP:', vitals.lcp)
console.log('FID:', vitals.fid)
console.log('CLS:', vitals.cls)
```

### Regression Detection

```typescript
import { RegressionDetector, loadBaseline } from '@firm/capabilities/performance'

// Load baseline metrics
const baseline = await loadBaseline('./baseline.json')

const detector = new RegressionDetector({
  baseline,
  maxRegression: 10, // 10% maximum allowed regression
  metrics: ['loadTime', 'tti', 'tbt'],
  enableAlerts: true,
})

// Check current metrics
const currentMetrics = {
  loadTime: 3500,
  tti: 4200,
  tbt: 600,
  speedIndex: 2800,
  webVitals: vitals,
  bundleSizes: sizes,
  timestamp: Date.now(),
}

const regressions = detector.detectRegressions(currentMetrics)

regressions.forEach((regression) => {
  if (regression.detected) {
    console.warn(
      `Regression in ${regression.metric}: ${regression.percentageChange.toFixed(1)}%`
    )
    console.log('Recommendation:', regression.recommendation)
  }
})
```

### Bundle Analysis

```typescript
import { BundleAnalyzer, parseWebpackStats } from '@firm/capabilities/performance'
import fs from 'fs'

// Load webpack stats
const stats = JSON.parse(fs.readFileSync('./dist/stats.json', 'utf-8'))
const bundleData = parseWebpackStats(stats)

// Analyze bundle
const analyzer = new BundleAnalyzer({
  largeModuleThreshold: 50 * 1024, // 50KB
  analyzeTreeShaking: true,
})

const analysis = analyzer.analyzeBundle(bundleData)

console.log(`Bundle Size: ${(analysis.size / 1024).toFixed(0)}KB`)
console.log(`Modules: ${analysis.modules.length}`)
console.log(`Large Modules: ${analysis.largeModules.length}`)
console.log(`Duplicates: ${analysis.duplicates.length}`)

// Get recommendations
const recommendations = analyzer.generateRecommendations(analysis)
recommendations.forEach((rec) => console.log('•', rec))

// Generate HTML report
const html = analyzer.generateHTMLReport(analysis)
fs.writeFileSync('./bundle-report.html', html)
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Performance Checks

on: [pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci

      - name: Build with stats
        run: npm run build -- --json > dist/stats.json

      - name: Check performance budgets
        run: node scripts/performance/check-budgets.js --verbose --fail-on-warning

      - name: Upload performance report
        uses: actions/upload-artifact@v3
        with:
          name: performance-report
          path: |
            dist/performance-report.json
            dist/performance-report.html
```

### Custom Budget Configuration

Create `performance-budgets.json`:

```json
[
  {
    "name": "Total Page Size",
    "resourceType": "total",
    "maxSize": 2097152,
    "warningThreshold": 0.8,
    "enforce": true
  },
  {
    "name": "JavaScript Bundle",
    "resourceType": "javascript",
    "maxSize": 358400,
    "warningThreshold": 0.75,
    "enforce": true
  },
  {
    "name": "CSS Bundle",
    "resourceType": "css",
    "maxSize": 102400,
    "warningThreshold": 0.75,
    "enforce": true
  }
]
```

## Best Practices

### 1. Set Realistic Budgets

Base budgets on user network conditions and device capabilities:

```typescript
// Mobile-first budgets (3G connection)
const mobileBudgets = [
  { resourceType: 'javascript', maxSize: 200 * 1024 },
  { resourceType: 'css', maxSize: 50 * 1024 },
  { resourceType: 'total', maxSize: 1 * 1024 * 1024 },
]

// Desktop budgets (Cable connection)
const desktopBudgets = [
  { resourceType: 'javascript', maxSize: 350 * 1024 },
  { resourceType: 'css', maxSize: 100 * 1024 },
  { resourceType: 'total', maxSize: 2 * 1024 * 1024 },
]
```

### 2. Monitor in Production

```typescript
const monitor = createPerformanceMonitor({
  enableWebVitals: true,
  reportEndpoint: '/api/performance',
  onAlert: (alert) => {
    // Send to monitoring service
    logger.warn('Performance Alert', {
      type: alert.type,
      metric: alert.metric,
      value: alert.value,
      threshold: alert.threshold,
    })
  },
})

// Sample 10% of traffic
if (Math.random() < 0.1) {
  await monitor.check()
}
```

### 3. Track Trends Over Time

```typescript
const detector = new RegressionDetector(config)

// Store metrics regularly
setInterval(async () => {
  const metrics = await collectMetrics()
  detector.detectRegressions(metrics)

  // Analyze trends
  const trend = detector.calculateTrend('loadTime')
  console.log(`Load time trend: ${trend.trend} (${trend.changeRate.toFixed(1)}%)`)
}, 3600000) // Every hour
```

### 4. Optimize Based on Data

```typescript
const analyzer = new BundleAnalyzer()
const analysis = analyzer.analyzeBundle(bundleData)

// Address duplicates
if (analysis.duplicates.length > 0) {
  console.log('Fix duplicate dependencies:')
  analysis.duplicates.forEach((dup) => {
    console.log(`  ${dup.name}: ${dup.versions.join(', ')}`)
  })
}

// Code split large modules
if (analysis.largeModules.length > 0) {
  console.log('Consider lazy loading:')
  analysis.largeModules.slice(0, 5).forEach((mod) => {
    console.log(`  ${mod.name}: ${(mod.size / 1024).toFixed(0)}KB`)
  })
}
```

## Core Web Vitals Thresholds

| Metric | Good      | Needs Improvement | Poor    |
| ------ | --------- | ----------------- | ------- |
| LCP    | ≤ 2.5s    | 2.5s - 4.0s       | > 4.0s  |
| FID    | ≤ 100ms   | 100ms - 300ms     | > 300ms |
| CLS    | ≤ 0.1     | 0.1 - 0.25        | > 0.25  |
| FCP    | ≤ 1.8s    | 1.8s - 3.0s       | > 3.0s  |
| TTFB   | ≤ 800ms   | 800ms - 1800ms    | > 1.8s  |
| INP    | ≤ 200ms   | 200ms - 500ms     | > 500ms |

## API Reference

### BudgetChecker

```typescript
class BudgetChecker {
  constructor(budgets?: PerformanceBudget[])
  checkBudgets(resourceSizes: Partial<Record<ResourceType, number>>): BudgetCheckResult[]
  getAlerts(): PerformanceAlert[]
  addBudget(budget: PerformanceBudget): void
  removeBudget(name: string): void
  getSummary(results: BudgetCheckResult[]): Summary
}
```

### WebVitalsTracker

```typescript
class WebVitalsTracker {
  initialize(): void
  onReport(callback: (report: WebVitalsReport) => void): () => void
  getVitals(): CoreWebVitals
  getScore(): number
  disconnect(): void
}
```

### RegressionDetector

```typescript
class RegressionDetector {
  constructor(config: RegressionConfig)
  detectRegressions(current: PerformanceMetrics): RegressionResult[]
  calculateTrend(metric: keyof PerformanceMetrics): TrendAnalysis
  generateReport(results: RegressionResult[]): Report
}
```

### BundleAnalyzer

```typescript
class BundleAnalyzer {
  constructor(config?: BundleAnalyzerConfig)
  analyzeBundle(bundleData: BundleData): BundleAnalysisResult
  generateRecommendations(analysis: BundleAnalysisResult): string[]
  compare(baseline: BundleAnalysisResult, current: BundleAnalysisResult): Comparison
  generateHTMLReport(analysis: BundleAnalysisResult): string
}
```

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Performance Budgets](https://web.dev/performance-budgets-101/)
- [Lighthouse Performance Scoring](https://web.dev/performance-scoring/)
- [Bundle Analysis Best Practices](https://webpack.js.org/guides/code-splitting/)

## License

MIT
