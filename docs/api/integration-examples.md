---
title: API Integration Examples
description: Practical examples for frontend and automation clients.
---

# API Integration Examples

Use these samples to integrate frontend apps, automations, and internal tooling with the API gateway.

## Example: fetch submissions (frontend)

```ts
// Client-side example that reads submissions for a specific form.
// Note: keep tokens in secure storage (never in localStorage for production).
const response = await fetch("/api/forms/123/submissions", {
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
  },
});

if (!response.ok) {
  // Inline note: surface a friendly error message for client users.
  throw new Error("Unable to load submissions");
}

const data = await response.json();
```

## Example: submit a form (server)

```ts
// Server-side example that submits to the API with a secure token.
const payload = {
  formId: "contact",
  fields: {
    name: "Alex Doe",
    email: "alex@example.com",
  },
};

const response = await fetch("https://api.example.com/v1/forms/submit", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.API_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});
```

## Example: webhook handler

```ts
// Webhook handler that verifies the signature before processing.
export async function handleWebhook(request: Request) {
  const signature = request.headers.get("x-api-signature");
  // Inline note: reject requests with missing signatures.
  if (!signature) return new Response("Unauthorized", { status: 401 });

  const payload = await request.json();
  // Process the payload with capability-specific logic.
  return new Response("OK");
}
```
