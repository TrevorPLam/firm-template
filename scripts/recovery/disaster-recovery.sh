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
# Disaster Recovery System
#
# Purpose: Restore system from backups during disaster recovery
#
# Usage: ./disaster-recovery.sh [options]
#
# Options:
#   --type <all|database|files|config>  Recovery type (default: all)
#   --backup-dir <path>                 Backup source directory
#   --timestamp <YYYYMMDD_HHMMSS>       Specific backup timestamp
#   --verify                            Verify backup integrity
#   --dry-run                           Show what would be restored
#
# Example: ./disaster-recovery.sh --type database --timestamp 20260204_120000
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Default configuration
RECOVERY_TYPE="all"
BACKUP_ROOT="/var/backups/platform"
TIMESTAMP=""
VERIFY=false
DRY_RUN=false
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

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
            RECOVERY_TYPE="$2"
            shift 2
            ;;
        --backup-dir)
            BACKUP_ROOT="$2"
            shift 2
            ;;
        --timestamp)
            TIMESTAMP="$2"
            shift 2
            ;;
        --verify)
            VERIFY=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Verify backup directory exists
if [[ ! -d "$BACKUP_ROOT" ]]; then
    log_error "Backup directory not found: $BACKUP_ROOT"
    exit 1
fi

log_info "Starting disaster recovery process..."
log_info "Recovery type: $RECOVERY_TYPE"
log_info "Backup source: $BACKUP_ROOT"

# Find latest backup if timestamp not specified
if [[ -z "$TIMESTAMP" ]]; then
    log_info "No timestamp specified, finding latest backup..."
    TIMESTAMP=$(ls -t "$BACKUP_ROOT/database" | grep "db_backup" | head -1 | sed 's/db_backup_\(.*\)\.sql.*/\1/')
    if [[ -z "$TIMESTAMP" ]]; then
        log_error "No backups found"
        exit 1
    fi
    log_info "Using latest backup: $TIMESTAMP"
fi

# Track recovery status
RECOVERY_SUCCESS=true
RECOVERY_SUMMARY=()

# Verify backup integrity
verify_backup() {
    log_info "Verifying backup integrity..."
    
    local ALL_GOOD=true
    
    # Check database backup
    if [[ -f "$BACKUP_ROOT/database/db_backup_$TIMESTAMP.sql" ]] || \
       [[ -f "$BACKUP_ROOT/database/db_backup_$TIMESTAMP.sql.gz" ]]; then
        log_success "Database backup found"
    else
        log_warning "Database backup not found for timestamp: $TIMESTAMP"
        ALL_GOOD=false
    fi
    
    # Check files backup
    if [[ -f "$BACKUP_ROOT/files/files_backup_$TIMESTAMP.tar" ]] || \
       [[ -f "$BACKUP_ROOT/files/files_backup_$TIMESTAMP.tar.gz" ]]; then
        log_success "Files backup found"
    else
        log_warning "Files backup not found for timestamp: $TIMESTAMP"
        ALL_GOOD=false
    fi
    
    # Check config backup
    if [[ -f "$BACKUP_ROOT/config/config_backup_$TIMESTAMP.tar" ]] || \
       [[ -f "$BACKUP_ROOT/config/config_backup_$TIMESTAMP.tar.gz" ]]; then
        log_success "Config backup found"
    else
        log_warning "Config backup not found for timestamp: $TIMESTAMP"
        ALL_GOOD=false
    fi
    
    if [[ "$ALL_GOOD" == true ]]; then
        log_success "Backup integrity verified"
        return 0
    else
        log_error "Backup integrity check failed"
        return 1
    fi
}

# Restore database
restore_database() {
    log_info "Restoring database..."
    
    local DB_BACKUP_FILE="$BACKUP_ROOT/database/db_backup_$TIMESTAMP.sql"
    
    # Check for compressed backup
    if [[ ! -f "$DB_BACKUP_FILE" ]] && [[ -f "${DB_BACKUP_FILE}.gz" ]]; then
        log_info "Decompressing database backup..."
        gunzip -k "${DB_BACKUP_FILE}.gz"
    fi
    
    # Check for encrypted backup
    if [[ ! -f "$DB_BACKUP_FILE" ]] && [[ -f "${DB_BACKUP_FILE}.enc" ]]; then
        log_info "Decrypting database backup..."
        openssl enc -aes-256-cbc -d -in "${DB_BACKUP_FILE}.enc" -out "$DB_BACKUP_FILE" -k "$BACKUP_ENCRYPTION_KEY"
    fi
    
    if [[ ! -f "$DB_BACKUP_FILE" ]]; then
        log_error "Database backup file not found: $DB_BACKUP_FILE"
        RECOVERY_SUCCESS=false
        RECOVERY_SUMMARY+=("Database: FAILED (file not found)")
        return 1
    fi
    
    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY RUN] Would restore database from: $DB_BACKUP_FILE"
        RECOVERY_SUMMARY+=("Database: DRY RUN")
        return 0
    fi
    
    # Get database credentials
    DB_NAME="${POSTGRES_DB:-platform_db}"
    DB_HOST="${POSTGRES_HOST:-localhost}"
    DB_USER="${POSTGRES_USER:-postgres}"
    
    # Restore database
    if command -v psql &> /dev/null; then
        log_info "Dropping existing database..."
        PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "$DB_HOST" -U "$DB_USER" -c "DROP DATABASE IF EXISTS $DB_NAME;" postgres
        
        log_info "Creating new database..."
        PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "$DB_HOST" -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;" postgres
        
        log_info "Restoring database from backup..."
        if PGPASSWORD="${POSTGRES_PASSWORD}" psql -h "$DB_HOST" -U "$DB_USER" "$DB_NAME" < "$DB_BACKUP_FILE" 2>&1; then
            log_success "Database restored successfully"
            RECOVERY_SUMMARY+=("Database: SUCCESS")
        else
            log_error "Database restore failed"
            RECOVERY_SUCCESS=false
            RECOVERY_SUMMARY+=("Database: FAILED")
            return 1
        fi
    else
        log_error "PostgreSQL not found"
        RECOVERY_SUCCESS=false
        RECOVERY_SUMMARY+=("Database: FAILED (no PostgreSQL)")
        return 1
    fi
}

# Restore files
restore_files() {
    log_info "Restoring application files..."
    
    local FILES_BACKUP_FILE="$BACKUP_ROOT/files/files_backup_$TIMESTAMP.tar"
    
    # Check for compressed backup
    if [[ ! -f "$FILES_BACKUP_FILE" ]] && [[ -f "${FILES_BACKUP_FILE}.gz" ]]; then
        log_info "Decompressing files backup..."
        gunzip -k "${FILES_BACKUP_FILE}.gz"
    fi
    
    if [[ ! -f "$FILES_BACKUP_FILE" ]]; then
        log_error "Files backup not found: $FILES_BACKUP_FILE"
        RECOVERY_SUCCESS=false
        RECOVERY_SUMMARY+=("Files: FAILED (file not found)")
        return 1
    fi
    
    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY RUN] Would restore files from: $FILES_BACKUP_FILE"
        log_info "[DRY RUN] Files in backup:"
        tar -tzf "$FILES_BACKUP_FILE" | head -20
        RECOVERY_SUMMARY+=("Files: DRY RUN")
        return 0
    fi
    
    # Extract files
    if tar -xf "$FILES_BACKUP_FILE" -C "$REPO_ROOT" 2>&1; then
        log_success "Files restored successfully"
        RECOVERY_SUMMARY+=("Files: SUCCESS")
    else
        log_error "Files restore failed"
        RECOVERY_SUCCESS=false
        RECOVERY_SUMMARY+=("Files: FAILED")
        return 1
    fi
}

# Restore configuration
restore_config() {
    log_info "Restoring configuration files..."
    
    local CONFIG_BACKUP_FILE="$BACKUP_ROOT/config/config_backup_$TIMESTAMP.tar"
    
    # Check for compressed backup
    if [[ ! -f "$CONFIG_BACKUP_FILE" ]] && [[ -f "${CONFIG_BACKUP_FILE}.gz" ]]; then
        log_info "Decompressing config backup..."
        gunzip -k "${CONFIG_BACKUP_FILE}.gz"
    fi
    
    if [[ ! -f "$CONFIG_BACKUP_FILE" ]]; then
        log_error "Config backup not found: $CONFIG_BACKUP_FILE"
        RECOVERY_SUCCESS=false
        RECOVERY_SUMMARY+=("Config: FAILED (file not found)")
        return 1
    fi
    
    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY RUN] Would restore config from: $CONFIG_BACKUP_FILE"
        log_info "[DRY RUN] Config files in backup:"
        tar -tzf "$CONFIG_BACKUP_FILE"
        RECOVERY_SUMMARY+=("Config: DRY RUN")
        return 0
    fi
    
    # Extract config files
    if tar -xf "$CONFIG_BACKUP_FILE" -C "$REPO_ROOT" 2>&1; then
        log_success "Configuration restored successfully"
        RECOVERY_SUMMARY+=("Config: SUCCESS")
    else
        log_error "Configuration restore failed"
        RECOVERY_SUCCESS=false
        RECOVERY_SUMMARY+=("Config: FAILED")
        return 1
    fi
}

# Post-recovery tasks
post_recovery() {
    if [[ "$DRY_RUN" == true ]]; then
        log_info "[DRY RUN] Would run post-recovery tasks"
        return 0
    fi
    
    log_info "Running post-recovery tasks..."
    
    # Reinstall dependencies
    if [[ -f "$REPO_ROOT/package.json" ]]; then
        log_info "Reinstalling dependencies..."
        cd "$REPO_ROOT"
        if pnpm install 2>&1; then
            log_success "Dependencies reinstalled"
        else
            log_warning "Failed to reinstall dependencies"
        fi
    fi
    
    # Rebuild applications
    log_info "Rebuilding applications..."
    cd "$REPO_ROOT"
    if pnpm build 2>&1; then
        log_success "Applications rebuilt"
    else
        log_warning "Failed to rebuild applications"
    fi
    
    log_success "Post-recovery tasks completed"
}

# Verify backup if requested
if [[ "$VERIFY" == true ]]; then
    verify_backup || exit 1
fi

# Confirmation prompt
if [[ "$DRY_RUN" != true ]]; then
    echo ""
    log_warning "⚠️  WARNING: This will overwrite existing data!"
    echo ""
    read -p "Are you sure you want to proceed with recovery? (yes/no): " CONFIRM
    if [[ "$CONFIRM" != "yes" ]]; then
        log_info "Recovery cancelled by user"
        exit 0
    fi
    echo ""
fi

# Execute recovery based on type
case "$RECOVERY_TYPE" in
    database)
        restore_database
        ;;
    files)
        restore_files
        ;;
    config)
        restore_config
        ;;
    all)
        restore_database || true
        restore_files || true
        restore_config || true
        post_recovery
        ;;
    *)
        log_error "Invalid recovery type: $RECOVERY_TYPE"
        exit 1
        ;;
esac

# Summary
echo ""
log_info "Disaster recovery process completed"
echo ""
echo "Summary:"
printf '%s\n' "${RECOVERY_SUMMARY[@]}"
echo ""

if [[ "$RECOVERY_SUCCESS" == true ]]; then
    log_success "Recovery completed successfully"
    exit 0
else
    log_error "Some recovery operations failed"
    exit 1
fi
