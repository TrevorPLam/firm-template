/**
 * Financial Reporting and ROI Analytics Module
 * 
 * Provides comprehensive financial tracking, client profitability analysis,
 * and ROI calculation capabilities for business intelligence.
 * 
 * @module financial
 */

/**
 * Client financial metrics for profitability analysis
 */
export interface ClientFinancials {
  clientId: string;
  clientName: string;
  monthlyRevenue: number;
  quarterlyRevenue: number;
  annualRevenue: number;
  costs: {
    infrastructure: number;
    development: number;
    support: number;
    marketing: number;
    other: number;
  };
  metrics: {
    profitMargin: number;
    roi: number;
    lifetimeValue: number;
    acquisitionCost: number;
    churnRisk: number;
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

/**
 * ROI calculation parameters
 */
export interface ROICalculation {
  investment: number;
  returns: number;
  period: number; // in months
  additionalCosts?: number;
}

/**
 * Financial report configuration
 */
export interface FinancialReportConfig {
  clientIds?: string[];
  startDate: string;
  endDate: string;
  includeForecasts?: boolean;
  groupBy?: 'client' | 'month' | 'quarter' | 'year';
  metrics?: string[];
}

/**
 * Calculate ROI percentage
 * 
 * @param calculation - ROI calculation parameters
 * @returns ROI as a percentage
 * 
 * @example
 * ```typescript
 * const roi = calculateROI({
 *   investment: 10000,
 *   returns: 15000,
 *   period: 12
 * });
 * console.log(`ROI: ${roi}%`); // ROI: 50%
 * ```
 */
export function calculateROI(calculation: ROICalculation): number {
  const { investment, returns, additionalCosts = 0 } = calculation;
  const totalCost = investment + additionalCosts;
  const profit = returns - totalCost;
  return (profit / totalCost) * 100;
}

/**
 * Calculate profit margin
 * 
 * @param revenue - Total revenue
 * @param costs - Total costs
 * @returns Profit margin as a percentage
 */
export function calculateProfitMargin(revenue: number, costs: number): number {
  const profit = revenue - costs;
  return (profit / revenue) * 100;
}

/**
 * Calculate customer lifetime value (CLV)
 * 
 * @param avgMonthlyRevenue - Average monthly revenue per customer
 * @param avgLifetimeMonths - Average customer lifetime in months
 * @param profitMargin - Profit margin as decimal (e.g., 0.3 for 30%)
 * @returns Customer lifetime value
 */
export function calculateLifetimeValue(
  avgMonthlyRevenue: number,
  avgLifetimeMonths: number,
  profitMargin: number
): number {
  return avgMonthlyRevenue * avgLifetimeMonths * profitMargin;
}

/**
 * Calculate payback period (time to recover investment)
 * 
 * @param initialInvestment - Initial investment amount
 * @param monthlyProfit - Average monthly profit
 * @returns Payback period in months
 */
export function calculatePaybackPeriod(
  initialInvestment: number,
  monthlyProfit: number
): number {
  if (monthlyProfit <= 0) return Infinity;
  return initialInvestment / monthlyProfit;
}

/**
 * Calculate churn risk score based on financial indicators
 * 
 * @param metrics - Client financial metrics
 * @returns Churn risk score (0-100, higher = more risk)
 */
export function calculateChurnRisk(metrics: {
  revenueGrowth: number;
  paymentDelays: number;
  supportTickets: number;
  engagementScore: number;
}): number {
  const { revenueGrowth, paymentDelays, supportTickets, engagementScore } = metrics;
  
  let riskScore = 0;
  
  // Negative revenue growth increases risk
  if (revenueGrowth < 0) riskScore += 30;
  else if (revenueGrowth < 5) riskScore += 15;
  
  // Payment delays increase risk
  riskScore += Math.min(paymentDelays * 10, 30);
  
  // High support tickets may indicate issues
  if (supportTickets > 10) riskScore += 20;
  else if (supportTickets > 5) riskScore += 10;
  
  // Low engagement increases risk
  if (engagementScore < 30) riskScore += 20;
  else if (engagementScore < 50) riskScore += 10;
  
  return Math.min(riskScore, 100);
}

/**
 * Aggregate client financials for a reporting period
 * 
 * @param clients - Array of client financial data
 * @returns Aggregated financial summary
 */
export function aggregateFinancials(clients: ClientFinancials[]) {
  const totalRevenue = clients.reduce((sum, c) => sum + c.monthlyRevenue, 0);
  const totalCosts = clients.reduce((sum, c) => {
    const clientCosts = Object.values(c.costs).reduce((s, cost) => s + cost, 0);
    return sum + clientCosts;
  }, 0);
  
  const avgROI = clients.reduce((sum, c) => sum + c.metrics.roi, 0) / clients.length;
  const avgProfitMargin = clients.reduce((sum, c) => sum + c.metrics.profitMargin, 0) / clients.length;
  
  return {
    totalRevenue,
    totalCosts,
    totalProfit: totalRevenue - totalCosts,
    profitMargin: calculateProfitMargin(totalRevenue, totalCosts),
    avgROI,
    avgProfitMargin,
    clientCount: clients.length,
    highRiskClients: clients.filter(c => c.metrics.churnRisk > 60).length,
  };
}

/**
 * Generate financial forecast based on historical data
 * 
 * @param historicalRevenue - Array of historical revenue data
 * @param periodsAhead - Number of periods to forecast
 * @returns Forecasted revenue values
 */
export function forecastRevenue(
  historicalRevenue: number[],
  periodsAhead: number
): number[] {
  if (historicalRevenue.length < 2) {
    return Array(periodsAhead).fill(historicalRevenue[0] || 0);
  }
  
  // Simple linear regression for forecasting
  const n = historicalRevenue.length;
  const xSum = (n * (n + 1)) / 2;
  const ySum = historicalRevenue.reduce((sum, val) => sum + val, 0);
  const xySum = historicalRevenue.reduce((sum, val, idx) => sum + val * (idx + 1), 0);
  const xxSum = (n * (n + 1) * (2 * n + 1)) / 6;
  
  const slope = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum);
  const intercept = (ySum - slope * xSum) / n;
  
  const forecasts: number[] = [];
  for (let i = 1; i <= periodsAhead; i++) {
    const forecast = slope * (n + i) + intercept;
    forecasts.push(Math.max(0, forecast)); // Ensure non-negative
  }
  
  return forecasts;
}

/**
 * Financial reporting class for generating reports
 */
export class FinancialReporter {
  private clients: ClientFinancials[] = [];
  
  /**
   * Add client financial data
   */
  addClient(client: ClientFinancials): void {
    this.clients.push(client);
  }
  
  /**
   * Generate comprehensive financial report
   */
  generateReport(config: FinancialReportConfig) {
    let filteredClients = this.clients;
    
    // Filter by client IDs if specified
    if (config.clientIds && config.clientIds.length > 0) {
      filteredClients = filteredClients.filter(c => 
        config.clientIds!.includes(c.clientId)
      );
    }
    
    // Filter by date range
    filteredClients = filteredClients.filter(c => {
      const start = new Date(config.startDate);
      const end = new Date(config.endDate);
      const clientStart = new Date(c.period.startDate);
      const clientEnd = new Date(c.period.endDate);
      
      return clientStart >= start && clientEnd <= end;
    });
    
    const summary = aggregateFinancials(filteredClients);
    
    return {
      summary,
      clients: filteredClients,
      generatedAt: new Date().toISOString(),
      config,
    };
  }
  
  /**
   * Get high-risk clients that need attention
   */
  getHighRiskClients(threshold: number = 60): ClientFinancials[] {
    return this.clients.filter(c => c.metrics.churnRisk >= threshold);
  }
  
  /**
   * Get most profitable clients
   */
  getTopClients(count: number = 10): ClientFinancials[] {
    return [...this.clients]
      .sort((a, b) => b.metrics.roi - a.metrics.roi)
      .slice(0, count);
  }
}

/**
 * Export all financial utilities
 */
export const Financial = {
  calculateROI,
  calculateProfitMargin,
  calculateLifetimeValue,
  calculatePaybackPeriod,
  calculateChurnRisk,
  aggregateFinancials,
  forecastRevenue,
  FinancialReporter,
};

export default Financial;
