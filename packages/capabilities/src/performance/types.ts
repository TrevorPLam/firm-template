/**
 * Type definitions for performance monitoring system
 */

/**
 * Performance budget configuration
 */
export interface PerformanceBudget {
  /** Budget name */
  name: string
  /** Resource type to monitor */
  resourceType: ResourceType
  /** Maximum allowed size in bytes */
  maxSize: number
  /** Warning threshold (percentage of max) */
  warningThreshold: number
  /** Enable enforcement */
  enforce: boolean
}

/**
 * Resource types for budgeting
 */
export type ResourceType =
  | 'total'
  | 'javascript'
  | 'css'
  | 'image'
  | 'font'
  | 'html'
  | 'media'
  | 'document'
  | 'other'

/**
 * Performance budget check result
 */
export interface BudgetCheckResult {
  /** Budget being checked */
  budget: PerformanceBudget
  /** Actual size in bytes */
  actualSize: number
  /** Percentage of budget used */
  percentageUsed: number
  /** Whether budget passed */
  passed: boolean
  /** Whether warning threshold exceeded */
  warning: boolean
  /** Human-readable message */
  message: string
}

/**
 * Core Web Vitals metrics
 */
export interface CoreWebVitals {
  /** Largest Contentful Paint (ms) */
  lcp: number | null
  /** First Input Delay (ms) */
  fid: number | null
  /** Cumulative Layout Shift */
  cls: number | null
  /** First Contentful Paint (ms) */
  fcp: number | null
  /** Time to First Byte (ms) */
  ttfb: number | null
  /** Interaction to Next Paint (ms) */
  inp: number | null
}

/**
 * Web Vitals rating
 */
export type VitalsRating = 'good' | 'needs-improvement' | 'poor'

/**
 * Web Vitals report
 */
export interface WebVitalsReport {
  /** Metric name */
  name: keyof CoreWebVitals
  /** Metric value */
  value: number
  /** Rating based on thresholds */
  rating: VitalsRating
  /** Delta from previous measurement */
  delta: number
  /** Unique ID for this page load */
  id: string
  /** Navigation type */
  navigationType: NavigationType
  /** Timestamp */
  timestamp: number
}

/**
 * Navigation type
 */
export type NavigationType = 'navigate' | 'reload' | 'back-forward' | 'prerender'

/**
 * Performance regression configuration
 */
export interface RegressionConfig {
  /** Baseline metrics to compare against */
  baseline: PerformanceMetrics
  /** Maximum allowed regression percentage */
  maxRegression: number
  /** Metrics to monitor */
  metrics: Array<keyof PerformanceMetrics>
  /** Enable alerts */
  enableAlerts: boolean
}

/**
 * Performance metrics snapshot
 */
export interface PerformanceMetrics {
  /** Load time (ms) */
  loadTime: number
  /** Time to Interactive (ms) */
  tti: number
  /** Total Blocking Time (ms) */
  tbt: number
  /** Speed Index */
  speedIndex: number
  /** Core Web Vitals */
  webVitals: CoreWebVitals
  /** Bundle sizes */
  bundleSizes: BundleSizes
  /** Timestamp */
  timestamp: number
}

/**
 * Bundle size information
 */
export interface BundleSizes {
  /** Total bundle size (bytes) */
  total: number
  /** JavaScript size (bytes) */
  javascript: number
  /** CSS size (bytes) */
  css: number
  /** Images size (bytes) */
  images: number
  /** Fonts size (bytes) */
  fonts: number
  /** Other resources size (bytes) */
  other: number
}

/**
 * Regression detection result
 */
export interface RegressionResult {
  /** Whether regression detected */
  detected: boolean
  /** Metric that regressed */
  metric: string
  /** Baseline value */
  baseline: number
  /** Current value */
  current: number
  /** Percentage change */
  percentageChange: number
  /** Severity level */
  severity: 'minor' | 'moderate' | 'major' | 'critical'
  /** Recommendation */
  recommendation: string
}

/**
 * Bundle analysis result
 */
export interface BundleAnalysisResult {
  /** Bundle name */
  name: string
  /** Total size (bytes) */
  size: number
  /** Gzipped size (bytes) */
  gzipSize: number
  /** Module breakdown */
  modules: ModuleInfo[]
  /** Duplicate modules */
  duplicates: DuplicateInfo[]
  /** Large modules (over threshold) */
  largeModules: ModuleInfo[]
  /** Tree-shaking opportunities */
  treeShakingOpportunities: TreeShakingOpportunity[]
}

/**
 * Module information
 */
export interface ModuleInfo {
  /** Module name/path */
  name: string
  /** Module size (bytes) */
  size: number
  /** Gzipped size (bytes) */
  gzipSize: number
  /** Percentage of total bundle */
  percentage: number
}

/**
 * Duplicate module information
 */
export interface DuplicateInfo {
  /** Module name */
  name: string
  /** Number of occurrences */
  count: number
  /** Total wasted bytes */
  wastedBytes: number
  /** Module versions */
  versions: string[]
}

/**
 * Tree-shaking opportunity
 */
export interface TreeShakingOpportunity {
  /** Module name */
  module: string
  /** Unused exports */
  unusedExports: string[]
  /** Potential savings (bytes) */
  potentialSavings: number
}

/**
 * Performance monitoring configuration
 */
export interface PerformanceConfig {
  /** Enable monitoring */
  enabled: boolean
  /** Sampling rate (0-1) */
  samplingRate: number
  /** Report endpoint URL */
  reportEndpoint?: string
  /** Enable console logging */
  consoleLogging: boolean
  /** Performance budgets */
  budgets: PerformanceBudget[]
  /** Regression detection config */
  regressionConfig?: RegressionConfig
}

/**
 * Performance alert
 */
export interface PerformanceAlert {
  /** Alert type */
  type: 'budget' | 'regression' | 'vitals'
  /** Severity level */
  severity: 'info' | 'warning' | 'error' | 'critical'
  /** Alert title */
  title: string
  /** Alert message */
  message: string
  /** Related metric */
  metric: string
  /** Current value */
  value: number
  /** Expected/threshold value */
  threshold: number
  /** Timestamp */
  timestamp: number
  /** Metadata */
  metadata?: Record<string, unknown>
}

/**
 * Performance report
 */
export interface PerformanceReport {
  /** Report ID */
  id: string
  /** Report timestamp */
  timestamp: number
  /** Page URL */
  url: string
  /** Performance metrics */
  metrics: PerformanceMetrics
  /** Budget check results */
  budgetResults: BudgetCheckResult[]
  /** Regression results */
  regressionResults: RegressionResult[]
  /** Web vitals reports */
  webVitalsReports: WebVitalsReport[]
  /** Alerts generated */
  alerts: PerformanceAlert[]
  /** Overall score (0-100) */
  score: number
}
