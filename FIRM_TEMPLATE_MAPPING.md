# Patterns Mappable to firm-template

**Analysis of which patterns from new apps can be directly applied to firm-template**

---

## Current firm-template State

### ✅ What firm-template Has
- **Next.js 15.5.2** with App Router
- **TypeScript** (strict mode)
- **Security middleware** (CSP, HSTS, etc.)
- **Vitest** for testing
- **Playwright** for E2E
- **ESLint + Prettier** for linting/formatting
- **Sentry** for error tracking
- **Upstash Redis** for rate limiting
- **Governance framework** (`.repo/` structure)
- **Extensive automation scripts** (intelligent, ultra, vibranium)

### ❌ What firm-template Lacks
- **No database layer** (no Prisma, Drizzle, etc.)
- **No repository pattern**
- **No API routes** (only placeholder `app/api/og`)
- **No GraphQL**
- **No plugin system**
- **No multi-provider abstraction**
- **No persistent configuration** (only environment variables)

---

## 🎯 High-Priority Mappings

### 1. **Biome Configuration** (from cal.com)

**Why it fits:**
- firm-template currently uses **ESLint + Prettier** separately
- Biome is a **unified tool** that replaces both
- Better performance and simpler configuration
- Already TypeScript-focused (matches firm-template)

**What to extract:**
```json
// biome.json
{
  "formatter": {
    "lineWidth": 100,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "nursery": {
        "noUnresolvedImports": "warn"
      }
    }
  },
  "overrides": [
    {
      "includes": ["app/**/page.tsx", "app/**/layout.tsx"],
      "linter": {
        "rules": {
          "style": {
            "noDefaultExport": "off"
          }
        }
      }
    }
  ]
}
```

**Implementation Steps:**
1. Install Biome: `npm install --save-dev @biomejs/biome`
2. Replace ESLint config with `biome.json`
3. Replace Prettier with Biome formatter
4. Update `package.json` scripts:
   ```json
   {
     "lint": "biome check .",
     "lint:fix": "biome check --write .",
     "format": "biome format --write ."
   }
   ```
5. Remove ESLint and Prettier dependencies

**Files to modify:**
- `package.json` (scripts, dependencies)
- `eslint.config.mjs` → `biome.json` (replace)
- `.prettierrc` (remove)
- `.lintstagedrc.json` (update to use Biome)

**Benefits:**
- ✅ Single tool instead of two
- ✅ Faster linting/formatting
- ✅ Better TypeScript support
- ✅ Simpler configuration

---

### 2. **Repository Pattern** (from cal.com)

**Why it fits:**
- firm-template has a **placeholder backend** directory
- When they add a database, repository pattern will be essential
- Provides **type safety** and **testability**
- **Select-based queries** improve performance

**What to extract:**
```typescript
// lib/repositories/base-repository.ts
import type { PrismaClient } from '@prisma/client'

export interface IRepository<T, TWhere, TSelect, TCreate, TUpdate> {
  findById(id: number): Promise<T | null>
  findByUid(uid: string): Promise<T | null>
  findMany(where: TWhere): Promise<T[]>
  create(data: TCreate): Promise<T>
  update(where: TWhere, data: TUpdate): Promise<T>
  delete(where: TWhere): Promise<void>
}

export abstract class BaseRepository<T, TWhere, TSelect, TCreate, TUpdate>
  implements IRepository<T, TWhere, TSelect, TCreate, TUpdate>
{
  constructor(protected prismaClient: PrismaClient) {}

  abstract findById(id: number): Promise<T | null>
  abstract findByUid(uid: string): Promise<T | null>
  abstract findMany(where: TWhere): Promise<T[]>
  abstract create(data: TCreate): Promise<T>
  abstract update(where: TWhere, data: TUpdate): Promise<T>
  abstract delete(where: TWhere): Promise<void>
}
```

**Example implementation:**
```typescript
// lib/repositories/user-repository.ts
import { BaseRepository } from './base-repository'
import type { PrismaClient, User } from '@prisma/client'

const userMinimalSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
} as const

export class UserRepository extends BaseRepository<
  User,
  Prisma.UserWhereInput,
  typeof userMinimalSelect,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  async findByUid(uid: string) {
    return await this.prismaClient.user.findUnique({
      where: { uid },
      select: userMinimalSelect, // Select, not include!
    })
  }

  async findByEmail(email: string) {
    return await this.prismaClient.user.findUnique({
      where: { email },
      select: userMinimalSelect,
    })
  }
}
```

**Implementation Steps:**
1. Create `lib/repositories/` directory
2. Add base repository interface and class
3. Create example repository (e.g., `UserRepository`)
4. Add to documentation with usage examples
5. Add to testing patterns

**Files to create:**
- `lib/repositories/base-repository.ts`
- `lib/repositories/user-repository.ts` (example)
- `__tests__/lib/repositories/user-repository.test.ts` (example test)
- `docs/patterns/repository-pattern.md`

**Benefits:**
- ✅ Type-safe data access
- ✅ Easier testing (mock Prisma client)
- ✅ Better performance (select vs include)
- ✅ Consistent patterns across codebase

---

### 3. **Persistent Configuration** (from open-webui)

**Why it fits:**
- firm-template currently uses **environment variables only**
- Some config should be **user-editable** (theme, UI settings)
- Database-backed config allows **runtime changes** without redeployment
- Falls back to environment variables (backward compatible)

**What to extract:**
```typescript
// lib/config/persistent-config.ts
import { getConfig, saveConfig } from './config-db'

export class PersistentConfig<T> {
  private envValue: T
  private configPath: string
  private envName: string

  constructor(envName: string, configPath: string, envValue: T) {
    this.envName = envName
    this.configPath = configPath
    this.envValue = envValue
    
    // Try to load from database, fallback to env
    const dbValue = getConfigValue(configPath)
    this.value = dbValue ?? envValue
  }

  get value(): T {
    return this._value
  }

  set value(newValue: T) {
    this._value = newValue
    saveConfig(this.configPath, newValue)
  }
}

// Usage
export const UI_THEME = new PersistentConfig<string>(
  'UI_THEME',
  'ui.theme',
  process.env.UI_THEME || 'light'
)
```

**Implementation Steps:**
1. Add database schema for config (if using Prisma)
2. Create `lib/config/persistent-config.ts`
3. Create `lib/config/config-db.ts` for database operations
4. Migrate existing env vars to PersistentConfig where appropriate
5. Add config management UI (optional)

**Files to create:**
- `lib/config/persistent-config.ts`
- `lib/config/config-db.ts`
- `app/api/config/route.ts` (API for config management)
- `docs/patterns/persistent-config.md`

**Benefits:**
- ✅ Runtime configuration changes
- ✅ User-editable settings
- ✅ Environment variable fallback
- ✅ Type-safe configuration

---

### 4. **Testing Patterns** (from cal.com)

**Why it fits:**
- firm-template already uses **Vitest**
- Repository pattern makes testing easier
- Select-based queries improve test performance
- Better test organization patterns

**What to extract:**
```typescript
// __tests__/lib/repositories/user-repository.test.ts
import { describe, it, expect, vi } from 'vitest'
import { UserRepository } from '@/lib/repositories/user-repository'
import type { PrismaClient } from '@prisma/client'

describe('UserRepository', () => {
  it('should use select for performance', async () => {
    const mockPrisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
        }),
      },
    } as unknown as PrismaClient

    const repo = new UserRepository(mockPrisma)
    await repo.findByUid('test-uid')

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { uid: 'test-uid' },
      select: userMinimalSelect, // Not include!
    })
  })
})
```

**Implementation Steps:**
1. Create test utilities for mocking Prisma
2. Add example repository tests
3. Document testing patterns
4. Add to testing guidelines

**Files to create:**
- `__tests__/lib/repositories/user-repository.test.ts` (example)
- `__tests__/utils/mock-prisma.ts` (test utilities)
- `docs/testing/repository-pattern.md`

**Benefits:**
- ✅ Easier to test data access
- ✅ Better test performance
- ✅ Consistent testing patterns

---

## 🟡 Medium-Priority Mappings

### 5. **Factory Pattern for Providers** (from esperanto)

**Why it fits:**
- firm-template might add **multiple AI providers** (OpenAI, Anthropic, etc.)
- **Email providers** (SendGrid, Resend, etc.)
- **Storage providers** (S3, Cloudflare R2, etc.)
- Reduces vendor lock-in

**When to implement:**
- When adding first provider abstraction
- Before adding second provider of same type

**What to extract:**
```typescript
// lib/providers/email/factory.ts
export class EmailProviderFactory {
  static create(provider: 'sendgrid' | 'resend' | 'ses', config: EmailConfig) {
    switch (provider) {
      case 'sendgrid':
        return new SendGridProvider(config)
      case 'resend':
        return new ResendProvider(config)
      case 'ses':
        return new SESProvider(config)
      default:
        throw new Error(`Unknown email provider: ${provider}`)
    }
  }
}
```

**Implementation Steps:**
1. Create `lib/providers/` directory structure
2. Define base interface for provider type
3. Implement factory pattern
4. Add to documentation

**Files to create:**
- `lib/providers/email/factory.ts`
- `lib/providers/email/base.ts`
- `lib/providers/email/sendgrid.ts` (example)
- `docs/patterns/factory-pattern.md`

---

### 6. **GraphQL Setup** (from hoppscotch)

**Why it fits:**
- firm-template might add **GraphQL API** in the future
- Better for **complex queries** and **real-time subscriptions**
- NestJS patterns can be adapted to Next.js

**When to implement:**
- When adding GraphQL API
- When needing subscriptions

**What to extract:**
```typescript
// app/api/graphql/route.ts
import { createYoga } from 'graphql-yoga'
import { schema } from '@/lib/graphql/schema'

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: {
    Request: Request,
    Response: Response,
  },
})

export { handleRequest as GET, handleRequest as POST }
```

**Implementation Steps:**
1. Install GraphQL dependencies
2. Create schema
3. Set up GraphQL endpoint
4. Add subscriptions (if needed)

**Files to create:**
- `lib/graphql/schema.ts`
- `app/api/graphql/route.ts`
- `docs/api/graphql.md`

---

## 🔴 Low-Priority Mappings

### 7. **Plugin System** (from eliza)

**Why it's low priority:**
- firm-template is a **template**, not a framework
- Plugin system adds **complexity**
- Most users won't need extensibility

**When to implement:**
- If firm-template becomes a framework
- If users request plugin support

---

### 8. **SST Infrastructure** (from opencode)

**Why it's low priority:**
- firm-template targets **Cloudflare Pages**
- SST is for **AWS/serverless**
- Different deployment target

**When to implement:**
- If adding AWS/serverless deployment option
- If users request SST support

---

## Implementation Roadmap

### Phase 1: Quick Wins (1-2 days)
1. ✅ **Biome Configuration**
   - Replace ESLint + Prettier
   - Update scripts
   - Test linting/formatting

### Phase 2: Foundation (3-5 days)
2. ✅ **Repository Pattern**
   - Create base repository
   - Add example repository
   - Add tests
   - Document pattern

3. ✅ **Testing Patterns**
   - Add test utilities
   - Document testing guidelines
   - Add example tests

### Phase 3: Enhancement (1 week)
4. ✅ **Persistent Configuration**
   - Add database schema (if using Prisma)
   - Create PersistentConfig class
   - Add API routes
   - Document usage

### Phase 4: Future (as needed)
5. ⏳ **Factory Pattern** (when needed)
6. ⏳ **GraphQL** (when needed)
7. ⏳ **Plugin System** (if becomes framework)

---

## Summary

### Immediate Actions
1. **Replace ESLint + Prettier with Biome** (high impact, low effort)
2. **Add repository pattern** (foundation for future database work)
3. **Add persistent configuration** (enables runtime config changes)

### Future Considerations
- Factory pattern when adding multiple providers
- GraphQL when adding complex API needs
- Plugin system if template becomes framework

---

## Files to Create/Modify

### New Files
```
lib/
├── repositories/
│   ├── base-repository.ts
│   └── user-repository.ts (example)
├── config/
│   ├── persistent-config.ts
│   └── config-db.ts
└── providers/
    └── email/
        ├── factory.ts
        └── base.ts

__tests__/
├── lib/
│   └── repositories/
│       └── user-repository.test.ts
└── utils/
    └── mock-prisma.ts

docs/
├── patterns/
│   ├── repository-pattern.md
│   ├── factory-pattern.md
│   └── persistent-config.md
└── testing/
    └── repository-pattern.md
```

### Modified Files
```
package.json (scripts, dependencies)
eslint.config.mjs → biome.json (replace)
.prettierrc (remove)
.lintstagedrc.json (update)
```

---

**Last Updated:** 2024-12-19  
**Target:** firm-template  
**Source Repositories:** cal.com, open-webui, esperanto, hoppscotch
