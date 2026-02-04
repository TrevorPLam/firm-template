# Client Onboarding System

**Status:** Production Ready  
**Version:** 1.0  
**Last Updated:** 2026-02-04

## Overview

The automated client onboarding system streamlines the process of provisioning new client sites from the template. It handles:

- Site scaffolding from template
- Theme configuration generation
- Package and workspace configuration
- Environment setup
- Documentation generation

## Quick Start

### Basic Usage

```bash
# Provision a new client with default theme
./scripts/onboarding/provision-client.sh acme-corp

# Provision with custom colors
./scripts/onboarding/provision-client.sh acme-corp \
  --theme-primary "#FF5733" \
  --theme-secondary "#33C3FF"

# Dry run (preview without changes)
./scripts/onboarding/provision-client.sh acme-corp --dry-run
```

## Script: provision-client.sh

### Purpose

Automates creation of new client sites from the template-site with minimal manual intervention.

### Options

| Option | Description | Default | Required |
|--------|-------------|---------|----------|
| `client-name` | Client identifier (lowercase, hyphens) | - | Yes |
| `--theme-primary` | Primary brand color (hex) | `#0066CC` | No |
| `--theme-secondary` | Secondary brand color (hex) | `#00AA66` | No |
| `--dry-run` | Preview operations without executing | `false` | No |
| `--skip-git` | Skip git operations (future use) | `false` | No |

### What It Does

1. **Validates Input**
   - Checks client name format (lowercase, hyphens, numbers only)
   - Verifies template directory exists
   - Ensures client doesn't already exist

2. **Creates Client Directory**
   - Copies entire `apps/template-site` to `apps/{client-name}`
   - Preserves all configuration and code

3. **Generates Theme Configuration**
   - Creates `packages/tokens/src/themes/{client-name}/index.ts`
   - Includes primary and secondary colors
   - Sets up typography and spacing structure

4. **Updates Package Configuration**
   - Modifies `package.json` with correct package name
   - Sets up workspace references

5. **Creates Environment Configuration**
   - Generates `.env.example` with client-specific variables
   - Includes analytics, integrations, and API configuration

6. **Generates Documentation**
   - Creates client-specific `README.md`
   - Documents setup steps and customization paths
   - Includes provisioning metadata

### Example Output

```
[INFO] Starting client provisioning for: acme-corp
[INFO] Repository root: /home/runner/work/firm-template/firm-template
[INFO] Step 1: Copying template to new client directory...
[SUCCESS] Template copied successfully
[INFO] Step 2: Creating theme configuration...
[SUCCESS] Theme configuration created
[INFO] Step 3: Updating package.json...
[SUCCESS] package.json updated
[INFO] Step 4: Creating client-specific environment configuration...
[SUCCESS] Environment configuration created
[INFO] Step 5: Creating client documentation...
[SUCCESS] Client documentation created
[INFO] Step 6: Updating workspace configuration...
[SUCCESS] Workspace configuration verified

[SUCCESS] ✓ Client provisioning completed successfully!

Next steps:
  1. Review and customize theme: packages/tokens/src/themes/acme-corp/index.ts
  2. Configure environment: apps/acme-corp/.env.local
  3. Customize content in: apps/acme-corp/app
  4. Run dev server: pnpm --filter @repo/acme-corp dev

Happy building! 🚀
```

## Post-Provisioning Workflow

### 1. Theme Customization

Edit `packages/tokens/src/themes/{client-name}/index.ts`:

```typescript
export const acmeCorpTheme = {
  colors: {
    primary: '#FF5733',
    secondary: '#33C3FF',
    accent: '#FFC300',
    background: '#FFFFFF',
    text: '#333333',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFamily: 'Poppins, sans-serif',
  },
  spacing: {
    containerMaxWidth: '1280px',
  },
};
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_SITE_NAME="Acme Corp"
NEXT_PUBLIC_SITE_URL="https://acmecorp.com"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_HUBSPOT_PORTAL_ID="12345678"
```

### 3. Content Customization

Update content in `apps/{client-name}/app/`:
- Page content and metadata
- Navigation structure
- Form configurations
- Integration settings

### 4. Development

```bash
# Install dependencies (if new packages added)
pnpm install

# Start development server
pnpm --filter @repo/{client-name} dev

# Build for production
pnpm --filter @repo/{client-name} build
```

## Directory Structure

After provisioning, the following structure is created:

```
apps/{client-name}/
├── app/                    # Next.js app directory
├── package.json           # Package configuration
├── .env.example           # Environment template
├── README.md              # Client documentation
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration

packages/tokens/src/themes/{client-name}/
└── index.ts               # Theme configuration
```

## Best Practices

### Naming Conventions

- **Client names**: lowercase with hyphens (e.g., `acme-corp`, `widget-co`)
- **Theme exports**: camelCase with "Theme" suffix (e.g., `acmeCorpTheme`)
- **Package names**: scoped with `@repo/` prefix (e.g., `@repo/acme-corp`)

### Theme Design

1. **Start with brand colors**: Primary, secondary, and accent
2. **Test accessibility**: Ensure sufficient color contrast
3. **Use semantic naming**: Base theme decisions on usage, not appearance
4. **Document customizations**: Add comments for any complex overrides

### Configuration Management

1. **Never commit .env.local**: Contains sensitive keys
2. **Keep .env.example updated**: Document all required variables
3. **Use environment-specific configs**: Separate dev/staging/production
4. **Validate configurations**: Check required variables on startup

## Troubleshooting

### Common Issues

**Issue: "Client directory already exists"**
```bash
# Solution: Use a different name or remove existing client
rm -rf apps/existing-client
```

**Issue: "Template directory not found"**
```bash
# Solution: Ensure you're in the repository root
cd /path/to/firm-template
./scripts/onboarding/provision-client.sh client-name
```

**Issue: "Invalid client name format"**
```bash
# Solution: Use lowercase letters, numbers, and hyphens only
# Bad: Acme_Corp, ACME, acme.corp
# Good: acme-corp, acme, acme123
```

### Validation

Test provisioning with dry-run before executing:

```bash
./scripts/onboarding/provision-client.sh new-client --dry-run
```

## Future Enhancements

Planned improvements:

- [ ] Interactive wizard mode with prompts
- [ ] Template selection (multiple templates)
- [ ] Git branch creation and initial commit
- [ ] Automatic deployment configuration
- [ ] Client metadata database integration
- [ ] Validation and testing automation
- [ ] Rollback functionality
- [ ] Bulk provisioning support

## Related Documentation

- [Platform Architecture](../docs/PLATFORM.md)
- [Client Sites Guide](../docs/archive/CLIENT_SITES.md)
- [Theme System](../packages/tokens/README.md)
- [Contributing Guide](../CONTRIBUTING.md)

## Support

For issues or questions:
1. Check this documentation
2. Review existing client implementations
3. Consult team documentation
4. Contact platform team

---

**Maintained by:** Platform Team  
**Repository:** firm-template  
**License:** Proprietary
