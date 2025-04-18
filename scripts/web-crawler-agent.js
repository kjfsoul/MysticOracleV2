#!/usr/bin/env node

/**
 * Web Crawler Agent
 * 
 * This agent crawls websites and analyzes them for issues.
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as webCrawlerModule from './web-crawler-module.js';

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
    url: 'https://mysticarcana.com',
    description: 'Tarot and astrology platform'
  }
];

// Main function
async function main() {
  console.clear();
  console.log('=== WEB CRAWLER AGENT ===');
  console.log('');
  console.log('Select a project to analyze:');
  console.log('');
  
  PROJECTS.forEach((project, index) => {
    console.log(`${index + 1}. ${project.name} (${project.url})`);
  });
  
  console.log('');
  console.log('q. Quit');
  console.log('');
  
  rl.question('> ', async (answer) => {
    if (answer.toLowerCase() === 'q') {
      console.log('Goodbye!');
      rl.close();
      return;
    }
    
    const projectIndex = parseInt(answer) - 1;
    
    if (isNaN(projectIndex) || projectIndex < 0 || projectIndex >= PROJECTS.length) {
      console.log('Invalid choice. Please try again.');
      setTimeout(main, 1500);
      return;
    }
    
    const project = PROJECTS[projectIndex];
    await selectAnalysisDepth(project);
  });
}

// Select analysis depth
async function selectAnalysisDepth(project) {
  console.clear();
  console.log(`=== ${project.name.toUpperCase()} WEB CRAWLER ===`);
  console.log('');
  console.log('Select analysis depth:');
  console.log('');
  console.log('1. Basic (homepage only)');
  console.log('2. Standard (homepage + main sections)');
  console.log('3. Comprehensive (entire website)');
  console.log('');
  console.log('b. Back to project selection');
  console.log('');
  
  rl.question('> ', async (answer) => {
    if (answer.toLowerCase() === 'b') {
      main();
      return;
    }
    
    const depths = ['basic', 'standard', 'comprehensive'];
    const depthIndex = parseInt(answer) - 1;
    
    if (isNaN(depthIndex) || depthIndex < 0 || depthIndex >= depths.length) {
      console.log('Invalid choice. Please try again.');
      setTimeout(() => selectAnalysisDepth(project), 1500);
      return;
    }
    
    const depth = depths[depthIndex];
    await runWebCrawler(project, depth);
  });
}

// Run web crawler
async function runWebCrawler(project, depth) {
  console.clear();
  console.log(`=== WEB CRAWLER: ${project.name.toUpperCase()} ===`);
  console.log('');
  console.log(`URL: ${project.url}`);
  console.log(`Depth: ${depth}`);
  console.log('');
  console.log('Starting web crawler...');
  console.log('');
  
  try {
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
        issues.forEach(issue => {
          console.log(`- ${issue}`);
        });
        
        console.log('');
      }
    });
    
    console.log(`Found ${totalIssues} issues across all categories.`);
    console.log('');
    console.log('Would you like to save this report? (y/n)');
    
    rl.question('> ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        saveReport(project, result);
      } else {
        console.log('');
        console.log('Press any key to continue...');
        
        process.stdin.once('data', () => {
          main();
        });
      }
    });
  } catch (error) {
    console.log('');
    console.log(`Error running web crawler: ${error.message}`);
    console.log('');
    console.log('Press any key to continue...');
    
    process.stdin.once('data', () => {
      main();
    });
  }
}

// Save report
function saveReport(project, result) {
  // Create reports directory if it doesn't exist
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  // Create report file
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
  const reportFile = path.join(reportsDir, `${project.name.toLowerCase()}-report-${timestamp}.json`);
  
  try {
    fs.writeFileSync(reportFile, JSON.stringify(result, null, 2));
    console.log('');
    console.log(`Report saved to: ${reportFile}`);
    console.log('');
    console.log('Press any key to continue...');
    
    process.stdin.once('data', () => {
      main();
    });
  } catch (error) {
    console.log('');
    console.log(`Error saving report: ${error.message}`);
    console.log('');
    console.log('Press any key to continue...');
    
    process.stdin.once('data', () => {
      main();
    });
  }
}

// Start the agent
main();
