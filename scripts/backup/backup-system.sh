# AI-META-BEGIN
# 
# AI-META: Build or utility script
# OWNERSHIP: scripts (build/deployment utilities)
# ENTRYPOINTS: Imported by application modules
# DEPENDENCIES: Standard library only
# DANGER: Credential handling
# CHANGE-SAFETY: Review impact on consumers before modifying public API
# TESTS: Run: pnpm test && pnpm type-check
# 
# AI-META-END

#!/bin/bash

###############################################################################
# Automated Backup System
#
# Purpose: Create automated backups of databases, files, and configurations
#
# Usage: ./backup-system.sh [options]
#
# Options:
#   --type <all|database|files|config>  Backup type (default: all)
#   --retention <days>                  Retention period (default: 30)
#   --destination <path>                Backup destination
#   --compress                          Enable compression
#   --encrypt                           Enable encryption
#   --notify                            Send notifications
#
# Example: ./backup-system.sh --type database --compress --encrypt
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Default configuration
BACKUP_TYPE="all"
RETENTION_DAYS=30
BACKUP_ROOT="/var/backups/platform"
COMPRESS=false
ENCRYPT=false
NOTIFY=false
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# S3 configuration (optional)
S3_BUCKET="${BACKUP_S3_BUCKET:-}"
S3_PREFIX="backups"

# Notification configuration
NOTIFY_EMAIL="${BACKUP_NOTIFY_EMAIL:-}"
NOTIFY_SLACK="${BACKUP_NOTIFY_SLACK:-}"

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --type)
            BACKUP_TYPE="$2"
            shift 2
            ;;
        --retention)
            RETENTION_DAYS="$2"
            shift 2
            ;;
        --destination)
            BACKUP_ROOT="$2"
            shift 2
            ;;
        --compress)
            COMPRESS=true
            shift
            ;;
        --encrypt)
            ENCRYPT=true
            shift
            ;;
        --notify)
            NOTIFY=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Create backup directories
mkdir -p "$BACKUP_ROOT/database"
mkdir -p "$BACKUP_ROOT/files"
mkdir -p "$BACKUP_ROOT/config"
mkdir -p "$BACKUP_ROOT/logs"

log_info "Starting backup process..."
log_info "Backup type: $BACKUP_TYPE"
log_info "Destination: $BACKUP_ROOT"
log_info "Retention: $RETENTION_DAYS days"

# Track backup status
BACKUP_SUCCESS=true
BACKUP_SUMMARY=()

# Backup database function
backup_database() {
    log_info "Backing up databases..."
    
    local DB_BACKUP_DIR="$BACKUP_ROOT/database"
    local DB_BACKUP_FILE="$DB_BACKUP_DIR/db_backup_$TIMESTAMP.sql"
    
    # Check if PostgreSQL is available
    if command -v pg_dump &> /dev/null; then
        log_info "PostgreSQL detected, backing up..."
        
        # Get database name from environment or use default
        DB_NAME="${POSTGRES_DB:-platform_db}"
        DB_HOST="${POSTGRES_HOST:-localhost}"
        DB_USER="${POSTGRES_USER:-postgres}"
        
        # Perform backup
        if PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump -h "$DB_HOST" -U "$DB_USER" "$DB_NAME" > "$DB_BACKUP_FILE" 2>&1; then
            log_success "Database backup created: $DB_BACKUP_FILE"
            BACKUP_SUMMARY+=("Database: SUCCESS")
        else
            log_error "Database backup failed"
            BACKUP_SUCCESS=false
            BACKUP_SUMMARY+=("Database: FAILED")
            return 1
        fi
    else
        log_warning "PostgreSQL not found, skipping database backup"
        BACKUP_SUMMARY+=("Database: SKIPPED (no PostgreSQL)")
    fi
    
    # Compress if requested
    if [[ "$COMPRESS" == true ]]; then
        log_info "Compressing database backup..."
        gzip "$DB_BACKUP_FILE"
        log_success "Database backup compressed"
    fi
    
    # Encrypt if requested
    if [[ "$ENCRYPT" == true ]] && [[ -n "${BACKUP_ENCRYPTION_KEY:-}" ]]; then
        log_info "Encrypting database backup..."
        local ENCRYPTED_FILE="${DB_BACKUP_FILE}.enc"
        openssl enc -aes-256-cbc -salt -in "$DB_BACKUP_FILE" -out "$ENCRYPTED_FILE" -k "$BACKUP_ENCRYPTION_KEY"
        rm "$DB_BACKUP_FILE"
        log_success "Database backup encrypted"
    fi
}

# Backup files function
backup_files() {
    log_info "Backing up application files..."
    
    local FILES_BACKUP_DIR="$BACKUP_ROOT/files"
    local FILES_BACKUP_FILE="$FILES_BACKUP_DIR/files_backup_$TIMESTAMP.tar"
    
    # Directories to backup
    local BACKUP_DIRS=(
        "$REPO_ROOT/apps"
        "$REPO_ROOT/packages"
        "$REPO_ROOT/services"
        "$REPO_ROOT/docs"
    )
    
    # Create tar archive
    if tar -cf "$FILES_BACKUP_FILE" -C "$REPO_ROOT" \
        --exclude='node_modules' \
        --exclude='.next' \
        --exclude='dist' \
        --exclude='.turbo' \
        apps packages services docs 2>&1; then
        log_success "Files backup created: $FILES_BACKUP_FILE"
        BACKUP_SUMMARY+=("Files: SUCCESS")
    else
        log_error "Files backup failed"
        BACKUP_SUCCESS=false
        BACKUP_SUMMARY+=("Files: FAILED")
        return 1
    fi
    
    # Compress if requested
    if [[ "$COMPRESS" == true ]]; then
        log_info "Compressing files backup..."
        gzip "$FILES_BACKUP_FILE"
        log_success "Files backup compressed"
    fi
}

# Backup configuration function
backup_config() {
    log_info "Backing up configuration files..."
    
    local CONFIG_BACKUP_DIR="$BACKUP_ROOT/config"
    local CONFIG_BACKUP_FILE="$CONFIG_BACKUP_DIR/config_backup_$TIMESTAMP.tar"
    
    # Configuration files to backup
    local CONFIG_FILES=(
        "$REPO_ROOT/.env.example"
        "$REPO_ROOT/package.json"
        "$REPO_ROOT/pnpm-workspace.yaml"
        "$REPO_ROOT/turbo.json"
        "$REPO_ROOT/tsconfig.json"
        "$REPO_ROOT/docker-compose.yml"
    )
    
    # Create tar archive
    if tar -cf "$CONFIG_BACKUP_FILE" -C "$REPO_ROOT" \
        .env.example package.json pnpm-workspace.yaml turbo.json tsconfig.json docker-compose.yml 2>&1; then
        log_success "Config backup created: $CONFIG_BACKUP_FILE"
        BACKUP_SUMMARY+=("Config: SUCCESS")
    else
        log_error "Config backup failed"
        BACKUP_SUCCESS=false
        BACKUP_SUMMARY+=("Config: FAILED")
        return 1
    fi
    
    # Compress if requested
    if [[ "$COMPRESS" == true ]]; then
        log_info "Compressing config backup..."
        gzip "$CONFIG_BACKUP_FILE"
        log_success "Config backup compressed"
    fi
}

# Upload to S3 function
upload_to_s3() {
    if [[ -z "$S3_BUCKET" ]]; then
        log_info "S3 bucket not configured, skipping upload"
        return 0
    fi
    
    log_info "Uploading backups to S3..."
    
    if command -v aws &> /dev/null; then
        if aws s3 sync "$BACKUP_ROOT" "s3://$S3_BUCKET/$S3_PREFIX/" --exclude "*" --include "*.tar*" --include "*.sql*" 2>&1; then
            log_success "Backups uploaded to S3"
            BACKUP_SUMMARY+=("S3 Upload: SUCCESS")
        else
            log_error "S3 upload failed"
            BACKUP_SUMMARY+=("S3 Upload: FAILED")
        fi
    else
        log_warning "AWS CLI not found, skipping S3 upload"
        BACKUP_SUMMARY+=("S3 Upload: SKIPPED (no AWS CLI)")
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    log_info "Cleaning up backups older than $RETENTION_DAYS days..."
    
    find "$BACKUP_ROOT" -type f -mtime +$RETENTION_DAYS -delete 2>&1
    
    log_success "Old backups cleaned up"
}

# Send notifications
send_notifications() {
    if [[ "$NOTIFY" != true ]]; then
        return 0
    fi
    
    log_info "Sending notifications..."
    
    local STATUS="SUCCESS"
    if [[ "$BACKUP_SUCCESS" != true ]]; then
        STATUS="FAILED"
    fi
    
    local MESSAGE="Backup $STATUS\n\nTimestamp: $TIMESTAMP\nType: $BACKUP_TYPE\n\nSummary:\n$(printf '%s\n' "${BACKUP_SUMMARY[@]}")"
    
    # Email notification
    if [[ -n "$NOTIFY_EMAIL" ]] && command -v mail &> /dev/null; then
        echo -e "$MESSAGE" | mail -s "Platform Backup $STATUS" "$NOTIFY_EMAIL"
        log_success "Email notification sent"
    fi
    
    # Slack notification
    if [[ -n "$NOTIFY_SLACK" ]] && command -v curl &> /dev/null; then
        curl -X POST "$NOTIFY_SLACK" \
            -H 'Content-Type: application/json' \
            -d "{\"text\": \"$MESSAGE\"}" 2>&1
        log_success "Slack notification sent"
    fi
}

# Create backup manifest
create_manifest() {
    local MANIFEST_FILE="$BACKUP_ROOT/manifest_$TIMESTAMP.json"
    
    cat > "$MANIFEST_FILE" << EOF
{
  "timestamp": "$TIMESTAMP",
  "type": "$BACKUP_TYPE",
  "retention_days": $RETENTION_DAYS,
  "compressed": $COMPRESS,
  "encrypted": $ENCRYPT,
  "success": $BACKUP_SUCCESS,
  "summary": [
$(printf '    "%s"' "${BACKUP_SUMMARY[@]}" | paste -sd ',' -)
  ]
}
EOF
    
    log_success "Backup manifest created: $MANIFEST_FILE"
}

# Execute backup based on type
case "$BACKUP_TYPE" in
    database)
        backup_database
        ;;
    files)
        backup_files
        ;;
    config)
        backup_config
        ;;
    all)
        backup_database || true
        backup_files || true
        backup_config || true
        ;;
    *)
        log_error "Invalid backup type: $BACKUP_TYPE"
        exit 1
        ;;
esac

# Upload to S3 if configured
upload_to_s3

# Cleanup old backups
cleanup_old_backups

# Create manifest
create_manifest

# Send notifications
send_notifications

# Summary
echo ""
log_info "Backup process completed"
echo ""
echo "Summary:"
printf '%s\n' "${BACKUP_SUMMARY[@]}"
echo ""

if [[ "$BACKUP_SUCCESS" == true ]]; then
    log_success "All backups completed successfully"
    exit 0
else
    log_error "Some backups failed"
    exit 1
fi
