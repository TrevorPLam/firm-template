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
 * Quality Score Dashboard Generator
 * Creates interactive dashboards and reports for quality metrics
 * 
 * Usage:
 *   npx tsx scripts/quality/quality-dashboard.ts --output ./dashboard.html
 *   npx tsx scripts/quality/quality-dashboard.ts --format json --output ./metrics.json
 */

import * as fs from 'fs';
import * as path from 'path';
import type { QualityMetrics } from './monitor-quality';

export interface DashboardConfig {
  title: string;
  description?: string;
  timeRange: 'day' | 'week' | 'month' | 'quarter' | 'year';
  groupBy?: 'tier' | 'priority' | 'tag';
  includeCharts: boolean;
  includeDetails: boolean;
  theme: 'light' | 'dark';
}

export interface DashboardData {
  generated: string;
  config: DashboardConfig;
  summary: SummaryData;
  sites: SiteData[];
  trends: TrendData[];
  alerts: AlertData[];
}

export interface SummaryData {
  totalSites: number;
  averageScores: {
    overall: number;
    performance: number;
    accessibility: number;
    seo: number;
    bestPractices: number;
    security: number;
  };
  distribution: {
    excellent: number; // 90-100
    good: number; // 70-89
    needsImprovement: number; // 50-69
    poor: number; // 0-49
  };
  trends: {
    improving: number;
    stable: number;
    declining: number;
  };
}

export interface SiteData {
  id: string;
  name: string;
  url: string;
  tier: string;
  overallScore: number;
  scores: {
    performance: number;
    accessibility: number;
    seo: number;
    bestPractices: number;
    security: number;
  };
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

export interface TrendData {
  category: string;
  data: Array<{ date: string; score: number }>;
}

export interface AlertData {
  severity: 'critical' | 'warning' | 'info';
  site: string;
  category: string;
  message: string;
  timestamp: string;
}

export class DashboardGenerator {
  /**
   * Generate dashboard from metrics data
   */
  static generateDashboard(
    metricsData: QualityMetrics[],
    config: DashboardConfig
  ): DashboardData {
    const summary = this.calculateSummary(metricsData);
    const sites = this.processSiteData(metricsData);
    const trends = this.calculateTrends(metricsData);
    const alerts = this.generateAlerts(metricsData);

    return {
      generated: new Date().toISOString(),
      config,
      summary,
      sites,
      trends,
      alerts,
    };
  }

  /**
   * Calculate summary statistics
   */
  private static calculateSummary(metrics: QualityMetrics[]): SummaryData {
    if (metrics.length === 0) {
      return {
        totalSites: 0,
        averageScores: {
          overall: 0,
          performance: 0,
          accessibility: 0,
          seo: 0,
          bestPractices: 0,
          security: 0,
        },
        distribution: { excellent: 0, good: 0, needsImprovement: 0, poor: 0 },
        trends: { improving: 0, stable: 0, declining: 0 },
      };
    }

    const latestMetrics = this.getLatestMetricsPerSite(metrics);
    
    const avgPerformance = this.average(latestMetrics.map((m) => m.performance.score));
    const avgAccessibility = this.average(latestMetrics.map((m) => m.accessibility.score));
    const avgSeo = this.average(latestMetrics.map((m) => m.seo.score));
    const avgBestPractices = this.average(latestMetrics.map((m) => m.bestPractices.score));
    const avgSecurity = this.average(latestMetrics.map((m) => m.security.score));
    const avgOverall = this.average([avgPerformance, avgAccessibility, avgSeo, avgBestPractices, avgSecurity]);

    const distribution = latestMetrics.reduce(
      (acc, m) => {
        const overall = this.calculateOverallScore(m);
        if (overall >= 90) acc.excellent++;
        else if (overall >= 70) acc.good++;
        else if (overall >= 50) acc.needsImprovement++;
        else acc.poor++;
        return acc;
      },
      { excellent: 0, good: 0, needsImprovement: 0, poor: 0 }
    );

    return {
      totalSites: latestMetrics.length,
      averageScores: {
        overall: avgOverall,
        performance: avgPerformance,
        accessibility: avgAccessibility,
        seo: avgSeo,
        bestPractices: avgBestPractices,
        security: avgSecurity,
      },
      distribution,
      trends: { improving: 0, stable: 0, declining: 0 }, // Would calculate from historical data
    };
  }

  /**
   * Process site-level data
   */
  private static processSiteData(metrics: QualityMetrics[]): SiteData[] {
    const latestMetrics = this.getLatestMetricsPerSite(metrics);
    
    return latestMetrics.map((m) => {
      const overallScore = this.calculateOverallScore(m);
      return {
        id: m.siteId,
        name: m.siteId, // Would get from config
        url: '', // Would get from config
        tier: 'gold', // Would get from config
        overallScore,
        scores: {
          performance: m.performance.score,
          accessibility: m.accessibility.score,
          seo: m.seo.score,
          bestPractices: m.bestPractices.score,
          security: m.security.score,
        },
        status: this.getStatus(overallScore),
        lastUpdated: new Date(m.timestamp).toISOString(),
        trend: 'stable', // Would calculate from historical data
      };
    });
  }

  /**
   * Calculate trends over time
   */
  private static calculateTrends(metrics: QualityMetrics[]): TrendData[] {
    const categories = ['performance', 'accessibility', 'seo', 'bestPractices', 'security'];
    
    return categories.map((category) => ({
      category,
      data: this.groupByDate(metrics).map((group) => ({
        date: group.date,
        score: this.average(
          group.metrics.map((m) => (m as any)[category].score)
        ),
      })),
    }));
  }

  /**
   * Generate alerts from metrics
   */
  private static generateAlerts(metrics: QualityMetrics[]): AlertData[] {
    const alerts: AlertData[] = [];
    const latestMetrics = this.getLatestMetricsPerSite(metrics);

    for (const m of latestMetrics) {
      // Check for critical issues
      if (m.performance.score < 50) {
        alerts.push({
          severity: 'critical',
          site: m.siteId,
          category: 'performance',
          message: `Performance score critically low: ${m.performance.score}`,
          timestamp: new Date(m.timestamp).toISOString(),
        });
      }

      if (m.accessibility.criticalIssues > 0) {
        alerts.push({
          severity: 'critical',
          site: m.siteId,
          category: 'accessibility',
          message: `${m.accessibility.criticalIssues} critical accessibility issues found`,
          timestamp: new Date(m.timestamp).toISOString(),
        });
      }

      if (m.security.vulnerabilities > 0) {
        alerts.push({
          severity: 'critical',
          site: m.siteId,
          category: 'security',
          message: `${m.security.vulnerabilities} security vulnerabilities detected`,
          timestamp: new Date(m.timestamp).toISOString(),
        });
      }

      // Check for warnings
      if (m.performance.score < 70) {
        alerts.push({
          severity: 'warning',
          site: m.siteId,
          category: 'performance',
          message: `Performance score below threshold: ${m.performance.score}`,
          timestamp: new Date(m.timestamp).toISOString(),
        });
      }
    }

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  /**
   * Generate HTML dashboard
   */
  static generateHTML(data: DashboardData): string {
    const theme = data.config.theme === 'dark' ? 'dark' : 'light';
    const bgColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
    const textColor = theme === 'dark' ? '#e0e0e0' : '#333333';
    const cardBg = theme === 'dark' ? '#2a2a2a' : '#f5f5f5';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.config.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${bgColor};
      color: ${textColor};
      padding: 2rem;
      line-height: 1.6;
    }
    .header {
      margin-bottom: 3rem;
      border-bottom: 2px solid ${theme === 'dark' ? '#444' : '#ddd'};
      padding-bottom: 1rem;
    }
    .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .header p { color: ${theme === 'dark' ? '#888' : '#666'}; }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    .card {
      background: ${cardBg};
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card h3 { font-size: 0.875rem; text-transform: uppercase; color: ${theme === 'dark' ? '#888' : '#666'}; margin-bottom: 0.5rem; }
    .card .value { font-size: 2.5rem; font-weight: bold; }
    .score { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 4px; font-weight: bold; }
    .score.excellent { background: #10b981; color: white; }
    .score.good { background: #3b82f6; color: white; }
    .score.needs-improvement { background: #f59e0b; color: white; }
    .score.poor { background: #ef4444; color: white; }
    .sites-table {
      width: 100%;
      border-collapse: collapse;
      background: ${cardBg};
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 3rem;
    }
    .sites-table th, .sites-table td { padding: 1rem; text-align: left; }
    .sites-table th { background: ${theme === 'dark' ? '#333' : '#e5e5e5'}; font-weight: 600; }
    .sites-table tr:not(:last-child) { border-bottom: 1px solid ${theme === 'dark' ? '#444' : '#ddd'}; }
    .sites-table tr:hover { background: ${theme === 'dark' ? '#333' : '#f0f0f0'}; }
    .alerts {
      background: ${cardBg};
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 3rem;
    }
    .alert {
      padding: 1rem;
      margin-bottom: 0.75rem;
      border-radius: 4px;
      border-left: 4px solid;
    }
    .alert.critical { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; }
    .alert.warning { background: rgba(245, 158, 11, 0.1); border-color: #f59e0b; }
    .alert.info { background: rgba(59, 130, 246, 0.1); border-color: #3b82f6; }
    .alert-header { font-weight: bold; margin-bottom: 0.25rem; }
    .footer { text-align: center; color: ${theme === 'dark' ? '#888' : '#666'}; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid ${theme === 'dark' ? '#444' : '#ddd'}; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${data.config.title}</h1>
    ${data.config.description ? `<p>${data.config.description}</p>` : ''}
    <p>Generated: ${new Date(data.generated).toLocaleString()}</p>
  </div>

  <div class="summary">
    <div class="card">
      <h3>Total Sites</h3>
      <div class="value">${data.summary.totalSites}</div>
    </div>
    <div class="card">
      <h3>Overall Score</h3>
      <div class="value">${Math.round(data.summary.averageScores.overall)}</div>
    </div>
    <div class="card">
      <h3>Performance</h3>
      <div class="value">${Math.round(data.summary.averageScores.performance)}</div>
    </div>
    <div class="card">
      <h3>Accessibility</h3>
      <div class="value">${Math.round(data.summary.averageScores.accessibility)}</div>
    </div>
    <div class="card">
      <h3>SEO</h3>
      <div class="value">${Math.round(data.summary.averageScores.seo)}</div>
    </div>
    <div class="card">
      <h3>Security</h3>
      <div class="value">${Math.round(data.summary.averageScores.security)}</div>
    </div>
  </div>

  ${data.alerts.length > 0 ? `
  <div class="alerts">
    <h2 style="margin-bottom: 1rem;">Alerts</h2>
    ${data.alerts.slice(0, 10).map(alert => `
      <div class="alert ${alert.severity}">
        <div class="alert-header">${alert.severity.toUpperCase()}: ${alert.category}</div>
        <div>${alert.site} - ${alert.message}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div style="background: ${cardBg}; padding: 1.5rem; border-radius: 8px;">
    <h2 style="margin-bottom: 1rem;">Sites Overview</h2>
    <table class="sites-table">
      <thead>
        <tr>
          <th>Site</th>
          <th>Overall</th>
          <th>Performance</th>
          <th>Accessibility</th>
          <th>SEO</th>
          <th>Best Practices</th>
          <th>Security</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${data.sites.map(site => `
          <tr>
            <td><strong>${site.name}</strong></td>
            <td>${Math.round(site.overallScore)}</td>
            <td>${Math.round(site.scores.performance)}</td>
            <td>${Math.round(site.scores.accessibility)}</td>
            <td>${Math.round(site.scores.seo)}</td>
            <td>${Math.round(site.scores.bestPractices)}</td>
            <td>${Math.round(site.scores.security)}</td>
            <td><span class="score ${site.status}">${site.status.replace('-', ' ')}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>Quality Dashboard - Built with ❤️ for multi-tenant monitoring</p>
  </div>
</body>
</html>`;
  }

  /**
   * Helper: Get latest metrics per site
   */
  private static getLatestMetricsPerSite(metrics: QualityMetrics[]): QualityMetrics[] {
    const latestMap = new Map<string, QualityMetrics>();
    
    for (const m of metrics) {
      const existing = latestMap.get(m.siteId);
      if (!existing || m.timestamp > existing.timestamp) {
        latestMap.set(m.siteId, m);
      }
    }
    
    return Array.from(latestMap.values());
  }

  /**
   * Helper: Calculate overall score
   */
  private static calculateOverallScore(metrics: QualityMetrics): number {
    return this.average([
      metrics.performance.score,
      metrics.accessibility.score,
      metrics.seo.score,
      metrics.bestPractices.score,
      metrics.security.score,
    ]);
  }

  /**
   * Helper: Get status from score
   */
  private static getStatus(score: number): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Helper: Calculate average
   */
  private static average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  /**
   * Helper: Group metrics by date
   */
  private static groupByDate(metrics: QualityMetrics[]): Array<{ date: string; metrics: QualityMetrics[] }> {
    const groups = new Map<string, QualityMetrics[]>();
    
    for (const m of metrics) {
      const date = new Date(m.timestamp).toISOString().split('T')[0];
      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)!.push(m);
    }
    
    return Array.from(groups.entries())
      .map(([date, metrics]) => ({ date, metrics }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}

/**
 * CLI entry point
 */
export async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  const outputIndex = args.indexOf('--output');
  const outputPath = outputIndex >= 0 && args[outputIndex + 1] ? args[outputIndex + 1] : './dashboard.html';
  
  const formatIndex = args.indexOf('--format');
  const format = formatIndex >= 0 && args[formatIndex + 1] ? args[formatIndex + 1] : 'html';

  // Load metrics data (in production, from database or files)
  const metricsData: QualityMetrics[] = []; // Load from storage

  const config: DashboardConfig = {
    title: 'Quality Assurance Dashboard',
    description: 'Multi-tenant quality monitoring and reporting',
    timeRange: 'week',
    includeCharts: true,
    includeDetails: true,
    theme: 'light',
  };

  const dashboard = DashboardGenerator.generateDashboard(metricsData, config);

  // Output based on format
  if (format === 'json') {
    fs.writeFileSync(outputPath, JSON.stringify(dashboard, null, 2));
  } else {
    const html = DashboardGenerator.generateHTML(dashboard);
    fs.writeFileSync(outputPath, html);
  }

  console.log(`Dashboard generated: ${outputPath}`);
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}
