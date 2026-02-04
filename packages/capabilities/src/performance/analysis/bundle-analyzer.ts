// AI-META-BEGIN
// 
// AI-META: Shared package module
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * Bundle analysis utilities for performance optimization
 */

import type {
  BundleAnalysisResult,
  ModuleInfo,
  DuplicateInfo,
  TreeShakingOpportunity,
} from '../types'

/**
 * Bundle analyzer configuration
 */
export interface BundleAnalyzerConfig {
  /** Threshold for considering a module "large" (bytes) */
  largeModuleThreshold: number
  /** Minimum size for duplicate detection (bytes) */
  minimumDuplicateSize: number
  /** Enable tree-shaking analysis */
  analyzeTreeShaking: boolean
  /** Gzip compression level simulation */
  gzipLevel: number
}

/**
 * Default analyzer configuration
 */
const DEFAULT_CONFIG: BundleAnalyzerConfig = {
  largeModuleThreshold: 50 * 1024, // 50KB
  minimumDuplicateSize: 10 * 1024, // 10KB
  analyzeTreeShaking: true,
  gzipLevel: 9,
}

/**
 * Bundle analyzer for webpack/rollup/vite bundles
 */
export class BundleAnalyzer {
  private config: BundleAnalyzerConfig

  constructor(config: Partial<BundleAnalyzerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Analyze bundle composition
   */
  analyzeBundle(bundleData: {
    name: string
    modules: Array<{ name: string; size: number; source?: string }>
  }): BundleAnalysisResult {
    const totalSize = bundleData.modules.reduce((sum, m) => sum + m.size, 0)

    const modules: ModuleInfo[] = bundleData.modules.map((m) => ({
      name: m.name,
      size: m.size,
      gzipSize: this.estimateGzipSize(m.size),
      percentage: (m.size / totalSize) * 100,
    }))

    // Sort by size descending
    modules.sort((a, b) => b.size - a.size)

    const duplicates = this.findDuplicates(bundleData.modules)
    const largeModules = modules.filter((m) => m.size > this.config.largeModuleThreshold)

    const treeShakingOpportunities = this.config.analyzeTreeShaking
      ? this.findTreeShakingOpportunities(bundleData.modules)
      : []

    return {
      name: bundleData.name,
      size: totalSize,
      gzipSize: this.estimateGzipSize(totalSize),
      modules,
      duplicates,
      largeModules,
      treeShakingOpportunities,
    }
  }

  /**
   * Find duplicate modules across bundle
   */
  private findDuplicates(
    modules: Array<{ name: string; size: number }>
  ): DuplicateInfo[] {
    const moduleMap = new Map<string, Array<{ size: number; version?: string }>>()

    for (const module of modules) {
      // Extract module name without version
      const baseName = this.extractModuleName(module.name)
      const version = this.extractVersion(module.name)

      if (!moduleMap.has(baseName)) {
        moduleMap.set(baseName, [])
      }

      moduleMap.get(baseName)?.push({ size: module.size, version })
    }

    const duplicates: DuplicateInfo[] = []

    for (const [name, instances] of moduleMap.entries()) {
      if (instances.length > 1) {
        const totalSize = instances.reduce((sum, i) => sum + i.size, 0)

        if (totalSize > this.config.minimumDuplicateSize) {
          const wastedBytes = totalSize - Math.max(...instances.map((i) => i.size))
          const versions = [...new Set(instances.map((i) => i.version).filter(Boolean))]

          duplicates.push({
            name,
            count: instances.length,
            wastedBytes,
            versions: versions as string[],
          })
        }
      }
    }

    return duplicates.sort((a, b) => b.wastedBytes - a.wastedBytes)
  }

  /**
   * Extract module name from full path
   */
  private extractModuleName(path: string): string {
    // Handle node_modules paths
    const nodeModulesMatch = path.match(/node_modules\/(@[^/]+\/[^/]+|[^/]+)/)
    if (nodeModulesMatch) {
      return nodeModulesMatch[1]
    }

    // Handle relative paths
    const parts = path.split('/')
    return parts[parts.length - 1].replace(/\.[^.]+$/, '')
  }

  /**
   * Extract version from module path
   */
  private extractVersion(path: string): string | undefined {
    const versionMatch = path.match(/@(\d+\.\d+\.\d+[^/]*)/)
    return versionMatch?.[1]
  }

  /**
   * Find tree-shaking opportunities
   */
  private findTreeShakingOpportunities(
    modules: Array<{ name: string; size: number; source?: string }>
  ): TreeShakingOpportunity[] {
    const opportunities: TreeShakingOpportunity[] = []

    for (const module of modules) {
      if (!module.source) continue

      const unusedExports = this.detectUnusedExports(module.source)

      if (unusedExports.length > 0) {
        // Estimate potential savings (rough heuristic)
        const potentialSavings = Math.floor(
          module.size * (unusedExports.length / this.countExports(module.source))
        )

        if (potentialSavings > 1000) {
          // Only report if > 1KB savings
          opportunities.push({
            module: module.name,
            unusedExports,
            potentialSavings,
          })
        }
      }
    }

    return opportunities.sort((a, b) => b.potentialSavings - a.potentialSavings)
  }

  /**
   * Detect unused exports in module source
   */
  private detectUnusedExports(source: string): string[] {
    const exports: string[] = []

    // Match export statements
    const exportRegex = /export\s+(?:const|let|var|function|class)\s+(\w+)/g
    let match

    while ((match = exportRegex.exec(source)) !== null) {
      const exportName = match[1]

      // Check if export is used (simple heuristic)
      const usageRegex = new RegExp(`\\b${exportName}\\b`, 'g')
      const usageCount = (source.match(usageRegex) || []).length

      // If only mentioned once (the export itself), it's likely unused
      if (usageCount <= 1) {
        exports.push(exportName)
      }
    }

    return exports
  }

  /**
   * Count total exports in module
   */
  private countExports(source: string): number {
    const exportRegex = /export\s+(?:const|let|var|function|class|default)\s+/g
    return (source.match(exportRegex) || []).length || 1
  }

  /**
   * Estimate gzipped size
   */
  private estimateGzipSize(size: number): number {
    // Rough estimation: gzip typically achieves 60-80% compression for code
    // Using 70% as average
    return Math.round(size * 0.3)
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(analysis: BundleAnalysisResult): string[] {
    const recommendations: string[] = []

    // Check total bundle size
    if (analysis.size > 350 * 1024) {
      recommendations.push(
        `Bundle size (${(analysis.size / 1024).toFixed(0)}KB) exceeds recommended 350KB. Consider code splitting.`
      )
    }

    // Check for duplicates
    if (analysis.duplicates.length > 0) {
      const totalWasted = analysis.duplicates.reduce((sum, d) => sum + d.wastedBytes, 0)
      recommendations.push(
        `Found ${analysis.duplicates.length} duplicate modules wasting ${(totalWasted / 1024).toFixed(0)}KB. Review dependency versions.`
      )
    }

    // Check for large modules
    if (analysis.largeModules.length > 0) {
      recommendations.push(
        `${analysis.largeModules.length} modules exceed 50KB. Consider lazy loading or splitting: ${analysis.largeModules.slice(0, 3).map((m) => m.name).join(', ')}`
      )
    }

    // Check tree-shaking opportunities
    if (analysis.treeShakingOpportunities.length > 0) {
      const totalSavings = analysis.treeShakingOpportunities.reduce(
        (sum, o) => sum + o.potentialSavings,
        0
      )
      recommendations.push(
        `Potential ${(totalSavings / 1024).toFixed(0)}KB savings from removing unused exports in ${analysis.treeShakingOpportunities.length} modules.`
      )
    }

    // Check module count
    if (analysis.modules.length > 500) {
      recommendations.push(
        `High module count (${analysis.modules.length}). Consider module concatenation or scope hoisting.`
      )
    }

    return recommendations
  }

  /**
   * Compare two bundle analyses
   */
  compare(
    baseline: BundleAnalysisResult,
    current: BundleAnalysisResult
  ): {
    sizeChange: number
    sizeChangePercentage: number
    modulesAdded: number
    modulesRemoved: number
    newDuplicates: DuplicateInfo[]
    summary: string
  } {
    const sizeChange = current.size - baseline.size
    const sizeChangePercentage = (sizeChange / baseline.size) * 100

    const baselineModuleNames = new Set(baseline.modules.map((m) => m.name))
    const currentModuleNames = new Set(current.modules.map((m) => m.name))

    const modulesAdded = [...currentModuleNames].filter((n) => !baselineModuleNames.has(n)).length
    const modulesRemoved = [...baselineModuleNames].filter((n) => !currentModuleNames.has(n))
      .length

    const baselineDuplicates = new Set(baseline.duplicates.map((d) => d.name))
    const newDuplicates = current.duplicates.filter((d) => !baselineDuplicates.has(d.name))

    const summary = this.generateComparisonSummary({
      sizeChange,
      sizeChangePercentage,
      modulesAdded,
      modulesRemoved,
      newDuplicates: newDuplicates.length,
    })

    return {
      sizeChange,
      sizeChangePercentage,
      modulesAdded,
      modulesRemoved,
      newDuplicates,
      summary,
    }
  }

  /**
   * Generate comparison summary
   */
  private generateComparisonSummary(data: {
    sizeChange: number
    sizeChangePercentage: number
    modulesAdded: number
    modulesRemoved: number
    newDuplicates: number
  }): string {
    const parts: string[] = []

    if (data.sizeChange !== 0) {
      const direction = data.sizeChange > 0 ? 'increased' : 'decreased'
      parts.push(
        `Bundle size ${direction} by ${Math.abs(data.sizeChangePercentage).toFixed(1)}% (${Math.abs(data.sizeChange / 1024).toFixed(0)}KB)`
      )
    }

    if (data.modulesAdded > 0) {
      parts.push(`${data.modulesAdded} modules added`)
    }

    if (data.modulesRemoved > 0) {
      parts.push(`${data.modulesRemoved} modules removed`)
    }

    if (data.newDuplicates > 0) {
      parts.push(`${data.newDuplicates} new duplicate modules`)
    }

    return parts.length > 0 ? parts.join(', ') : 'No significant changes'
  }

  /**
   * Export analysis to JSON
   */
  exportAnalysis(analysis: BundleAnalysisResult): string {
    return JSON.stringify(analysis, null, 2)
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(analysis: BundleAnalysisResult): string {
    const recommendations = this.generateRecommendations(analysis)

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bundle Analysis Report - ${analysis.name}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto; }
    h1 { color: #333; }
    .metric { display: inline-block; margin: 20px 20px 20px 0; padding: 20px; background: #f5f5f5; border-radius: 8px; }
    .metric-label { font-size: 14px; color: #666; }
    .metric-value { font-size: 32px; font-weight: bold; color: #333; }
    .recommendation { padding: 15px; margin: 10px 0; background: #fff3cd; border-left: 4px solid #ffc107; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f5f5f5; font-weight: 600; }
    .size { font-family: monospace; }
  </style>
</head>
<body>
  <h1>Bundle Analysis: ${analysis.name}</h1>
  
  <div class="metric">
    <div class="metric-label">Total Size</div>
    <div class="metric-value">${(analysis.size / 1024).toFixed(0)} KB</div>
  </div>
  
  <div class="metric">
    <div class="metric-label">Gzipped Size</div>
    <div class="metric-value">${(analysis.gzipSize / 1024).toFixed(0)} KB</div>
  </div>
  
  <div class="metric">
    <div class="metric-label">Modules</div>
    <div class="metric-value">${analysis.modules.length}</div>
  </div>
  
  <h2>Recommendations</h2>
  ${recommendations.map((r) => `<div class="recommendation">${r}</div>`).join('')}
  
  <h2>Largest Modules</h2>
  <table>
    <thead>
      <tr>
        <th>Module</th>
        <th>Size</th>
        <th>Gzipped</th>
        <th>% of Total</th>
      </tr>
    </thead>
    <tbody>
      ${analysis.largeModules
        .slice(0, 10)
        .map(
          (m) => `
        <tr>
          <td>${m.name}</td>
          <td class="size">${(m.size / 1024).toFixed(1)} KB</td>
          <td class="size">${(m.gzipSize / 1024).toFixed(1)} KB</td>
          <td>${m.percentage.toFixed(1)}%</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>
  
  ${
    analysis.duplicates.length > 0
      ? `
  <h2>Duplicate Modules</h2>
  <table>
    <thead>
      <tr>
        <th>Module</th>
        <th>Occurrences</th>
        <th>Wasted</th>
        <th>Versions</th>
      </tr>
    </thead>
    <tbody>
      ${analysis.duplicates
        .map(
          (d) => `
        <tr>
          <td>${d.name}</td>
          <td>${d.count}</td>
          <td class="size">${(d.wastedBytes / 1024).toFixed(1)} KB</td>
          <td>${d.versions.join(', ')}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>
  `
      : ''
  }
</body>
</html>
    `.trim()
  }
}

/**
 * Parse webpack stats JSON
 */
export function parseWebpackStats(stats: any): {
  name: string
  modules: Array<{ name: string; size: number; source?: string }>
} {
  const modules = stats.modules?.map((m: any) => ({
    name: m.name || m.identifier,
    size: m.size || 0,
    source: m.source,
  })) || []

  return {
    name: stats.name || 'bundle',
    modules,
  }
}

/**
 * Parse rollup bundle info
 */
export function parseRollupBundle(bundle: any): {
  name: string
  modules: Array<{ name: string; size: number }>
} {
  const modules = Object.entries(bundle).map(([name, info]: [string, any]) => ({
    name,
    size: info.code?.length || 0,
  }))

  return {
    name: 'rollup-bundle',
    modules,
  }
}
