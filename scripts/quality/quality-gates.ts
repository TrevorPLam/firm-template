#!/usr/bin/env node
/**
 * Automated Quality Gate Enforcement
 * Enforces quality standards and gates for deployments
 * 
 * Usage:
 *   npx tsx scripts/quality/quality-gates.ts --check site-id
 *   npx tsx scripts/quality/quality-gates.ts --enforce --config gates-config.json
 */

import type { QualityMetrics } from './monitor-quality';

export interface QualityGate {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rules: QualityRule[];
  actions: GateAction[];
}

export interface QualityRule {
  metric: string;
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
  threshold: number;
  weight: number; // 1-10, importance of this rule
  category: 'performance' | 'accessibility' | 'seo' | 'bestPractices' | 'security';
}

export interface GateAction {
  type: 'block' | 'warn' | 'notify' | 'log';
  message: string;
  recipients?: string[];
}

export interface GateResult {
  passed: boolean;
  gate: string;
  score: number;
  failedRules: FailedRule[];
  warnings: string[];
  actions: string[];
  timestamp: string;
}

export interface FailedRule {
  rule: QualityRule;
  actualValue: number;
  message: string;
}

export interface GateConfig {
  gates: QualityGate[];
  enforcement: {
    blockOnFailure: boolean;
    requireAllGates: boolean;
    allowOverride: boolean;
  };
  notifications: {
    enabled: boolean;
    channels: string[];
  };
}

/**
 * Quality gate presets for different environments
 */
export const standardGates: QualityGate[] = [
  {
    id: 'production-gate',
    name: 'Production Deployment Gate',
    description: 'Strict requirements for production deployments',
    enabled: true,
    rules: [
      {
        metric: 'performance.score',
        operator: 'gte',
        threshold: 80,
        weight: 10,
        category: 'performance',
      },
      {
        metric: 'accessibility.score',
        operator: 'gte',
        threshold: 90,
        weight: 10,
        category: 'accessibility',
      },
      {
        metric: 'accessibility.criticalIssues',
        operator: 'eq',
        threshold: 0,
        weight: 10,
        category: 'accessibility',
      },
      {
        metric: 'seo.score',
        operator: 'gte',
        threshold: 85,
        weight: 8,
        category: 'seo',
      },
      {
        metric: 'security.score',
        operator: 'gte',
        threshold: 90,
        weight: 10,
        category: 'security',
      },
      {
        metric: 'security.vulnerabilities',
        operator: 'eq',
        threshold: 0,
        weight: 10,
        category: 'security',
      },
      {
        metric: 'bestPractices.score',
        operator: 'gte',
        threshold: 80,
        weight: 7,
        category: 'bestPractices',
      },
    ],
    actions: [
      {
        type: 'block',
        message: 'Deployment blocked: Quality standards not met',
      },
      {
        type: 'notify',
        message: 'Production gate failed - review required',
        recipients: ['devops@example.com'],
      },
    ],
  },
  {
    id: 'staging-gate',
    name: 'Staging Deployment Gate',
    description: 'Moderate requirements for staging deployments',
    enabled: true,
    rules: [
      {
        metric: 'performance.score',
        operator: 'gte',
        threshold: 70,
        weight: 8,
        category: 'performance',
      },
      {
        metric: 'accessibility.score',
        operator: 'gte',
        threshold: 80,
        weight: 8,
        category: 'accessibility',
      },
      {
        metric: 'security.vulnerabilities',
        operator: 'lte',
        threshold: 2,
        weight: 9,
        category: 'security',
      },
    ],
    actions: [
      {
        type: 'warn',
        message: 'Staging deployment has quality warnings',
      },
    ],
  },
  {
    id: 'development-gate',
    name: 'Development Gate',
    description: 'Basic quality checks for development',
    enabled: true,
    rules: [
      {
        metric: 'performance.score',
        operator: 'gte',
        threshold: 50,
        weight: 5,
        category: 'performance',
      },
      {
        metric: 'accessibility.criticalIssues',
        operator: 'lte',
        threshold: 5,
        weight: 6,
        category: 'accessibility',
      },
    ],
    actions: [
      {
        type: 'log',
        message: 'Development gate check completed',
      },
    ],
  },
];

/**
 * Client tier-based gates
 */
export const tierGates: Record<string, QualityGate> = {
  platinum: {
    id: 'platinum-tier',
    name: 'Platinum Tier Standards',
    description: 'Highest quality standards for premium clients',
    enabled: true,
    rules: [
      {
        metric: 'performance.score',
        operator: 'gte',
        threshold: 90,
        weight: 10,
        category: 'performance',
      },
      {
        metric: 'accessibility.score',
        operator: 'gte',
        threshold: 95,
        weight: 10,
        category: 'accessibility',
      },
      {
        metric: 'seo.score',
        operator: 'gte',
        threshold: 90,
        weight: 9,
        category: 'seo',
      },
      {
        metric: 'security.score',
        operator: 'gte',
        threshold: 95,
        weight: 10,
        category: 'security',
      },
    ],
    actions: [
      {
        type: 'block',
        message: 'Platinum tier standards not met',
      },
    ],
  },
  gold: {
    id: 'gold-tier',
    name: 'Gold Tier Standards',
    description: 'High quality standards',
    enabled: true,
    rules: [
      {
        metric: 'performance.score',
        operator: 'gte',
        threshold: 80,
        weight: 9,
        category: 'performance',
      },
      {
        metric: 'accessibility.score',
        operator: 'gte',
        threshold: 90,
        weight: 9,
        category: 'accessibility',
      },
      {
        metric: 'security.score',
        operator: 'gte',
        threshold: 85,
        weight: 9,
        category: 'security',
      },
    ],
    actions: [
      {
        type: 'warn',
        message: 'Gold tier standards not fully met',
      },
    ],
  },
  silver: {
    id: 'silver-tier',
    name: 'Silver Tier Standards',
    description: 'Standard quality requirements',
    enabled: true,
    rules: [
      {
        metric: 'performance.score',
        operator: 'gte',
        threshold: 70,
        weight: 7,
        category: 'performance',
      },
      {
        metric: 'accessibility.score',
        operator: 'gte',
        threshold: 80,
        weight: 8,
        category: 'accessibility',
      },
    ],
    actions: [
      {
        type: 'warn',
        message: 'Silver tier standards not met',
      },
    ],
  },
  bronze: {
    id: 'bronze-tier',
    name: 'Bronze Tier Standards',
    description: 'Minimum quality requirements',
    enabled: true,
    rules: [
      {
        metric: 'performance.score',
        operator: 'gte',
        threshold: 60,
        weight: 5,
        category: 'performance',
      },
      {
        metric: 'accessibility.criticalIssues',
        operator: 'lte',
        threshold: 3,
        weight: 7,
        category: 'accessibility',
      },
    ],
    actions: [
      {
        type: 'log',
        message: 'Bronze tier check completed',
      },
    ],
  },
};

export class QualityGateEnforcer {
  private config: GateConfig;

  constructor(config: GateConfig) {
    this.config = config;
  }

  /**
   * Evaluate quality metrics against a gate
   */
  evaluateGate(gate: QualityGate, metrics: QualityMetrics): GateResult {
    const failedRules: FailedRule[] = [];
    const warnings: string[] = [];
    let totalWeight = 0;
    let passedWeight = 0;

    for (const rule of gate.rules) {
      totalWeight += rule.weight;
      const actualValue = this.getMetricValue(metrics, rule.metric);
      const passed = this.evaluateRule(rule, actualValue);

      if (passed) {
        passedWeight += rule.weight;
      } else {
        failedRules.push({
          rule,
          actualValue,
          message: this.formatRuleFailure(rule, actualValue),
        });
      }
    }

    const score = totalWeight > 0 ? (passedWeight / totalWeight) * 100 : 0;
    const passed = failedRules.length === 0;

    const actions = passed
      ? [`✓ ${gate.name} passed`]
      : gate.actions.map((a) => `${a.type.toUpperCase()}: ${a.message}`);

    return {
      passed,
      gate: gate.name,
      score: Math.round(score),
      failedRules,
      warnings,
      actions,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Evaluate a single rule
   */
  private evaluateRule(rule: QualityRule, actualValue: number): boolean {
    switch (rule.operator) {
      case 'gt':
        return actualValue > rule.threshold;
      case 'gte':
        return actualValue >= rule.threshold;
      case 'lt':
        return actualValue < rule.threshold;
      case 'lte':
        return actualValue <= rule.threshold;
      case 'eq':
        return actualValue === rule.threshold;
      default:
        return false;
    }
  }

  /**
   * Get metric value from nested object
   */
  private getMetricValue(metrics: QualityMetrics, path: string): number {
    const keys = path.split('.');
    let value: any = metrics;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return 0;
    }

    return typeof value === 'number' ? value : 0;
  }

  /**
   * Format rule failure message
   */
  private formatRuleFailure(rule: QualityRule, actualValue: number): string {
    const operatorText = {
      gt: 'greater than',
      gte: 'at least',
      lt: 'less than',
      lte: 'at most',
      eq: 'equal to',
    };

    return `${rule.metric} is ${actualValue}, expected ${operatorText[rule.operator]} ${rule.threshold}`;
  }

  /**
   * Evaluate all configured gates
   */
  evaluateAllGates(metrics: QualityMetrics): GateResult[] {
    const results: GateResult[] = [];

    for (const gate of this.config.gates) {
      if (gate.enabled) {
        const result = this.evaluateGate(gate, metrics);
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Check if deployment should be allowed
   */
  canDeploy(results: GateResult[]): { allowed: boolean; reason?: string } {
    if (!this.config.enforcement.blockOnFailure) {
      return { allowed: true, reason: 'Enforcement disabled' };
    }

    const failedGates = results.filter((r) => !r.passed);

    if (this.config.enforcement.requireAllGates && failedGates.length > 0) {
      return {
        allowed: false,
        reason: `${failedGates.length} gate(s) failed: ${failedGates.map((g) => g.gate).join(', ')}`,
      };
    }

    // Check for blocking actions
    const blockingFailures = failedGates.filter((r) =>
      this.config.gates
        .find((g) => g.name === r.gate)
        ?.actions.some((a) => a.type === 'block')
    );

    if (blockingFailures.length > 0) {
      return {
        allowed: false,
        reason: `Blocking failures: ${blockingFailures.map((g) => g.gate).join(', ')}`,
      };
    }

    return { allowed: true };
  }

  /**
   * Generate detailed report
   */
  generateReport(results: GateResult[]): string {
    const lines: string[] = [];
    lines.push('Quality Gate Evaluation Report');
    lines.push('='.repeat(60));
    lines.push('');

    const passed = results.filter((r) => r.passed).length;
    const failed = results.length - passed;

    lines.push(`Summary: ${passed}/${results.length} gates passed`);
    lines.push('');

    for (const result of results) {
      const status = result.passed ? '✓ PASS' : '✗ FAIL';
      lines.push(`${status} - ${result.gate} (Score: ${result.score}%)`);

      if (result.failedRules.length > 0) {
        lines.push('  Failed Rules:');
        for (const failure of result.failedRules) {
          lines.push(`    - ${failure.message}`);
        }
      }

      if (result.actions.length > 0) {
        lines.push('  Actions:');
        for (const action of result.actions) {
          lines.push(`    - ${action}`);
        }
      }

      lines.push('');
    }

    const deployment = this.canDeploy(results);
    lines.push('Deployment Decision:');
    lines.push(`  ${deployment.allowed ? '✓ ALLOWED' : '✗ BLOCKED'}`);
    if (deployment.reason) {
      lines.push(`  Reason: ${deployment.reason}`);
    }

    return lines.join('\n');
  }
}

/**
 * CLI entry point
 */
export async function main() {
  const args = process.argv.slice(2);

  const defaultConfig: GateConfig = {
    gates: standardGates,
    enforcement: {
      blockOnFailure: true,
      requireAllGates: false,
      allowOverride: false,
    },
    notifications: {
      enabled: true,
      channels: ['email'],
    },
  };

  // Mock metrics for testing
  const mockMetrics: QualityMetrics = {
    siteId: 'test-site',
    timestamp: Date.now(),
    performance: {
      score: 75,
      fcp: 1500,
      lcp: 2500,
      cls: 0.1,
      tti: 3500,
      tbt: 300,
      speedIndex: 2200,
      loadTime: 2800,
    },
    accessibility: {
      score: 85,
      violations: 5,
      criticalIssues: 0,
      moderateIssues: 3,
      minorIssues: 2,
      wcagLevel: 'AA',
    },
    seo: {
      score: 80,
      metaTags: true,
      structuredData: true,
      mobileOptimized: true,
      indexable: true,
      sitemap: true,
      robotsTxt: true,
    },
    bestPractices: {
      score: 75,
      https: true,
      modernApis: true,
      deprecatedApis: 2,
      consoleErrors: 3,
      imageDimensions: true,
    },
    security: {
      score: 85,
      contentSecurityPolicy: true,
      xssProtection: true,
      secureHeaders: 6,
      vulnerabilities: 0,
      certificateValid: true,
    },
  };

  const enforcer = new QualityGateEnforcer(defaultConfig);
  const results = enforcer.evaluateAllGates(mockMetrics);
  const report = enforcer.generateReport(results);

  console.log(report);

  // Exit with appropriate code
  const deployment = enforcer.canDeploy(results);
  process.exit(deployment.allowed ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}
