/**
 * Financial Reporting System
 * 
 * Generate financial reports, dashboards, and forecasts
 * for executive decision making and client management
 * 
 * @module packages/capabilities/src/financial/reporting
 * @author Platform Team
 * @created 2026-02-04
 */

import {
  ClientProfitability,
  ExecutiveDashboard,
  FinancialForecast,
  BudgetAllocation,
  ReportConfig,
  TimePeriod,
  CostCategory,
} from './types';
import {
  calculateARPC,
  calculatePortfolioMargin,
  sortByProfitability,
  getAttentionClients,
  getClientsByTier,
} from './calculator';

/**
 * Financial Report Generator
 * 
 * Generates comprehensive financial reports and dashboards
 */
export class FinancialReporter {
  /**
   * Generate executive dashboard
   * @param clients - Array of client profitability data
   * @param period - Report period
   * @returns Executive dashboard
   */
  generateExecutiveDashboard(
    clients: ClientProfitability[],
    period: { start: Date; end: Date; type: TimePeriod }
  ): ExecutiveDashboard {
    // Calculate totals
    const totalRevenue = clients.reduce(
      (sum, c) => sum + c.revenue.lifetime,
      0
    );
    const totalCosts = clients.reduce((sum, c) => sum + c.costs.total, 0);
    const totalProfit = totalRevenue - totalCosts;
    const profitMargin = calculatePortfolioMargin(clients);
    
    // Calculate ARPC
    const arpc = calculateARPC(clients);
    
    // Calculate profitability distribution
    const profitabilityDistribution = {
      platinum: getClientsByTier(clients, 'platinum').length,
      gold: getClientsByTier(clients, 'gold').length,
      silver: getClientsByTier(clients, 'silver').length,
      bronze: getClientsByTier(clients, 'bronze').length,
      loss: getClientsByTier(clients, 'loss').length,
    };
    
    // Get top clients (top 5 by profit)
    const sortedClients = sortByProfitability(clients);
    const topClients = sortedClients.slice(0, 5);
    
    // Get clients needing attention
    const attentionClients = getAttentionClients(clients, 15);
    
    // Create budget status (placeholder - would be loaded from actual budgets)
    const budgetStatus = this.generateBudgetStatus(clients);
    
    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      profitMargin,
      clientCount: clients.length,
      arpc,
      profitabilityDistribution,
      topClients,
      attentionClients,
      budgetStatus,
      period,
      generatedAt: new Date(),
    };
  }
  
  /**
   * Generate budget status report
   * @param clients - Array of client profitability data
   * @returns Budget allocations
   */
  private generateBudgetStatus(
    clients: ClientProfitability[]
  ): BudgetAllocation[] {
    // Calculate actual spending by category
    const totalByCategory: Record<CostCategory, number> = {
      infrastructure: 0,
      personnel: 0,
      software: 0,
      marketing: 0,
      support: 0,
      operations: 0,
      other: 0,
    };
    
    clients.forEach((client) => {
      totalByCategory.infrastructure += client.costs.infrastructure;
      totalByCategory.personnel += client.costs.personnel;
      totalByCategory.software += client.costs.software;
      totalByCategory.marketing += client.costs.marketing;
      totalByCategory.support += client.costs.support;
      totalByCategory.operations += client.costs.operations;
      totalByCategory.other += client.costs.other;
    });
    
    // Create budget allocations (using 120% of current spend as budget)
    const categories: CostCategory[] = [
      'infrastructure',
      'personnel',
      'software',
      'marketing',
      'support',
      'operations',
      'other',
    ];
    
    return categories.map((category) => {
      const spent = totalByCategory[category];
      const allocated = spent * 1.2; // 20% buffer
      const remaining = allocated - spent;
      const utilization = allocated > 0 ? (spent / allocated) * 100 : 0;
      const overBudget = spent > allocated;
      
      return {
        category,
        allocated,
        spent,
        remaining,
        utilization,
        overBudget,
      };
    });
  }
  
  /**
   * Generate financial forecast
   * @param clients - Array of client profitability data
   * @param period - Forecast period
   * @param scenario - Forecast scenario
   * @returns Financial forecast
   */
  generateForecast(
    clients: ClientProfitability[],
    period: TimePeriod,
    scenario: 'best' | 'expected' | 'worst' = 'expected'
  ): FinancialForecast {
    // Calculate current metrics
    const currentRevenue = clients.reduce(
      (sum, c) => sum + c.revenue.mrr,
      0
    );
    const currentCosts = clients.reduce(
      (sum, c) => sum + c.costs.total / 12,
      0
    ); // Monthly average
    
    // Calculate average growth rate
    const avgGrowthRate =
      clients.reduce((sum, c) => sum + c.revenue.growthRate, 0) /
      Math.max(clients.length, 1);
    
    // Forecast multipliers based on scenario
    const multipliers = {
      best: { revenue: 1.15, costs: 1.05 },
      expected: { revenue: 1.08, costs: 1.08 },
      worst: { revenue: 1.0, costs: 1.12 },
    };
    
    const mult = multipliers[scenario];
    
    // Project based on period
    let months = 1;
    if (period === 'quarterly') months = 3;
    else if (period === 'yearly') months = 12;
    
    const projectedRevenue = currentRevenue * mult.revenue * months;
    const projectedCosts = currentCosts * mult.costs * months;
    const projectedProfit = projectedRevenue - projectedCosts;
    
    // Confidence level based on scenario and data quality
    const confidence =
      scenario === 'expected'
        ? 0.75
        : scenario === 'best'
        ? 0.6
        : 0.65;
    
    const assumptions = [
      `${scenario.charAt(0).toUpperCase() + scenario.slice(1)} case scenario`,
      `Revenue growth: ${((mult.revenue - 1) * 100).toFixed(1)}%`,
      `Cost increase: ${((mult.costs - 1) * 100).toFixed(1)}%`,
      `Based on ${clients.length} client(s)`,
      `Average historical growth: ${avgGrowthRate.toFixed(1)}%`,
    ];
    
    return {
      period,
      projectedRevenue,
      projectedCosts,
      projectedProfit,
      confidence,
      assumptions,
      scenario,
    };
  }
  
  /**
   * Generate detailed client report
   * @param client - Client profitability data
   * @returns Formatted report string
   */
  generateClientReport(client: ClientProfitability): string {
    const lines: string[] = [];
    
    lines.push(`\n${'='.repeat(60)}`);
    lines.push(`CLIENT FINANCIAL REPORT: ${client.clientName}`);
    lines.push(`${'='.repeat(60)}\n`);
    
    // Period
    lines.push(
      `Period: ${client.periodStart.toISOString().split('T')[0]} to ${
        client.periodEnd.toISOString().split('T')[0]
      }`
    );
    lines.push(`Tier: ${client.tier.toUpperCase()}\n`);
    
    // Revenue
    lines.push('REVENUE METRICS');
    lines.push('-'.repeat(30));
    lines.push(`MRR:              $${client.revenue.mrr.toFixed(2)}`);
    lines.push(`ARR:              $${client.revenue.arr.toFixed(2)}`);
    lines.push(
      `Lifetime:         $${client.revenue.lifetime.toFixed(2)}`
    );
    lines.push(
      `Growth Rate:      ${client.revenue.growthRate.toFixed(2)}%\n`
    );
    
    // Costs
    lines.push('COST BREAKDOWN');
    lines.push('-'.repeat(30));
    lines.push(
      `Infrastructure:   $${client.costs.infrastructure.toFixed(2)}`
    );
    lines.push(`Personnel:        $${client.costs.personnel.toFixed(2)}`);
    lines.push(`Software:         $${client.costs.software.toFixed(2)}`);
    lines.push(`Marketing:        $${client.costs.marketing.toFixed(2)}`);
    lines.push(`Support:          $${client.costs.support.toFixed(2)}`);
    lines.push(`Operations:       $${client.costs.operations.toFixed(2)}`);
    lines.push(`Other:            $${client.costs.other.toFixed(2)}`);
    lines.push(`Total Costs:      $${client.costs.total.toFixed(2)}\n`);
    
    // Profitability
    lines.push('PROFITABILITY');
    lines.push('-'.repeat(30));
    lines.push(`Gross Profit:     $${client.grossProfit.toFixed(2)}`);
    lines.push(`Gross Margin:     ${client.grossMargin.toFixed(2)}%`);
    lines.push(`Net Profit:       $${client.netProfit.toFixed(2)}`);
    lines.push(`Net Margin:       ${client.netMargin.toFixed(2)}%\n`);
    
    // ROI
    lines.push('ROI METRICS');
    lines.push('-'.repeat(30));
    lines.push(`Investment:       $${client.roi.investment.toFixed(2)}`);
    lines.push(`Return:           $${client.roi.return.toFixed(2)}`);
    lines.push(`ROI:              ${client.roi.roiPercentage.toFixed(2)}%`);
    lines.push(
      `Payback Period:   ${client.roi.paybackMonths.toFixed(1)} months`
    );
    lines.push(`LTV:CAC Ratio:    ${client.roi.ltvCacRatio.toFixed(2)}:1\n`);
    
    lines.push('='.repeat(60) + '\n');
    
    return lines.join('\n');
  }
  
  /**
   * Export dashboard to JSON
   * @param dashboard - Executive dashboard
   * @returns JSON string
   */
  exportToJSON(dashboard: ExecutiveDashboard): string {
    return JSON.stringify(dashboard, null, 2);
  }
  
  /**
   * Export dashboard to CSV
   * @param dashboard - Executive dashboard
   * @returns CSV string
   */
  exportToCSV(dashboard: ExecutiveDashboard): string {
    const lines: string[] = [];
    
    // Header
    lines.push(
      'Client,Revenue,Costs,Profit,Margin %,Tier,ROI %,LTV:CAC'
    );
    
    // All clients
    const allClients = [
      ...dashboard.topClients,
      ...dashboard.attentionClients,
    ];
    
    allClients.forEach((client) => {
      lines.push(
        [
          client.clientName,
          client.revenue.lifetime.toFixed(2),
          client.costs.total.toFixed(2),
          client.netProfit.toFixed(2),
          client.netMargin.toFixed(2),
          client.tier,
          client.roi.roiPercentage.toFixed(2),
          client.roi.ltvCacRatio.toFixed(2),
        ].join(',')
      );
    });
    
    return lines.join('\n');
  }
}
