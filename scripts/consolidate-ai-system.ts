import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const BACKUP_DIR = path.join(ROOT_DIR, 'backup-ai-systems');

async function createNewStructure() {
  const aiCorePath = path.join(ROOT_DIR, 'ai-core');
  
  // Create new directory structure
  const directories = [
    'agents',
    'agents/mcp',
    'agents/crewai',
    'agents/prompts',
    'models',
    'services',
    'config',
    '__tests__'
  ];

  for (const dir of directories) {
    await fs.ensureDir(path.join(aiCorePath, dir));
  }
}

async function migrateConfigurations() {
  // Migrate MCP configs
  const mcpConfigPath = path.join(ROOT_DIR, '.mcp/agents.json');
  if (await fs.pathExists(mcpConfigPath)) {
    const mcpConfig = await fs.readJson(mcpConfigPath);
    await fs.writeJson(
      path.join(ROOT_DIR, 'ai-core/config/mcp-agents.json'),
      mcpConfig,
      { spaces: 2 }
    );
  }

  // Migrate CrewAI configs
  const crewaiConfigPath = path.join(ROOT_DIR, 'crewai/config.py');
  if (await fs.pathExists(crewaiConfigPath)) {
    await fs.copy(
      crewaiConfigPath,
      path.join(ROOT_DIR, 'ai-core/config/crewai-config.py')
    );
  }

  // Create unified config
  const unifiedConfig = {
    agents: {
      mcp: {
        enabled: true,
        configPath: 'config/mcp-agents.json'
      },
      crewai: {
        enabled: true,
        configPath: 'config/crewai-config.py'
      }
    },
    logging: {
      level: 'info',
      path: 'logs'
    }
  };

  await fs.writeJson(
    path.join(ROOT_DIR, 'ai-core/config/unified-config.json'),
    unifiedConfig,
    { spaces: 2 }
  );
}

async function migrateAgentCode() {
  // Migrate MCP agents
  if (await fs.pathExists(path.join(ROOT_DIR, '.mcp'))) {
    await fs.copy(
      path.join(ROOT_DIR, '.mcp'),
      path.join(ROOT_DIR, 'ai-core/agents/mcp'),
      {
        filter: (src) => !src.includes('agents.json') // Skip config file as it's already migrated
      }
    );
  }

  // Migrate CrewAI agents
  if (await fs.pathExists(path.join(ROOT_DIR, 'crewai/agents'))) {
    await fs.copy(
      path.join(ROOT_DIR, 'crewai/agents'),
      path.join(ROOT_DIR, 'ai-core/agents/crewai')
    );
  }

  // Migrate prompts
  if (await fs.pathExists(path.join(ROOT_DIR, 'cline_docs/agent-prompts'))) {
    await fs.copy(
      path.join(ROOT_DIR, 'cline_docs/agent-prompts'),
      path.join(ROOT_DIR, 'ai-core/agents/prompts')
    );
  }
}

async function cleanupScripts() {
  const scriptsDir = path.join(ROOT_DIR, 'scripts/agents');
  const aiCoreScripts = path.join(ROOT_DIR, 'ai-core/scripts');

  // Create new scripts directory
  await fs.ensureDir(aiCoreScripts);

  // Create unified start script
  await fs.writeFile(
    path.join(aiCoreScripts, 'start.ts'),
    `
import { UnifiedAgentManager } from '../agents/UnifiedAgentManager';

async function main() {
  const manager = new UnifiedAgentManager();
  await manager.start();
}

main().catch(console.error);
`
  );

  // Create unified status script
  await fs.writeFile(
    path.join(aiCoreScripts, 'status.ts'),
    `
import { UnifiedAgentManager } from '../agents/UnifiedAgentManager';

async function main() {
  const manager = new UnifiedAgentManager();
  const status = await manager.getStatus();
  console.log(JSON.stringify(status, null, 2));
}

main().catch(console.error);
`
  );
}

async function updatePackageJson() {
  const packageJsonPath = path.join(ROOT_DIR, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);

  packageJson.scripts = {
    ...packageJson.scripts,
    "start:agents": "ts-node ai-core/scripts/start.ts",
    "status:agents": "ts-node ai-core/scripts/status.ts",
    "test:agents": "jest ai-core/__tests__",
  };

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

async function backupExistingSystem() {
  // Create backup directory
  await fs.ensureDir(BACKUP_DIR);

  // Backup existing directories
  const dirsToBackup = ['.mcp', 'crewai', 'cline_docs/agent-prompts', 'scripts/agents'];
  
  for (const dir of dirsToBackup) {
    const sourcePath = path.join(ROOT_DIR, dir);
    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, path.join(BACKUP_DIR, dir));
    }
  }
}

async function removeOldDirectories() {
  const dirsToRemove = [
    '.mcp',
    'crewai',
    'cline_docs/agent-prompts',
    'scripts/agents'
  ];

  for (const dir of dirsToRemove) {
    const dirPath = path.join(ROOT_DIR, dir);
    if (await fs.pathExists(dirPath)) {
      await fs.remove(dirPath);
    }
  }
}

async function main() {
  try {
    console.log('Starting AI system consolidation...');

    // Step 1: Backup existing system
    console.log('Backing up existing system...');
    await backupExistingSystem();

    // Step 2: Create new structure
    console.log('Creating new directory structure...');
    await createNewStructure();

    // Step 3: Migrate configurations
    console.log('Migrating configurations...');
    await migrateConfigurations();

    // Step 4: Migrate agent code
    console.log('Migrating agent code...');
    await migrateAgentCode();

    // Step 5: Clean up and create new scripts
    console.log('Cleaning up scripts...');
    await cleanupScripts();

    // Step 6: Update package.json
    console.log('Updating package.json...');
    await updatePackageJson();

    // Step 7: Remove old directories
    console.log('Removing old directories...');
    await removeOldDirectories();

    console.log('AI system consolidation completed successfully!');
    console.log('Backup of old system is available at:', BACKUP_DIR);

  } catch (error) {
    console.error('Consolidation failed:', error);
    // Restore from backup if needed
    console.log('Restoring from backup...');
    await fs.remove(path.join(ROOT_DIR, 'ai-core'));
    await fs.copy(BACKUP_DIR, ROOT_DIR);
    process.exit(1);
  }
}

main();