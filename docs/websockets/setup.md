---
title: WebSocket Infrastructure Setup
description: WebSocket server setup, auth, and scaling guidance.
---

# WebSocket Infrastructure Setup

## Server Setup Example

```ts
import { Server } from "socket.io";

const io = new Server(httpServer, {
  cors: { origin: process.env.APP_ORIGIN }, // Allow app origin only.
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("unauthorized"));
  return next();
});
```

## Scaling Notes

- Use Redis or another adapter for horizontal scaling.
- Pin sessions to reduce cross-node chatter.
- Monitor connection counts and message rates.
