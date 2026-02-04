---
title: Application Performance Monitoring (APM) Setup Guide
description: Comprehensive guide for setting up and using APM tools for production monitoring.
created: 2026-02-04
component: devex/monitoring
---

# Application Performance Monitoring (APM) Setup Guide

This guide covers the implementation of Application Performance Monitoring (APM) to track performance metrics, error monitoring, and business metrics collection for production insights.

## Overview

APM provides deep visibility into application performance, helping identify bottlenecks, track user journeys, and monitor system health in real-time.

## Supported APM Solutions

### Recommended Options

1. **DataDog APM** - Full-featured APM with infrastructure monitoring
2. **New Relic** - Comprehensive observability platform  
3. **Sentry APM** - Error tracking with performance monitoring
4. **Elastic APM** - Open-source alternative with Elasticsearch integration

## Configuration

### Environment Variables

Add to `.env.example`:

```bash
# DataDog APM Configuration
DD_API_KEY=your_datadog_api_key_here
DD_SERVICE=firm-web-app
DD_ENV=production
DD_VERSION=1.0.0

# New Relic Configuration (alternative)
NEW_RELIC_LICENSE_KEY=your_license_key_here
NEW_RELIC_APP_NAME=firm-web-app

# Sentry Configuration (alternative)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

## Core User Journey Tracking

Track critical user flows to identify performance issues:

- Form submissions
- Page navigation
- Checkout processes
- Authentication flows
- Search and filtering

## Custom Business Metrics

Monitor business KPIs alongside technical metrics:

- Conversion rates
- Revenue tracking
- User engagement
- Feature adoption
- Customer satisfaction scores

## Alerting Rules

Configure alerts for critical issues:

- High error rates (> 1%)
- Slow response times (p95 > 1s)
- Failed user journeys
- Resource exhaustion
- Anomaly detection

## Monitoring Procedures

### Daily Review
- Check error rate trends
- Monitor response time metrics
- Review critical user journey completion rates

### Weekly Analysis
- Analyze performance trends
- Review top errors and their impact
- Optimize slow endpoints
- Update alert thresholds

## Further Reading

- [Real User Monitoring (RUM) Setup](./rum-setup.md)
- [Core Web Vitals Tracking](./core-web-vitals.md)
- [Error Tracking Best Practices](./error-tracking.md)
