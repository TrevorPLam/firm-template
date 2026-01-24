# Onboarding

## Overview

This template ships with a Next.js application and an optional placeholder backend directory. The organization’s standard stack is **Django 4.2** on **Python 3.11** for backend services and **React 18** + **TypeScript** for frontend work (the active app here is Next.js with React). If a standalone backend is added later, align it to that standard stack.

## Prerequisites

- Node.js 20+
- npm 10+

## Environment Setup

1. Copy the example file and create your local environment file:

```bash
cp .env.example .env.local
```

2. Populate required variables (defined in `lib/env.ts`):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `HUBSPOT_PRIVATE_APP_TOKEN`

3. Optional variables have defaults or graceful fallbacks, but are recommended in production:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

4. Add optional email and scheduling provider settings only if you intend to use them:

- `EMAIL_PROVIDER`, `EMAIL_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_TO_ADDRESS`, `EMAIL_SEND_THANK_YOU`
- `SCHEDULING_PROVIDER`, `CALENDLY_URL`, `CALCOM_USERNAME`

## Run the App

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to confirm the site is running.
