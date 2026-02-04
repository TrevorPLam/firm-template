/**
 * Financial Dashboard Component
 * 
 * Displays comprehensive financial metrics and ROI analytics
 * 
 * @module financial/dashboard
 */

'use client';

import React, { useMemo } from 'react';
import type { ClientFinancials } from './index';
import { aggregateFinancials, calculateROI } from './index';

export interface FinancialDashboardProps {
  clients: ClientFinancials[];
  period: {
    startDate: string;
    endDate: string;
  };
  className?: string;
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage for display
 */
function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Get risk level class based on churn risk score
 */
function getRiskLevelClass(riskScore: number): string {
  if (riskScore >= 70) return 'text-red-600 font-bold';
  if (riskScore >= 40) return 'text-yellow-600';
  return 'text-green-600';
}

/**
 * Financial Dashboard Component
 * 
 * Displays key financial metrics, client profitability, and ROI analysis
 * 
 * @example
 * ```tsx
 * <FinancialDashboard
 *   clients={clientData}
 *   period={{ startDate: '2024-01-01', endDate: '2024-12-31' }}
 * />
 * ```
 */
export function FinancialDashboard({
  clients,
  period,
  className = '',
}: FinancialDashboardProps) {
  const summary = useMemo(() => aggregateFinancials(clients), [clients]);
  
  const topClients = useMemo(() => {
    return [...clients]
      .sort((a, b) => b.metrics.roi - a.metrics.roi)
      .slice(0, 5);
  }, [clients]);
  
  const highRiskClients = useMemo(() => {
    return clients.filter(c => c.metrics.churnRisk >= 60);
  }, [clients]);

  return (
    <div className={`financial-dashboard ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(summary.totalRevenue)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Profit</h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(summary.totalProfit)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Profit Margin</h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatPercentage(summary.profitMargin)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Avg ROI</h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatPercentage(summary.avgROI)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Clients */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Top Performing Clients</h3>
          <div className="space-y-4">
            {topClients.map((client) => (
              <div key={client.clientId} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{client.clientName}</h4>
                    <p className="text-sm text-gray-600">
                      Revenue: {formatCurrency(client.monthlyRevenue)}/mo
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ROI: {formatPercentage(client.metrics.roi)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Margin: {formatPercentage(client.metrics.profitMargin)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* At-Risk Clients */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">
            At-Risk Clients
            {highRiskClients.length > 0 && (
              <span className="ml-2 text-red-600">({highRiskClients.length})</span>
            )}
          </h3>
          {highRiskClients.length === 0 ? (
            <p className="text-gray-600">No high-risk clients at this time.</p>
          ) : (
            <div className="space-y-4">
              {highRiskClients.map((client) => (
                <div key={client.clientId} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{client.clientName}</h4>
                      <p className="text-sm text-gray-600">
                        Revenue: {formatCurrency(client.monthlyRevenue)}/mo
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getRiskLevelClass(client.metrics.churnRisk)}`}>
                        Risk: {client.metrics.churnRisk.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Period Information */}
      <div className="mt-8 text-sm text-gray-600 text-center">
        Reporting Period: {period.startDate} to {period.endDate}
      </div>
    </div>
  );
}

export default FinancialDashboard;
