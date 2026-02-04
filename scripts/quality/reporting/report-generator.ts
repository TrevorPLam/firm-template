// AI-META-BEGIN
// 
// AI-META: Build or utility script
// OWNERSHIP: scripts (build/deployment utilities)
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Upstash Redis (rate limiting)
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

/**
 * Report Generation Utilities
 * Creates various quality reports in multiple formats
 */

import * as fs from 'fs';
import * as path from 'path';
import type { QualityMetrics } from '../monitor-quality';
import type { DetailedScore } from './score-calculator';
import { ScoreCalculator, defaultWeights } from './score-calculator';

export interface ReportConfig {
  title: string;
  subtitle?: string;
  period: string;
  format: 'html' | 'markdown' | 'json' | 'csv' | 'pdf';
  includeCharts: boolean;
  includeDetails: boolean;
  includeRecommendations: boolean;
  theme?: 'light' | 'dark';
}

export interface ReportData {
  config: ReportConfig;
  generated: string;
  summary: ReportSummary;
  sites: SiteReport[];
  trends: TrendReport[];
  recommendations: string[];
  metadata: ReportMetadata;
}

export interface ReportSummary {
  totalSites: number;
  averageScore: number;
  scoreDistribution: Record<string, number>;
  topPerformers: Array<{ site: string; score: number }>;
  needsAttention: Array<{ site: string; score: number; reason: string }>;
}

export interface SiteReport {
  siteId: string;
  name: string;
  score: DetailedScore;
  metrics: QualityMetrics;
  status: string;
  recommendations: string[];
}

export interface TrendReport {
  category: string;
  current: number;
  previous?: number;
  change?: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ReportMetadata {
  version: string;
  generatedBy: string;
  dataPoints: number;
  timeRange: string;
}

export class ReportGenerator {
  private calculator: ScoreCalculator;

  constructor(calculator?: ScoreCalculator) {
    this.calculator = calculator || new ScoreCalculator(defaultWeights);
  }

  /**
   * Generate complete report from metrics
   */
  generateReport(metrics: QualityMetrics[], config: ReportConfig): ReportData {
    const scores = metrics.map((m) => ({
      siteId: m.siteId,
      score: this.calculator.calculate(m),
      metrics: m,
    }));

    const summary = this.generateSummary(scores);
    const sites = this.generateSiteReports(scores);
    const trends = this.generateTrends(metrics);
    const recommendations = this.generateOverallRecommendations(scores);

    return {
      config,
      generated: new Date().toISOString(),
      summary,
      sites,
      trends,
      recommendations,
      metadata: {
        version: '1.0.0',
        generatedBy: 'Quality Report Generator',
        dataPoints: metrics.length,
        timeRange: config.period,
      },
    };
  }

  /**
   * Generate summary section
   */
  private generateSummary(
    scores: Array<{ siteId: string; score: DetailedScore; metrics: QualityMetrics }>
  ): ReportSummary {
    const totalSites = scores.length;
    const averageScore =
      scores.reduce((sum, s) => sum + s.score.weighted, 0) / (scores.length || 1);

    const scoreDistribution: Record<string, number> = {
      'Excellent (90+)': 0,
      'Good (75-89)': 0,
      'Needs Improvement (60-74)': 0,
      'Poor (<60)': 0,
    };

    for (const { score } of scores) {
      if (score.weighted >= 90) scoreDistribution['Excellent (90+)']++;
      else if (score.weighted >= 75) scoreDistribution['Good (75-89)']++;
      else if (score.weighted >= 60) scoreDistribution['Needs Improvement (60-74)']++;
      else scoreDistribution['Poor (<60)']++;
    }

    const sorted = [...scores].sort((a, b) => b.score.weighted - a.score.weighted);
    const topPerformers = sorted.slice(0, 5).map((s) => ({
      site: s.siteId,
      score: s.score.weighted,
    }));

    const needsAttention = sorted
      .filter((s) => s.score.weighted < 75)
      .slice(-5)
      .map((s) => ({
        site: s.siteId,
        score: s.score.weighted,
        reason: this.identifyMainIssue(s.score),
      }));

    return {
      totalSites,
      averageScore: Math.round(averageScore * 10) / 10,
      scoreDistribution,
      topPerformers,
      needsAttention,
    };
  }

  /**
   * Generate individual site reports
   */
  private generateSiteReports(
    scores: Array<{ siteId: string; score: DetailedScore; metrics: QualityMetrics }>
  ): SiteReport[] {
    return scores.map(({ siteId, score, metrics }) => ({
      siteId,
      name: siteId,
      score,
      metrics,
      status: score.status,
      recommendations: this.calculator.getRecommendations(score),
    }));
  }

  /**
   * Generate trend reports
   */
  private generateTrends(metrics: QualityMetrics[]): TrendReport[] {
    const categories = ['performance', 'accessibility', 'seo', 'bestPractices', 'security'] as const;

    return categories.map((category) => {
      const scores = metrics.map((m) => (m[category] as any).score);
      const current = scores.length > 0 ? scores[scores.length - 1] : 0;
      const previous = scores.length > 1 ? scores[scores.length - 2] : undefined;
      const change = previous !== undefined ? current - previous : undefined;
      const trend = change !== undefined ? (change > 1 ? 'up' : change < -1 ? 'down' : 'stable') : 'stable';

      return {
        category,
        current: Math.round(current * 10) / 10,
        previous: previous !== undefined ? Math.round(previous * 10) / 10 : undefined,
        change: change !== undefined ? Math.round(change * 10) / 10 : undefined,
        trend,
      };
    });
  }

  /**
   * Generate overall recommendations
   */
  private generateOverallRecommendations(
    scores: Array<{ siteId: string; score: DetailedScore }>
  ): string[] {
    const recommendations: string[] = [];

    // Find common issues across sites
    const categoryScores: Record<string, number[]> = {
      performance: [],
      accessibility: [],
      seo: [],
      bestPractices: [],
      security: [],
    };

    for (const { score } of scores) {
      categoryScores.performance.push(score.breakdown.performance.score);
      categoryScores.accessibility.push(score.breakdown.accessibility.score);
      categoryScores.seo.push(score.breakdown.seo.score);
      categoryScores.bestPractices.push(score.breakdown.bestPractices.score);
      categoryScores.security.push(score.breakdown.security.score);
    }

    // Calculate averages and identify weak areas
    for (const [category, scores] of Object.entries(categoryScores)) {
      const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      if (avg < 75) {
        const sitesBelow70 = scores.filter((s) => s < 70).length;
        recommendations.push(
          `${category.charAt(0).toUpperCase() + category.slice(1)}: Portfolio average ${avg.toFixed(0)}. ${sitesBelow70} sites need immediate attention.`
        );
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('Overall quality is good across all monitored sites.');
    }

    return recommendations;
  }

  /**
   * Identify main issue for a site
   */
  private identifyMainIssue(score: DetailedScore): string {
    const categories = Object.entries(score.breakdown).sort((a, b) => a[1].score - b[1].score);
    const [category, catScore] = categories[0];
    return `Low ${category} score (${catScore.score.toFixed(0)})`;
  }

  /**
   * Export report to HTML
   */
  exportHTML(report: ReportData): string {
    const theme = report.config.theme || 'light';
    const isDark = theme === 'dark';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.config.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      padding: 2rem;
      background: ${isDark ? '#1a1a1a' : '#f8f9fa'};
      color: ${isDark ? '#e0e0e0' : '#333'};
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      background: ${isDark ? '#2a2a2a' : '#fff'};
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .header p { color: ${isDark ? '#999' : '#666'}; }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .card {
      background: ${isDark ? '#2a2a2a' : '#fff'};
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card h3 { font-size: 0.875rem; text-transform: uppercase; color: ${isDark ? '#999' : '#666'}; margin-bottom: 0.5rem; }
    .card .value { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
    .card .label { font-size: 0.875rem; color: ${isDark ? '#999' : '#666'}; }
    .section { margin-bottom: 2rem; }
    .section h2 { margin-bottom: 1rem; }
    table {
      width: 100%;
      background: ${isDark ? '#2a2a2a' : '#fff'};
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    th, td { padding: 1rem; text-align: left; }
    th { background: ${isDark ? '#333' : '#f0f0f0'}; font-weight: 600; }
    tr:not(:last-child) { border-bottom: 1px solid ${isDark ? '#444' : '#e0e0e0'}; }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .badge.excellent { background: #10b981; color: white; }
    .badge.good { background: #3b82f6; color: white; }
    .badge.needs-improvement { background: #f59e0b; color: white; }
    .badge.poor { background: #ef4444; color: white; }
    .recommendations { background: ${isDark ? '#2a2a2a' : '#fff'}; padding: 1.5rem; border-radius: 8px; }
    .recommendations li { margin-bottom: 0.75rem; padding-left: 1.5rem; position: relative; }
    .recommendations li:before { content: '→'; position: absolute; left: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${report.config.title}</h1>
      ${report.config.subtitle ? `<p>${report.config.subtitle}</p>` : ''}
      <p>Period: ${report.config.period} | Generated: ${new Date(report.generated).toLocaleString()}</p>
    </div>

    <div class="summary">
      <div class="card">
        <h3>Total Sites</h3>
        <div class="value">${report.summary.totalSites}</div>
      </div>
      <div class="card">
        <h3>Average Score</h3>
        <div class="value">${report.summary.averageScore.toFixed(1)}</div>
      </div>
      ${Object.entries(report.summary.scoreDistribution)
        .slice(0, 2)
        .map(
          ([label, count]) => `
        <div class="card">
          <h3>${label}</h3>
          <div class="value">${count}</div>
          <div class="label">${((count / report.summary.totalSites) * 100).toFixed(1)}%</div>
        </div>
      `
        )
        .join('')}
    </div>

    ${
      report.summary.topPerformers.length > 0
        ? `
    <div class="section">
      <h2>Top Performers</h2>
      <table>
        <thead>
          <tr>
            <th>Site</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${report.summary.topPerformers
            .map(
              (site) => `
            <tr>
              <td>${site.site}</td>
              <td>${site.score.toFixed(1)}</td>
              <td><span class="badge excellent">Excellent</span></td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
    `
        : ''
    }

    ${
      report.recommendations.length > 0
        ? `
    <div class="section">
      <h2>Recommendations</h2>
      <div class="recommendations">
        <ul>
          ${report.recommendations.map((rec) => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    </div>
    `
        : ''
    }

    <div class="section">
      <p style="text-align: center; color: ${isDark ? '#666' : '#999'}; margin-top: 3rem;">
        Quality Report v${report.metadata.version} | Data points: ${report.metadata.dataPoints}
      </p>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Export report to Markdown
   */
  exportMarkdown(report: ReportData): string {
    const lines: string[] = [];

    lines.push(`# ${report.config.title}`);
    if (report.config.subtitle) {
      lines.push(`## ${report.config.subtitle}`);
    }
    lines.push('');
    lines.push(`**Period**: ${report.config.period}`);
    lines.push(`**Generated**: ${new Date(report.generated).toLocaleString()}`);
    lines.push('');

    lines.push('## Summary');
    lines.push('');
    lines.push(`- **Total Sites**: ${report.summary.totalSites}`);
    lines.push(`- **Average Score**: ${report.summary.averageScore.toFixed(1)}`);
    lines.push('');

    lines.push('### Score Distribution');
    lines.push('');
    for (const [label, count] of Object.entries(report.summary.scoreDistribution)) {
      const pct = ((count / report.summary.totalSites) * 100).toFixed(1);
      lines.push(`- ${label}: ${count} (${pct}%)`);
    }
    lines.push('');

    if (report.summary.topPerformers.length > 0) {
      lines.push('## Top Performers');
      lines.push('');
      lines.push('| Site | Score |');
      lines.push('|------|-------|');
      for (const site of report.summary.topPerformers) {
        lines.push(`| ${site.site} | ${site.score.toFixed(1)} |`);
      }
      lines.push('');
    }

    if (report.recommendations.length > 0) {
      lines.push('## Recommendations');
      lines.push('');
      for (const rec of report.recommendations) {
        lines.push(`- ${rec}`);
      }
      lines.push('');
    }

    lines.push('---');
    lines.push(`*Quality Report v${report.metadata.version} | Data points: ${report.metadata.dataPoints}*`);

    return lines.join('\n');
  }

  /**
   * Export report to JSON
   */
  exportJSON(report: ReportData): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Export report to CSV
   */
  exportCSV(report: ReportData): string {
    const lines: string[] = [];

    // Header
    lines.push('Site ID,Overall Score,Performance,Accessibility,SEO,Best Practices,Security,Status');

    // Data rows
    for (const site of report.sites) {
      const row = [
        site.siteId,
        site.score.weighted.toFixed(1),
        site.score.breakdown.performance.score.toFixed(0),
        site.score.breakdown.accessibility.score.toFixed(0),
        site.score.breakdown.seo.score.toFixed(0),
        site.score.breakdown.bestPractices.score.toFixed(0),
        site.score.breakdown.security.score.toFixed(0),
        site.status,
      ];
      lines.push(row.join(','));
    }

    return lines.join('\n');
  }

  /**
   * Save report to file
   */
  saveReport(report: ReportData, outputPath: string): void {
    let content: string;

    switch (report.config.format) {
      case 'html':
        content = this.exportHTML(report);
        break;
      case 'markdown':
        content = this.exportMarkdown(report);
        break;
      case 'json':
        content = this.exportJSON(report);
        break;
      case 'csv':
        content = this.exportCSV(report);
        break;
      default:
        throw new Error(`Unsupported format: ${report.config.format}`);
    }

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, content);
    console.log(`Report saved to ${outputPath}`);
  }
}
