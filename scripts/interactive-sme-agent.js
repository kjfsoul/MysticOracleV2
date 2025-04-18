#!/usr/bin/env node

/**
 * Interactive SME Agent
 * 
 * This agent provides an interactive interface for managing projects.
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Project configuration
const PROJECTS = [
  {
    name: 'MysticArcana',
    path: process.cwd(),
    agentDir: '.mcp',
    url: 'https://mysticarcana.com',
    description: 'Tarot and astrology platform'
  }
];

// Knowledge base
let knowledgeBase = {};
const knowledgeBasePath = path.join(process.cwd(), 'data', 'knowledge-base.json');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load knowledge base
function loadKnowledgeBase() {
  try {
    if (fs.existsSync(knowledgeBasePath)) {
      knowledgeBase = JSON.parse(fs.readFileSync(knowledgeBasePath, 'utf8'));
    } else {
      knowledgeBase = {};
      PROJECTS.forEach(project => {
        knowledgeBase[project.name] = {
          priorities: [],
          tasks: [],
          knowledge: {}
        };
      });
      saveKnowledgeBase();
    }
  } catch (error) {
    console.error(`Error loading knowledge base: ${error.message}`);
    knowledgeBase = {};
    PROJECTS.forEach(project => {
      knowledgeBase[project.name] = {
        priorities: [],
        tasks: [],
        knowledge: {}
      };
    });
  }
}

// Save knowledge base
function saveKnowledgeBase() {
  try {
    fs.writeFileSync(knowledgeBasePath, JSON.stringify(knowledgeBase, null, 2));
  } catch (error) {
    console.error(`Error saving knowledge base: ${error.message}`);
  }
}

// Current project
let currentProject = null;

// Show main menu
function showMainMenu() {
  console.clear();
  console.log('=== INTERACTIVE SME AGENT ===');
  console.log('');
  console.log('Select a project:');
  console.log('');
  
  PROJECTS.forEach((project, index) => {
    console.log(`${index + 1}. ${project.name} (${project.description})`);
  });
  
  console.log('');
  console.log('q. Quit');
  console.log('');
  
  rl.question('> ', (answer) => {
    if (answer.toLowerCase() === 'q') {
      console.log('Goodbye!');
      rl.close();
      return;
    }
    
    const projectIndex = parseInt(answer) - 1;
    
    if (isNaN(projectIndex) || projectIndex < 0 || projectIndex >= PROJECTS.length) {
      console.log('Invalid choice. Please try again.');
      setTimeout(showMainMenu, 1500);
      return;
    }
    
    currentProject = PROJECTS[projectIndex];
    showProjectMenu();
  });
}

// Show project menu
function showProjectMenu() {
  console.clear();
  console.log(`=== ${currentProject.name} ===`);
  console.log('');
  console.log('What would you like to do?');
  console.log('');
  console.log('1. Discuss project improvements');
  console.log('2. Set project priorities');
  console.log('3. Create new task');
  console.log('4. View project status');
  console.log('5. Add to knowledge base');
  console.log('6. Run project analysis');
  console.log('7. View project knowledge');
  console.log('');
  console.log('b. Back to main menu');
  console.log('');
  
  rl.question('> ', (answer) => {
    if (answer.toLowerCase() === 'b') {
      currentProject = null;
      showMainMenu();
      return;
    }
    
    switch (answer) {
      case '1':
        console.log('Discuss project improvements - Not implemented yet');
        setTimeout(showProjectMenu, 1500);
        break;
      case '2':
        console.log('Set project priorities - Not implemented yet');
        setTimeout(showProjectMenu, 1500);
        break;
      case '3':
        console.log('Create new task - Not implemented yet');
        setTimeout(showProjectMenu, 1500);
        break;
      case '4':
        console.log('View project status - Not implemented yet');
        setTimeout(showProjectMenu, 1500);
        break;
      case '5':
        console.log('Add to knowledge base - Not implemented yet');
        setTimeout(showProjectMenu, 1500);
        break;
      case '6':
        runProjectAnalysis();
        break;
      case '7':
        console.log('View project knowledge - Not implemented yet');
        setTimeout(showProjectMenu, 1500);
        break;
      default:
        console.log('Invalid choice. Please try again.');
        setTimeout(showProjectMenu, 1500);
    }
  });
}

// Run project analysis
function runProjectAnalysis() {
  console.clear();
  console.log(`=== ${currentProject.name} ANALYSIS ===`);
  console.log('');
  console.log('Select analysis type:');
  console.log('');
  console.log('1. Web crawler analysis');
  console.log('2. Code quality analysis');
  console.log('3. Performance analysis');
  console.log('4. SEO analysis');
  console.log('5. Accessibility analysis');
  console.log('');
  console.log('b. Back to project menu');
  console.log('');
  
  rl.question('> ', (answer) => {
    if (answer.toLowerCase() === 'b') {
      showProjectMenu();
      return;
    }
    
    const analysisTypes = ['web crawler', 'code quality', 'performance', 'seo', 'accessibility'];
    const analysisIndex = parseInt(answer) - 1;
    
    if (isNaN(analysisIndex) || analysisIndex < 0 || analysisIndex >= analysisTypes.length) {
      console.log('Invalid choice. Please try again.');
      setTimeout(runProjectAnalysis, 1500);
      return;
    }
    
    const analysisType = analysisTypes[analysisIndex];
    
    if (analysisType === 'web crawler') {
      selectWebCrawlerDepth();
    } else {
      console.log('');
      console.log(`${analysisType.toUpperCase()} analysis is not yet implemented.`);
      console.log('');
      console.log('Press any key to continue...');
      
      process.stdin.once('data', () => {
        runProjectAnalysis();
      });
    }
  });
}

// Select web crawler depth
function selectWebCrawlerDepth() {
  console.clear();
  console.log(`=== ${currentProject.name} WEB CRAWLER DEPTH ===`);
  console.log('');
  console.log('Select analysis depth:');
  console.log('');
  console.log('1. Basic (homepage only)');
  console.log('2. Standard (homepage + main sections)');
  console.log('3. Comprehensive (entire website)');
  console.log('');
  console.log('b. Back to analysis options');
  console.log('');
  
  rl.question('> ', (answer) => {
    if (answer.toLowerCase() === 'b') {
      runProjectAnalysis();
      return;
    }
    
    const depths = ['basic', 'standard', 'comprehensive'];
    const depthIndex = parseInt(answer) - 1;
    
    if (isNaN(depthIndex) || depthIndex < 0 || depthIndex >= depths.length) {
      console.log('Invalid choice. Please try again.');
      setTimeout(selectWebCrawlerDepth, 1500);
      return;
    }
    
    const depth = depths[depthIndex];
    runWebCrawlerForProject(currentProject, depth);
  });
}

// Run web crawler for a project
async function runWebCrawlerForProject(project, depth) {
  console.clear();
  console.log(`=== WEB CRAWLER: ${project.name.toUpperCase()} ===`);
  console.log('');
  console.log(`URL: ${project.url}`);
  console.log(`Depth: ${depth}`);
  console.log('');
  console.log('Starting web crawler...');
  console.log('');

  try {
    // Import the web crawler module dynamically
    const webCrawlerModule = await import('./web-crawler-module.js');
    
    // Run web crawler analysis
    const result = await webCrawlerModule.runWebCrawlerAnalysis(
      project,
      'full',
      depth,
      (message) => {
        console.log(message);
      }
    );

    // Display summary
    console.clear();
    console.log(`=== ${project.name.toUpperCase()} ANALYSIS SUMMARY ===`);
    console.log('');

    const categories = ['design', 'accessibility', 'content', 'functionality', 'seo', 'brokenLinks', 'contentFreshness'];
    let totalIssues = 0;
    
    categories.forEach(category => {
      if (result.results.summary[category]) {
        const issues = result.results.summary[category].issues;
        totalIssues += issues.length;
        
        console.log(`${category.toUpperCase()} Issues (${issues.length}):`);
        issues.slice(0, 3).forEach(issue => {
          console.log(`- ${issue}`);
        });
        
        if (issues.length > 3) {
          console.log(`  ... and ${issues.length - 3} more issues`);
        }
        
        console.log('');
      }
    });

    console.log('');
    console.log(`Found ${totalIssues} issues across all categories.`);
    console.log('');
    console.log('Press any key to continue...');
    
    process.stdin.once('data', () => {
      showProjectMenu();
    });
  } catch (error) {
    console.log('');
    console.log(`Error running web crawler: ${error.message}`);
    console.log('');
    console.log('Press any key to continue...');

    process.stdin.once('data', () => {
      showProjectMenu();
    });
  }
}

// Initialize
function initialize() {
  // Load knowledge base
  loadKnowledgeBase();
  
  // Show main menu
  showMainMenu();
}

// Start the agent
initialize();
