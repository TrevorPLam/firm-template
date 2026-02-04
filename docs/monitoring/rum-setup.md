---
title: Real User Monitoring (RUM) Setup Guide
description: Guide for implementing Real User Monitoring to track Core Web Vitals and user behavior in production.
created: 2026-02-04
component: devex/performance
---

# Real User Monitoring (RUM) Setup Guide

This guide covers implementing Real User Monitoring (RUM) to track Core Web Vitals, user behavior, and performance metrics in production environments with privacy compliance.

## Overview

RUM captures actual user experience data from real browsers, providing insights into:
- Core Web Vitals (LCP, FID, CLS, FCP, TTFB, INP)
- Page load performance
- User journey completion rates
- Geographic performance variations
- Device and browser performance

## Implementation

### Using Existing Web Vitals Tracker

The codebase includes a built-in Web Vitals tracker at `packages/capabilities/src/performance/monitoring/core-web-vitals.ts`.

#### Basic Setup

```typescript
/**
 * Initialize Web Vitals tracking
 */

import { WebVitalsTracker } from '@repo/capabilities/performance/monitoring/core-web-vitals';
import { track } from '@repo/capabilities/analytics';

// Create tracker instance
const vitalsTracker = new WebVitalsTracker();

// Initialize tracking
vitalsTracker.initialize();

// Subscribe to vitals updates
vitalsTracker.onReport((report) => {
  // Send to analytics service
  track('web_vital', {
    metric: report.name,
    value: report.value,
    rating: report.rating,
    delta: report.delta,
    navigationType: report.navigationType,
    page: window.location.pathname,
  });
  
  // Log poor performance
  if (report.rating === 'poor') {
    console.warn(`Poor ${report.name.toUpperCase()}: ${report.value}ms`);
  }
});
```

#### Integration with Next.js

Add to `app/layout.tsx` or `_app.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { WebVitalsTracker } from '@repo/capabilities/performance/monitoring/core-web-vitals';
import { track } from '@repo/capabilities/analytics';

export function WebVitalsReporter() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    const tracker = new WebVitalsTracker();
    tracker.initialize();
    
    // Send reports to analytics
    const unsubscribe = tracker.onReport((report) => {
      track('web_vital', {
        metric: report.name,
        value: report.value,
        rating: report.rating,
        page: window.location.pathname,
      });
    });
    
    return () => {
      unsubscribe();
      tracker.disconnect();
    };
  }, []);
  
  return null;
}
```

### Core Web Vitals Thresholds

The tracker uses industry-standard thresholds:

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP    | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| FID    | ≤ 100ms | ≤ 300ms | > 300ms |
| CLS    | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| FCP    | ≤ 1.8s | ≤ 3.0s | > 3.0s |
| TTFB   | ≤ 800ms | ≤ 1.8s | > 1.8s |
| INP    | ≤ 200ms | ≤ 500ms | > 500ms |

## User Journey Tracking

### Completion Rate Monitoring

```typescript
/**
 * Track user journey completion rates
 */

interface JourneyStep {
  name: string;
  timestamp: number;
  duration?: number;
}

class JourneyTracker {
  private steps: JourneyStep[] = [];
  private startTime: number = Date.now();
  
  step(name: string) {
    const timestamp = Date.now();
    const duration = timestamp - (this.steps[this.steps.length - 1]?.timestamp || this.startTime);
    
    this.steps.push({ name, timestamp, duration });
    
    // Track step completion
    track('journey_step', {
      journey: 'form_submission',
      step: name,
      duration,
      total_duration: timestamp - this.startTime,
    });
  }
  
  complete() {
    const totalDuration = Date.now() - this.startTime;
    
    track('journey_complete', {
      journey: 'form_submission',
      steps: this.steps.length,
      total_duration: totalDuration,
      success: true,
    });
  }
  
  abandon(reason?: string) {
    const totalDuration = Date.now() - this.startTime;
    
    track('journey_abandon', {
      journey: 'form_submission',
      last_step: this.steps[this.steps.length - 1]?.name,
      steps_completed: this.steps.length,
      total_duration: totalDuration,
      reason,
    });
  }
}

// Usage example
const journey = new JourneyTracker();
journey.step('form_view');
journey.step('form_fill');
journey.step('validation');
journey.complete();
```

### Form Completion Tracking

```typescript
/**
 * Track form interactions and completion
 */

export function trackFormInteraction(formId: string) {
  const startTime = Date.now();
  let fieldInteractions = 0;
  
  return {
    fieldFocus: (fieldName: string) => {
      fieldInteractions++;
      track('form_field_focus', { formId, fieldName });
    },
    
    fieldBlur: (fieldName: string, hasValue: boolean) => {
      track('form_field_blur', { 
        formId, 
        fieldName, 
        filled: hasValue 
      });
    },
    
    submit: (success: boolean, errors?: string[]) => {
      const duration = Date.now() - startTime;
      
      track('form_submission', {
        formId,
        success,
        duration,
        field_interactions: fieldInteractions,
        errors: errors?.length || 0,
      });
    },
  };
}
```

## Performance Dashboards

### Key Metrics to Monitor

1. **Core Web Vitals Score**: Percentage of "good" experiences
2. **Page Load Time**: P50, P75, P95, P99 percentiles  
3. **Time to Interactive**: When page becomes fully interactive
4. **Error Rate**: JavaScript errors per page view
5. **Bounce Rate**: Users leaving without interaction

### Example Dashboard Configuration

```typescript
/**
 * Performance dashboard data aggregation
 */

export interface PerformanceDashboard {
  // Core Web Vitals
  lcp: { good: number; needsImprovement: number; poor: number };
  fid: { good: number; needsImprovement: number; poor: number };
  cls: { good: number; needsImprovement: number; poor: number };
  
  // Page performance
  pageLoadTime: { p50: number; p75: number; p95: number; p99: number };
  
  // User behavior
  bounceRate: number;
  avgSessionDuration: number;
  pagesPerSession: number;
  
  // Errors
  errorRate: number;
  topErrors: Array<{ message: string; count: number }>;
}
```

## Performance Budget Alerts

### Setting Up Alerts

```typescript
/**
 * Configure performance budget alerts
 */

import { WebVitalsTracker } from '@repo/capabilities/performance/monitoring/core-web-vitals';

const tracker = new WebVitalsTracker();
tracker.initialize();

// Alert on poor vitals
tracker.onReport((report) => {
  if (report.rating === 'poor') {
    // Send alert
    sendAlert({
      severity: 'warning',
      title: `Poor ${report.name.toUpperCase()} detected`,
      message: `${report.name.toUpperCase()} is ${report.value.toFixed(0)}ms (threshold: ${getThreshold(report.name)}ms)`,
      page: window.location.pathname,
      userAgent: navigator.userAgent,
    });
  }
});

function getThreshold(metric: string): number {
  const thresholds = {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    fcp: 1800,
    ttfb: 800,
    inp: 200,
  };
  return thresholds[metric as keyof typeof thresholds] || 0;
}
```

### Budget Thresholds

Set performance budgets for different page types:

```typescript
export const PERFORMANCE_BUDGETS = {
  landing: {
    lcp: 2000,  // 2 seconds for landing pages
    fid: 50,    // 50ms for first input
    cls: 0.05,  // Very minimal layout shift
  },
  dashboard: {
    lcp: 2500,  // 2.5 seconds for interactive dashboards
    fid: 100,   // 100ms for dashboard interactions
    cls: 0.1,   // Standard layout shift threshold
  },
  content: {
    lcp: 2000,  // 2 seconds for content pages
    fid: 100,   // 100ms for content interactions
    cls: 0.1,   // Standard layout shift threshold
  },
};
```

## Privacy Compliance

### GDPR and Privacy Considerations

```typescript
/**
 * Privacy-compliant RUM implementation
 */

export interface RUMConfig {
  // Consent management
  requireConsent: boolean;
  consentGranted: boolean;
  
  // Data anonymization
  anonymizeIP: boolean;
  anonymizeUserAgent: boolean;
  
  // Data retention
  retentionDays: number;
  
  // Sampling
  sampleRate: number; // 0.0 to 1.0
}

export function createPrivateRUM(config: RUMConfig) {
  // Check consent
  if (config.requireConsent && !config.consentGranted) {
    console.log('[RUM] Tracking disabled - awaiting consent');
    return {
      track: () => {},
      initialize: () => {},
    };
  }
  
  // Initialize with privacy settings
  const tracker = new WebVitalsTracker();
  
  // Apply sampling
  if (Math.random() > config.sampleRate) {
    return {
      track: () => {},
      initialize: () => {},
    };
  }
  
  tracker.initialize();
  
  return {
    track: (data: any) => {
      // Anonymize data before sending
      const anonymized = {
        ...data,
        ip: config.anonymizeIP ? undefined : data.ip,
        userAgent: config.anonymizeUserAgent ? undefined : data.userAgent,
      };
      
      // Send anonymized data
      sendToAnalytics(anonymized);
    },
    initialize: () => tracker.initialize(),
  };
}
```

### Cookie-less Tracking

Use first-party identifiers instead of third-party cookies:

```typescript
/**
 * Generate privacy-friendly session ID
 */

export function generateSessionId(): string {
  // Use browser fingerprinting (privacy-friendly)
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
  
  const fingerprint = {
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    renderer: debugInfo ? gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown',
  };
  
  // Hash fingerprint
  const hash = btoa(JSON.stringify(fingerprint));
  return `session_${Date.now()}_${hash.substring(0, 8)}`;
}
```

## Integration with Analytics

### Sending Data to Analytics Service

```typescript
/**
 * Send RUM data to analytics endpoint
 */

export async function sendRUMData(data: any) {
  try {
    // Use sendBeacon for reliability (fires even if page is closing)
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { 
        type: 'application/json' 
      });
      navigator.sendBeacon('/api/analytics/rum', blob);
    } else {
      // Fallback to fetch with keepalive
      await fetch('/api/analytics/rum', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      });
    }
  } catch (error) {
    console.error('[RUM] Failed to send data:', error);
  }
}
```

## Troubleshooting

### Common Issues

**Vitals not being collected**
- Verify browser supports Performance Observer API
- Check that tracker is initialized after page load
- Ensure analytics endpoint is accessible

**High data volume**
- Implement sampling (e.g., 10% of users)
- Filter out bot traffic
- Aggregate data before sending

**Privacy concerns**
- Enable IP anonymization
- Implement proper consent management
- Set appropriate data retention periods

## Best Practices

1. **Sample appropriately**: Start with 100% sampling, adjust based on volume
2. **Set realistic budgets**: Base budgets on current performance, improve gradually
3. **Monitor trends**: Look for performance regressions over time
4. **Segment data**: Analyze performance by device, location, and connection type
5. **Act on insights**: Use data to prioritize optimization work

## Further Reading

- [Core Web Vitals Documentation](https://web.dev/vitals/)
- [Performance Monitoring Best Practices](https://web.dev/performance-monitoring/)
- [GDPR Compliance for Analytics](https://gdpr.eu/cookies/)
- [Web Performance Working Group](https://www.w3.org/webperf/)

## Related Documentation

- [APM Setup Guide](./apm-setup.md)
- [Performance Optimization](../performance/optimization.md)
- [Analytics Configuration](../analytics/README.md)
- [Privacy and Compliance](../security/privacy.md)
