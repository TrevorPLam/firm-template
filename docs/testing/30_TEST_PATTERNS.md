# Test Patterns and Best Practices

This guide provides standard patterns, anti-patterns, and best practices for writing tests in this repository.

## Table of Contents

- [General Principles](#general-principles)
- [Unit Test Patterns](#unit-test-patterns)
- [Integration Test Patterns](#integration-test-patterns)
- [Component Test Patterns](#component-test-patterns)
- [Mocking Strategies](#mocking-strategies)
- [Test Data Management](#test-data-management)
- [Anti-Patterns](#anti-patterns)
- [E2E Patterns](#e2e-patterns)

## General Principles

### 1. Arrange-Act-Assert (AAA)

Structure every test clearly:

```typescript
it('calculates total price with tax', () => {
  // Arrange: Set up test data
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 1 },
  ]
  const taxRate = 0.1
  
  // Act: Execute the function
  const total = calculateTotal(items, taxRate)
  
  // Assert: Verify the result
  expect(total).toBe(27.5) // (10*2 + 5*1) * 1.1
})
```

### 2. One Assertion Per Test (When Possible)

```typescript
// ❌ BAD: Multiple unrelated assertions
it('user validation', () => {
  expect(validateEmail('test@example.com')).toBe(true)
  expect(validatePhone('555-1234')).toBe(true)
  expect(validateAge(25)).toBe(true)
})

// ✅ GOOD: Separate tests
describe('validation', () => {
  it('validates email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })
  
  it('validates phone numbers', () => {
    expect(validatePhone('555-1234')).toBe(true)
  })
  
  it('validates ages', () => {
    expect(validateAge(25)).toBe(true)
  })
})
```

### 3. Descriptive Test Names

```typescript
// ❌ BAD: Vague names
it('works', () => { ... })
it('test 1', () => { ... })
it('edge case', () => { ... })

// ✅ GOOD: Descriptive names
it('returns empty array for no items', () => { ... })
it('throws error when amount is negative', () => { ... })
it('handles concurrent requests correctly', () => { ... })
```

### 4. Test Behavior, Not Implementation

```typescript
// ❌ BAD: Testing implementation details
it('calls array.map exactly once', () => {
  const spy = vi.spyOn(Array.prototype, 'map')
  processItems([1, 2, 3])
  expect(spy).toHaveBeenCalledTimes(1)
})

// ✅ GOOD: Testing behavior
it('transforms all items', () => {
  const result = processItems([1, 2, 3])
  expect(result).toEqual([2, 4, 6])
})
```

## Unit Test Patterns

### Pure Functions

Easiest to test - no side effects:

```typescript
// Function to test
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Test
describe('formatCurrency', () => {
  it('formats USD amounts', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })
  
  it('formats EUR amounts', () => {
    expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56')
  })
  
  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })
  
  it('handles negative amounts', () => {
    expect(formatCurrency(-100)).toBe('-$100.00')
  })
})
```

### Functions with Dependencies

Use dependency injection:

```typescript
// ❌ BAD: Hard-coded dependency
export function getUser(id: string) {
  return database.query('SELECT * FROM users WHERE id = ?', [id])
}

// ✅ GOOD: Injected dependency
export function getUser(id: string, db = database) {
  return db.query('SELECT * FROM users WHERE id = ?', [id])
}

// Test
it('queries database with correct ID', async () => {
  const mockDb = {
    query: vi.fn().mockResolvedValue({ id: '123', name: 'Alice' })
  }
  
  const user = await getUser('123', mockDb)
  
  expect(mockDb.query).toHaveBeenCalledWith(
    'SELECT * FROM users WHERE id = ?',
    ['123']
  )
  expect(user).toEqual({ id: '123', name: 'Alice' })
})
```

### Error Handling

Always test error paths:

```typescript
export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division by zero')
  }
  return a / b
}

describe('divide', () => {
  it('divides numbers', () => {
    expect(divide(10, 2)).toBe(5)
  })
  
  it('throws on division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero')
  })
  
  it('handles negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5)
  })
})
```

### Async Functions

Use `async/await`:

```typescript
export async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}

describe('fetchUser', () => {
  it('fetches user successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: '123', name: 'Alice' }),
    })
    
    const user = await fetchUser('123')
    
    expect(user).toEqual({ id: '123', name: 'Alice' })
  })
  
  it('throws on HTTP error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    })
    
    await expect(fetchUser('123')).rejects.toThrow('HTTP 404')
  })
})
```

## Integration Test Patterns

### Database Tests

Use test database or in-memory database:

```typescript
describe('UserRepository', () => {
  let db: Database
  
  beforeEach(async () => {
    db = await createTestDatabase()
    await db.migrate()
  })
  
  afterEach(async () => {
    await db.close()
  })
  
  it('creates a user', async () => {
    const repo = new UserRepository(db)
    const user = await repo.create({ name: 'Alice', email: 'alice@example.com' })
    
    expect(user.id).toBeDefined()
    expect(user.name).toBe('Alice')
    
    // Verify in database
    const stored = await repo.findById(user.id)
    expect(stored).toEqual(user)
  })
})
```

### API Client Tests

Mock HTTP responses:

```typescript
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: 'Alice' })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ApiClient', () => {
  it('fetches user', async () => {
    const client = new ApiClient('http://localhost')
    const user = await client.getUser('123')
    
    expect(user).toEqual({ id: '123', name: 'Alice' })
  })
  
  it('handles 404 errors', async () => {
    server.use(
      http.get('/api/users/:id', () => {
        return new HttpResponse(null, { status: 404 })
      })
    )
    
    const client = new ApiClient('http://localhost')
    await expect(client.getUser('999')).rejects.toThrow()
  })
})
```

## Component Test Patterns

### React Components

Use Testing Library principles:

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('LoginForm', () => {
  it('renders form fields', () => {
    render(<LoginForm onSubmit={vi.fn()} />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })
  
  it('calls onSubmit with form data', async () => {
    const handleSubmit = vi.fn()
    render(<LoginForm onSubmit={handleSubmit} />)
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))
    
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })
  
  it('shows validation errors', async () => {
    render(<LoginForm onSubmit={vi.fn()} />)
    
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
  })
})
```

### Component with Context

```typescript
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </AuthProvider>
)

it('uses authentication context', () => {
  render(<UserProfile />, { wrapper: TestWrapper })
  
  expect(screen.getByText(/logged in as/i)).toBeInTheDocument()
})
```

## Mocking Strategies

### Mocking Modules

```typescript
// Mock entire module
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: '123', name: 'Alice' }),
}))

// Mock specific exports
vi.mock('./logger', () => ({
  ...vi.importActual('./logger'),
  logError: vi.fn(), // Only mock logError
}))
```

### Mocking Timers

```typescript
describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })
  
  it('delays function execution', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 1000)
    
    debounced()
    expect(fn).not.toHaveBeenCalled()
    
    vi.advanceTimersByTime(1000)
    expect(fn).toHaveBeenCalledOnce()
  })
})
```

### Partial Mocking

```typescript
// Keep most of the real implementation
const realModule = await vi.importActual<typeof import('./utils')>('./utils')

vi.mock('./utils', () => ({
  ...realModule,
  getRandomId: () => 'test-id', // Only override this
}))
```

## Test Data Management

### Factories

Create reusable test data builders:

```typescript
// test/factories/user.ts
export function createUser(overrides: Partial<User> = {}): User {
  return {
    id: Math.random().toString(36),
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(),
    ...overrides,
  }
}

// Use in tests
it('updates user name', () => {
  const user = createUser({ name: 'Alice' })
  const updated = updateUser(user, { name: 'Bob' })
  expect(updated.name).toBe('Bob')
})
```

### Fixtures

Store complex test data:

```typescript
// tests/fixtures/users.json
[
  {
    "id": "user-1",
    "name": "Alice",
    "email": "alice@example.com"
  },
  {
    "id": "user-2",
    "name": "Bob",
    "email": "bob@example.com"
  }
]

// Use in tests
import users from '../fixtures/users.json'

it('filters active users', () => {
  const active = filterActiveUsers(users)
  expect(active).toHaveLength(2)
})
```

## Anti-Patterns

### ❌ Testing Implementation Details

```typescript
// BAD
it('uses useState hook', () => {
  const { result } = renderHook(() => useCounter())
  expect(result.current[0]).toBe(0) // Testing state internals
})

// GOOD
it('increments counter', () => {
  render(<Counter />)
  const button = screen.getByRole('button', { name: /increment/i })
  
  expect(screen.getByText('0')).toBeInTheDocument()
  userEvent.click(button)
  expect(screen.getByText('1')).toBeInTheDocument()
})
```

### ❌ Brittle Snapshots

```typescript
// BAD: Snapshot includes timestamps, IDs
it('renders user', () => {
  expect(render(<User />).container).toMatchSnapshot()
})

// GOOD: Test specific behavior
it('displays user name', () => {
  render(<User name="Alice" />)
  expect(screen.getByText('Alice')).toBeInTheDocument()
})
```

### ❌ Magic Sleeps

```typescript
// BAD
it('loads data', async () => {
  loadData()
  await new Promise(resolve => setTimeout(resolve, 1000))
  expect(getData()).toBeDefined()
})

// GOOD
it('loads data', async () => {
  loadData()
  await waitFor(() => {
    expect(getData()).toBeDefined()
  })
})
```

### ❌ Over-Mocking

```typescript
// BAD: Mocking everything
vi.mock('./database')
vi.mock('./logger')
vi.mock('./cache')
vi.mock('./validator')

// GOOD: Only mock external dependencies
vi.mock('./database') // External system
// Test everything else with real implementations
```

### ❌ Test Interdependence

```typescript
// BAD: Tests depend on each other
describe('user flow', () => {
  let userId: string
  
  it('creates user', async () => {
    userId = await createUser({ name: 'Alice' })
    expect(userId).toBeDefined()
  })
  
  it('updates user', async () => {
    await updateUser(userId, { name: 'Bob' }) // Depends on previous test
    expect(await getUser(userId)).toEqual({ name: 'Bob' })
  })
})

// GOOD: Independent tests
describe('user flow', () => {
  it('creates user', async () => {
    const userId = await createUser({ name: 'Alice' })
    expect(userId).toBeDefined()
  })
  
  it('updates user', async () => {
    const userId = await createUser({ name: 'Alice' })
    await updateUser(userId, { name: 'Bob' })
    expect(await getUser(userId)).toEqual({ name: 'Bob' })
  })
})
```

## E2E Patterns

### Page Object Model

```typescript
// pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}
  
  async goto() {
    await this.page.goto('/login')
  }
  
  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email)
    await this.page.getByLabel('Password').fill(password)
    await this.page.getByRole('button', { name: 'Log in' }).click()
  }
  
  async getErrorMessage() {
    return this.page.getByRole('alert').textContent()
  }
}

// tests/e2e/login.spec.ts
test('user can log in', async ({ page }) => {
  const loginPage = new LoginPage(page)
  
  await loginPage.goto()
  await loginPage.login('test@example.com', 'password123')
  
  await expect(page).toHaveURL('/dashboard')
})
```

### Avoiding Flaky Tests

```typescript
// ❌ BAD: Fixed timeout
await page.waitForTimeout(1000)

// ✅ GOOD: Wait for specific condition
await page.waitForSelector('[data-testid="user-profile"]')

// ✅ GOOD: Playwright auto-waiting
await page.click('button') // Waits for button to be clickable

// ✅ GOOD: Retry assertions
await expect(page.getByText('Loaded')).toBeVisible({ timeout: 5000 })
```

### Test Data Cleanup

```typescript
test.afterEach(async ({ page, context }) => {
  // Clear cookies
  await context.clearCookies()
  
  // Clear local storage
  await page.evaluate(() => localStorage.clear())
  
  // Clean up test data (if API available)
  await cleanupTestUsers()
})
```

## Quick Reference

### Test Structure

```typescript
describe('feature name', () => {
  beforeEach(() => {
    // Setup before each test
  })
  
  afterEach(() => {
    // Cleanup after each test
  })
  
  it('does something specific', () => {
    // Arrange
    const input = createTestData()
    
    // Act
    const result = functionUnderTest(input)
    
    // Assert
    expect(result).toBe(expected)
  })
})
```

### Common Assertions

```typescript
// Values
expect(value).toBe(expected)
expect(value).toEqual(expected)
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()

// Numbers
expect(number).toBeGreaterThan(5)
expect(number).toBeLessThan(10)
expect(number).toBeCloseTo(0.1 + 0.2)

// Strings
expect(string).toMatch(/pattern/)
expect(string).toContain('substring')

// Arrays
expect(array).toHaveLength(3)
expect(array).toContain(item)
expect(array).toEqual([1, 2, 3])

// Objects
expect(object).toHaveProperty('key')
expect(object).toMatchObject({ key: 'value' })

// Functions
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledWith(arg1, arg2)
expect(fn).toHaveBeenCalledTimes(1)

// Promises
await expect(promise).resolves.toBe(value)
await expect(promise).rejects.toThrow(error)

// Exceptions
expect(() => fn()).toThrow()
expect(() => fn()).toThrow('specific message')
```

## Summary

- **Structure**: Use AAA pattern (Arrange-Act-Assert)
- **Names**: Descriptive test names
- **Focus**: Test behavior, not implementation
- **Mocking**: Only mock external dependencies
- **Data**: Use factories and fixtures
- **Avoid**: Snapshots, magic sleeps, test interdependence
- **E2E**: Use Page Object Model, avoid flaky patterns

For more details, see:
- [00_INDEX.md](./00_INDEX.md) - Testing overview
- [10_RUNNING_TESTS.md](./10_RUNNING_TESTS.md) - How to run tests
- [20_COVERAGE.md](./20_COVERAGE.md) - Coverage requirements
