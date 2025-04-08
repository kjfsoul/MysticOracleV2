#!/usr/bin/env node

/**
 * Agent Ecosystem Migration Script
 * 
 * This script helps migrate the Mystic Arcana agent ecosystem to a standalone project.
 * It copies all agent-related files while preserving the original files in Mystic Arcana.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, exec } from 'child_process';
import readline from 'readline';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask a question and get user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Main migration function
async function migrateAgentEcosystem() {
  console.log('=== Agent Ecosystem Migration Tool ===\n');
  console.log('This tool will help you migrate the Mystic Arcana agent ecosystem to a standalone project.');
  console.log('The original files will remain in Mystic Arcana.\n');
  
  // Get destination directory
  const defaultDestination = path.resolve(projectRoot, '../agent-ecosystem');
  const destination = await askQuestion(`Enter destination directory [${defaultDestination}]: `);
  const destinationPath = destination || defaultDestination;
  
  // Confirm migration
  const confirm = await askQuestion(`\nWill migrate agent ecosystem to: ${destinationPath}\nContinue? (y/n): `);
  if (confirm.toLowerCase() !== 'y') {
    console.log('Migration cancelled.');
    rl.close();
    return;
  }
  
  try {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
      console.log(`Created destination directory: ${destinationPath}`);
    }
    
    // Create directory structure
    const directories = [
      'scripts/agents',
      'scripts/agents/mcp',
      'scripts/agents/autonomous',
      'scripts/agents/refactoring',
      'scripts/agents/specialized',
      'config',
      'prompts',
      'prompts/design',
      'prompts/content',
      'prompts/code',
      'prompts/integration',
      'models',
      'models/fine-tuned',
      'logs',
      'logs/history',
      'docs'
    ];
    
    for (const dir of directories) {
      const dirPath = path.join(destinationPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
      }
    }
    
    // Copy agent files
    console.log('\nCopying agent files...');
    
    // 1. Copy MCP agent files
    copyDirectory(
      path.join(projectRoot, 'scripts/start-mcp-agents.js'),
      path.join(destinationPath, 'scripts/agents/mcp/start-mcp-agents.js')
    );
    
    // 2. Copy autonomous agent files
    copyDirectory(
      path.join(projectRoot, 'scripts/start-agents.js'),
      path.join(destinationPath, 'scripts/agents/autonomous/start-agents.js')
    );
    
    copyDirectory(
      path.join(projectRoot, 'scripts/monitor-agents.js'),
      path.join(destinationPath, 'scripts/agents/autonomous/monitor-agents.js')
    );
    
    // 3. Copy refactoring agent files
    copyDirectory(
      path.join(projectRoot, 'scripts/agents/refactoring-agent.js'),
      path.join(destinationPath, 'scripts/agents/refactoring/refactoring-agent.js')
    );
    
    copyDirectory(
      path.join(projectRoot, 'scripts/agents/refactoring-manager.js'),
      path.join(destinationPath, 'scripts/agents/refactoring/refactoring-manager.js')
    );
    
    copyDirectory(
      path.join(projectRoot, 'scripts/agents/refactoring-scheduler.js'),
      path.join(destinationPath, 'scripts/agents/refactoring/refactoring-scheduler.js')
    );
    
    copyDirectory(
      path.join(projectRoot, 'scripts/agents/refactoring-strategies'),
      path.join(destinationPath, 'scripts/agents/refactoring/strategies')
    );
    
    // 4. Copy documentation
    copyDirectory(
      path.join(projectRoot, 'cline_docs/agent-ecosystem-documentation.md'),
      path.join(destinationPath, 'docs/README.md')
    );
    
    copyDirectory(
      path.join(projectRoot, 'cline_docs/refactoring'),
      path.join(destinationPath, 'docs/refactoring')
    );
    
    // 5. Copy configuration files
    if (fs.existsSync(path.join(projectRoot, '.mcp'))) {
      copyDirectory(
        path.join(projectRoot, '.mcp'),
        path.join(destinationPath, 'config/mcp')
      );
    }
    
    // Create package.json for the new project
    const packageJson = {
      "name": "agent-ecosystem",
      "version": "1.0.0",
      "description": "A standalone agent ecosystem for AI-assisted development",
      "type": "module",
      "main": "scripts/manager.js",
      "scripts": {
        "start": "node scripts/manager.js",
        "mcp:start": "node scripts/agents/mcp/start-mcp-agents.js",
        "autonomous:start": "node scripts/agents/autonomous/start-agents.js",
        "autonomous:monitor": "node scripts/agents/autonomous/monitor-agents.js",
        "refactor:run": "node scripts/agents/refactoring/refactoring-manager.js run",
        "refactor:start": "node scripts/agents/refactoring/refactoring-manager.js start",
        "refactor:stop": "node scripts/agents/refactoring/refactoring-manager.js stop",
        "refactor:status": "node scripts/agents/refactoring/refactoring-manager.js status",
        "refactor:configure": "node scripts/agents/refactoring/refactoring-manager.js configure",
        "setup": "node scripts/setup.js"
      },
      "keywords": [
        "agent",
        "ai",
        "automation",
        "development"
      ],
      "author": "",
      "license": "MIT",
      "dependencies": {
        "axios": "^1.6.0",
        "dotenv": "^16.3.1",
        "fs-extra": "^11.1.1",
        "node-cron": "^3.0.2",
        "openai": "^4.0.0"
      }
    };
    
    fs.writeFileSync(
      path.join(destinationPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    console.log('Created package.json');
    
    // Create manager.js - the main entry point
    createManagerScript(destinationPath);
    
    // Create setup.js - the one-click setup script
    createSetupScript(destinationPath);
    
    // Create .env file
    fs.writeFileSync(
      path.join(destinationPath, '.env.example'),
      `# Agent Ecosystem Environment Variables
OPENAI_API_KEY=your_openai_api_key
MCP_API_KEY=your_mcp_api_key
GITHUB_TOKEN=your_github_token

# Configuration
AGENT_LOG_LEVEL=info
AGENT_AUTO_START=true
AGENT_MAX_CONCURRENT=2
`
    );
    console.log('Created .env.example');
    
    // Create README.md
    fs.writeFileSync(
      path.join(destinationPath, 'README.md'),
      `# Agent Ecosystem

A standalone agent ecosystem for AI-assisted development.

## Quick Start

1. Clone this repository
2. Copy \`.env.example\` to \`.env\` and fill in your API keys
3. Run \`npm install\`
4. Run \`npm run setup\` for one-click setup
5. Run \`npm start\` to start the agent manager

## Documentation

See the [full documentation](./docs/README.md) for details on the agent ecosystem.

## Available Scripts

- \`npm start\`: Start the agent manager
- \`npm run mcp:start\`: Start MCP agents
- \`npm run autonomous:start\`: Start autonomous agents
- \`npm run autonomous:monitor\`: Monitor autonomous agents
- \`npm run refactor:run\`: Run the refactoring agent once
- \`npm run refactor:start\`: Start the refactoring scheduler
- \`npm run refactor:stop\`: Stop the refactoring scheduler
- \`npm run refactor:status\`: Check refactoring status
- \`npm run refactor:configure\`: Configure the refactoring agent
- \`npm run setup\`: Run the one-click setup

## License

MIT
`
    );
    console.log('Created README.md');
    
    console.log('\nMigration completed successfully!');
    console.log(`\nThe agent ecosystem has been migrated to: ${destinationPath}`);
    console.log('\nNext steps:');
    console.log('1. Navigate to the new directory: cd ' + destinationPath);
    console.log('2. Install dependencies: npm install');
    console.log('3. Copy .env.example to .env and fill in your API keys');
    console.log('4. Run the setup script: npm run setup');
    console.log('5. Start the agent manager: npm start');
    
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    rl.close();
  }
}

// Helper function to copy a file or directory
function copyDirectory(source, destination) {
  try {
    if (!fs.existsSync(source)) {
      console.log(`Warning: Source does not exist: ${source}`);
      return;
    }
    
    if (fs.statSync(source).isDirectory()) {
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }
      
      const files = fs.readdirSync(source);
      for (const file of files) {
        const sourcePath = path.join(source, file);
        const destPath = path.join(destination, file);
        copyDirectory(sourcePath, destPath);
      }
    } else {
      fs.copyFileSync(source, destination);
      console.log(`Copied: ${source} -> ${destination}`);
    }
  } catch (error) {
    console.error(`Error copying ${source} to ${destination}:`, error);
  }
}

// Create the manager.js script
function createManagerScript(destinationPath) {
  const managerScript = `#!/usr/bin/env node

/**
 * Agent Ecosystem Manager
 * 
 * This is the main entry point for the agent ecosystem.
 * It manages all agent types and coordinates their activities.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration paths
const CONFIG_PATH = path.join(projectRoot, 'config');
const LOG_PATH = path.join(projectRoot, 'logs');

// Ensure directories exist
[CONFIG_PATH, LOG_PATH].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Initialize logging
const timestamp = new Date().toISOString().replace(/:/g, '-');
const logFile = path.join(LOG_PATH, \`manager-\${timestamp}.log\`);
const logger = fs.createWriteStream(logFile, { flags: 'a' });

function log(message) {
  const logMessage = \`[\${new Date().toISOString()}] \${message}\`;
  console.log(logMessage);
  logger.write(logMessage + '\\n');
}

// Load configuration
let config = {
  autoStart: process.env.AGENT_AUTO_START === 'true',
  maxConcurrent: parseInt(process.env.AGENT_MAX_CONCURRENT || '2', 10),
  agents: {
    mcp: true,
    autonomous: true,
    refactoring: true
  }
};

const configPath = path.join(CONFIG_PATH, 'manager-config.json');
if (fs.existsSync(configPath)) {
  try {
    const loadedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config = { ...config, ...loadedConfig };
  } catch (error) {
    log(\`Error loading configuration: \${error.message}\`);
  }
} else {
  // Create default config
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  log(\`Created default configuration at \${configPath}\`);
}

// Track running processes
const processes = new Map();

// Start an agent process
function startAgent(type, script) {
  log(\`Starting \${type} agent...\`);
  
  const scriptPath = path.join(__dirname, script);
  
  if (!fs.existsSync(scriptPath)) {
    log(\`Error: Script not found: \${scriptPath}\`);
    return null;
  }
  
  const process = spawn('node', [scriptPath], {
    stdio: 'pipe',
    detached: false
  });
  
  const pid = process.pid;
  log(\`\${type} agent started with PID \${pid}\`);
  
  // Handle process output
  process.stdout.on('data', (data) => {
    logger.write(\`[\${type}] \${data}\`);
  });
  
  process.stderr.on('data', (data) => {
    logger.write(\`[\${type} ERROR] \${data}\`);
  });
  
  // Handle process completion
  process.on('close', (code) => {
    log(\`\${type} agent (PID \${pid}) exited with code \${code}\`);
    processes.delete(pid);
    
    // Restart the process if it wasn't terminated intentionally
    if (code !== 0 && processes.size < config.maxConcurrent) {
      log(\`Restarting \${type} agent...\`);
      setTimeout(() => {
        const newProcess = startAgent(type, script);
        if (newProcess) {
          processes.set(newProcess.pid, { type, process: newProcess });
        }
      }, 5000); // Wait 5 seconds before restarting
    }
  });
  
  return process;
}

// Start all enabled agents
function startAllAgents() {
  log('Starting all enabled agents...');
  
  if (config.agents.mcp) {
    const mcpProcess = startAgent('mcp', 'agents/mcp/start-mcp-agents.js');
    if (mcpProcess) {
      processes.set(mcpProcess.pid, { type: 'mcp', process: mcpProcess });
    }
  }
  
  if (config.agents.autonomous) {
    const autonomousProcess = startAgent('autonomous', 'agents/autonomous/start-agents.js');
    if (autonomousProcess) {
      processes.set(autonomousProcess.pid, { type: 'autonomous', process: autonomousProcess });
    }
  }
  
  if (config.agents.refactoring) {
    const refactoringProcess = startAgent('refactoring', 'agents/refactoring/refactoring-manager.js');
    if (refactoringProcess) {
      processes.set(refactoringProcess.pid, { type: 'refactoring', process: refactoringProcess });
    }
  }
  
  log(\`Started \${processes.size} agent processes\`);
}

// Stop all running agents
function stopAllAgents() {
  log(\`Stopping \${processes.size} agent processes...\`);
  
  for (const [pid, { type, process }] of processes.entries()) {
    log(\`Stopping \${type} agent (PID \${pid})...\`);
    process.kill();
  }
  
  processes.clear();
  log('All agents stopped');
}

// Main function
function main() {
  log('Agent Ecosystem Manager starting...');
  
  // Auto-start agents if configured
  if (config.autoStart) {
    startAllAgents();
  } else {
    log('Auto-start is disabled. Use the API or CLI to start agents.');
  }
  
  // Handle process termination
  process.on('SIGINT', () => {
    log('Received SIGINT. Shutting down...');
    stopAllAgents();
    logger.end();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('Received SIGTERM. Shutting down...');
    stopAllAgents();
    logger.end();
    process.exit(0);
  });
  
  // Keep the process running
  log('Manager is running. Press Ctrl+C to stop.');
}

// Run the main function
main();
`;

  fs.writeFileSync(
    path.join(destinationPath, 'scripts/manager.js'),
    managerScript
  );
  console.log('Created manager.js');
}

// Create the setup.js script
function createSetupScript(destinationPath) {
  const setupScript = `#!/usr/bin/env node

/**
 * One-Click Agent Ecosystem Setup
 * 
 * This script provides a one-click setup for the agent ecosystem.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, exec } from 'child_process';
import readline from 'readline';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask a question and get user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Main setup function
async function setup() {
  console.log('=== Agent Ecosystem Setup Wizard ===\\n');
  
  try {
    // 1. Check dependencies
    console.log('Checking dependencies...');
    
    // Check for Node.js
    const nodeVersion = process.version;
    console.log(\`Node.js version: \${nodeVersion}\`);
    
    // Check for npm
    try {
      const npmVersion = await execCommand('npm --version');
      console.log(\`npm version: \${npmVersion}\`);
    } catch (error) {
      console.error('Error: npm is required but not found.');
      process.exit(1);
    }
    
    // 2. Check environment variables
    console.log('\\nChecking environment variables...');
    
    const missingVars = [];
    if (!process.env.OPENAI_API_KEY) missingVars.push('OPENAI_API_KEY');
    
    if (missingVars.length > 0) {
      console.log(\`Missing environment variables: \${missingVars.join(', ')}\`);
      const setupEnv = await askQuestion('Would you like to set up these variables now? (y/n): ');
      
      if (setupEnv.toLowerCase() === 'y') {
        // Create .env file if it doesn't exist
        if (!fs.existsSync(path.join(projectRoot, '.env'))) {
          fs.copyFileSync(
            path.join(projectRoot, '.env.example'),
            path.join(projectRoot, '.env')
          );
        }
        
        // Update .env file with user input
        let envContent = fs.readFileSync(path.join(projectRoot, '.env'), 'utf8');
        
        for (const varName of missingVars) {
          const value = await askQuestion(\`Enter value for \${varName}: \`);
          const regex = new RegExp(\`\${varName}=.*\\n\`, 'g');
          
          if (envContent.match(regex)) {
            envContent = envContent.replace(regex, \`\${varName}=\${value}\\n\`);
          } else {
            envContent += \`\${varName}=\${value}\\n\`;
          }
        }
        
        fs.writeFileSync(path.join(projectRoot, '.env'), envContent);
        console.log('Environment variables updated in .env file.');
        
        // Reload environment variables
        dotenv.config();
      }
    } else {
      console.log('All required environment variables are set.');
    }
    
    // 3. Configure agent settings
    console.log('\\nConfiguring agent settings...');
    
    const configPath = path.join(projectRoot, 'config/manager-config.json');
    let config = {
      autoStart: true,
      maxConcurrent: 2,
      agents: {
        mcp: true,
        autonomous: true,
        refactoring: true
      }
    };
    
    if (fs.existsSync(configPath)) {
      try {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (error) {
        console.error(\`Error loading configuration: \${error.message}\`);
      }
    }
    
    const configureAgents = await askQuestion('Would you like to configure agent settings? (y/n): ');
    
    if (configureAgents.toLowerCase() === 'y') {
      const autoStart = await askQuestion(\`Enable auto-start? (y/n) [\${config.autoStart ? 'y' : 'n'}]: \`);
      if (autoStart) config.autoStart = autoStart.toLowerCase() === 'y';
      
      const maxConcurrent = await askQuestion(\`Maximum concurrent agents [\${config.maxConcurrent}]: \`);
      if (maxConcurrent) config.maxConcurrent = parseInt(maxConcurrent, 10);
      
      const enableMcp = await askQuestion(\`Enable MCP agents? (y/n) [\${config.agents.mcp ? 'y' : 'n'}]: \`);
      if (enableMcp) config.agents.mcp = enableMcp.toLowerCase() === 'y';
      
      const enableAutonomous = await askQuestion(\`Enable autonomous agents? (y/n) [\${config.agents.autonomous ? 'y' : 'n'}]: \`);
      if (enableAutonomous) config.agents.autonomous = enableAutonomous.toLowerCase() === 'y';
      
      const enableRefactoring = await askQuestion(\`Enable refactoring agent? (y/n) [\${config.agents.refactoring ? 'y' : 'n'}]: \`);
      if (enableRefactoring) config.agents.refactoring = enableRefactoring.toLowerCase() === 'y';
      
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log('Agent settings updated.');
    }
    
    // 4. Set up auto-start (if enabled)
    if (config.autoStart) {
      console.log('\\nSetting up auto-start...');
      
      const setupAutoStart = await askQuestion('Would you like to set up auto-start with PM2? (y/n): ');
      
      if (setupAutoStart.toLowerCase() === 'y') {
        try {
          // Check if PM2 is installed
          try {
            await execCommand('pm2 --version');
          } catch (error) {
            console.log('PM2 is not installed. Installing PM2...');
            await execCommand('npm install -g pm2');
          }
          
          // Create PM2 ecosystem file
          const ecosystemConfig = {
            apps: [
              {
                name: "agent-manager",
                script: "./scripts/manager.js",
                watch: false,
                env: {
                  NODE_ENV: "production",
                },
                autorestart: true,
                max_restarts: 10
              }
            ]
          };
          
          fs.writeFileSync(
            path.join(projectRoot, 'ecosystem.config.js'),
            \`module.exports = \${JSON.stringify(ecosystemConfig, null, 2)};\`
          );
          
          console.log('Created PM2 ecosystem file.');
          
          // Set up PM2 to start on system boot
          await execCommand('pm2 startup');
          
          console.log('PM2 startup configured. You can now start the agent manager with:');
          console.log('pm2 start ecosystem.config.js');
          console.log('pm2 save');
        } catch (error) {
          console.error(\`Error setting up PM2: \${error.message}\`);
          console.log('You can manually start the agent manager with: npm start');
        }
      }
    }
    
    // 5. Start the agent manager
    console.log('\\nSetup complete!');
    
    const startNow = await askQuestion('Would you like to start the agent manager now? (y/n): ');
    
    if (startNow.toLowerCase() === 'y') {
      console.log('Starting agent manager...');
      
      const managerProcess = spawn('node', [path.join(projectRoot, 'scripts/manager.js')], {
        stdio: 'inherit',
        detached: false
      });
      
      managerProcess.on('error', (error) => {
        console.error(\`Error starting agent manager: \${error.message}\`);
      });
      
      console.log('Agent manager started. Press Ctrl+C to stop.');
      
      // Keep the process running
      process.stdin.resume();
    } else {
      console.log('You can start the agent manager later with: npm start');
      rl.close();
    }
    
  } catch (error) {
    console.error('Error during setup:', error);
    rl.close();
    process.exit(1);
  }
}

// Helper function to execute a command
function execCommand(command) {
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

// Run the setup
setup().catch(error => {
  console.error('Error during setup:', error);
  rl.close();
  process.exit(1);
});
`;

  fs.writeFileSync(
    path.join(destinationPath, 'scripts/setup.js'),
    setupScript
  );
  console.log('Created setup.js');
}

// Run the migration
migrateAgentEcosystem().catch(error => {
  console.error('Error during migration:', error);
  process.exit(1);
});
