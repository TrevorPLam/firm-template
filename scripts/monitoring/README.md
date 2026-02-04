# Monitoring Scripts

This directory contains scripts for infrastructure monitoring, health checks, and observability.

## Scripts

### health-check.sh

Comprehensive infrastructure health check script.

```bash
# Run health check
./health-check.sh

# JSON output for automation
./health-check.sh --json
```

**Checks performed:**
- Disk space usage
- Memory utilization
- CPU load
- Backup age verification
- Service availability
- Database connectivity

**Exit codes:**
- `0`: All checks passed
- `1`: One or more checks failed

## Scheduled Monitoring

### Cron Setup

Add to crontab for automated monitoring:

```bash
# Every 5 minutes
*/5 * * * * /path/to/scripts/monitoring/health-check.sh --json >> /var/log/health.log

# Daily summary
0 9 * * * /path/to/scripts/monitoring/health-check.sh | mail -s "Daily Health Report" ops@example.com
```

## Integration

### With Alerting Systems

```bash
# Alert on failure
./health-check.sh || curl -X POST https://alerts.example.com/trigger
```

### With Monitoring Platforms

```bash
# Send metrics to monitoring system
./health-check.sh --json | send-to-metrics.sh
```

## Documentation

See [../../docs/operations/MONITORING.md](../../docs/operations/MONITORING.md) for comprehensive monitoring guide.
