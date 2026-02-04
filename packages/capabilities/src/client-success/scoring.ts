/**
 * Client Health Scoring System
 * 
 * Calculates comprehensive health scores for clients based on
 * performance, engagement, business, and technical metrics.
 */

import { ClientHealthMetrics, HealthStatus } from './types';

/**
 * Scoring weights for different metric categories
 */
const SCORING_WEIGHTS = {
  performance: 0.30,  // 30% weight
  engagement: 0.25,   // 25% weight
  business: 0.30,     // 30% weight
  technical: 0.15,    // 15% weight
};

/**
 * Calculate performance score (0-100)
 */
export function calculatePerformanceScore(metrics: ClientHealthMetrics['performance']): number {
  const {
    uptime,
    avgResponseTime,
    errorRate,
    availability,
  } = metrics;
  
  // Normalize metrics to 0-100 scale
  const uptimeScore = uptime;
  const responseTimeScore = Math.max(0, 100 - (avgResponseTime / 30)); // 30ms = 0 score
  const errorRateScore = Math.max(0, 100 - (errorRate * 10)); // 10% error = 0 score
  const availabilityScore = availability;
  
  // Weighted average
  return (
    uptimeScore * 0.35 +
    responseTimeScore * 0.25 +
    errorRateScore * 0.20 +
    availabilityScore * 0.20
  );
}

/**
 * Calculate engagement score (0-100)
 */
export function calculateEngagementScore(metrics: ClientHealthMetrics['engagement']): number {
  const {
    activeUsers,
    dailyActiveUsers,
    monthlyActiveUsers,
    sessionDuration,
    conversionRate,
  } = metrics;
  
  // DAU/MAU ratio (sticky factor)
  const stickyFactor = monthlyActiveUsers > 0 
    ? (dailyActiveUsers / monthlyActiveUsers) * 100 
    : 0;
  
  // Session duration score (10 min = 100)
  const durationScore = Math.min(100, (sessionDuration / 10) * 100);
  
  // Conversion rate is already 0-100
  const conversionScore = conversionRate;
  
  // Active users growth (assume target is 1000)
  const usersScore = Math.min(100, (activeUsers / 1000) * 100);
  
  return (
    stickyFactor * 0.30 +
    durationScore * 0.25 +
    conversionScore * 0.25 +
    usersScore * 0.20
  );
}

/**
 * Calculate business score (0-100)
 */
export function calculateBusinessScore(metrics: ClientHealthMetrics['business']): number {
  const {
    revenue,
    growth,
    churnRisk,
    lifetimeValue,
    satisfaction,
  } = metrics;
  
  // Revenue score (assume $50k/month = 100)
  const revenueScore = Math.min(100, (revenue / 50000) * 100);
  
  // Growth score (positive growth = higher score)
  const growthScore = Math.max(0, Math.min(100, 50 + growth * 2));
  
  // Churn risk (inverted - lower risk = higher score)
  const churnScore = 100 - churnRisk;
  
  // LTV score (assume $100k = 100)
  const ltvScore = Math.min(100, (lifetimeValue / 100000) * 100);
  
  // Satisfaction score (0-10 to 0-100)
  const satisfactionScore = satisfaction * 10;
  
  return (
    revenueScore * 0.25 +
    growthScore * 0.20 +
    churnScore * 0.25 +
    ltvScore * 0.15 +
    satisfactionScore * 0.15
  );
}

/**
 * Calculate technical score (0-100)
 */
export function calculateTechnicalScore(metrics: ClientHealthMetrics['technical']): number {
  const {
    coreWebVitals,
    securityScore,
    seoScore,
    accessibilityScore,
  } = metrics;
  
  // Core Web Vitals scoring
  const lcpScore = coreWebVitals.lcp <= 2500 ? 100 : 
                   coreWebVitals.lcp <= 4000 ? 50 : 0;
  const fidScore = coreWebVitals.fid <= 100 ? 100 : 
                   coreWebVitals.fid <= 300 ? 50 : 0;
  const clsScore = coreWebVitals.cls <= 0.1 ? 100 : 
                   coreWebVitals.cls <= 0.25 ? 50 : 0;
  
  const webVitalsScore = (lcpScore + fidScore + clsScore) / 3;
  
  return (
    webVitalsScore * 0.30 +
    securityScore * 0.30 +
    seoScore * 0.20 +
    accessibilityScore * 0.20
  );
}

/**
 * Calculate overall health score
 */
export function calculateOverallScore(metrics: ClientHealthMetrics): number {
  const performanceScore = calculatePerformanceScore(metrics.performance);
  const engagementScore = calculateEngagementScore(metrics.engagement);
  const businessScore = calculateBusinessScore(metrics.business);
  const technicalScore = calculateTechnicalScore(metrics.technical);
  
  return (
    performanceScore * SCORING_WEIGHTS.performance +
    engagementScore * SCORING_WEIGHTS.engagement +
    businessScore * SCORING_WEIGHTS.business +
    technicalScore * SCORING_WEIGHTS.technical
  );
}

/**
 * Determine health status from score
 */
export function getHealthStatus(score: number): HealthStatus {
  if (score >= 90) return HealthStatus.EXCELLENT;
  if (score >= 70) return HealthStatus.GOOD;
  if (score >= 50) return HealthStatus.WARNING;
  return HealthStatus.CRITICAL;
}

/**
 * Calculate health score with status
 */
export function calculateHealthScore(metrics: ClientHealthMetrics): {
  score: number;
  status: HealthStatus;
  breakdown: {
    performance: number;
    engagement: number;
    business: number;
    technical: number;
  };
} {
  const performanceScore = calculatePerformanceScore(metrics.performance);
  const engagementScore = calculateEngagementScore(metrics.engagement);
  const businessScore = calculateBusinessScore(metrics.business);
  const technicalScore = calculateTechnicalScore(metrics.technical);
  
  const overallScore = calculateOverallScore(metrics);
  const status = getHealthStatus(overallScore);
  
  return {
    score: Math.round(overallScore * 10) / 10, // Round to 1 decimal
    status,
    breakdown: {
      performance: Math.round(performanceScore * 10) / 10,
      engagement: Math.round(engagementScore * 10) / 10,
      business: Math.round(businessScore * 10) / 10,
      technical: Math.round(technicalScore * 10) / 10,
    },
  };
}
