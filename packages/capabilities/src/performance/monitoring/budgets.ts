/**
 * Performance budget enforcement and monitoring
 */

import type {
  PerformanceBudget,
  BudgetCheckResult,
  ResourceType,
  PerformanceAlert,
} from '../types'

/**
 * Default performance budgets based on industry best practices
 */
export const DEFAULT_BUDGETS: PerformanceBudget[] = [
  {
    name: 'Total Page Size',
    resourceType: 'total',
    maxSize: 2 * 1024 * 1024, // 2MB
    warningThreshold: 0.8,
    enforce: true,
  },
  {
    name: 'JavaScript Bundle',
    resourceType: 'javascript',
    maxSize: 350 * 1024, // 350KB
    warningThreshold: 0.75,
    enforce: true,
  },
  {
    name: 'CSS Bundle',
    resourceType: 'css',
    maxSize: 100 * 1024, // 100KB
    warningThreshold: 0.75,
    enforce: true,
  },
  {
    name: 'Images',
    resourceType: 'image',
    maxSize: 1 * 1024 * 1024, // 1MB
    warningThreshold: 0.8,
    enforce: true,
  },
  {
    name: 'Fonts',
    resourceType: 'font',
    maxSize: 200 * 1024, // 200KB
    warningThreshold: 0.75,
    enforce: false,
  },
]

/**
 * Performance budget checker
 */
export class BudgetChecker {
  private budgets: PerformanceBudget[]
  private alerts: PerformanceAlert[] = []

  constructor(budgets: PerformanceBudget[] = DEFAULT_BUDGETS) {
    this.budgets = budgets
  }

  /**
   * Check if resource sizes meet budget requirements
   */
  checkBudgets(resourceSizes: Partial<Record<ResourceType, number>>): BudgetCheckResult[] {
    this.alerts = []
    const results: BudgetCheckResult[] = []

    for (const budget of this.budgets) {
      const actualSize = resourceSizes[budget.resourceType] ?? 0
      const result = this.checkBudget(budget, actualSize)
      results.push(result)

      if (!result.passed && budget.enforce) {
        this.createAlert(result, 'error')
      } else if (result.warning) {
        this.createAlert(result, 'warning')
      }
    }

    return results
  }

  /**
   * Check a single budget
   */
  private checkBudget(budget: PerformanceBudget, actualSize: number): BudgetCheckResult {
    const percentageUsed = (actualSize / budget.maxSize) * 100
    const warningLimit = budget.maxSize * budget.warningThreshold
    const passed = actualSize <= budget.maxSize
    const warning = actualSize > warningLimit && passed

    const message = this.createMessage(budget, actualSize, percentageUsed, passed, warning)

    return {
      budget,
      actualSize,
      percentageUsed,
      passed,
      warning,
      message,
    }
  }

  /**
   * Create human-readable message for budget result
   */
  private createMessage(
    budget: PerformanceBudget,
    actualSize: number,
    percentageUsed: number,
    passed: boolean,
    warning: boolean
  ): string {
    const actualKB = (actualSize / 1024).toFixed(2)
    const maxKB = (budget.maxSize / 1024).toFixed(2)

    if (!passed) {
      const overage = actualSize - budget.maxSize
      const overageKB = (overage / 1024).toFixed(2)
      return `❌ ${budget.name} exceeded budget by ${overageKB}KB (${actualKB}KB / ${maxKB}KB)`
    }

    if (warning) {
      return `⚠️  ${budget.name} approaching budget limit (${percentageUsed.toFixed(1)}% used: ${actualKB}KB / ${maxKB}KB)`
    }

    return `✅ ${budget.name} within budget (${percentageUsed.toFixed(1)}% used: ${actualKB}KB / ${maxKB}KB)`
  }

  /**
   * Create alert for budget violation
   */
  private createAlert(result: BudgetCheckResult, severity: 'warning' | 'error'): void {
    this.alerts.push({
      type: 'budget',
      severity,
      title: `Performance Budget ${severity === 'error' ? 'Exceeded' : 'Warning'}`,
      message: result.message,
      metric: result.budget.name,
      value: result.actualSize,
      threshold: result.budget.maxSize,
      timestamp: Date.now(),
      metadata: {
        resourceType: result.budget.resourceType,
        percentageUsed: result.percentageUsed,
      },
    })
  }

  /**
   * Get all generated alerts
   */
  getAlerts(): PerformanceAlert[] {
    return this.alerts
  }

  /**
   * Add custom budget
   */
  addBudget(budget: PerformanceBudget): void {
    this.budgets.push(budget)
  }

  /**
   * Remove budget by name
   */
  removeBudget(name: string): void {
    this.budgets = this.budgets.filter((b) => b.name !== name)
  }

  /**
   * Update existing budget
   */
  updateBudget(name: string, updates: Partial<PerformanceBudget>): void {
    const index = this.budgets.findIndex((b) => b.name === name)
    if (index !== -1) {
      this.budgets[index] = { ...this.budgets[index], ...updates }
    }
  }

  /**
   * Get current budgets
   */
  getBudgets(): PerformanceBudget[] {
    return [...this.budgets]
  }

  /**
   * Check if all budgets passed
   */
  allBudgetsPassed(results: BudgetCheckResult[]): boolean {
    return results.every((result) => result.passed || !result.budget.enforce)
  }

  /**
   * Get summary statistics
   */
  getSummary(results: BudgetCheckResult[]): {
    total: number
    passed: number
    failed: number
    warnings: number
    passRate: number
  } {
    const total = results.length
    const passed = results.filter((r) => r.passed).length
    const failed = results.filter((r) => !r.passed && r.budget.enforce).length
    const warnings = results.filter((r) => r.warning).length

    return {
      total,
      passed,
      failed,
      warnings,
      passRate: (passed / total) * 100,
    }
  }
}

/**
 * Calculate resource sizes from performance entries
 */
export function calculateResourceSizes(
  entries: PerformanceResourceTiming[]
): Partial<Record<ResourceType, number>> {
  const sizes: Partial<Record<ResourceType, number>> = {
    total: 0,
    javascript: 0,
    css: 0,
    image: 0,
    font: 0,
    html: 0,
    media: 0,
    document: 0,
    other: 0,
  }

  for (const entry of entries) {
    const size = entry.transferSize || entry.encodedBodySize || 0
    const type = getResourceType(entry)

    sizes[type] = (sizes[type] || 0) + size
    sizes.total = (sizes.total || 0) + size
  }

  return sizes
}

/**
 * Determine resource type from performance entry
 */
function getResourceType(entry: PerformanceResourceTiming): ResourceType {
  const { initiatorType, name } = entry

  // Check by initiator type
  if (initiatorType === 'script') return 'javascript'
  if (initiatorType === 'link' || initiatorType === 'css') return 'css'
  if (initiatorType === 'img') return 'image'
  if (initiatorType === 'xmlhttprequest' || initiatorType === 'fetch') return 'other'

  // Check by file extension
  const extension = name.split('.').pop()?.toLowerCase()
  if (extension === 'js' || extension === 'mjs') return 'javascript'
  if (extension === 'css') return 'css'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(extension || ''))
    return 'image'
  if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(extension || '')) return 'font'
  if (['mp4', 'webm', 'ogg', 'mp3', 'wav'].includes(extension || '')) return 'media'
  if (extension === 'html') return 'html'

  return 'other'
}

/**
 * Monitor budgets in real-time (browser environment)
 */
export function monitorBudgets(
  checker: BudgetChecker,
  options: {
    interval?: number
    onViolation?: (results: BudgetCheckResult[]) => void
    onWarning?: (results: BudgetCheckResult[]) => void
  } = {}
): () => void {
  if (typeof window === 'undefined' || !window.performance) {
    console.warn('Performance API not available')
    return () => {}
  }

  const interval = options.interval || 10000 // Check every 10 seconds
  let timeoutId: NodeJS.Timeout

  const check = () => {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const sizes = calculateResourceSizes(entries)
    const results = checker.checkBudgets(sizes)

    const violations = results.filter((r) => !r.passed && r.budget.enforce)
    const warnings = results.filter((r) => r.warning)

    if (violations.length > 0 && options.onViolation) {
      options.onViolation(violations)
    }

    if (warnings.length > 0 && options.onWarning) {
      options.onWarning(warnings)
    }

    timeoutId = setTimeout(check, interval)
  }

  check()

  return () => clearTimeout(timeoutId)
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
