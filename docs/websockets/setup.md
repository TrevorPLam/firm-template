---
title: WebSocket Infrastructure Setup
description: WebSocket server setup, auth, and scaling guidance.
---

# WebSocket Infrastructure Setup

## Server Setup Example

```ts
import { Server } from 'socket.io'
import { getRealtimeConfig } from '@repo/capabilities/realtime'

const realtimeConfig = getRealtimeConfig()

const io = new Server(httpServer, {
  cors: { origin: realtimeConfig.appOrigin }, // Allow app origin only.
})

io.use((socket, next) => {
  const token = socket.handshake.auth?.token
  if (!token) return next(new Error('unauthorized'))
  return next()
})
```

## Environment Configuration

```bash
# .env.local (example)
REALTIME_PROVIDER=socket-io
REALTIME_SERVER_URL=https://realtime.example.com
REALTIME_APP_ORIGIN=https://app.example.com
REALTIME_API_KEY=server-secret
REALTIME_ENABLE_PRESENCE=true
REALTIME_CONNECTION_TIMEOUT_MS=10000
REALTIME_MESSAGE_RETENTION_MINUTES=15
```

## Scaling Notes

- Use Redis or another adapter for horizontal scaling.
- Pin sessions to reduce cross-node chatter.
- Monitor connection counts and message rates.

## Monitoring Checklist

- Track connection failures and auth rejections.
- Alert on sustained reconnect loops.
- Capture per-tenant socket usage for rate tuning.
