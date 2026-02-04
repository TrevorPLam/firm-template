// AI-META-BEGIN
// 
// AI-META: Configuration file
// OWNERSHIP: apps/template-site
// ENTRYPOINTS: Loaded by build tools at compile time
// DEPENDENCIES: internal packages (@repo/*)
// DANGER: None identified
// CHANGE-SAFETY: Config values: safe to modify. Schema/structure: coordinate with team
// TESTS: Run: pnpm test && pnpm type-check
// 
// AI-META-END

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/patterns', '@repo/capabilities', '@repo/tokens', '@repo/utils'],
}

module.exports = nextConfig
