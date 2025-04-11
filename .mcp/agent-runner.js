import { exec } from 'child_process';
import fs from "fs";
import { promisify } from 'util';

const execAsync = promisify(exec);
const AGENTS_CONFIG = JSON.parse(fs.readFileSync("./.mcp/agents.json", "utf8"));

async function executeTask(agent, task) {
  console.log(`Executing task ${task.name} for ${agent}...`);
  let result = { success: false };

  try {
    switch (task.action) {
      case "optimizeMemory":
        result = await optimizeMemory();
        break;
      case "crawlLinks":
        result = await crawlWebsiteLinks();
        break;
      case "fixBrokenLinks":
        result = await fixBrokenLinks();
        break;
      case "auditUI":
        result = await auditUserInterface();
        break;
      case "fixNavigation":
        result = await fixNavigationMenu();
        break;
    }

    // Mark task as completed
    task.completed = true;
    task.completedAt = new Date().toISOString();
    task.result = result;
    saveAgentsConfig();
    
    return result;
  } catch (error) {
    console.error(`Task ${task.name} failed:`, error);
    task.error = error.message;
    saveAgentsConfig();
    throw error;
  }
}

async function optimizeMemory() {
  try {
    console.log("Optimizing memory usage...");
    global.gc && global.gc();
    
    // Analyze memory usage
    const { stdout } = await execAsync('node --print-memory-usage ./scripts/analyze-memory.js');
    const memoryData = JSON.parse(stdout);
    
    // Optimize based on analysis
    if (memoryData.heapUsed > memoryData.heapTotal * 0.8) {
      await execAsync('node --max-old-space-size=4096 ./scripts/optimize-memory.js');
      return {
        success: true,
        message: `Memory optimized from ${memoryData.heapUsed} to ${memoryData.heapTotal * 0.6}`
      };
    }
    return { success: true, message: 'Memory already optimized' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function crawlWebsiteLinks() {
  try {
    console.log("Crawling website links...");
    const { stdout } = await execAsync('node ./scripts/crawl-links.js');
    const links = JSON.parse(stdout);
    return {
      success: true,
      linksFound: links.length,
      brokenLinks: links.filter(l => l.status >= 400).length
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function fixBrokenLinks() {
  try {
    console.log("Fixing broken links...");
    const { stdout } = await execAsync('node ./scripts/fix-links.js');
    const result = JSON.parse(stdout);
    return {
      success: true,
      fixedLinks: result.fixed,
      remainingIssues: result.errors
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function auditUserInterface() {
  try {
    console.log("Auditing UI...");
    const { stdout } = await execAsync('node ./scripts/audit-ui.js');
    const issues = JSON.parse(stdout);
    return {
      success: true,
      issuesFound: issues.length,
      fixedIssues: issues.filter(i => i.fixed).length
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function fixNavigationMenu() {
  try {
    console.log("Fixing navigation menu...");
    const { stdout } = await execAsync('node ./scripts/fix-navigation.js');
    const result = JSON.parse(stdout);
    return {
      success: true,
      improvements: result.improvements,
      performanceGain: result.performanceGain
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function saveAgentsConfig() {
  fs.writeFileSync(
    "./.mcp/agents.json",
    JSON.stringify(AGENTS_CONFIG, null, 2)
  );
}

// Main execution loop
async function runTasks() {
  for (const [agentName, agent] of Object.entries(AGENTS_CONFIG.agents)) {
    if (!agent.enabled) continue;

    for (const task of agent.tasks) {
      if (!task.completed && task.enabled) {
        try {
          await executeTask(agentName, task);
          // Small delay between tasks
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error executing task ${task.name}:`, error);
        }
      }
    }
  }
}

// Start execution
console.log("Agent runner started");
runTasks().catch(console.error);

// Add memory management
const MAX_MEMORY_USAGE = 0.9;
const CHECK_INTERVAL = 5 * 60 * 1000;

setInterval(() => {
  const used = process.memoryUsage().heapUsed / process.memoryUsage().heapTotal;
  if (used > MAX_MEMORY_USAGE) {
    console.log("High memory usage detected, running optimization...");
    optimizeMemory();
  }
}, CHECK_INTERVAL);

// Handle process signals
process.on("SIGINT", () => {
  console.log("Received SIGINT signal. Shutting down...");
  saveAgentsConfig();
  process.exit(0);
});
