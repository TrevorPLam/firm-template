// AI-META-BEGIN
// 
// AI-META: Build or utility script
// OWNERSHIP: scripts (build/deployment utilities)
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: XSS prevention - must sanitize all user input
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

#!/usr/bin/env node
/**
 * Client-Specific Quality Benchmarking
 * Creates benchmarks and tracks quality trends per client
 * 
 * Usage:
 *   npx tsx scripts/quality/client-benchmarks.ts --client client-id
 *   npx tsx scripts/quality/client-benchmarks.ts --generate-report --output report.json
 */

import type { QualityMetrics } from './monitor-quality';

export interface ClientBenchmark {
  clientId: string;
  clientName: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  created: string;
  updated: string;
  baseline: BenchmarkMetrics;
  targets: BenchmarkMetrics;
  current: BenchmarkMetrics;
  history: HistoricalMetrics[];
  trends: TrendAnalysis;
  recommendations: string[];
}

export interface BenchmarkMetrics {
  performance: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
  security: number;
  overall: number;
}

export interface HistoricalMetrics {
  timestamp: string;
  metrics: BenchmarkMetrics;
  notes?: string;
}

export interface TrendAnalysis {
  direction: 'improving' | 'stable' | 'declining';
  velocity: number; // Rate of change per week
  confidence: 'high' | 'medium' | 'low';
  categories: {
    performance: TrendDirection;
    accessibility: TrendDirection;
    seo: TrendDirection;
    bestPractices: TrendDirection;
    security: TrendDirection;
  };
}

export interface TrendDirection {
  direction: 'up' | 'stable' | 'down';
  change: number; // Percentage change
  significance: 'major' | 'moderate' | 'minor' | 'negligible';
}

export interface BenchmarkComparison {
  client: string;
  vsBaseline: ComparisonResult;
  vsTarget: ComparisonResult;
  vsIndustry: ComparisonResult;
  vsTier: ComparisonResult;
}

export interface ComparisonResult {
  difference: number;
  percentage: number;
  status: 'above' | 'at' | 'below';
  categories: Record<string, number>;
}

/**
 * Industry benchmark data (example values)
 */
export const industryBenchmarks: Record<string, BenchmarkMetrics> = {
  ecommerce: {
    performance: 75,
    accessibility: 85,
    seo: 88,
    bestPractices: 80,
    security: 90,
    overall: 83.6,
  },
  saas: {
    performance: 80,
    accessibility: 88,
    seo: 82,
    bestPractices: 85,
    security: 92,
    overall: 85.4,
  },
  content: {
    performance: 78,
    accessibility: 90,
    seo: 92,
    bestPractices: 82,
    security: 88,
    overall: 86.0,
  },
  marketing: {
    performance: 82,
    accessibility: 85,
    seo: 95,
    bestPractices: 83,
    security: 87,
    overall: 86.4,
  },
};

/**
 * Tier-based target benchmarks
 */
export const tierTargets: Record<string, BenchmarkMetrics> = {
  bronze: {
    performance: 60,
    accessibility: 75,
    seo: 70,
    bestPractices: 70,
    security: 80,
    overall: 71.0,
  },
  silver: {
    performance: 75,
    accessibility: 85,
    seo: 80,
    bestPractices: 80,
    security: 85,
    overall: 81.0,
  },
  gold: {
    performance: 85,
    accessibility: 90,
    seo: 88,
    bestPractices: 85,
    security: 90,
    overall: 87.6,
  },
  platinum: {
    performance: 92,
    accessibility: 95,
    seo: 93,
    bestPractices: 90,
    security: 95,
    overall: 93.0,
  },
};

export class BenchmarkAnalyzer {
  /**
   * Convert QualityMetrics to BenchmarkMetrics
   */
  static toBenchmarkMetrics(metrics: QualityMetrics): BenchmarkMetrics {
    return {
      performance: metrics.performance.score,
      accessibility: metrics.accessibility.score,
      seo: metrics.seo.score,
      bestPractices: metrics.bestPractices.score,
      security: metrics.security.score,
      overall: this.calculateOverallScore(metrics),
    };
  }

  /**
   * Calculate overall quality score
   */
  static calculateOverallScore(metrics: QualityMetrics | BenchmarkMetrics): number {
    if ('performance' in metrics && typeof metrics.performance === 'object') {
      const m = metrics as QualityMetrics;
      return (
        (m.performance.score +
          m.accessibility.score +
          m.seo.score +
          m.bestPractices.score +
          m.security.score) /
        5
      );
    } else {
      const m = metrics as BenchmarkMetrics;
      return (m.performance + m.accessibility + m.seo + m.bestPractices + m.security) / 5;
    }
  }

  /**
   * Create initial benchmark for a client
   */
  static createBenchmark(
    clientId: string,
    clientName: string,
    tier: 'bronze' | 'silver' | 'gold' | 'platinum',
    currentMetrics: QualityMetrics
  ): ClientBenchmark {
    const current = this.toBenchmarkMetrics(currentMetrics);
    const targets = tierTargets[tier];

    return {
      clientId,
      clientName,
      tier,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      baseline: { ...current },
      targets,
      current,
      history: [
        {
          timestamp: new Date().toISOString(),
          metrics: current,
          notes: 'Initial benchmark',
        },
      ],
      trends: this.analyzeTrends([]),
      recommendations: this.generateRecommendations(current, targets),
    };
  }

  /**
   * Update benchmark with new metrics
   */
  static updateBenchmark(benchmark: ClientBenchmark, newMetrics: QualityMetrics): ClientBenchmark {
    const current = this.toBenchmarkMetrics(newMetrics);

    // Add to history
    const updatedHistory = [
      ...benchmark.history,
      {
        timestamp: new Date().toISOString(),
        metrics: current,
      },
    ];

    // Keep last 100 data points
    if (updatedHistory.length > 100) {
      updatedHistory.shift();
    }

    // Analyze trends
    const trends = this.analyzeTrends(updatedHistory);

    // Generate recommendations
    const recommendations = this.generateRecommendations(current, benchmark.targets);

    return {
      ...benchmark,
      updated: new Date().toISOString(),
      current,
      history: updatedHistory,
      trends,
      recommendations,
    };
  }

  /**
   * Analyze trends from historical data
   */
  static analyzeTrends(history: HistoricalMetrics[]): TrendAnalysis {
    if (history.length < 2) {
      return {
        direction: 'stable',
        velocity: 0,
        confidence: 'low',
        categories: {
          performance: { direction: 'stable', change: 0, significance: 'negligible' },
          accessibility: { direction: 'stable', change: 0, significance: 'negligible' },
          seo: { direction: 'stable', change: 0, significance: 'negligible' },
          bestPractices: { direction: 'stable', change: 0, significance: 'negligible' },
          security: { direction: 'stable', change: 0, significance: 'negligible' },
        },
      };
    }

    const recent = history.slice(-10); // Last 10 measurements
    const categories = ['performance', 'accessibility', 'seo', 'bestPractices', 'security'] as const;

    const categoryTrends = {} as TrendAnalysis['categories'];

    for (const category of categories) {
      const values = recent.map((h) => h.metrics[category]);
      const trend = this.calculateTrend(values);
      categoryTrends[category] = trend;
    }

    // Overall trend
    const overallChanges = Object.values(categoryTrends).map((t) => t.change);
    const avgChange = overallChanges.reduce((sum, c) => sum + c, 0) / overallChanges.length;
    const direction = avgChange > 1 ? 'improving' : avgChange < -1 ? 'declining' : 'stable';

    // Calculate velocity (change per week)
    const timeSpan = this.getTimeSpanInWeeks(recent[0].timestamp, recent[recent.length - 1].timestamp);
    const velocity = timeSpan > 0 ? avgChange / timeSpan : 0;

    // Confidence based on data points and consistency
    const confidence = history.length >= 10 ? 'high' : history.length >= 5 ? 'medium' : 'low';

    return {
      direction,
      velocity,
      confidence,
      categories: categoryTrends,
    };
  }

  /**
   * Calculate trend for a series of values
   */
  private static calculateTrend(values: number[]): TrendDirection {
    if (values.length < 2) {
      return { direction: 'stable', change: 0, significance: 'negligible' };
    }

    const first = values[0];
    const last = values[values.length - 1];
    const change = ((last - first) / first) * 100;

    const direction = change > 1 ? 'up' : change < -1 ? 'down' : 'stable';
    const absChange = Math.abs(change);
    const significance =
      absChange >= 10 ? 'major' : absChange >= 5 ? 'moderate' : absChange >= 2 ? 'minor' : 'negligible';

    return { direction, change, significance };
  }

  /**
   * Get time span in weeks between two timestamps
   */
  private static getTimeSpanInWeeks(start: string, end: string): number {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const diffMs = endDate - startDate;
    return diffMs / (1000 * 60 * 60 * 24 * 7);
  }

  /**
   * Generate recommendations based on current vs target
   */
  static generateRecommendations(current: BenchmarkMetrics, target: BenchmarkMetrics): string[] {
    const recommendations: string[] = [];

    const categories = [
      { key: 'performance', name: 'Performance' },
      { key: 'accessibility', name: 'Accessibility' },
      { key: 'seo', name: 'SEO' },
      { key: 'bestPractices', name: 'Best Practices' },
      { key: 'security', name: 'Security' },
    ] as const;

    for (const category of categories) {
      const currentScore = current[category.key];
      const targetScore = target[category.key];
      const gap = targetScore - currentScore;

      if (gap > 10) {
        recommendations.push(
          `🔴 ${category.name}: Critical gap of ${gap.toFixed(0)} points - immediate action required`
        );
      } else if (gap > 5) {
        recommendations.push(
          `🟡 ${category.name}: Moderate gap of ${gap.toFixed(0)} points - needs improvement`
        );
      } else if (gap > 0) {
        recommendations.push(
          `🟢 ${category.name}: Minor gap of ${gap.toFixed(0)} points - minor optimizations needed`
        );
      } else {
        recommendations.push(`✅ ${category.name}: Target achieved (${currentScore.toFixed(0)})`);
      }
    }

    return recommendations;
  }

  /**
   * Compare client against various benchmarks
   */
  static compare(
    client: ClientBenchmark,
    industry?: string
  ): BenchmarkComparison {
    const current = client.current;

    return {
      client: client.clientName,
      vsBaseline: this.compareMetrics(current, client.baseline),
      vsTarget: this.compareMetrics(current, client.targets),
      vsIndustry: industry
        ? this.compareMetrics(current, industryBenchmarks[industry] || industryBenchmarks.marketing)
        : this.compareMetrics(current, { ...current, overall: current.overall }),
      vsTier: this.compareMetrics(current, tierTargets[client.tier]),
    };
  }

  /**
   * Compare two sets of metrics
   */
  private static compareMetrics(current: BenchmarkMetrics, reference: BenchmarkMetrics): ComparisonResult {
    const difference = current.overall - reference.overall;
    const percentage = reference.overall > 0 ? (difference / reference.overall) * 100 : 0;
    const status = difference > 1 ? 'above' : difference < -1 ? 'below' : 'at';

    const categories: Record<string, number> = {
      performance: current.performance - reference.performance,
      accessibility: current.accessibility - reference.accessibility,
      seo: current.seo - reference.seo,
      bestPractices: current.bestPractices - reference.bestPractices,
      security: current.security - reference.security,
    };

    return { difference, percentage, status, categories };
  }

  /**
   * Generate benchmark report
   */
  static generateReport(benchmark: ClientBenchmark): string {
    const lines: string[] = [];

    lines.push(`Client Benchmark Report: ${benchmark.clientName}`);
    lines.push('='.repeat(60));
    lines.push('');
    lines.push(`Client ID: ${benchmark.clientId}`);
    lines.push(`Tier: ${benchmark.tier.toUpperCase()}`);
    lines.push(`Created: ${new Date(benchmark.created).toLocaleDateString()}`);
    lines.push(`Updated: ${new Date(benchmark.updated).toLocaleDateString()}`);
    lines.push('');

    lines.push('Current Scores:');
    lines.push(`  Overall: ${benchmark.current.overall.toFixed(1)}`);
    lines.push(`  Performance: ${benchmark.current.performance.toFixed(0)}`);
    lines.push(`  Accessibility: ${benchmark.current.accessibility.toFixed(0)}`);
    lines.push(`  SEO: ${benchmark.current.seo.toFixed(0)}`);
    lines.push(`  Best Practices: ${benchmark.current.bestPractices.toFixed(0)}`);
    lines.push(`  Security: ${benchmark.current.security.toFixed(0)}`);
    lines.push('');

    lines.push('Trend Analysis:');
    lines.push(`  Direction: ${benchmark.trends.direction.toUpperCase()}`);
    lines.push(`  Velocity: ${benchmark.trends.velocity.toFixed(2)} points/week`);
    lines.push(`  Confidence: ${benchmark.trends.confidence.toUpperCase()}`);
    lines.push('');

    lines.push('Recommendations:');
    for (const rec of benchmark.recommendations) {
      lines.push(`  ${rec}`);
    }

    return lines.join('\n');
  }

  /**
   * Generate multi-client comparison
   */
  static compareClients(benchmarks: ClientBenchmark[]): string {
    const lines: string[] = [];

    lines.push('Multi-Client Benchmark Comparison');
    lines.push('='.repeat(80));
    lines.push('');

    // Sort by overall score
    const sorted = [...benchmarks].sort((a, b) => b.current.overall - a.current.overall);

    lines.push(
      `${'Client'.padEnd(25)} ${'Tier'.padEnd(10)} ${'Overall'.padEnd(10)} ${'Trend'.padEnd(12)} Status`
    );
    lines.push('-'.repeat(80));

    for (const benchmark of sorted) {
      const trendIcon =
        benchmark.trends.direction === 'improving' ? '📈' : benchmark.trends.direction === 'declining' ? '📉' : '➡️';
      const status =
        benchmark.current.overall >= benchmark.targets.overall
          ? '✅ On Target'
          : benchmark.current.overall >= benchmark.targets.overall * 0.9
          ? '🟡 Close'
          : '🔴 Below';

      lines.push(
        `${benchmark.clientName.padEnd(25)} ${benchmark.tier.padEnd(10)} ${benchmark.current.overall
          .toFixed(1)
          .padEnd(10)} ${(trendIcon + ' ' + benchmark.trends.direction).padEnd(12)} ${status}`
      );
    }

    return lines.join('\n');
  }
}

/**
 * CLI entry point
 */
export async function main() {
  const args = process.argv.slice(2);

  // Example usage
  const mockMetrics: QualityMetrics = {
    siteId: 'client-1',
    timestamp: Date.now(),
    performance: { score: 78, fcp: 1400, lcp: 2300, cls: 0.09, tti: 3200, tbt: 250, speedIndex: 2100, loadTime: 2600 },
    accessibility: { score: 88, violations: 3, criticalIssues: 0, moderateIssues: 2, minorIssues: 1, wcagLevel: 'AA' },
    seo: { score: 85, metaTags: true, structuredData: true, mobileOptimized: true, indexable: true, sitemap: true, robotsTxt: true },
    bestPractices: { score: 80, https: true, modernApis: true, deprecatedApis: 1, consoleErrors: 2, imageDimensions: true },
    security: { score: 90, contentSecurityPolicy: true, xssProtection: true, secureHeaders: 7, vulnerabilities: 0, certificateValid: true },
  };

  const benchmark = BenchmarkAnalyzer.createBenchmark('client-1', 'Example Client', 'gold', mockMetrics);
  const report = BenchmarkAnalyzer.generateReport(benchmark);

  console.log(report);
  console.log('\n');

  // Comparison
  const comparison = BenchmarkAnalyzer.compare(benchmark, 'marketing');
  console.log('Comparison Results:');
  console.log(`  vs Target: ${comparison.vsTarget.status} (${comparison.vsTarget.difference.toFixed(1)} points)`);
  console.log(`  vs Industry: ${comparison.vsIndustry.status} (${comparison.vsIndustry.difference.toFixed(1)} points)`);
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}
