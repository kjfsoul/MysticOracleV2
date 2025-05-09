import fs from 'fs-extra';
import path from 'path';

const ROOT_DIR = process.cwd();
const BACKUP_DIR = path.join(ROOT_DIR, 'backup-pre-migration');

async function createDirectoryStructure() {
  const directories = [
    'client/client/src/core/types',
    'client/client/src/core/hooks',
    'client/client/src/core/services',
    'client/client/src/core/utils',
    'client/client/src/features/tarot',
    'client/client/src/features/astrology',
    'client/client/src/features/journal',
    'client/client/src/shared/components',
    'client/client/src/shared/layouts',
    'client/client/src/shared/styles',
    'client/client/src/ai/agents',
    'client/client/src/ai/models',
    'client/client/src/ai/services',
    'server/client/src/api',
    'server/client/src/services',
    'server/client/src/db',
    'server/client/src/ai/agents',
    'server/client/src/ai/models',
    'server/client/src/ai/training',
    'ai-core/agents/tarot',
    'ai-core/agents/development',
    'ai-core/agents/content',
    'ai-core/agents/personalization',
    'ai-core/models/training',
    'ai-core/models/inference',
    'ai-core/services/mcp',
    'ai-core/services/crewai',
    'ai-core/prompts',
    'ai-core/config',
    'shared/types',
    'shared/utils',
    'shared/constants',
  ];

  for (const dir of directories) {
    await fs.ensureDir(path.join(ROOT_DIR, dir));
    console.log(`Created directory: ${dir}`);
  }
}

async function backupExistingCode() {
  await fs.copy(ROOT_DIR, BACKUP_DIR, {
    filter: (src) => {
      return !src.includes('node_modules') && 
             !src.includes('.git') &&
             !src.includes(BACKUP_DIR);
    }
  });
  console.log('Backup created at:', BACKUP_DIR);
}

async function migrateAgentSystem() {
  // Migrate MCP agents
  const mcpConfig = await fs.readJson(path.join(ROOT_DIR, '.mcp/agents.json'));
  await fs.writeJson(
    path.join(ROOT_DIR, 'ai-core/config/mcp-agents.json'),
    mcpConfig,
    { spaces: 2 }
  );

  // Migrate CrewAI agents
  const crewaiFiles = await fs.readdir(path.join(ROOT_DIR, 'crewai/agents'));
  for (const file of crewaiFiles) {
    await fs.copy(
      path.join(ROOT_DIR, 'crewai/agents', file),
      path.join(ROOT_DIR, 'ai-core/agents', file)
    );
  }
}

async function main() {
  try {
    console.log('Starting AI system migration...');
    
    // Step 1: Backup existing code
    await backupExistingCode();
    
    // Step 2: Create new directory structure
    await createDirectoryStructure();
    
    // Step 3: Migrate agent system
    await migrateAgentSystem();
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    // Restore from backup
    await fs.remove(path.join(ROOT_DIR, 'ai-core'));
    await fs.copy(BACKUP_DIR, ROOT_DIR);
    process.exit(1);
  }
}

main();
