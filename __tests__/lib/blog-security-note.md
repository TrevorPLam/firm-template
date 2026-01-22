# Blog Path Traversal Test - Security Note

## Issue Discovered

The original test for path traversal protection (`rejects path traversal slugs`) had a **false positive** vulnerability.

### The Problem

The test checks:
```typescript
expect(getPostBySlug('../secret')).toBeUndefined()
```

But `getPostBySlug` returns `undefined` in TWO cases:
1. ✅ **Security rejection** (slug fails `isValidSlug()` check) - GOOD
2. ❌ **File not found** (legitimate slug, but file doesn't exist) - ALSO RETURNS undefined

This means if someone removes the security check:
```typescript
// BROKEN CODE:
export function getPostBySlug(slug: string): BlogPost | undefined {
  try {
    // if (!isValidSlug(slug)) {  // <-- COMMENTED OUT
    //   return undefined
    // }
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')  // Tries to read file
    // ...
  } catch {
    return undefined  // <-- File not found, returns undefined anyway!
  }
}
```

**The test still passes** because `undefined === undefined`, even though the security control is gone!

### What We Tried

We attempted to use `vi.spyOn(fs, 'readFileSync')` to verify the file system is never accessed for malicious slugs, but Vitest can't spy on native Node modules in ESM mode.

### Current Mitigation

1. **Improved test coverage**: Added comprehensive path traversal variations (16 malicious slugs tested)
2. **Documentation**: This file explains the limitation
3. **Code review**: Manual review should verify `isValidSlug()` is called early
4. **Integration test**: E2E test should attempt path traversal via HTTP

### Recommended Future Fix

1. **Refactor for testability**: Extract file system access to separate function:
   ```typescript
   // Separate concerns - easier to mock
   function readPostFile(slug: string): string {
     const fullPath = path.join(postsDirectory, `${slug}.mdx`)
     return fs.readFileSync(fullPath, 'utf8')
   }
   
   export function getPostBySlug(slug: string): BlogPost | undefined {
     if (!isValidSlug(slug)) {
       return undefined  // Now we can verify this path
     }
     
     try {
       const fileContents = readPostFile(slug)  // Can be mocked
       // ...
     } catch {
       return undefined
     }
   }
   ```

2. **Alternative**: Use E2E test with Playwright to verify path traversal returns 404, not /etc/passwd

3. **Static analysis**: Use CodeQL or Semgrep to detect missing `isValidSlug()` calls

## Test Trust Lesson

**False positives are worse than no tests** - they create false confidence.

When testing security controls, always verify:
- The control is actually executed (not bypassed by mocks/stubs)
- The test fails when the control is removed
- The test passes when the control is present AND working
