# Architectural Boundaries

## Overview

Boundaries enforce clean architecture and prevent coupling. This document defines the hybrid_domain_feature_layer model, directory patterns, import rules, enforcement methods, and exception processes.

---

## Boundary Model: hybrid_domain_feature_layer

### Model Description

This repository uses a **hybrid model** that combines:
- **Domain-Driven Design**: Top-level organization by business domains
- **Feature Slicing**: Features organized within domains
- **Layered Architecture**: Layers within features (ui, domain, data)

### Structure Pattern

```
src/
├── <domain>/              # Business domain (e.g., auth, billing, analytics)
│   ├── <feature>/         # Feature within domain (e.g., login, signup)
│   │   ├── ui/           # Presentation layer (components, views)
│   │   ├── domain/       # Business logic layer (use cases, entities)
│   │   └── data/         # Data layer (repositories, API clients)
│   └── shared/           # Shared within domain
└── platform/             # Shared across all domains
    ├── ui/               # Shared UI components
    ├── utils/            # Shared utilities
    └── types/            # Shared type definitions
```

### Example

```
src/
├── auth/                  # Authentication domain
│   ├── login/            # Login feature
│   │   ├── ui/          # LoginForm component
│   │   ├── domain/      # Login use case
│   │   └── data/        # Auth API client
│   ├── signup/           # Signup feature
│   │   ├── ui/
│   │   ├── domain/
│   │   └── data/
│   └── shared/          # Shared auth utilities
├── billing/              # Billing domain
│   ├── checkout/
│   ├── subscription/
│   └── shared/
└── platform/            # Shared platform code
    ├── ui/             # Button, Input components
    ├── utils/          # Logger, validator
    └── types/          # Common types
```

---

## Allowed Import Direction

**Rule**: Imports must follow dependency direction. Higher layers can import lower layers, but not vice versa.

### Import Direction: ui → domain → data → shared_platform

```
┌──────────┐
│    UI    │  Can import from domain, data, platform
└────┬─────┘
     ↓
┌──────────┐
│  Domain  │  Can import from data, platform (NOT ui)
└────┬─────┘
     ↓
┌──────────┐
│   Data   │  Can import from platform only (NOT ui, domain)
└────┬─────┘
     ↓
┌──────────┐
│ Platform │  Cannot import from domains (self-contained)
└──────────┘
```

### Allowed Imports (Examples)

✅ **Good: UI imports Domain**
```typescript
// src/auth/login/ui/LoginForm.tsx
import { loginUseCase } from '../domain/loginUseCase';
```

✅ **Good: Domain imports Data**
```typescript
// src/auth/login/domain/loginUseCase.ts
import { authRepository } from '../data/authRepository';
```

✅ **Good: Data imports Platform**
```typescript
// src/auth/login/data/authRepository.ts
import { httpClient } from '@/platform/utils/httpClient';
```

✅ **Good: Any layer imports Platform**
```typescript
// src/auth/login/ui/LoginForm.tsx
import { Button } from '@/platform/ui/Button';
```

### Forbidden Imports (Examples)

❌ **Bad: Domain imports UI**
```typescript
// src/auth/login/domain/loginUseCase.ts
import { LoginForm } from '../ui/LoginForm';  // ❌ VIOLATION
```

❌ **Bad: Data imports Domain**
```typescript
// src/auth/login/data/authRepository.ts
import { loginUseCase } from '../domain/loginUseCase';  // ❌ VIOLATION
```

❌ **Bad: Data imports UI**
```typescript
// src/auth/login/data/authRepository.ts
import { LoginForm } from '../ui/LoginForm';  // ❌ VIOLATION
```

❌ **Bad: Platform imports Domain**
```typescript
// src/platform/utils/logger.ts
import { loginUseCase } from '@/auth/login/domain/loginUseCase';  // ❌ VIOLATION
```

---

## Cross-Feature Imports

**Rule**: Features within the same domain should minimize cross-feature imports. Cross-feature imports require justification.

### Within Same Domain

**Allowed**: Import from sibling feature's domain or data layers (with justification)

✅ **Acceptable: Reusing domain logic**
```typescript
// src/auth/signup/domain/signupUseCase.ts
import { validatePassword } from '@/auth/login/domain/passwordValidator';  // ✅ OK with justification
```

**Requires ADR**: Multiple features depending on each other suggests missing shared layer

❌ **Bad: Tight coupling between features**
```typescript
// src/auth/signup/ui/SignupForm.tsx
import { LoginForm } from '@/auth/login/ui/LoginForm';  // ❌ Requires ADR or refactor
```

**Better**: Extract to shared
```typescript
// src/auth/shared/ui/AuthForm.tsx
export const AuthForm = ...;

// src/auth/login/ui/LoginForm.tsx
import { AuthForm } from '@/auth/shared/ui/AuthForm';  // ✅ Good

// src/auth/signup/ui/SignupForm.tsx
import { AuthForm } from '@/auth/shared/ui/AuthForm';  // ✅ Good
```

### Cross-Domain Imports

**Rule**: Cross-domain imports require ADR and architectural review.

**Why**: Cross-domain dependencies create coupling and make domains harder to evolve independently.

❌ **Bad: Direct cross-domain dependency**
```typescript
// src/billing/checkout/domain/checkoutUseCase.ts
import { loginUseCase } from '@/auth/login/domain/loginUseCase';  // ❌ Requires ADR
```

**Better**: Use platform layer or events
```typescript
// src/billing/checkout/domain/checkoutUseCase.ts
import { EventBus } from '@/platform/events/EventBus';
EventBus.emit('user.authenticated', { userId });  // ✅ Decoupled
```

---

## Platform Directory

**Purpose**: `src/platform/` contains code shared across ALL domains.

### What Belongs in Platform

- ✅ Generic UI components (Button, Input, Modal)
- ✅ Utility functions (logger, validator, formatter)
- ✅ Type definitions used everywhere (Result, Error types)
- ✅ Infrastructure (HTTP client, event bus, storage)
- ✅ Configuration and constants

### What Does NOT Belong in Platform

- ❌ Domain-specific logic (belongs in domain)
- ❌ Feature-specific code (belongs in feature)
- ❌ Business rules (belongs in domain layer)

### Platform Import Rules

- Platform code **CANNOT** import from domains
- Platform code **CAN** import other platform code
- Platform code should be self-contained and reusable

---

## Enforcement Method

**Method**: `hybrid_static_checker_plus_manifest`

### How It Works

1. **Static Checker**: Linter/compiler plugin checks imports at build time
   - Detects wrong-direction imports (data → domain, domain → ui)
   - Detects forbidden patterns (platform → domain)
   - Fast feedback during development

2. **Manifest**: `/.repo/repo.manifest.yaml` defines allowed boundary exceptions
   - Explicit list of permitted cross-boundary imports
   - Requires justification for each exception
   - Single source of truth

3. **CI Check**: `commands.check:boundaries` runs on every PR
   - Validates no unauthorized boundary violations
   - Checks manifest is up to date
   - Blocks merge if violations found

### Example Manifest Entry

```yaml
boundaries:
  enforcement: hybrid_static_checker_plus_manifest
  edges_model: explicit_allowlist
  edges:
    - from: "src/auth/signup/domain"
      to: "src/auth/login/domain"
      reason: "Password validation shared"
      approved_by: "architect@example.com"
      approved_date: "2026-01-23"
      review_by: "2026-07-23"  # 6-month review
```

---

## Exception Process

### Small Exceptions (< 3 cross-boundary imports)

1. **Document in PR**: Explain why boundary crossing is needed
2. **Add to Manifest**: Update `/.repo/repo.manifest.yaml` with entry
3. **Get Review**: Architect or tech lead approves
4. **Merge**: PR can merge with documented exception

### Large Exceptions (≥ 3 cross-boundary imports OR pattern)

1. **Create ADR**: Document architectural decision
   - Why is boundary crossing needed?
   - What alternatives were considered?
   - What's the long-term plan?
2. **Architectural Review**: Architect and team review
3. **Add to Manifest**: Update manifest with references to ADR
4. **Create Remediation Plan**: If this is technical debt, plan to fix it
5. **Merge**: PR can merge after ADR approved

---

## Violation Severity

**Severity**: `waiver_plus_auto_task`

### How It Works

1. **Violation Detected**: Boundary checker finds unauthorized import
2. **Waiver Generated**: Auto-waiver created for violation
3. **Auto-Task Created**: Task to fix violation (refactor, extract to shared, etc.)
4. **Expiration**: 90 days (longer than quality gates due to refactoring complexity)
5. **Tracking**: Violation tracked until resolved

### Remediation Options

- **Extract to Shared**: Move shared code to appropriate shared layer
- **Use Abstraction**: Introduce interface or event to decouple
- **Refactor**: Restructure code to respect boundaries
- **Accept**: Document in manifest with ADR if boundary is correct

---

## Boundary Visibility Requirements

### Public vs Private

**Rule**: Layers should export only what's needed by other layers.

```typescript
// src/auth/login/domain/index.ts
export { loginUseCase } from './loginUseCase';  // ✅ Public API
export type { LoginResult } from './types';      // ✅ Public type

// Internal helpers NOT exported
// - validateInput (internal only)
// - formatError (internal only)
```

### Barrel Files

**Recommended**: Use index.ts barrel files to define public API of each layer.

```typescript
// src/auth/login/domain/index.ts
export * from './loginUseCase';
export * from './types';
// Everything else is internal
```

---

## Practical Examples

### Example 1: Correct Layering

```typescript
// ✅ UI layer
// src/auth/login/ui/LoginForm.tsx
import { loginUseCase } from '../domain/loginUseCase';  // ✅ UI → Domain
import { Button } from '@/platform/ui/Button';          // ✅ UI → Platform

export const LoginForm = () => {
  const handleLogin = () => loginUseCase.execute(...);
  return <Button onClick={handleLogin}>Login</Button>;
};

// ✅ Domain layer
// src/auth/login/domain/loginUseCase.ts
import { authRepository } from '../data/authRepository';  // ✅ Domain → Data
import { logger } from '@/platform/utils/logger';         // ✅ Domain → Platform

export const loginUseCase = {
  execute: (username, password) => {
    logger.info('Login attempt');
    return authRepository.authenticate(username, password);
  }
};

// ✅ Data layer
// src/auth/login/data/authRepository.ts
import { httpClient } from '@/platform/utils/httpClient';  // ✅ Data → Platform

export const authRepository = {
  authenticate: (username, password) => {
    return httpClient.post('/api/auth/login', { username, password });
  }
};
```

### Example 2: Boundary Violation

```typescript
// ❌ Domain importing UI (WRONG DIRECTION)
// src/auth/login/domain/loginUseCase.ts
import { LoginForm } from '../ui/LoginForm';  // ❌ VIOLATION: Domain → UI

// ❌ Data importing Domain (WRONG DIRECTION)
// src/auth/login/data/authRepository.ts
import { loginUseCase } from '../domain/loginUseCase';  // ❌ VIOLATION: Data → Domain
```

### Example 3: Correct Cross-Feature Sharing

```typescript
// ✅ Extract to shared layer
// src/auth/shared/validation/passwordValidator.ts
export const validatePassword = (password) => { ... };

// ✅ Both features use shared code
// src/auth/login/domain/loginUseCase.ts
import { validatePassword } from '@/auth/shared/validation/passwordValidator';

// src/auth/signup/domain/signupUseCase.ts
import { validatePassword } from '@/auth/shared/validation/passwordValidator';
```

---

## Boundary Checker Tool

### Running Boundary Checks

```bash
# From manifest
npm run check:boundaries

# Manual
npx eslint --plugin boundaries src/
```

### Output Example

```
❌ Boundary Violation
  File: src/auth/login/domain/loginUseCase.ts:5
  Import: '../ui/LoginForm'
  Violation: domain → ui (wrong direction)
  Fix: Remove UI import from domain layer

✅ All boundaries respected
  Files checked: 247
  Violations: 0
```

---

**Version**: 2.2  
**Last Updated**: 2026-01-23  
**Authority**: Constitution Article 4 (Incremental Delivery) + Principle P13 (Respect Boundaries)
