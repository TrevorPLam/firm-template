/**
 * Quality Score Calculator
 * Calculates comprehensive quality scores with weighted categories
 */

import type { QualityMetrics } from '../monitor-quality';

export interface ScoreWeights {
  performance: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
  security: number;
}

export interface DetailedScore {
  overall: number;
  weighted: number;
  breakdown: ScoreBreakdown;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
}

export interface ScoreBreakdown {
  performance: CategoryScore;
  accessibility: CategoryScore;
  seo: CategoryScore;
  bestPractices: CategoryScore;
  security: CategoryScore;
}

export interface CategoryScore {
  score: number;
  weight: number;
  weightedScore: number;
  grade: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  details?: Record<string, any>;
}

/**
 * Default weight configuration
 */
export const defaultWeights: ScoreWeights = {
  performance: 0.25, // 25%
  accessibility: 0.25, // 25%
  seo: 0.20, // 20%
  bestPractices: 0.15, // 15%
  security: 0.15, // 15%
};

/**
 * Tier-specific weight configurations
 */
export const tierWeights: Record<string, ScoreWeights> = {
  bronze: {
    performance: 0.20,
    accessibility: 0.25,
    seo: 0.20,
    bestPractices: 0.15,
    security: 0.20,
  },
  silver: {
    performance: 0.25,
    accessibility: 0.25,
    seo: 0.20,
    bestPractices: 0.15,
    security: 0.15,
  },
  gold: {
    performance: 0.25,
    accessibility: 0.25,
    seo: 0.20,
    bestPractices: 0.15,
    security: 0.15,
  },
  platinum: {
    performance: 0.30,
    accessibility: 0.25,
    seo: 0.15,
    bestPractices: 0.15,
    security: 0.15,
  },
};

/**
 * Industry-specific weight configurations
 */
export const industryWeights: Record<string, ScoreWeights> = {
  ecommerce: {
    performance: 0.30,
    accessibility: 0.20,
    seo: 0.25,
    bestPractices: 0.10,
    security: 0.15,
  },
  saas: {
    performance: 0.25,
    accessibility: 0.25,
    seo: 0.15,
    bestPractices: 0.20,
    security: 0.15,
  },
  content: {
    performance: 0.25,
    accessibility: 0.25,
    seo: 0.30,
    bestPractices: 0.10,
    security: 0.10,
  },
  healthcare: {
    performance: 0.20,
    accessibility: 0.30,
    seo: 0.15,
    bestPractices: 0.15,
    security: 0.20,
  },
  finance: {
    performance: 0.25,
    accessibility: 0.20,
    seo: 0.15,
    bestPractices: 0.15,
    security: 0.25,
  },
};

export class ScoreCalculator {
  private weights: ScoreWeights;

  constructor(weights: ScoreWeights = defaultWeights) {
    this.weights = this.normalizeWeights(weights);
  }

  /**
   * Normalize weights to sum to 1.0
   */
  private normalizeWeights(weights: ScoreWeights): ScoreWeights {
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (total === 0) return defaultWeights;

    return {
      performance: weights.performance / total,
      accessibility: weights.accessibility / total,
      seo: weights.seo / total,
      bestPractices: weights.bestPractices / total,
      security: weights.security / total,
    };
  }

  /**
   * Calculate detailed score from metrics
   */
  calculate(metrics: QualityMetrics): DetailedScore {
    const breakdown: ScoreBreakdown = {
      performance: this.calculateCategoryScore(
        'performance',
        metrics.performance.score,
        this.weights.performance,
        {
          fcp: metrics.performance.fcp,
          lcp: metrics.performance.lcp,
          cls: metrics.performance.cls,
          tti: metrics.performance.tti,
        }
      ),
      accessibility: this.calculateCategoryScore(
        'accessibility',
        metrics.accessibility.score,
        this.weights.accessibility,
        {
          violations: metrics.accessibility.violations,
          criticalIssues: metrics.accessibility.criticalIssues,
          wcagLevel: metrics.accessibility.wcagLevel,
        }
      ),
      seo: this.calculateCategoryScore('seo', metrics.seo.score, this.weights.seo, {
        metaTags: metrics.seo.metaTags,
        structuredData: metrics.seo.structuredData,
        mobileOptimized: metrics.seo.mobileOptimized,
      }),
      bestPractices: this.calculateCategoryScore(
        'bestPractices',
        metrics.bestPractices.score,
        this.weights.bestPractices,
        {
          https: metrics.bestPractices.https,
          deprecatedApis: metrics.bestPractices.deprecatedApis,
        }
      ),
      security: this.calculateCategoryScore('security', metrics.security.score, this.weights.security, {
        vulnerabilities: metrics.security.vulnerabilities,
        certificateValid: metrics.security.certificateValid,
      }),
    };

    // Calculate overall scores
    const overall =
      (breakdown.performance.score +
        breakdown.accessibility.score +
        breakdown.seo.score +
        breakdown.bestPractices.score +
        breakdown.security.score) /
      5;

    const weighted =
      breakdown.performance.weightedScore +
      breakdown.accessibility.weightedScore +
      breakdown.seo.weightedScore +
      breakdown.bestPractices.weightedScore +
      breakdown.security.weightedScore;

    const grade = this.calculateGrade(weighted);
    const status = this.calculateStatus(weighted);

    return {
      overall: Math.round(overall * 10) / 10,
      weighted: Math.round(weighted * 10) / 10,
      breakdown,
      grade,
      status,
    };
  }

  /**
   * Calculate score for a single category
   */
  private calculateCategoryScore(
    category: string,
    score: number,
    weight: number,
    details?: Record<string, any>
  ): CategoryScore {
    const weightedScore = score * weight;
    const grade = this.calculateLetterGrade(score);
    const impact = this.determineImpact(weight);

    return {
      score: Math.round(score * 10) / 10,
      weight: Math.round(weight * 100),
      weightedScore: Math.round(weightedScore * 10) / 10,
      grade,
      impact,
      details,
    };
  }

  /**
   * Calculate letter grade from score
   */
  private calculateLetterGrade(score: number): string {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    if (score >= 55) return 'C-';
    if (score >= 50) return 'D';
    return 'F';
  }

  /**
   * Calculate overall grade
   */
  private calculateGrade(score: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Calculate status
   */
  private calculateStatus(score: number): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Determine impact level based on weight
   */
  private determineImpact(weight: number): 'critical' | 'high' | 'medium' | 'low' {
    if (weight >= 0.25) return 'critical';
    if (weight >= 0.20) return 'high';
    if (weight >= 0.15) return 'medium';
    return 'low';
  }

  /**
   * Compare two scores
   */
  compareScores(current: DetailedScore, previous: DetailedScore): {
    change: number;
    percentage: number;
    improved: boolean;
    categories: Record<string, { change: number; improved: boolean }>;
  } {
    const change = current.weighted - previous.weighted;
    const percentage = previous.weighted > 0 ? (change / previous.weighted) * 100 : 0;
    const improved = change > 0;

    const categories: Record<string, { change: number; improved: boolean }> = {};

    for (const category of ['performance', 'accessibility', 'seo', 'bestPractices', 'security'] as const) {
      const categoryChange = current.breakdown[category].score - previous.breakdown[category].score;
      categories[category] = {
        change: Math.round(categoryChange * 10) / 10,
        improved: categoryChange > 0,
      };
    }

    return {
      change: Math.round(change * 10) / 10,
      percentage: Math.round(percentage * 10) / 10,
      improved,
      categories,
    };
  }

  /**
   * Calculate percentile ranking
   */
  calculatePercentile(score: number, allScores: number[]): number {
    const sorted = [...allScores].sort((a, b) => a - b);
    const index = sorted.findIndex((s) => s >= score);
    if (index === -1) return 100;
    return Math.round((index / sorted.length) * 100);
  }

  /**
   * Get improvement recommendations
   */
  getRecommendations(score: DetailedScore): string[] {
    const recommendations: string[] = [];

    // Sort categories by potential impact (weight) and current score
    const categories = Object.entries(score.breakdown)
      .map(([name, cat]) => ({
        name,
        score: cat.score,
        weight: cat.weight,
        potential: (100 - cat.score) * (cat.weight / 100),
      }))
      .sort((a, b) => b.potential - a.potential);

    for (const category of categories.slice(0, 3)) {
      if (category.score < 90) {
        const impact = category.potential > 5 ? 'High' : category.potential > 2 ? 'Medium' : 'Low';
        recommendations.push(
          `${impact} Priority: Improve ${category.name} from ${category.score.toFixed(0)} (potential +${category.potential.toFixed(1)} points)`
        );
      }
    }

    // Add specific recommendations based on scores
    if (score.breakdown.performance.score < 75) {
      recommendations.push('Performance: Optimize images, minimize JavaScript, enable caching');
    }
    if (score.breakdown.accessibility.score < 85) {
      recommendations.push('Accessibility: Fix ARIA labels, improve keyboard navigation, check color contrast');
    }
    if (score.breakdown.seo.score < 80) {
      recommendations.push('SEO: Add meta tags, implement structured data, optimize mobile experience');
    }
    if (score.breakdown.security.score < 85) {
      recommendations.push('Security: Enable HTTPS, add security headers, patch vulnerabilities');
    }

    return recommendations;
  }

  /**
   * Format score for display
   */
  formatScore(score: DetailedScore): string {
    const lines: string[] = [];

    lines.push(`Overall Score: ${score.weighted.toFixed(1)} (${score.grade}) - ${score.status.toUpperCase()}`);
    lines.push('');
    lines.push('Category Breakdown:');

    const categories = [
      { key: 'performance', name: 'Performance' },
      { key: 'accessibility', name: 'Accessibility' },
      { key: 'seo', name: 'SEO' },
      { key: 'bestPractices', name: 'Best Practices' },
      { key: 'security', name: 'Security' },
    ] as const;

    for (const category of categories) {
      const cat = score.breakdown[category.key];
      lines.push(
        `  ${category.name.padEnd(15)}: ${cat.score
          .toFixed(0)
          .padStart(3)} (${cat.grade.padStart(2)}) - Weight: ${cat.weight}% - Impact: ${cat.impact.toUpperCase()}`
      );
    }

    return lines.join('\n');
  }
}

/**
 * Batch calculate scores for multiple sites
 */
export function batchCalculateScores(
  metricsArray: QualityMetrics[],
  weights: ScoreWeights = defaultWeights
): Map<string, DetailedScore> {
  const calculator = new ScoreCalculator(weights);
  const scores = new Map<string, DetailedScore>();

  for (const metrics of metricsArray) {
    scores.set(metrics.siteId, calculator.calculate(metrics));
  }

  return scores;
}

/**
 * Calculate aggregate statistics
 */
export function calculateAggregateStats(scores: DetailedScore[]): {
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
  distribution: Record<string, number>;
} {
  if (scores.length === 0) {
    return {
      mean: 0,
      median: 0,
      min: 0,
      max: 0,
      stdDev: 0,
      distribution: {},
    };
  }

  const weightedScores = scores.map((s) => s.weighted);
  const sorted = [...weightedScores].sort((a, b) => a - b);

  const mean = weightedScores.reduce((sum, s) => sum + s, 0) / weightedScores.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  // Standard deviation
  const variance = weightedScores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / weightedScores.length;
  const stdDev = Math.sqrt(variance);

  // Distribution
  const distribution: Record<string, number> = {
    'A+ (95-100)': 0,
    'A (90-94)': 0,
    'B (80-89)': 0,
    'C (70-79)': 0,
    'D (60-69)': 0,
    'F (<60)': 0,
  };

  for (const score of weightedScores) {
    if (score >= 95) distribution['A+ (95-100)']++;
    else if (score >= 90) distribution['A (90-94)']++;
    else if (score >= 80) distribution['B (80-89)']++;
    else if (score >= 70) distribution['C (70-79)']++;
    else if (score >= 60) distribution['D (60-69)']++;
    else distribution['F (<60)']++;
  }

  return {
    mean: Math.round(mean * 10) / 10,
    median: Math.round(median * 10) / 10,
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    stdDev: Math.round(stdDev * 10) / 10,
    distribution,
  };
}
