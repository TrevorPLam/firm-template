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
 * Financial Analytics Types
 * 
 * TypeScript type definitions for financial reporting,
 * ROI tracking, and client profitability analysis
 * 
 * @module packages/capabilities/src/financial/types
 * @author Platform Team
 * @created 2026-02-04
 */

/**
 * Time period for financial reporting
 */
export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

/**
 * Currency code (ISO 4217)
 */
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

/**
 * Client profitability tier
 */
export type ProfitabilityTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'loss';

/**
 * Cost category for expense tracking
 */
export type CostCategory =
  | 'infrastructure'
  | 'personnel'
  | 'software'
  | 'marketing'
  | 'support'
  | 'operations'
  | 'other';

/**
 * Revenue metrics for a client
 */
export interface RevenueMetrics {
  /** Monthly recurring revenue */
  mrr: number;
  /** Annual recurring revenue */
  arr: number;
  /** One-time revenue */
  oneTime: number;
  /** Total revenue to date */
  lifetime: number;
  /** Revenue growth rate (percentage) */
  growthRate: number;
  /** Average revenue per month */
  averageMonthly: number;
}

/**
 * Cost breakdown by category
 */
export interface CostBreakdown {
  /** Infrastructure costs (hosting, CDN, etc.) */
  infrastructure: number;
  /** Personnel costs (developers, support, etc.) */
  personnel: number;
  /** Software licenses and tools */
  software: number;
  /** Marketing and acquisition costs */
  marketing: number;
  /** Support and maintenance costs */
  support: number;
  /** General operations */
  operations: number;
  /** Other miscellaneous costs */
  other: number;
  /** Total cost */
  total: number;
}

/**
 * Resource utilization metrics
 */
export interface ResourceUtilization {
  /** Developer hours allocated */
  developerHours: number;
  /** Support hours allocated */
  supportHours: number;
  /** Server resources (CPU hours) */
  serverHours: number;
  /** Bandwidth used (GB) */
  bandwidthGB: number;
  /** Storage used (GB) */
  storageGB: number;
  /** API calls made */
  apiCalls: number;
}

/**
 * ROI (Return on Investment) metrics
 */
export interface ROIMetrics {
  /** Investment amount */
  investment: number;
  /** Return amount */
  return: number;
  /** Net profit */
  netProfit: number;
  /** ROI percentage */
  roiPercentage: number;
  /** Payback period (months) */
  paybackMonths: number;
  /** Customer acquisition cost */
  cac: number;
  /** Customer lifetime value */
  ltv: number;
  /** LTV:CAC ratio */
  ltvCacRatio: number;
}

/**
 * Client profitability analysis
 */
export interface ClientProfitability {
  /** Client identifier */
  clientId: string;
  /** Client name */
  clientName: string;
  /** Revenue metrics */
  revenue: RevenueMetrics;
  /** Cost breakdown */
  costs: CostBreakdown;
  /** Resource utilization */
  resources: ResourceUtilization;
  /** Gross profit (revenue - direct costs) */
  grossProfit: number;
  /** Gross margin percentage */
  grossMargin: number;
  /** Net profit (revenue - total costs) */
  netProfit: number;
  /** Net margin percentage */
  netMargin: number;
  /** Profitability tier */
  tier: ProfitabilityTier;
  /** ROI metrics */
  roi: ROIMetrics;
  /** Analysis period start */
  periodStart: Date;
  /** Analysis period end */
  periodEnd: Date;
  /** Last updated timestamp */
  lastUpdated: Date;
}

/**
 * Financial forecast data
 */
export interface FinancialForecast {
  /** Forecast period */
  period: TimePeriod;
  /** Projected revenue */
  projectedRevenue: number;
  /** Projected costs */
  projectedCosts: number;
  /** Projected profit */
  projectedProfit: number;
  /** Confidence level (0-1) */
  confidence: number;
  /** Assumptions used */
  assumptions: string[];
  /** Scenario (best/expected/worst) */
  scenario: 'best' | 'expected' | 'worst';
}

/**
 * Budget allocation by category
 */
export interface BudgetAllocation {
  /** Category name */
  category: CostCategory;
  /** Allocated amount */
  allocated: number;
  /** Spent amount */
  spent: number;
  /** Remaining amount */
  remaining: number;
  /** Utilization percentage */
  utilization: number;
  /** Is over budget */
  overBudget: boolean;
}

/**
 * Executive financial dashboard data
 */
export interface ExecutiveDashboard {
  /** Total revenue (all clients) */
  totalRevenue: number;
  /** Total costs */
  totalCosts: number;
  /** Total profit */
  totalProfit: number;
  /** Profit margin percentage */
  profitMargin: number;
  /** Number of clients */
  clientCount: number;
  /** Average revenue per client */
  arpc: number;
  /** Client profitability distribution */
  profitabilityDistribution: {
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
    loss: number;
  };
  /** Top performing clients */
  topClients: ClientProfitability[];
  /** Clients needing attention */
  attentionClients: ClientProfitability[];
  /** Budget status */
  budgetStatus: BudgetAllocation[];
  /** Period summary */
  period: {
    start: Date;
    end: Date;
    type: TimePeriod;
  };
  /** Generated timestamp */
  generatedAt: Date;
}

/**
 * Financial report configuration
 */
export interface ReportConfig {
  /** Report period */
  period: TimePeriod;
  /** Include forecasts */
  includeForecast: boolean;
  /** Include detailed breakdown */
  includeDetails: boolean;
  /** Currency to use */
  currency: CurrencyCode;
  /** Clients to include (empty = all) */
  clientIds?: string[];
  /** Date range */
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Financial event for tracking
 */
export interface FinancialEvent {
  /** Event ID */
  id: string;
  /** Client ID */
  clientId: string;
  /** Event type */
  type: 'revenue' | 'cost' | 'refund' | 'adjustment';
  /** Category */
  category: string;
  /** Amount */
  amount: number;
  /** Currency */
  currency: CurrencyCode;
  /** Description */
  description: string;
  /** Event date */
  date: Date;
  /** Metadata */
  metadata?: Record<string, unknown>;
}
