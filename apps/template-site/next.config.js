/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/patterns', '@repo/capabilities', '@repo/tokens', '@repo/utils'],
}

module.exports = nextConfig
