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
 * Client Success Types
 * 
 * Type definitions for client health monitoring and success metrics
 */

/**
 * Client health status levels
 */
export enum HealthStatus {
  EXCELLENT = 'excellent',   // 90-100 score
  GOOD = 'good',             // 70-89 score
  WARNING = 'warning',       // 50-69 score
  CRITICAL = 'critical',     // 0-49 score
}

/**
 * Client health metrics
 */
export interface ClientHealthMetrics {
  clientId: string;
  clientName: string;
  overallScore: number;  // 0-100
  status: HealthStatus;
  
  // Performance metrics
  performance: {
    uptime: number;          // Percentage (0-100)
    avgResponseTime: number; // milliseconds
    errorRate: number;       // Percentage (0-100)
    availability: number;    // Percentage (0-100)
  };
  
  // Engagement metrics
  engagement: {
    activeUsers: number;
    dailyActiveUsers: number;
    monthlyActiveUsers: number;
    sessionDuration: number;  // minutes
    conversionRate: number;   // Percentage (0-100)
  };
  
  // Business metrics
  business: {
    revenue: number;
    growth: number;           // Percentage (-100 to +infinity)
    churnRisk: number;        // Percentage (0-100)
    lifetimeValue: number;
    satisfaction: number;     // 0-10
  };
  
  // Technical health
  technical: {
    coreWebVitals: {
      lcp: number;  // Largest Contentful Paint (ms)
      fid: number;  // First Input Delay (ms)
      cls: number;  // Cumulative Layout Shift
    };
    securityScore: number;    // 0-100
    seoScore: number;         // 0-100
    accessibilityScore: number; // 0-100
  };
  
  // Timestamps
  lastUpdated: Date;
  lastIncident?: Date;
  nextReview: Date;
}

/**
 * Alert configuration
 */
export interface AlertConfig {
  type: 'email' | 'slack' | 'webhook';
  enabled: boolean;
  threshold: number;
  recipients?: string[];
  webhookUrl?: string;
  slackChannel?: string;
}

/**
 * Client alert
 */
export interface ClientAlert {
  id: string;
  clientId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  details?: Record<string, any>;
  createdAt: Date;
  resolvedAt?: Date;
  status: 'active' | 'resolved' | 'acknowledged';
}

/**
 * Success metrics over time
 */
export interface MetricTimeSeries {
  clientId: string;
  metric: string;
  dataPoints: Array<{
    timestamp: Date;
    value: number;
  }>;
}

/**
 * Client benchmark data
 */
export interface ClientBenchmark {
  clientId: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  metrics: {
    metric: string;
    clientValue: number;
    industryAverage: number;
    percentile: number;  // 0-100
  }[];
}

/**
 * Health report configuration
 */
export interface ReportConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  format: 'pdf' | 'html' | 'json';
  includeRecommendations: boolean;
  recipients: string[];
}

/**
 * Generated health report
 */
export interface HealthReport {
  id: string;
  clientId: string;
  reportDate: Date;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    overallHealth: HealthStatus;
    score: number;
    trend: 'improving' | 'stable' | 'declining';
    keyHighlights: string[];
    concerns: string[];
  };
  metrics: ClientHealthMetrics;
  recommendations: Recommendation[];
  alerts: ClientAlert[];
}

/**
 * Automated recommendation
 */
export interface Recommendation {
  id: string;
  priority: 'low' | 'medium' | 'high';
  category: 'performance' | 'engagement' | 'business' | 'technical';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  actionItems: string[];
}
