#!/usr/bin/env node

/**
 * Client Onboarding Progress Tracker
 * 
 * Tracks and displays onboarding progress for clients
 * Provides status dashboard and completion metrics
 * 
 * @module scripts/onboarding/track-progress
 * @author Platform Team
 * @created 2026-02-04
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

/**
 * Onboarding checklist items
 */
const ONBOARDING_CHECKLIST = [
  { id: 'directory', name: 'Client directory created', weight: 10 },
  { id: 'package', name: 'Package configuration', weight: 10 },
  { id: 'theme', name: 'Theme configuration', weight: 15 },
  { id: 'env', name: 'Environment setup', weight: 10 },
  { id: 'readme', name: 'Documentation created', weight: 10 },
  { id: 'config', name: 'Client config file', weight: 15 },
  { id: 'content', name: 'Content customization', weight: 15 },
  { id: 'deployment', name: 'Deployment configuration', weight: 10 },
  { id: 'testing', name: 'Testing completed', weight: 5 },
];

/**
 * Check if a specific onboarding item is complete
 * @param {string} clientName - Client name
 * @param {string} itemId - Checklist item ID
 * @returns {boolean} True if complete
 */
function checkItem(clientName, itemId) {
  const repoRoot = path.join(__dirname, '..', '..');
  const clientDir = path.join(repoRoot, 'apps', clientName);
  const themeDir = path.join(repoRoot, 'packages', 'tokens', 'src', 'themes', clientName);
  
  switch (itemId) {
    case 'directory':
      return fs.existsSync(clientDir);
    
    case 'package':
      const pkgPath = path.join(clientDir, 'package.json');
      if (!fs.existsSync(pkgPath)) return false;
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        return pkg.name === `@repo/${clientName}`;
      } catch {
        return false;
      }
    
    case 'theme':
      return fs.existsSync(path.join(themeDir, 'index.ts'));
    
    case 'env':
      return (
        fs.existsSync(path.join(clientDir, '.env.example')) ||
        fs.existsSync(path.join(clientDir, '.env.local'))
      );
    
    case 'readme':
      return fs.existsSync(path.join(clientDir, 'README.md'));
    
    case 'config':
      return fs.existsSync(path.join(clientDir, 'client.config.json'));
    
    case 'content':
      // Check if page content has been customized (not just template)
      const homePage = path.join(clientDir, 'app', 'page.tsx');
      if (!fs.existsSync(homePage)) return false;
      const content = fs.readFileSync(homePage, 'utf8');
      // Simple check: look for client-specific content, not template placeholders
      return !content.includes('[Your Company]') && !content.includes('template-site');
    
    case 'deployment':
      // Check for deployment config or vercel.json
      return (
        fs.existsSync(path.join(clientDir, 'vercel.json')) ||
        fs.existsSync(path.join(clientDir, '.vercel')) ||
        fs.existsSync(path.join(clientDir, 'Dockerfile'))
      );
    
    case 'testing':
      // Check if tests exist and pass
      const testDir = path.join(clientDir, '__tests__');
      return fs.existsSync(testDir) && fs.readdirSync(testDir).length > 0;
    
    default:
      return false;
  }
}

/**
 * Calculate completion percentage
 * @param {string} clientName - Client name
 * @returns {Object} Progress data
 */
function calculateProgress(clientName) {
  let totalWeight = 0;
  let completedWeight = 0;
  const items = [];
  
  for (const item of ONBOARDING_CHECKLIST) {
    const complete = checkItem(clientName, item.id);
    totalWeight += item.weight;
    if (complete) {
      completedWeight += item.weight;
    }
    items.push({
      ...item,
      complete,
    });
  }
  
  return {
    percentage: Math.round((completedWeight / totalWeight) * 100),
    completedItems: items.filter(i => i.complete).length,
    totalItems: items.length,
    items,
  };
}

/**
 * Display progress for a single client
 * @param {string} clientName - Client name
 */
function displayClientProgress(clientName) {
  const progress = calculateProgress(clientName);
  
  console.log(`\n${colors.blue}Client: ${clientName}${colors.reset}`);
  console.log('─'.repeat(50));
  
  // Progress bar
  const barWidth = 30;
  const filled = Math.round((progress.percentage / 100) * barWidth);
  const empty = barWidth - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  
  let barColor = colors.red;
  if (progress.percentage >= 80) barColor = colors.green;
  else if (progress.percentage >= 50) barColor = colors.yellow;
  
  console.log(`Progress: ${barColor}${bar}${colors.reset} ${progress.percentage}%`);
  console.log(`Completed: ${progress.completedItems}/${progress.totalItems} items\n`);
  
  // Checklist
  for (const item of progress.items) {
    const icon = item.complete ? `${colors.green}✓${colors.reset}` : `${colors.gray}○${colors.reset}`;
    const text = item.complete ? item.name : `${colors.gray}${item.name}${colors.reset}`;
    console.log(`  ${icon} ${text}`);
  }
  
  // Status message
  console.log('');
  if (progress.percentage === 100) {
    console.log(`${colors.green}✓ Onboarding complete!${colors.reset}`);
  } else if (progress.percentage >= 80) {
    console.log(`${colors.yellow}⚠ Almost done! Complete remaining items.${colors.reset}`);
  } else if (progress.percentage >= 50) {
    console.log(`${colors.yellow}⏳ In progress...${colors.reset}`);
  } else {
    console.log(`${colors.red}⚠ Onboarding incomplete. Please complete setup.${colors.reset}`);
  }
}

/**
 * Display progress for all clients
 */
function displayAllClients() {
  const repoRoot = path.join(__dirname, '..', '..');
  const appsDir = path.join(repoRoot, 'apps');
  
  if (!fs.existsSync(appsDir)) {
    console.error('Apps directory not found');
    process.exit(1);
  }
  
  const clients = fs.readdirSync(appsDir)
    .filter(name => {
      const stat = fs.statSync(path.join(appsDir, name));
      return stat.isDirectory() && name !== 'web'; // Exclude main web app
    });
  
  console.log(`\n${colors.blue}${'='.repeat(50)}${colors.reset}`);
  console.log(`${colors.blue}Client Onboarding Dashboard${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
  
  if (clients.length === 0) {
    console.log('\nNo client sites found.');
    return;
  }
  
  // Calculate and display summary
  const summaries = clients.map(client => ({
    name: client,
    progress: calculateProgress(client),
  }));
  
  // Sort by completion percentage
  summaries.sort((a, b) => b.progress.percentage - a.progress.percentage);
  
  console.log(`\nTotal clients: ${clients.length}\n`);
  
  for (const summary of summaries) {
    const { name, progress } = summary;
    const barWidth = 20;
    const filled = Math.round((progress.percentage / 100) * barWidth);
    const empty = barWidth - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    
    let color = colors.red;
    if (progress.percentage >= 80) color = colors.green;
    else if (progress.percentage >= 50) color = colors.yellow;
    
    console.log(`  ${name.padEnd(30)} ${color}${bar}${colors.reset} ${progress.percentage}%`);
  }
  
  console.log('\n');
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // No arguments: show all clients
    displayAllClients();
  } else {
    // Show specific client
    const clientName = args[0];
    displayClientProgress(clientName);
  }
}

// Run
main();
