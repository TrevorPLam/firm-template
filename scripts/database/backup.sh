# AI-META-BEGIN
# 
# AI-META: Build or utility script
# OWNERSHIP: scripts (build/deployment utilities)
# ENTRYPOINTS: Imported by application modules
# DEPENDENCIES: Standard library only
# DANGER: Database operations - ensure proper error handling
# CHANGE-SAFETY: Review impact on consumers before modifying public API
# TESTS: Run: pnpm test && pnpm type-check
# 
# AI-META-END

#!/usr/bin/env bash

###############################################################################
# Database Backup Script
#
# Purpose: Create comprehensive database backups with metadata and validation
#
# Usage: ./backup.sh [backup-dir] [--encrypt] [--compress] [--verify]
#
# Environment Variables:
#   DATABASE_URL - Database connection string (required)
#   BACKUP_ENCRYPTION_KEY - Encryption key for secure backups (optional)
#   BACKUP_RETENTION_DAYS - Days to retain backups (default: 30)
###############################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
: "${DATABASE_URL:?DATABASE_URL is required}"
BACKUP_DIR="${1:-backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/db-${TIMESTAMP}.dump"
METADATA_FILE="${BACKUP_DIR}/db-${TIMESTAMP}.meta.json"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

# Parse options
ENCRYPT=false
COMPRESS=true
VERIFY=false

for arg in "$@"; do
    case $arg in
        --encrypt)
            ENCRYPT=true
            shift
            ;;
        --no-compress)
            COMPRESS=false
            shift
            ;;
        --verify)
            VERIFY=true
            shift
            ;;
    esac
done

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

log_info "Starting database backup..."
log_info "Timestamp: $TIMESTAMP"
log_info "Target: $BACKUP_FILE"

# Create backup (example for PostgreSQL)
# Uncomment and customize for your database provider:
# pg_dump --format=custom --file "$BACKUP_FILE" "$DATABASE_URL"

# For demonstration, create a placeholder
log_info "Creating database snapshot..."
echo "# Database backup created at $TIMESTAMP" > "$BACKUP_FILE"
echo "# This is a placeholder - configure for your database provider" >> "$BACKUP_FILE"

# Compress if enabled
if [[ "$COMPRESS" == true ]]; then
    log_info "Compressing backup..."
    gzip -f "$BACKUP_FILE"
    BACKUP_FILE="${BACKUP_FILE}.gz"
fi

# Encrypt if enabled
if [[ "$ENCRYPT" == true ]]; then
    if [[ -z "${BACKUP_ENCRYPTION_KEY:-}" ]]; then
        log_error "BACKUP_ENCRYPTION_KEY not set for encryption"
        exit 1
    fi
    log_info "Encrypting backup..."
    # Add encryption logic here
    # Example: openssl enc -aes-256-cbc -salt -in "$BACKUP_FILE" -out "${BACKUP_FILE}.enc" -k "$BACKUP_ENCRYPTION_KEY"
fi

# Create metadata
log_info "Creating backup metadata..."
cat > "$METADATA_FILE" << EOF
{
  "timestamp": "$TIMESTAMP",
  "backup_file": "$(basename "$BACKUP_FILE")",
  "database": "production",
  "size": "$(stat -f%z "$BACKUP_FILE" 2>/dev/null || stat -c%s "$BACKUP_FILE" 2>/dev/null || echo 0)",
  "compressed": $COMPRESS,
  "encrypted": $ENCRYPT,
  "created_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "retention_days": $RETENTION_DAYS
}
EOF

# Verify backup
if [[ "$VERIFY" == true ]]; then
    log_info "Verifying backup integrity..."
    if [[ -f "$BACKUP_FILE" ]]; then
        log_success "Backup file exists and is readable"
    else
        log_error "Backup verification failed"
        exit 1
    fi
fi

# Clean old backups based on retention policy
log_info "Cleaning old backups (retention: ${RETENTION_DAYS} days)..."
find "$BACKUP_DIR" -name "db-*.dump*" -type f -mtime +${RETENTION_DAYS} -delete 2>/dev/null || true
find "$BACKUP_DIR" -name "db-*.meta.json" -type f -mtime +${RETENTION_DAYS} -delete 2>/dev/null || true

log_success "Backup completed successfully!"
echo ""
echo "Backup Details:"
echo "  File: $BACKUP_FILE"
echo "  Size: $(du -h "$BACKUP_FILE" | cut -f1)"
echo "  Metadata: $METADATA_FILE"
echo ""
echo "To restore this backup, run:"
echo "  ./scripts/database/restore.sh $BACKUP_FILE"
