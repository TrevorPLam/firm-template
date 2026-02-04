#!/usr/bin/env node

/**
 * Client Onboarding Wizard
 * 
 * Interactive CLI wizard for automated client provisioning
 * Guides through setup, theme customization, and configuration
 * 
 * @module scripts/onboarding/onboarding-wizard
 * @author Platform Team
 * @created 2026-02-04
 */

const readline = require('readline');
const { spawn } = require('child_process');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Create readline interface for user input
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Promisified question wrapper
 * @param {string} query - Question to ask user
 * @returns {Promise<string>} User's answer
 */
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

/**
 * Display styled header
 * @param {string} title - Header title
 */
function displayHeader(title) {
  console.log('\n' + colors.cyan + '='.repeat(60) + colors.reset);
  console.log(colors.bright + colors.cyan + title + colors.reset);
  console.log(colors.cyan + '='.repeat(60) + colors.reset + '\n');
}

/**
 * Display section header
 * @param {string} section - Section name
 */
function displaySection(section) {
  console.log('\n' + colors.blue + '─'.repeat(40) + colors.reset);
  console.log(colors.bright + section + colors.reset);
  console.log(colors.blue + '─'.repeat(40) + colors.reset + '\n');
}

/**
 * Log info message
 * @param {string} message - Message to log
 */
function logInfo(message) {
  console.log(colors.blue + '[INFO]' + colors.reset + ' ' + message);
}

/**
 * Log success message
 * @param {string} message - Message to log
 */
function logSuccess(message) {
  console.log(colors.green + '[SUCCESS]' + colors.reset + ' ' + message);
}

/**
 * Log error message
 * @param {string} message - Message to log
 */
function logError(message) {
  console.log(colors.red + '[ERROR]' + colors.reset + ' ' + message);
}

/**
 * Validate client name format
 * @param {string} name - Client name to validate
 * @returns {boolean} True if valid
 */
function validateClientName(name) {
  return /^[a-z0-9-]+$/.test(name);
}

/**
 * Validate hex color format
 * @param {string} color - Color to validate
 * @returns {boolean} True if valid
 */
function validateHexColor(color) {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Run shell command and return promise
 * @param {string} command - Command to run
 * @param {string[]} args - Command arguments
 * @returns {Promise<void>}
 */
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

/**
 * Main wizard flow
 */
async function runWizard() {
  displayHeader('🚀 Client Onboarding Wizard');
  
  console.log('Welcome to the automated client onboarding system!');
  console.log('This wizard will guide you through creating a new client site.\n');

  // Step 1: Client Information
  displaySection('Step 1: Client Information');
  
  let clientName = '';
  while (!clientName) {
    const name = await question('Client name (lowercase-with-hyphens): ');
    if (validateClientName(name.trim())) {
      clientName = name.trim();
    } else {
      logError('Invalid name. Use only lowercase letters, numbers, and hyphens.');
    }
  }
  
  const clientDisplayName = await question('Client display name (e.g., "Acme Corp"): ');
  const clientWebsite = await question('Client website URL (optional): ');
  
  // Step 2: Theme Configuration
  displaySection('Step 2: Theme Configuration');
  
  let primaryColor = '';
  while (!primaryColor) {
    const color = await question('Primary brand color (hex, e.g., #FF5733): ');
    if (validateHexColor(color.trim())) {
      primaryColor = color.trim();
    } else {
      logError('Invalid hex color. Format: #RRGGBB');
    }
  }
  
  let secondaryColor = '';
  while (!secondaryColor) {
    const color = await question('Secondary brand color (hex, e.g., #00AA66): ');
    if (validateHexColor(color.trim())) {
      secondaryColor = color.trim();
    } else {
      logError('Invalid hex color. Format: #RRGGBB');
    }
  }
  
  const fontFamily = await question('Font family (or press Enter for default): ');
  
  // Step 3: Integration Settings
  displaySection('Step 3: Integration Settings');
  
  const setupAnalytics = await question('Enable Google Analytics? (y/n): ');
  let gaId = '';
  if (setupAnalytics.toLowerCase() === 'y') {
    gaId = await question('Google Analytics ID (GA-XXXXXXXXX): ');
  }
  
  const setupHubspot = await question('Enable HubSpot integration? (y/n): ');
  let hubspotPortalId = '';
  let hubspotFormId = '';
  if (setupHubspot.toLowerCase() === 'y') {
    hubspotPortalId = await question('HubSpot Portal ID: ');
    hubspotFormId = await question('HubSpot Form ID: ');
  }
  
  // Step 4: Confirmation
  displaySection('Step 4: Confirmation');
  
  console.log('\nPlease review your configuration:\n');
  console.log(`  Client Name:       ${clientName}`);
  console.log(`  Display Name:      ${clientDisplayName || '(not set)'}`);
  console.log(`  Website:           ${clientWebsite || '(not set)'}`);
  console.log(`  Primary Color:     ${primaryColor}`);
  console.log(`  Secondary Color:   ${secondaryColor}`);
  console.log(`  Font Family:       ${fontFamily || '(default)'}`);
  console.log(`  Analytics:         ${gaId || '(disabled)'}`);
  console.log(`  HubSpot:           ${hubspotPortalId ? 'enabled' : '(disabled)'}`);
  
  const confirm = await question('\nProceed with provisioning? (y/n): ');
  
  if (confirm.toLowerCase() !== 'y') {
    console.log('\nProvisioning cancelled.');
    rl.close();
    return;
  }
  
  // Step 5: Provisioning
  displaySection('Step 5: Provisioning Client');
  
  try {
    logInfo('Running provisioning script...');
    
    const scriptPath = path.join(__dirname, 'provision-client.sh');
    const args = [
      clientName,
      '--theme-primary', primaryColor,
      '--theme-secondary', secondaryColor,
    ];
    
    await runCommand(scriptPath, args);
    
    logSuccess('Client provisioned successfully!');
    
    // Step 6: Post-provisioning setup
    displaySection('Step 6: Additional Configuration');
    
    logInfo('Creating custom configuration...');
    
    // Create enhanced config file
    const fs = require('fs');
    const configPath = path.join(__dirname, '..', '..', 'apps', clientName, 'client.config.json');
    
    const config = {
      name: clientName,
      displayName: clientDisplayName,
      website: clientWebsite,
      theme: {
        primary: primaryColor,
        secondary: secondaryColor,
        fontFamily: fontFamily || 'system-ui, -apple-system, sans-serif',
      },
      integrations: {
        analytics: {
          enabled: !!gaId,
          gaId: gaId || undefined,
        },
        hubspot: {
          enabled: !!hubspotPortalId,
          portalId: hubspotPortalId || undefined,
          formId: hubspotFormId || undefined,
        },
      },
      provisioned: new Date().toISOString(),
    };
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
    logSuccess('Configuration file created');
    
    // Step 7: Next Steps
    displayHeader('✨ Onboarding Complete!');
    
    console.log('Your new client site has been provisioned successfully.\n');
    console.log('Next steps:\n');
    console.log(`  1. ${colors.cyan}Review theme${colors.reset}:`);
    console.log(`     packages/tokens/src/themes/${clientName}/index.ts\n`);
    console.log(`  2. ${colors.cyan}Configure environment${colors.reset}:`);
    console.log(`     apps/${clientName}/.env.local\n`);
    console.log(`  3. ${colors.cyan}Start development server${colors.reset}:`);
    console.log(`     pnpm --filter @repo/${clientName} dev\n`);
    console.log(`  4. ${colors.cyan}Run validation${colors.reset}:`);
    console.log(`     ./scripts/onboarding/validate-client.sh ${clientName}\n`);
    console.log('Happy building! 🚀\n');
    
  } catch (error) {
    logError('Provisioning failed: ' + error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run wizard
runWizard().catch((error) => {
  logError('Wizard failed: ' + error.message);
  process.exit(1);
});
