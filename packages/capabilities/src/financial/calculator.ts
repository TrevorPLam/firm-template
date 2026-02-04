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
 * Financial Analytics Calculator
 * 
 * Core calculation functions for financial metrics,
 * ROI analysis, and profitability assessment
 * 
 * @module packages/capabilities/src/financial/calculator
 * @author Platform Team
 * @created 2026-02-04
 */

import {
  ClientProfitability,
  CostBreakdown,
  RevenueMetrics,
  ROIMetrics,
  ProfitabilityTier,
  ResourceUtilization,
} from './types';

/**
 * Calculate revenue metrics from historical data
 * @param revenueHistory - Array of monthly revenue values
 * @returns Revenue metrics
 */
export function calculateRevenueMetrics(
  revenueHistory: number[]
): RevenueMetrics {
  const mrr = revenueHistory[revenueHistory.length - 1] || 0;
  const arr = mrr * 12;
  const lifetime = revenueHistory.reduce((sum, val) => sum + val, 0);
  const averageMonthly = lifetime / Math.max(revenueHistory.length, 1);
  
  // Calculate growth rate (last month vs previous month)
  let growthRate = 0;
  if (revenueHistory.length >= 2) {
    const current = revenueHistory[revenueHistory.length - 1];
    const previous = revenueHistory[revenueHistory.length - 2];
    if (previous > 0) {
      growthRate = ((current - previous) / previous) * 100;
    }
  }
  
  return {
    mrr,
    arr,
    oneTime: 0, // Would be tracked separately
    lifetime,
    growthRate,
    averageMonthly,
  };
}

/**
 * Calculate total costs from breakdown
 * @param costs - Cost breakdown by category
 * @returns Cost breakdown with total
 */
export function calculateTotalCosts(
  costs: Omit<CostBreakdown, 'total'>
): CostBreakdown {
  const total =
    costs.infrastructure +
    costs.personnel +
    costs.software +
    costs.marketing +
    costs.support +
    costs.operations +
    costs.other;
  
  return {
    ...costs,
    total,
  };
}

/**
 * Calculate ROI metrics
 * @param investment - Total investment amount
 * @param revenue - Total revenue generated
 * @param costs - Total costs incurred
 * @param months - Number of months
 * @returns ROI metrics
 */
export function calculateROI(
  investment: number,
  revenue: number,
  costs: number,
  months: number
): ROIMetrics {
  const netProfit = revenue - costs;
  const roiPercentage = investment > 0 ? (netProfit / investment) * 100 : 0;
  
  // Calculate payback period (months to recover investment)
  const monthlyProfit = netProfit / Math.max(months, 1);
  const paybackMonths =
    monthlyProfit > 0 ? investment / monthlyProfit : Infinity;
  
  // CAC and LTV calculations (simplified)
  const cac = investment; // Customer acquisition cost
  const ltv = revenue; // Customer lifetime value
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  
  return {
    investment,
    return: revenue,
    netProfit,
    roiPercentage,
    paybackMonths: Math.min(paybackMonths, 999), // Cap at 999 months
    cac,
    ltv,
    ltvCacRatio,
  };
}

/**
 * Determine profitability tier based on margin
 * @param netMargin - Net margin percentage
 * @returns Profitability tier
 */
export function getProfitabilityTier(netMargin: number): ProfitabilityTier {
  if (netMargin < 0) return 'loss';
  if (netMargin >= 40) return 'platinum';
  if (netMargin >= 30) return 'gold';
  if (netMargin >= 20) return 'silver';
  return 'bronze';
}

/**
 * Calculate complete client profitability analysis
 * @param clientId - Client identifier
 * @param clientName - Client name
 * @param revenueHistory - Historical revenue data
 * @param costs - Cost breakdown
 * @param resources - Resource utilization
 * @param investment - Initial investment
 * @param periodStart - Analysis period start
 * @param periodEnd - Analysis period end
 * @returns Complete profitability analysis
 */
export function analyzeClientProfitability(
  clientId: string,
  clientName: string,
  revenueHistory: number[],
  costs: Omit<CostBreakdown, 'total'>,
  resources: ResourceUtilization,
  investment: number,
  periodStart: Date,
  periodEnd: Date
): ClientProfitability {
  // Calculate metrics
  const revenue = calculateRevenueMetrics(revenueHistory);
  const costBreakdown = calculateTotalCosts(costs);
  
  // Calculate profits and margins
  const totalRevenue = revenue.lifetime;
  const totalCosts = costBreakdown.total;
  const grossProfit = totalRevenue - costBreakdown.infrastructure - costBreakdown.operations;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const netProfit = totalRevenue - totalCosts;
  const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  
  // Calculate ROI
  const months = revenueHistory.length;
  const roi = calculateROI(investment, totalRevenue, totalCosts, months);
  
  // Determine tier
  const tier = getProfitabilityTier(netMargin);
  
  return {
    clientId,
    clientName,
    revenue,
    costs: costBreakdown,
    resources,
    grossProfit,
    grossMargin,
    netProfit,
    netMargin,
    tier,
    roi,
    periodStart,
    periodEnd,
    lastUpdated: new Date(),
  };
}

/**
 * Calculate average revenue per client
 * @param clients - Array of client profitability data
 * @returns Average revenue
 */
export function calculateARPC(clients: ClientProfitability[]): number {
  if (clients.length === 0) return 0;
  const totalRevenue = clients.reduce((sum, c) => sum + c.revenue.lifetime, 0);
  return totalRevenue / clients.length;
}

/**
 * Calculate profit margin for a portfolio
 * @param clients - Array of client profitability data
 * @returns Profit margin percentage
 */
export function calculatePortfolioMargin(
  clients: ClientProfitability[]
): number {
  const totalRevenue = clients.reduce((sum, c) => sum + c.revenue.lifetime, 0);
  const totalCosts = clients.reduce((sum, c) => sum + c.costs.total, 0);
  const totalProfit = totalRevenue - totalCosts;
  
  return totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
}

/**
 * Get clients by profitability tier
 * @param clients - Array of client profitability data
 * @param tier - Tier to filter by
 * @returns Filtered clients
 */
export function getClientsByTier(
  clients: ClientProfitability[],
  tier: ProfitabilityTier
): ClientProfitability[] {
  return clients.filter((c) => c.tier === tier);
}

/**
 * Sort clients by net profit (descending)
 * @param clients - Array of client profitability data
 * @returns Sorted clients
 */
export function sortByProfitability(
  clients: ClientProfitability[]
): ClientProfitability[] {
  return [...clients].sort((a, b) => b.netProfit - a.netProfit);
}

/**
 * Identify clients needing attention (low or negative profitability)
 * @param clients - Array of client profitability data
 * @param marginThreshold - Net margin threshold (default: 15%)
 * @returns Clients needing attention
 */
export function getAttentionClients(
  clients: ClientProfitability[],
  marginThreshold: number = 15
): ClientProfitability[] {
  return clients.filter((c) => c.netMargin < marginThreshold);
}

/**
 * Calculate resource efficiency (revenue per unit of resource)
 * @param client - Client profitability data
 * @returns Efficiency metrics
 */
export function calculateResourceEfficiency(client: ClientProfitability): {
  revenuePerDeveloperHour: number;
  revenuePerSupportHour: number;
  revenuePerServerHour: number;
} {
  const revenue = client.revenue.lifetime;
  const resources = client.resources;
  
  return {
    revenuePerDeveloperHour:
      resources.developerHours > 0 ? revenue / resources.developerHours : 0,
    revenuePerSupportHour:
      resources.supportHours > 0 ? revenue / resources.supportHours : 0,
    revenuePerServerHour:
      resources.serverHours > 0 ? revenue / resources.serverHours : 0,
  };
}
