# Client Onboarding Scripts

This directory contains automation scripts for client site provisioning and management.

## Scripts

### provision-client.sh

Automates the creation of new client sites from the template.

```bash
./provision-client.sh <client-name> [options]
```

See [../docs/onboarding/CLIENT_PROVISIONING.md](../../docs/onboarding/CLIENT_PROVISIONING.md) for full documentation.

### validate-client.sh

Validates a provisioned client site for completeness.

```bash
./validate-client.sh <client-name>
```

Checks:
- Directory structure
- Package configuration
- Theme files
- Environment setup
- Documentation

## Quick Reference

```bash
# Create new client
./provision-client.sh acme-corp --theme-primary "#FF5733"

# Validate client
./validate-client.sh acme-corp

# Dry run (preview only)
./provision-client.sh test-client --dry-run
```

## Documentation

See [../../docs/onboarding/CLIENT_PROVISIONING.md](../../docs/onboarding/CLIENT_PROVISIONING.md) for complete guide.
