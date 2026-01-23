# Platform Layer

This directory contains code shared across **ALL** domains in the application.

## Purpose

The platform layer provides:
- Generic, reusable UI components
- Common utilities and helpers
- Shared type definitions
- Infrastructure code (HTTP client, logging, storage)
- Configuration and constants

## What Belongs Here

✅ **Generic UI Components**
- Button, Input, Modal, Dropdown
- Layout components (Container, Grid, Flex)
- Common patterns (Form, Table, Card)

✅ **Utilities**
- Logger, Validator, Formatter
- Date/time utilities
- String manipulation
- Error handling utilities

✅ **Types**
- Result, Error types
- Common domain-agnostic types
- API response types
- Configuration types

✅ **Infrastructure**
- HTTP client
- WebSocket client
- Event bus
- Local storage wrapper
- Cache utilities

✅ **Configuration**
- Environment variables
- Feature flags
- App constants

## What Does NOT Belong Here

❌ **Domain-Specific Logic**
- Business rules belong in domain layers
- Feature-specific code belongs in features
- Domain models belong in domains

❌ **Feature-Specific Components**
- LoginForm belongs in auth/login/ui
- CheckoutWizard belongs in billing/checkout/ui

## Import Rules

See `/.repo/policy/BOUNDARIES.md` for complete details.

---
