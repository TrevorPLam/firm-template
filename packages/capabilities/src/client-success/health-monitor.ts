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
 * Client Health Monitor
 * 
 * Monitors client health in real-time and triggers alerts
 * when metrics fall below thresholds.
 */

import { ClientHealthMetrics, ClientAlert, HealthStatus } from './types';
import { calculateHealthScore } from './scoring';

/**
 * Health monitor configuration
 */
export interface HealthMonitorConfig {
  checkInterval: number;  // milliseconds
  alertThresholds: {
    performance: number;
    engagement: number;
    business: number;
    technical: number;
  };
}

/**
 * Default health monitor configuration
 */
export const defaultHealthMonitorConfig: HealthMonitorConfig = {
  checkInterval: 60000,  // 1 minute
  alertThresholds: {
    performance: 70,
    engagement: 60,
    business: 70,
    technical: 70,
  },
};

/**
 * Health Monitor Class
 */
export class HealthMonitor {
  private config: HealthMonitorConfig;
  private monitoredClients: Map<string, ClientHealthMetrics> = new Map();
  private intervalId?: NodeJS.Timeout;
  private alertCallbacks: Array<(alert: ClientAlert) => void> = [];

  constructor(config: Partial<HealthMonitorConfig> = {}) {
    this.config = {
      ...defaultHealthMonitorConfig,
      ...config,
    };
  }

  /**
   * Start monitoring
   */
  start(): void {
    if (this.intervalId) {
      console.warn('Health monitor already running');
      return;
    }

    this.intervalId = setInterval(() => {
      this.checkAllClients();
    }, this.config.checkInterval);

    console.log('Health monitor started');
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      console.log('Health monitor stopped');
    }
  }

  /**
   * Add client to monitoring
   */
  addClient(metrics: ClientHealthMetrics): void {
    this.monitoredClients.set(metrics.clientId, metrics);
  }

  /**
   * Remove client from monitoring
   */
  removeClient(clientId: string): void {
    this.monitoredClients.delete(clientId);
  }

  /**
   * Update client metrics
   */
  updateClientMetrics(metrics: ClientHealthMetrics): void {
    this.monitoredClients.set(metrics.clientId, metrics);
    this.checkClient(metrics);
  }

  /**
   * Register alert callback
   */
  onAlert(callback: (alert: ClientAlert) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Check all clients
   */
  private checkAllClients(): void {
    for (const metrics of this.monitoredClients.values()) {
      this.checkClient(metrics);
    }
  }

  /**
   * Check individual client health
   */
  private checkClient(metrics: ClientHealthMetrics): void {
    const health = calculateHealthScore(metrics);
    
    // Check for critical status
    if (health.status === HealthStatus.CRITICAL) {
      this.triggerAlert({
        id: `alert_${Date.now()}_${metrics.clientId}`,
        clientId: metrics.clientId,
        severity: 'critical',
        type: 'health_critical',
        message: `Client ${metrics.clientName} health is CRITICAL (score: ${health.score})`,
        details: { score: health.score, breakdown: health.breakdown },
        createdAt: new Date(),
        status: 'active',
      });
    }
    
    // Check individual metric thresholds
    if (health.breakdown.performance < this.config.alertThresholds.performance) {
      this.triggerAlert({
        id: `alert_${Date.now()}_${metrics.clientId}_perf`,
        clientId: metrics.clientId,
        severity: 'high',
        type: 'performance_degradation',
        message: `Performance issues detected for ${metrics.clientName}`,
        details: { 
          score: health.breakdown.performance,
          uptime: metrics.performance.uptime,
          responseTime: metrics.performance.avgResponseTime,
          errorRate: metrics.performance.errorRate,
        },
        createdAt: new Date(),
        status: 'active',
      });
    }
    
    // Check engagement
    if (health.breakdown.engagement < this.config.alertThresholds.engagement) {
      this.triggerAlert({
        id: `alert_${Date.now()}_${metrics.clientId}_eng`,
        clientId: metrics.clientId,
        severity: 'medium',
        type: 'low_engagement',
        message: `Low user engagement for ${metrics.clientName}`,
        details: { 
          score: health.breakdown.engagement,
          activeUsers: metrics.engagement.activeUsers,
          conversionRate: metrics.engagement.conversionRate,
        },
        createdAt: new Date(),
        status: 'active',
      });
    }
    
    // Check business metrics
    if (health.breakdown.business < this.config.alertThresholds.business) {
      this.triggerAlert({
        id: `alert_${Date.now()}_${metrics.clientId}_biz`,
        clientId: metrics.clientId,
        severity: 'high',
        type: 'business_concern',
        message: `Business metrics declining for ${metrics.clientName}`,
        details: { 
          score: health.breakdown.business,
          churnRisk: metrics.business.churnRisk,
          growth: metrics.business.growth,
          satisfaction: metrics.business.satisfaction,
        },
        createdAt: new Date(),
        status: 'active',
      });
    }
  }

  /**
   * Trigger alert
   */
  private triggerAlert(alert: ClientAlert): void {
    console.log(`[Alert] ${alert.severity.toUpperCase()}: ${alert.message}`);
    
    // Notify all registered callbacks
    for (const callback of this.alertCallbacks) {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error in alert callback:', error);
      }
    }
  }

  /**
   * Get current status of all clients
   */
  getClientStatuses(): Map<string, { metrics: ClientHealthMetrics; health: ReturnType<typeof calculateHealthScore> }> {
    const statuses = new Map();
    
    for (const [clientId, metrics] of this.monitoredClients) {
      statuses.set(clientId, {
        metrics,
        health: calculateHealthScore(metrics),
      });
    }
    
    return statuses;
  }

  /**
   * Get monitored clients count
   */
  getMonitoredCount(): number {
    return this.monitoredClients.size;
  }
}

/**
 * Create and configure health monitor
 */
export function createHealthMonitor(config?: Partial<HealthMonitorConfig>): HealthMonitor {
  return new HealthMonitor(config);
}
