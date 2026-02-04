<!--
META: Client Onboarding Scripts Directory
AUTHOR: Platform Team
CREATED: 2026-02-04
UPDATED: 2026-02-04
PURPOSE: Automated client provisioning and onboarding tools
-->

# Client Onboarding Scripts

This directory contains automation scripts for client site provisioning, validation, and progress tracking.

## 🚀 Quick Start

### Interactive Wizard (Recommended)
```bash
node onboarding-wizard.js
```

The wizard guides you through complete client setup with theme customization and integration configuration.

### Script-Based Provisioning
```bash
./provision-client.sh acme-corp --theme-primary "#FF5733"
```

## 📋 Available Scripts

### 1. onboarding-wizard.js

**Purpose**: Interactive CLI wizard for complete automated onboarding

**Features**:
- Step-by-step guided process
- Input validation
- Theme customization
- Integration setup
- Progress tracking
- Post-provisioning summary

**Usage**:
```bash
node onboarding-wizard.js
```

### 2. provision-client.sh

**Purpose**: Automated script-based client provisioning

**Options**:
- `--theme-primary` - Primary brand color (hex)
- `--theme-secondary` - Secondary brand color (hex)
- `--skip-git` - Skip git operations
- `--dry-run` - Preview without executing

**Usage**:
```bash
./provision-client.sh <client-name> [options]
```

**Example**:
```bash
./provision-client.sh acme-corp \
  --theme-primary "#FF5733" \
  --theme-secondary "#00AA66"
```

### 3. validate-client.sh

**Purpose**: Validate provisioned client for completeness

**Checks**:
- Directory structure
- Package configuration
- Theme files
- Environment setup
- Documentation
- TypeScript/Next.js config

**Usage**:
```bash
./validate-client.sh <client-name>
```

**Exit Codes**:
- `0` - Validation passed
- `1` - Validation failed

### 4. track-progress.js

**Purpose**: Monitor onboarding progress and completion status

**Features**:
- Weighted progress calculation
- Visual progress bars
- Dashboard for all clients
- Detailed checklist tracking

**Usage**:
```bash
# View all clients
node track-progress.js

# View specific client
node track-progress.js <client-name>
```

**Output Example**:
```
Client: acme-corp
──────────────────────────────────────────────────
Progress: ██████████████████████████████ 100%
Completed: 9/9 items

  ✓ Client directory created
  ✓ Package configuration
  ✓ Theme configuration
  ...
```

## 🔄 Complete Workflow

### Standard Onboarding Process

1. **Run Wizard** (5-10 min)
   ```bash
   node onboarding-wizard.js
   ```

2. **Validate Setup** (2-5 min)
   ```bash
   ./validate-client.sh acme-corp
   ```

3. **Check Progress** (1 min)
   ```bash
   node track-progress.js acme-corp
   ```

4. **Customize Content** (30-60 min)
   - Edit theme files
   - Update content
   - Configure integrations

5. **Test & Deploy** (15-30 min)
   ```bash
   pnpm --filter @repo/acme-corp dev
   pnpm --filter @repo/acme-corp build
   ```

## 📊 Progress Tracking

The system tracks completion of key onboarding items:

- ✅ Client directory (10%)
- ✅ Package config (10%)
- ✅ Theme configuration (15%)
- ✅ Environment setup (10%)
- ✅ Documentation (10%)
- ✅ Client config file (15%)
- ✅ Content customization (15%)
- ✅ Deployment config (10%)
- ✅ Testing setup (5%)

## 📚 Documentation

### Comprehensive Guides
- [Automated Onboarding Guide](../../docs/onboarding/AUTOMATED_ONBOARDING.md) - Complete documentation
- [Client Provisioning](../../docs/onboarding/CLIENT_PROVISIONING.md) - Provisioning details
- [Theme Customization](../../docs/design/THEMING.md) - Theme configuration

### Quick Reference

```bash
# Interactive wizard
node onboarding-wizard.js

# Script-based provisioning
./provision-client.sh acme-corp --theme-primary "#FF5733"

# Validation
./validate-client.sh acme-corp

# Progress tracking
node track-progress.js acme-corp

# Dry run (preview)
./provision-client.sh test-client --dry-run
```

## 🛠️ Troubleshooting

### Common Issues

**Provisioning fails**
- Check client name format (lowercase-with-hyphens)
- Verify template-site exists
- Ensure no existing client with same name

**Validation errors**
- Review specific error messages
- Check files exist in expected locations
- Verify package.json configuration

**Progress shows 0%**
- Verify provisioning completed
- Check client directory exists
- Run validation first

See [Troubleshooting Guide](../../docs/onboarding/AUTOMATED_ONBOARDING.md#troubleshooting) for detailed solutions.

## 🎯 Best Practices

1. **Use the wizard** for new clients (ensures completeness)
2. **Validate immediately** after provisioning
3. **Track progress** regularly during customization
4. **Test locally** before deploying
5. **Document custom requirements** in client README

---

**Last Updated**: 2026-02-04  
**Version**: 1.0.0  
**Maintainer**: Platform Team
