#!/usr/bin/env node

/**
 * Refactoring Agent
 *
 * This script analyzes the codebase and performs automated refactoring
 * based on best practices and configured rules.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { findDuplication } from './refactoring-strategies/duplication.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Configuration paths
const CONFIG_PATH = path.join(projectRoot, 'cline_docs/refactoring');
const LOG_PATH = path.join(CONFIG_PATH, 'logs');
const HISTORY_PATH = path.join(CONFIG_PATH, 'history');

// Ensure directories exist
[CONFIG_PATH, LOG_PATH, HISTORY_PATH].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Load configuration
let config = {
  enabled: true,
  refactoringTypes: ['duplication', 'complexity', 'naming', 'structure'],
  excludedPaths: ['node_modules', 'dist', 'build', '.git'],
  maxFilesPerRun: 10,
  maxChangesPerFile: 5,
  dryRun: false,
  createPullRequests: false,
  autoCommit: false,
  branchPrefix: 'refactor/',
  commitMessagePrefix: '[Refactor]',
  reviewers: []
};

const configPath = path.join(CONFIG_PATH, 'config.json');
if (fs.existsSync(configPath)) {
  try {
    const loadedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config = { ...config, ...loadedConfig };
  } catch (error) {
    console.error('Error loading configuration:', error);
  }
} else {
  // Create default config
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Created default configuration at ${configPath}`);
}

// Initialize logging
const timestamp = new Date().toISOString().replace(/:/g, '-');
const logFile = path.join(LOG_PATH, `refactor-${timestamp}.log`);
const logger = fs.createWriteStream(logFile, { flags: 'a' });

function log(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}`;
  console.log(logMessage);
  logger.write(logMessage + '\n');
}

// Check if refactoring is enabled
if (!config.enabled) {
  log('Refactoring agent is disabled in configuration. Exiting.');
  process.exit(0);
}

// Main refactoring function
async function runRefactoring() {
  log('Starting refactoring agent...');

  // Record start time
  const startTime = Date.now();

  // Create a unique run ID
  const runId = `refactor-${timestamp}`;

  // Create history entry
  const historyEntry = {
    runId,
    timestamp: new Date().toISOString(),
    config: { ...config },
    files: [],
    summary: {
      filesAnalyzed: 0,
      filesRefactored: 0,
      totalChanges: 0,
      duration: 0
    }
  };

  try {
    // 1. Find files to analyze
    log('Finding files to analyze...');
    const filesToAnalyze = await findFilesToAnalyze();
    historyEntry.summary.filesAnalyzed = filesToAnalyze.length;
    log(`Found ${filesToAnalyze.length} files to analyze`);

    // 2. Analyze and refactor files
    log('Analyzing and refactoring files...');
    const refactoringResults = await analyzeAndRefactorFiles(filesToAnalyze);

    // 3. Update history with results
    historyEntry.files = refactoringResults;
    historyEntry.summary.filesRefactored = refactoringResults.filter(r => r.changes.length > 0).length;
    historyEntry.summary.totalChanges = refactoringResults.reduce((sum, file) => sum + file.changes.length, 0);

    // 4. Commit changes if configured
    if (config.autoCommit && !config.dryRun && historyEntry.summary.totalChanges > 0) {
      await commitChanges(runId, historyEntry);
    }

    // 5. Create pull request if configured
    if (config.createPullRequests && !config.dryRun && historyEntry.summary.totalChanges > 0) {
      await createPullRequest(runId, historyEntry);
    }
  } catch (error) {
    log(`Error during refactoring: ${error.message}`);
    historyEntry.error = error.message;
  }

  // Record end time and duration
  const endTime = Date.now();
  historyEntry.summary.duration = endTime - startTime;

  // Save history entry
  const historyFilePath = path.join(HISTORY_PATH, `${runId}.json`);
  fs.writeFileSync(historyFilePath, JSON.stringify(historyEntry, null, 2));

  // Log summary
  log('Refactoring complete!');
  log(`Files analyzed: ${historyEntry.summary.filesAnalyzed}`);
  log(`Files refactored: ${historyEntry.summary.filesRefactored}`);
  log(`Total changes: ${historyEntry.summary.totalChanges}`);
  log(`Duration: ${historyEntry.summary.duration}ms`);

  // Close logger
  logger.end();
}

// Find files to analyze
async function findFilesToAnalyze() {
  return new Promise((resolve, reject) => {
    const excludeArgs = config.excludedPaths.map(p => `--exclude-dir=${p}`).join(' ');
    const command = `find ${projectRoot} -type f -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | grep -v ${excludeArgs}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      const files = stdout.trim().split('\n').filter(Boolean);

      // Limit the number of files if configured
      const limitedFiles = config.maxFilesPerRun > 0
        ? files.slice(0, config.maxFilesPerRun)
        : files;

      resolve(limitedFiles);
    });
  });
}

// Analyze and refactor files
async function analyzeAndRefactorFiles(files) {
  const results = [];

  for (const file of files) {
    log(`Analyzing file: ${file}`);

    try {
      // Read file content
      const content = fs.readFileSync(file, 'utf8');

      // Initialize result object
      const result = {
        file,
        originalSize: content.length,
        refactoredSize: content.length,
        changes: []
      };

      // Apply refactoring strategies based on configuration
      let refactoredContent = content;

      for (const refactoringType of config.refactoringTypes) {
        const changes = await applyRefactoringStrategy(refactoringType, file, refactoredContent);

        // Apply changes (limited by maxChangesPerFile)
        const limitedChanges = changes.slice(0, config.maxChangesPerFile);

        for (const change of limitedChanges) {
          log(`  - ${change.description}`);

          if (!config.dryRun) {
            refactoredContent = applyChange(refactoredContent, change);
          }

          result.changes.push(change);
        }
      }

      // Update file if changes were made and not in dry run mode
      if (result.changes.length > 0 && !config.dryRun) {
        fs.writeFileSync(file, refactoredContent);
        result.refactoredSize = refactoredContent.length;
      }

      results.push(result);
    } catch (error) {
      log(`Error analyzing file ${file}: ${error.message}`);
      results.push({
        file,
        error: error.message,
        changes: []
      });
    }
  }

  return results;
}

// Apply a specific refactoring strategy
async function applyRefactoringStrategy(strategy, file, content) {
  // This is where you would implement different refactoring strategies
  // For now, we'll use placeholder implementations

  switch (strategy) {
    case 'duplication':
      return findDuplication(file, content);
    case 'complexity':
      return reduceComplexity(file, content);
    case 'naming':
      return improveNaming(file, content);
    case 'structure':
      return improveStructure(file, content);
    default:
      return [];
  }
}


async function reduceComplexity(file, content) {
  // In a real implementation, this would use tools like ESLint or custom logic
  // to identify complex functions and suggest simplifications
  return [];
}

async function improveNaming(file, content) {
  // In a real implementation, this would analyze variable and function names
  // and suggest improvements
  return [];
}

async function improveStructure(file, content) {
  // In a real implementation, this would analyze code structure
  // and suggest architectural improvements
  return [];
}

// Apply a change to the content
function applyChange(content, change) {
  // This is a simplified implementation
  // In a real implementation, you would need to handle more complex changes

  if (change.type === 'replace') {
    return content.replace(change.oldCode, change.newCode);
  }

  return content;
}

// Commit changes
async function commitChanges(runId, historyEntry) {
  const branchName = `${config.branchPrefix}${runId}`;

  try {
    // Create a new branch
    await execPromise(`git checkout -b ${branchName}`);

    // Add all changes
    await execPromise('git add .');

    // Create commit message
    const commitMessage = `${config.commitMessagePrefix} Automated refactoring\n\n` +
      `Files refactored: ${historyEntry.summary.filesRefactored}\n` +
      `Total changes: ${historyEntry.summary.totalChanges}\n\n` +
      `Run ID: ${runId}`;

    // Commit changes
    await execPromise(`git commit -m "${commitMessage}"`);

    log(`Changes committed to branch: ${branchName}`);
    return true;
  } catch (error) {
    log(`Error committing changes: ${error.message}`);
    return false;
  }
}

// Create pull request
async function createPullRequest(runId, historyEntry) {
  // This would use the GitHub API or similar to create a PR
  // For now, we'll just log a message
  log('Pull request creation is not implemented yet');
  return false;
}

// Helper function to execute shell commands
function exec(command, callback) {
  const { exec } = require('child_process');
  exec(command, { cwd: projectRoot }, callback);
}

// Promise-based version of exec
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

// Run the refactoring process
runRefactoring().catch(error => {
  log(`Fatal error: ${error.message}`);
  process.exit(1);
});
