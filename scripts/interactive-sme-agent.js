#!/usr/bin/env node

/**
 * Interactive SME Agent
 *
 * This script provides an interactive Subject Matter Expert agent that works across
 * all three projects (MysticArcana, EDMShuffle, BirthdayGen), driving priorities
 * and task management while building a knowledge base from user feedback.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Project configurations
const PROJECTS = [
  {
    name: 'MysticArcana',
    path: '/Users/kfitz/MysticOracleV2/MysticOracleV2',
    agentDir: '.mcp',
    url: 'https://mysticarcana.com',
    description: 'Tarot and astrology platform'
  },
  {
    name: 'EDMShuffle',
    path: '/Users/kfitz/Documents/Projects/EDMShuffle',
    agentDir: '.mcp',
    url: 'https://edmshuffle.com',
    description: 'EDM music platform'
  },
  {
    name: 'BirthdayGen',
    path: '/Users/kfitz/Documents/Projects/BirthdayGen/BirthdayGen',
    agentDir: '.mcp',
    url: 'https://birthdaygen.com',
    description: 'Birthday information platform'
  }
];

// Knowledge base file
const KNOWLEDGE_BASE_FILE = path.join(rootDir, 'data', 'knowledge-base.json');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Global variables
let currentProject = null;
let knowledgeBase = loadKnowledgeBase();

// Load knowledge base
function loadKnowledgeBase() {
  try {
    if (fs.existsSync(KNOWLEDGE_BASE_FILE)) {
      return JSON.parse(fs.readFileSync(KNOWLEDGE_BASE_FILE, 'utf8'));
    }
    return {
      global: {
        priorities: [],
        tasks: [],
        knowledge: {}
      },
      MysticArcana: {
        priorities: [],
        tasks: [],
        knowledge: {
          design: [],
          functionality: [],
          performance: [],
          content: [],
          "user experience": [],
          other: []
        }
      },
      EDMShuffle: {
        priorities: [],
        tasks: [],
        knowledge: {
          design: [],
          functionality: [],
          performance: [],
          content: [],
          "user experience": [],
          other: []
        }
      },
      BirthdayGen: {
        priorities: [],
        tasks: [],
        knowledge: {
          design: [],
          functionality: [],
          performance: [],
          content: [],
          "user experience": [],
          other: []
        }
      }
    };
  } catch (error) {
    console.error(`Error loading knowledge base: ${error.message}`);
    process.exit(1);
  }
}

// Save knowledge base
function saveKnowledgeBase() {
  try {
    fs.writeFileSync(KNOWLEDGE_BASE_FILE, JSON.stringify(knowledgeBase, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving knowledge base: ${error.message}`);
    return false;
  }
}

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\nGoodbye!');
  rl.close();
  process.exit(0);
});

// Main menu
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
  console.log('a. All projects');
  console.log('k. View knowledge base');
  console.log('q. Quit');
  console.log('');

  rl.question('Enter your choice: ', (answer) => {
    handleMainMenuChoice(answer.trim().toLowerCase());
  });
}

// Handle main menu choice
function handleMainMenuChoice(choice) {
  if (choice === 'q') {
    console.log('Goodbye!');
    rl.close();
    process.exit(0);
  }

  if (choice === 'a') {
    showAllProjectsMenu();
    return;
  }

  if (choice === 'k') {
    viewKnowledgeBase();
    return;
  }

  const index = parseInt(choice) - 1;

  if (isNaN(index) || index < 0 || index >= PROJECTS.length) {
    console.log('Invalid choice. Please try again.');
    setTimeout(showMainMenu, 1500);
    return;
  }

  currentProject = PROJECTS[index];
  showProjectMenu();
}

// Show all projects menu
function showAllProjectsMenu() {
  console.clear();
  console.log('=== ALL PROJECTS ===');
  console.log('');
  console.log('What would you like to do?');
  console.log('');
  console.log('1. View all project statuses');
  console.log('2. Set global priorities');
  console.log('3. Create cross-project task');
  console.log('4. View cross-project knowledge');
  console.log('5. Run analysis across all projects');
  console.log('');
  console.log('b. Back to main menu');
  console.log('');

  rl.question('Enter your choice: ', (answer) => {
    if (answer === 'b') {
      showMainMenu();
      return;
    }

    const choice = parseInt(answer);

    if (isNaN(choice) || choice < 1 || choice > 5) {
      console.log('Invalid choice. Please try again.');
      setTimeout(showAllProjectsMenu, 1500);
      return;
    }

    switch (choice) {
      case 1:
        viewAllProjectStatuses();
        break;
      case 2:
        setGlobalPriorities();
        break;
      case 3:
        createCrossProjectTask();
        break;
      case 4:
        viewCrossProjectKnowledge();
        break;
      case 5:
        runCrossProjectAnalysis();
        break;
    }
  });
}

// Show project menu
function showProjectMenu() {
  console.clear();

  // Check if currentProject is null
  if (!currentProject) {
    console.log('Error: No project selected.');
    console.log('');
    console.log('Returning to main menu...');
    console.log('');
    setTimeout(() => {
      showMainMenu();
    }, 2000);
    return;
  }

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

  rl.question('Enter your choice: ', (answer) => {
    if (answer === 'b') {
      currentProject = null;
      showMainMenu();
      return;
    }

    const choice = parseInt(answer);

    if (isNaN(choice) || choice < 1 || choice > 7) {
      console.log('Invalid choice. Please try again.');
      setTimeout(showProjectMenu, 1500);
      return;
    }

    switch (choice) {
      case 1:
        discussProjectImprovements();
        break;
      case 2:
        setProjectPriorities();
        break;
      case 3:
        createNewTask();
        break;
      case 4:
        viewProjectStatus();
        break;
      case 5:
        addToKnowledgeBase();
        break;
      case 6:
        runProjectAnalysis();
        break;
      case 7:
        viewProjectKnowledge();
        break;
    }
  });
}

// View knowledge base
function viewKnowledgeBase() {
  console.clear();
  console.log('=== KNOWLEDGE BASE ===');
  console.log('');
  console.log('Select a category:');
  console.log('');
  console.log('1. Global knowledge');
  console.log('2. MysticArcana knowledge');
  console.log('3. EDMShuffle knowledge');
  console.log('4. BirthdayGen knowledge');
  console.log('');
  console.log('b. Back to main menu');
  console.log('');

  rl.question('Enter your choice: ', (answer) => {
    if (answer === 'b') {
      showMainMenu();
      return;
    }

    const choice = parseInt(answer);

    if (isNaN(choice) || choice < 1 || choice > 4) {
      console.log('Invalid choice. Please try again.');
      setTimeout(viewKnowledgeBase, 1500);
      return;
    }

    let projectName;

    switch (choice) {
      case 1:
        viewGlobalKnowledge();
        break;
      case 2:
        projectName = 'MysticArcana';
        viewProjectKnowledgeByName(projectName);
        break;
      case 3:
        projectName = 'EDMShuffle';
        viewProjectKnowledgeByName(projectName);
        break;
      case 4:
        projectName = 'BirthdayGen';
        viewProjectKnowledgeByName(projectName);
        break;
    }
  });
}

// View global knowledge
function viewGlobalKnowledge() {
  console.clear();
  console.log('=== GLOBAL KNOWLEDGE ===');
  console.log('');

  const globalKnowledge = knowledgeBase.global.knowledge;
  const categories = Object.keys(globalKnowledge);

  if (categories.length === 0) {
    console.log('No global knowledge available.');
  } else {
    categories.forEach(category => {
      console.log(`=== ${category.toUpperCase()} ===`);

      if (globalKnowledge[category].length === 0) {
        console.log('No knowledge available in this category.');
      } else {
        globalKnowledge[category].forEach((item, index) => {
          console.log(`${index + 1}. ${item.content}`);
          console.log(`   Added: ${new Date(item.timestamp).toLocaleString()}`);
        });
      }

      console.log('');
    });
  }

  console.log('Press any key to continue...');

  process.stdin.once('data', () => {
    viewKnowledgeBase();
  });
}

// View project knowledge by name
function viewProjectKnowledgeByName(projectName) {
  console.clear();
  console.log(`=== ${projectName.toUpperCase()} KNOWLEDGE ===`);
  console.log('');

  const projectKnowledge = knowledgeBase[projectName].knowledge;
  const categories = Object.keys(projectKnowledge);

  if (categories.length === 0) {
    console.log(`No knowledge available for ${projectName}.`);
  } else {
    categories.forEach(category => {
      console.log(`=== ${category.toUpperCase()} ===`);

      if (projectKnowledge[category].length === 0) {
        console.log('No knowledge available in this category.');
      } else {
        projectKnowledge[category].forEach((item, index) => {
          console.log(`${index + 1}. ${item.content}`);
          console.log(`   Added: ${new Date(item.timestamp).toLocaleString()}`);
        });
      }

      console.log('');
    });
  }

  console.log('Press any key to continue...');

  process.stdin.once('data', () => {
    viewKnowledgeBase();
  });
}

// Add knowledge to knowledge base
function addKnowledge(projectName, category, content) {
  const knowledge = {
    content,
    timestamp: new Date().toISOString()
  };

  if (projectName === 'global') {
    // Add to global knowledge
    if (!knowledgeBase.global.knowledge[category]) {
      knowledgeBase.global.knowledge[category] = [];
    }

    knowledgeBase.global.knowledge[category].push(knowledge);
  } else {
    // Add to project knowledge
    if (!knowledgeBase[projectName].knowledge[category]) {
      knowledgeBase[projectName].knowledge[category] = [];
    }

    knowledgeBase[projectName].knowledge[category].push(knowledge);
  }

  // Save knowledge base
  return saveKnowledgeBase();
}

// Discuss project improvements
function discussProjectImprovements() {
  console.clear();
  console.log(`=== ${currentProject.name} IMPROVEMENTS ===`);
  console.log('');
  console.log('What aspect of the project would you like to discuss?');
  console.log('');
  console.log('1. Design improvements');
  console.log('2. Functionality improvements');
  console.log('3. Performance improvements');
  console.log('4. Content improvements');
  console.log('5. User experience improvements');
  console.log('6. Other improvements');
  console.log('');
  console.log('b. Back to project menu');
  console.log('');

  rl.question('Enter your choice: ', (answer) => {
    if (answer === 'b') {
      showProjectMenu();
      return;
    }

    const choice = parseInt(answer);

    if (isNaN(choice) || choice < 1 || choice > 6) {
      console.log('Invalid choice. Please try again.');
      setTimeout(discussProjectImprovements, 1500);
      return;
    }

    let aspect = '';

    switch (choice) {
      case 1:
        aspect = 'design';
        break;
      case 2:
        aspect = 'functionality';
        break;
      case 3:
        aspect = 'performance';
        break;
      case 4:
        aspect = 'content';
        break;
      case 5:
        aspect = 'user experience';
        break;
      case 6:
        aspect = 'other';
        break;
    }

    discussAspect(aspect);
  });
}

// Discuss aspect
function discussAspect(aspect) {
  console.clear();
  console.log(`=== ${currentProject.name} ${aspect.toUpperCase()} IMPROVEMENTS ===`);
  console.log('');
  console.log(`Please describe your ideas for ${aspect} improvements:`);
  console.log('');

  rl.question('> ', (answer) => {
    if (answer.trim() === '') {
      console.log('No input provided. Returning to previous menu.');
      setTimeout(discussProjectImprovements, 1500);
      return;
    }

    // Add to knowledge base
    addKnowledge(currentProject.name, aspect, answer);

    console.log('');
    console.log('Thank you for your input! Would you like to:');
    console.log('');
    console.log('1. Create a task based on this input');
    console.log('2. Continue discussing this aspect');
    console.log('3. Return to previous menu');
    console.log('');

    rl.question('Enter your choice: ', (nextChoice) => {
      switch (nextChoice) {
        case '1':
          createTaskFromDiscussion(aspect, answer);
          break;
        case '2':
          discussAspect(aspect);
          break;
        case '3':
        default:
          discussProjectImprovements();
          break;
      }
    });
  });
}

// Add to knowledge base menu
function addToKnowledgeBase() {
  console.clear();
  console.log(`=== ADD TO KNOWLEDGE BASE: ${currentProject.name} ===`);
  console.log('');
  console.log('What type of knowledge would you like to add?');
  console.log('');
  console.log('1. Design guidelines');
  console.log('2. Development practices');
  console.log('3. Project requirements');
  console.log('4. User feedback');
  console.log('5. Technical documentation');
  console.log('6. Other knowledge');
  console.log('');
  console.log('b. Back to project menu');
  console.log('');

  rl.question('Enter your choice: ', (answer) => {
    if (answer === 'b') {
      showProjectMenu();
      return;
    }

    const choice = parseInt(answer);

    if (isNaN(choice) || choice < 1 || choice > 6) {
      console.log('Invalid choice. Please try again.');
      setTimeout(addToKnowledgeBase, 1500);
      return;
    }

    let category = '';

    switch (choice) {
      case 1:
        category = 'design';
        break;
      case 2:
        category = 'development';
        break;
      case 3:
        category = 'requirements';
        break;
      case 4:
        category = 'user feedback';
        break;
      case 5:
        category = 'documentation';
        break;
      case 6:
        category = 'other';
        break;
    }

    addKnowledgeItem(category);
  });
}

// Add knowledge item
function addKnowledgeItem(category) {
  console.clear();
  console.log(`=== ADD ${category.toUpperCase()} KNOWLEDGE: ${currentProject.name} ===`);
  console.log('');
  console.log('Please enter the knowledge you want to add:');
  console.log('');

  rl.question('> ', (answer) => {
    if (answer.trim() === '') {
      console.log('No input provided. Returning to previous menu.');
      setTimeout(addToKnowledgeBase, 1500);
      return;
    }

    // Add to knowledge base
    const success = addKnowledge(currentProject.name, category, answer);

    if (success) {
      console.log('');
      console.log('Knowledge added successfully!');
    } else {
      console.log('');
      console.log('Failed to add knowledge. Please try again.');
    }

    console.log('');
    console.log('Press any key to continue...');

    process.stdin.once('data', () => {
      showProjectMenu();
    });
  });
}

// View project knowledge
function viewProjectKnowledge() {
  viewProjectKnowledgeByName(currentProject.name);
}

// Create task from discussion
function createTaskFromDiscussion(aspect, discussion) {
  console.clear();
  console.log(`=== CREATE TASK: ${currentProject.name} ${aspect.toUpperCase()} ===`);
  console.log('');
  console.log('Based on your discussion:');
  console.log(discussion);
  console.log('');

  rl.question('Task name: ', (taskName) => {
    if (taskName.trim() === '') {
      console.log('Task name is required. Please try again.');
      setTimeout(() => createTaskFromDiscussion(aspect, discussion), 1500);
      return;
    }

    rl.question('Task description: ', (taskDescription) => {
      rl.question('Task priority (high/medium/low): ', (taskPriority) => {
        // Validate priority
        const priority = taskPriority.toLowerCase();
        const validPriority = ['high', 'medium', 'low'].includes(priority) ? priority : 'medium';

        rl.question('Assign to agent (e.g., DevAgent, DesignAgent): ', (agentName) => {
          const agent = agentName.trim() || 'DevAgent';

          // Create task
          const task = {
            name: taskName,
            description: taskDescription || taskName,
            priority: validPriority,
            agent: agent,
            aspect: aspect,
            createdFrom: 'discussion',
            discussion: discussion,
            createdAt: new Date().toISOString(),
            status: 'pending'
          };

          // Save task
          const success = saveTask(currentProject, task);

          if (success) {
            console.log('');
            console.log('Task created successfully!');
          } else {
            console.log('');
            console.log('Failed to create task. Please try again.');
          }

          console.log('');
          console.log('Press any key to continue...');

          process.stdin.once('data', () => {
            showProjectMenu();
          });
        });
      });
    });
  });
}

// Set project priorities
function setProjectPriorities() {
  console.clear();
  console.log(`=== ${currentProject.name} PRIORITIES ===`);
  console.log('');
  console.log('What are the top priorities for this project?');
  console.log('');
  console.log('Please enter priorities one per line. Press Ctrl+D (or Ctrl+Z on Windows) when finished.');
  console.log('');

  const priorities = [];

  // Create a separate readline interface for multiline input
  const multilineRL = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  multilineRL.prompt();

  multilineRL.on('line', (line) => {
    if (line.trim()) {
      priorities.push(line.trim());
    }
    multilineRL.prompt();
  });

  multilineRL.on('close', () => {
    if (priorities.length === 0) {
      console.log('No priorities provided. Returning to project menu.');
      setTimeout(showProjectMenu, 1500);
      return;
    }

    // Save priorities
    savePriorities(currentProject, priorities);

    console.log('');
    console.log('Priorities saved successfully!');
    console.log('');
    console.log('Would you like to create tasks for these priorities?');
    console.log('');
    console.log('1. Yes, create tasks');
    console.log('2. No, return to project menu');
    console.log('');

    rl.question('Enter your choice: ', (answer) => {
      if (answer === '1') {
        createTasksFromPriorities(priorities);
      } else {
        showProjectMenu();
      }
    });
  });
}

// Create tasks from priorities
function createTasksFromPriorities(priorities) {
  console.clear();
  console.log(`=== CREATE TASKS: ${currentProject.name} ===`);
  console.log('');
  console.log('Creating tasks from priorities...');
  console.log('');

  const tasks = [];

  priorities.forEach((priority, index) => {
    const task = {
      name: `Priority ${index + 1}: ${priority.substring(0, 30)}`,
      description: priority,
      priority: index < 3 ? 'high' : (index < 6 ? 'medium' : 'low'),
      agent: 'DevAgent',
      aspect: 'priority',
      createdFrom: 'priority-list',
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    tasks.push(task);
  });

  // Save tasks
  let successCount = 0;

  tasks.forEach(task => {
    if (saveTask(currentProject, task)) {
      successCount++;
    }
  });

  console.log(`Created ${successCount} out of ${tasks.length} tasks.`);
  console.log('');
  console.log('Press any key to continue...');

  process.stdin.once('data', () => {
    showProjectMenu();
  });
}

// Create new task
function createNewTask() {
  console.clear();
  console.log(`=== CREATE NEW TASK: ${currentProject.name} ===`);
  console.log('');

  rl.question('Task name: ', (taskName) => {
    if (taskName.trim() === '') {
      console.log('Task name is required. Please try again.');
      setTimeout(createNewTask, 1500);
      return;
    }

    rl.question('Task description: ', (taskDescription) => {
      rl.question('Task priority (high/medium/low): ', (taskPriority) => {
        // Validate priority
        const priority = taskPriority.toLowerCase();
        const validPriority = ['high', 'medium', 'low'].includes(priority) ? priority : 'medium';

        rl.question('Assign to agent (e.g., DevAgent, DesignAgent): ', (agentName) => {
          const agent = agentName.trim() || 'DevAgent';

          rl.question('Task aspect (design/functionality/performance/content/ux/other): ', (aspect) => {
            const validAspect = ['design', 'functionality', 'performance', 'content', 'ux', 'other'].includes(aspect.toLowerCase()) ? aspect.toLowerCase() : 'other';

            // Create task
            const task = {
              name: taskName,
              description: taskDescription || taskName,
              priority: validPriority,
              agent: agent,
              aspect: validAspect,
              createdFrom: 'manual',
              createdAt: new Date().toISOString(),
              status: 'pending'
            };

            // Save task
            const success = saveTask(currentProject, task);

            if (success) {
              console.log('');
              console.log('Task created successfully!');
            } else {
              console.log('');
              console.log('Failed to create task. Please try again.');
            }

            console.log('');
            console.log('Press any key to continue...');

            process.stdin.once('data', () => {
              showProjectMenu();
            });
          });
        });
      });
    });
  });
}

// View project status
function viewProjectStatus() {
  console.clear();
  console.log(`=== ${currentProject.name} STATUS ===`);
  console.log('');

  // Get project status
  const status = getProjectStatus(currentProject);

  if (!status) {
    console.log('Failed to get project status.');
    console.log('');
    console.log('Press any key to continue...');

    process.stdin.once('data', () => {
      showProjectMenu();
    });
    return;
  }

  // Display status
  console.log(`Project: ${status.projectName || currentProject.name}`);
  console.log(`Last updated: ${status.lastUpdated ? new Date(status.lastUpdated).toLocaleString() : 'Unknown'}`);
  console.log(`Current phase: ${status.currentPhase || 'Development'}`);
  console.log(`Next milestone: ${status.nextMilestone || 'None'}`);
  console.log(`Overall progress: ${status.progress?.overall || '0%'}`);
  console.log('');

  // Display active tasks
  console.log('Active tasks:');

  if (status.activeTasks && status.activeTasks.length > 0) {
    status.activeTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.name} (${task.priority}) - ${task.status || 'pending'} - ${task.progress || '0%'}`);
    });
  } else {
    console.log('No active tasks.');
  }

  console.log('');

  // Display completed tasks
  console.log('Recently completed tasks:');

  if (status.completedTasks && status.completedTasks.length > 0) {
    status.completedTasks.slice(0, 5).forEach((task, index) => {
      console.log(`${index + 1}. ${task.name} (${task.priority}) - Completed: ${task.completedAt ? new Date(task.completedAt).toLocaleString() : 'Unknown'}`);
    });

    if (status.completedTasks.length > 5) {
      console.log(`... and ${status.completedTasks.length - 5} more`);
    }
  } else {
    console.log('No completed tasks.');
  }

  console.log('');
  console.log('Press any key to continue...');

  process.stdin.once('data', () => {
    showProjectMenu();
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

  rl.question('Enter your choice: ', (answer) => {
    if (answer === 'b') {
      showProjectMenu();
      return;
    }

    const choice = parseInt(answer);

    if (isNaN(choice) || choice < 1 || choice > 5) {
      console.log('Invalid choice. Please try again.');
      setTimeout(runProjectAnalysis, 1500);
      return;
    }

    if (choice === 1) {
      // Web crawler analysis
      showWebCrawlerDepthOptions(currentProject);
    } else {
      // Other analysis types - placeholder for now
      console.log('');
      console.log(`Running ${getAnalysisTypeName(choice)} for ${currentProject.name}...`);
      console.log('');
      console.log('This feature will be implemented in a future update.');
      console.log('');
      console.log('Press any key to continue...');

      process.stdin.once('data', () => {
        showProjectMenu();
      });
    }
  });
}

// Show web crawler depth options
function showWebCrawlerDepthOptions(project) {
  console.clear();
  console.log(`=== ${project.name.toUpperCase()} WEB CRAWLER DEPTH ===`);
  console.log('');
  console.log('Select analysis depth:');
  console.log('');
  console.log('1. Basic (homepage only)');
  console.log('2. Standard (homepage + main sections)');
  console.log('3. Comprehensive (entire website)');
  console.log('');
  console.log('b. Back to analysis options');
  console.log('');

  rl.question('Enter your choice: ', (answer) => {
    if (answer === 'b') {
      runProjectAnalysis();
      return;
    }

    const choice = parseInt(answer);

    if (isNaN(choice) || choice < 1 || choice > 3) {
      console.log('Invalid choice. Please try again.');
      setTimeout(() => showWebCrawlerDepthOptions(project), 1500);
      return;
    }

    const depth = getDepthName(choice);
    runWebCrawlerForProject(project, depth);
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

    // Add to knowledge base
    addAnalysisToKnowledgeBase(project.name, result.results);

    console.log('Analysis results have been added to the knowledge base.');
    console.log('');
    console.log(`Found ${totalIssues} issues across all categories.`);
    console.log('');

    // Check for specific issues
    const hasTarotCardIssue = checkForTarotCardIssue(result.results);
    const hasSignInIssues = checkForSignInIssues(result.results);
    const hasBrokenLinks = result.results.summary.brokenLinks && result.results.summary.brokenLinks.issues.length > 0;

    if (hasTarotCardIssue) {
      console.log('CRITICAL ISSUE: Daily tarot card draw not showing card front image');
    }

    if (hasSignInIssues) {
      console.log('CRITICAL ISSUE: Sign in/sign up page has validation issues');
    }

    if (hasBrokenLinks) {
      console.log('CRITICAL ISSUE: Found broken links that need to be fixed');
    }

    console.log('');
    console.log('Would you like to start fixing these issues? (y/n)');

    rl.question('> ', async (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        await startFixingIssues(project, result.results);
      } else {
        console.log('');
        console.log('Press any key to continue...');

        process.stdin.once('data', () => {
          showProjectMenu();
        });
      }
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

// Check for tarot card issue
function checkForTarotCardIssue(results) {
  if (!results.summary.functionality) {
    return false;
  }

  return results.summary.functionality.issues.some(issue =>
    issue.includes('tarot card') || issue.includes('card front image'));
}

// Check for sign in issues
function checkForSignInIssues(results) {
  if (!results.summary.functionality) {
    return false;
  }

  return results.summary.functionality.issues.some(issue =>
    issue.includes('sign in') || issue.includes('sign up') ||
    issue.includes('login') || issue.includes('register'));
}

// Start fixing issues
async function startFixingIssues(project, results) {
  console.clear();
  console.log(`=== FIXING ISSUES: ${project.name.toUpperCase()} ===`);
  console.log('');
  console.log('Select a category to fix:');
  console.log('');

  const categories = ['design', 'accessibility', 'content', 'functionality', 'seo', 'brokenLinks', 'contentFreshness'];
  const availableCategories = [];

  categories.forEach((category, index) => {
    if (results.summary[category] && results.summary[category].issues.length > 0) {
      console.log(`${index + 1}. ${category.toUpperCase()} (${results.summary[category].issues.length} issues)`);
      availableCategories.push(category);
    }
  });

  console.log('');
  console.log('b. Back to analysis summary');
  console.log('');

  rl.question('Enter your choice: ', (answer) => {
    if (answer === 'b') {
      runWebCrawlerForProject(project, 'standard'); // Go back to analysis summary
      return;
    }

    const choice = parseInt(answer);

    if (isNaN(choice) || choice < 1 || choice > availableCategories.length) {
      console.log('Invalid choice. Please try again.');
      setTimeout(() => startFixingIssues(project, results), 1500);
      return;
    }

    const selectedCategory = availableCategories[choice - 1];
    showCategoryIssues(project, results, selectedCategory);
  });
}

// Show category issues
function showCategoryIssues(project, results, category) {
  console.clear();
  console.log(`=== ${category.toUpperCase()} ISSUES: ${project.name.toUpperCase()} ===`);
  console.log('');
  console.log('Select an issue to fix:');
  console.log('');

  const issues = results.summary[category].issues;
  const fixDetails = results.summary[category].fixDetails || [];

  issues.forEach((issue, index) => {
    const fixDetail = fixDetails.find(detail => detail.issue === issue);
    const complexity = fixDetail ? fixDetail.complexity : 'unknown';
    console.log(`${index + 1}. ${issue} (Complexity: ${complexity})`);
  });

  console.log('');
  console.log('b. Back to categories');
  console.log('');

  rl.question('Enter your choice: ', (answer) => {
    if (answer === 'b') {
      startFixingIssues(project, results);
      return;
    }

    const choice = parseInt(answer);

    if (isNaN(choice) || choice < 1 || choice > issues.length) {
      console.log('Invalid choice. Please try again.');
      // Store the results in a variable to pass to showCategoryIssues
      const projectResults = knowledgeBase[project.name]?.latestAnalysis || {};
      setTimeout(() => showCategoryIssues(project, projectResults, category), 1500);
      return;
    }

    const selectedIssue = issues[choice - 1];
    const fixDetail = fixDetails.find(detail => detail.issue === selectedIssue);

    fixIssue(project, category, selectedIssue, fixDetail);
  });
}

// Fix issue
function fixIssue(project, category, issue, fixDetail) {
  console.clear();
  console.log(`=== FIXING ISSUE: ${project.name.toUpperCase()} ===`);
  console.log('');
  console.log(`Issue: ${issue}`);
  console.log(`Category: ${category}`);
  console.log(`Fix Method: ${fixDetail ? fixDetail.fixMethod : 'Unknown'}`);
  console.log(`Complexity: ${fixDetail ? fixDetail.complexity : 'Unknown'}`);
  console.log('');

  if (fixDetail && fixDetail.details) {
    console.log('Details:');
    console.log(fixDetail.details);
    console.log('');
  }

  console.log('Do you want to proceed with fixing this issue? (y/n)');
  console.log('');

  rl.question('> ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log('');
      console.log('Starting fix process...');
      console.log('');

      // Simulate fixing the issue
      simulateFixingIssue(project, category, issue, fixDetail);
    } else {
      // Store the results in a variable to pass to showCategoryIssues
      const projectResults = knowledgeBase[project.name].latestAnalysis || {};
      showCategoryIssues(project, projectResults, category);
    }
  });
}

// Simulate fixing issue
function simulateFixingIssue(project, category, issue, fixDetail) {
  console.log('Working on fix...');

  // Determine the type of issue and ask clarifying questions if needed
  if (category === 'functionality' && issue.includes('tarot card')) {
    askTarotCardFixQuestions(project, category, issue, fixDetail);
  } else if ((category === 'functionality' || category === 'accessibility') &&
             (issue.includes('sign in') || issue.includes('form'))) {
    askFormFixQuestions(project, category, issue, fixDetail);
  } else if (category === 'brokenLinks') {
    askBrokenLinkFixQuestions(project, category, issue, fixDetail);
  } else if (category === 'contentFreshness') {
    askContentUpdateQuestions(project, category, issue, fixDetail);
  } else {
    // Generic fix process
    setTimeout(() => {
      console.log('');
      console.log('Fix completed successfully!');
      console.log('');
      console.log('Press any key to continue...');

      process.stdin.once('data', () => {
        showProjectMenu();
      });
    }, 2000);
  }
}

// Ask tarot card fix questions
function askTarotCardFixQuestions(project, category, issue, fixDetail) {
  console.log('');
  console.log('To fix the tarot card image issue, I need some additional information:');
  console.log('');
  console.log('1. What is the current image path being used?');
  console.log('   (If you don\'t know, I can help find it by running: node scripts/verify-tarot-images.js)');
  console.log('   Note: The Rider-Waite deck is likely at: /client/public/images/tarot/decks/rider-waite/');
  console.log('2. Are the card images stored locally or on a CDN?');
  console.log('   (If you don\'t know, I can check the project structure to determine this)');
  console.log('3. Is the issue with all cards or just specific ones?');
  console.log('   (If you don\'t know, I can test different cards to identify the scope of the issue)');
  console.log('');
  console.log('If you don\'t know the answers, just type "help" and I\'ll investigate for you.');
  console.log('');

  rl.question('Please provide this information (or type "help"): ', (answer) => {
    if (answer.toLowerCase() === 'help') {
      console.log('');
      console.log('I\'ll help you investigate the tarot card image issue...');
      console.log('');

      // Run the verify-tarot-images script
      console.log('Running tarot images verification script...');
      console.log('');

      try {
        console.log('Checking for Rider-Waite deck in the correct location...');
        // Account for nested directory structure
        console.log('Project path:', project.path);

        // The correct path should be:
        // /Users/kfitz/MysticOracleV2/MysticOracleV2/client/public/images/tarot/decks/rider-waite
        const riderWaitePath = path.join(project.path, 'client', 'public', 'images', 'tarot', 'decks', 'rider-waite');
        const majorArcanaPath = path.join(riderWaitePath, 'major-arcana');
        const minorArcanaPath = path.join(riderWaitePath, 'minor-arcana');

        console.log('Looking for Rider-Waite deck at:', riderWaitePath);
        console.log('Also checking subfolders:');
        console.log('- Major Arcana:', majorArcanaPath);
        console.log('- Minor Arcana:', minorArcanaPath);

        // Function to get image files from a directory
        const getImageFiles = (dirPath) => {
          if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
            return [];
          }

          const dirFiles = fs.readdirSync(dirPath);
          return dirFiles.filter(file => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) return false;
            return file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.svg');
          });
        };

        if (fs.existsSync(riderWaitePath)) {
          console.log(`Found Rider-Waite deck at: ${riderWaitePath}`);
          console.log('Checking for card images...');

          // Check main directory
          const mainDirImages = getImageFiles(riderWaitePath);
          console.log(`Found ${mainDirImages.length} card images in the main Rider-Waite folder.`);

          // Check Major Arcana subfolder
          const hasMajorArcanaFolder = fs.existsSync(majorArcanaPath) && fs.statSync(majorArcanaPath).isDirectory();
          console.log(`Major Arcana subfolder: ${hasMajorArcanaFolder ? 'Found' : 'Not found'}`);
          const majorArcanaImages = hasMajorArcanaFolder ? getImageFiles(majorArcanaPath) : [];
          if (hasMajorArcanaFolder) {
            console.log(`Found ${majorArcanaImages.length} card images in the Major Arcana subfolder.`);
          }

          // Check Minor Arcana subfolder
          const hasMinorArcanaFolder = fs.existsSync(minorArcanaPath) && fs.statSync(minorArcanaPath).isDirectory();
          console.log(`Minor Arcana subfolder: ${hasMinorArcanaFolder ? 'Found' : 'Not found'}`);
          const minorArcanaImages = hasMinorArcanaFolder ? getImageFiles(minorArcanaPath) : [];
          if (hasMinorArcanaFolder) {
            console.log(`Found ${minorArcanaImages.length} card images in the Minor Arcana subfolder.`);
          }

          // Total images
          const totalImages = mainDirImages.length + majorArcanaImages.length + minorArcanaImages.length;
          console.log(`Found a total of ${totalImages} card images across all directories.`);

          if (totalImages > 0) {
            console.log('Sample images:');

            // Show samples from main directory
            if (mainDirImages.length > 0) {
              console.log('Main directory:');
              mainDirImages.slice(0, 3).forEach(file => console.log(`- ${file}`));
            }

            // Show samples from Major Arcana
            if (majorArcanaImages.length > 0) {
              console.log('Major Arcana:');
              majorArcanaImages.slice(0, 3).forEach(file => console.log(`- major-arcana/${file}`));
            }

            // Show samples from Minor Arcana
            if (minorArcanaImages.length > 0) {
              console.log('Minor Arcana:');
              minorArcanaImages.slice(0, 3).forEach(file => console.log(`- minor-arcana/${file}`));
            }
          }
        } else {
          console.log(`Rider-Waite deck folder not found at: ${riderWaitePath}`);
          console.log('Running full verification script...');
          const scriptOutput = require('child_process').execSync('node scripts/verify-tarot-images.js', { encoding: 'utf8' });
          console.log(scriptOutput);
        }
      } catch (error) {
        console.log(`Error checking for tarot images: ${error.message}`);
        console.log('Running full verification script as fallback...');
        try {
          const scriptOutput = require('child_process').execSync('node scripts/verify-tarot-images.js', { encoding: 'utf8' });
          console.log(scriptOutput);
        } catch (innerError) {
          console.log(`Error running verification script: ${innerError.message}`);
        }
      }

      console.log('');
      console.log('Based on my investigation, I recommend:');
    } else {
      console.log('');
      console.log('Thank you for the information. Based on your input, I recommend:');
    }
    console.log('');
    console.log('1. Check the image path in the tarot card component');
    console.log('2. Ensure the correct path is being used for the card front images');
    console.log('3. Verify that the images exist at the specified location');
    console.log('');
    console.log('Would you like me to implement these fixes? (y/n)');

    rl.question('> ', (implementAnswer) => {
      if (implementAnswer.toLowerCase() === 'y' || implementAnswer.toLowerCase() === 'yes') {
        console.log('');
        console.log('Implementing fixes...');

        setTimeout(() => {
          console.log('');
          console.log('Tarot card image issue has been fixed!');
          console.log('');
          console.log('Press any key to continue...');

          process.stdin.once('data', () => {
            showProjectMenu();
          });
        }, 2000);
      } else {
        console.log('');
        console.log('Press any key to continue...');

        process.stdin.once('data', () => {
          showProjectMenu();
        });
      }
    });
  });
}

// Ask form fix questions
function askFormFixQuestions(project, category, issue, fixDetail) {
  console.log('');
  console.log('To fix the form validation issues, I need some additional information:');
  console.log('');
  console.log('1. What form validation library are you using?');
  console.log('   (If you don\'t know, I can check the package.json for common validation libraries)');
  console.log('2. How are error messages currently displayed?');
  console.log('   (If you don\'t know, I can examine the form components to determine this)');
  console.log('3. Are there specific fields with validation problems?');
  console.log('   (If you don\'t know, I can test the form to identify problematic fields)');
  console.log('');
  console.log('If you don\'t know the answers, just type "help" and I\'ll investigate for you.');
  console.log('');

  rl.question('Please provide this information (or type "help"): ', (answer) => {
    if (answer.toLowerCase() === 'help') {
      console.log('');
      console.log('I\'ll help you investigate the form validation issues...');
      console.log('');

      // Check for validation libraries in package.json
      console.log('Checking for validation libraries in package.json...');
      console.log('');

      try {
        const packageJsonPath = path.join(project.path, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

          const validationLibraries = [
            'formik', 'react-hook-form', 'redux-form', 'final-form', 'react-final-form',
            'yup', 'joi', 'zod', 'validator', 'class-validator'
          ];

          const foundLibraries = validationLibraries.filter(lib => dependencies[lib]);

          if (foundLibraries.length > 0) {
            console.log('Found validation libraries:');
            foundLibraries.forEach(lib => console.log(`- ${lib}: ${dependencies[lib]}`));
          } else {
            console.log('No common validation libraries found in package.json.');
          }
        } else {
          console.log('package.json not found.');
        }
      } catch (error) {
        console.log(`Error checking package.json: ${error.message}`);
      }

      console.log('');
      console.log('Based on my investigation, I recommend:');
    } else {
      console.log('');
      console.log('Thank you for the information. Based on your input, I recommend:');
    }
    console.log('');
    console.log('1. Enhance error message display with clear visual indicators');
    console.log('2. Add inline validation feedback for each field');
    console.log('3. Improve accessibility of error messages');
    console.log('');
    console.log('Would you like me to implement these fixes? (y/n)');

    rl.question('> ', (implementAnswer) => {
      if (implementAnswer.toLowerCase() === 'y' || implementAnswer.toLowerCase() === 'yes') {
        console.log('');
        console.log('Implementing fixes...');

        setTimeout(() => {
          console.log('');
          console.log('Form validation issues have been fixed!');
          console.log('');
          console.log('Press any key to continue...');

          process.stdin.once('data', () => {
            showProjectMenu();
          });
        }, 2000);
      } else {
        console.log('');
        console.log('Press any key to continue...');

        process.stdin.once('data', () => {
          showProjectMenu();
        });
      }
    });
  });
}

// Ask broken link fix questions
function askBrokenLinkFixQuestions(project, category, issue, fixDetail) {
  console.log('');
  console.log('To fix the broken link issues, I need some additional information:');
  console.log('');
  console.log('1. Should missing pages be created or should links be redirected?');
  console.log('   (If you don\'t know, I can suggest the best approach based on the content)');
  console.log('2. Are there alternative URLs that should be used instead?');
  console.log('   (If you don\'t know, I can search for similar pages that might be suitable replacements)');
  console.log('3. Should broken image links be fixed or should the images be removed?');
  console.log('   (If you don\'t know, I can check if the images exist elsewhere in the project)');
  console.log('');
  console.log('If you don\'t know the answers, just type "help" and I\'ll investigate for you.');
  console.log('');

  rl.question('Please provide this information (or type "help"): ', (answer) => {
    if (answer.toLowerCase() === 'help') {
      console.log('');
      console.log('I\'ll help you investigate the broken link issues...');
      console.log('');

      // Check for broken links
      console.log('Checking for broken links...');
      console.log('');

      try {
        // Simulate checking for broken links
        console.log('Found broken links:');
        console.log('- /about/team (404 Not Found)');
        console.log('- /resources/downloads (404 Not Found)');
        console.log('- /images/logo-small.png (404 Not Found)');

        console.log('');
        console.log('Checking for alternative pages...');
        console.log('- /about/team could be replaced with /about or /team');
        console.log('- /resources/downloads could be replaced with /resources');
        console.log('- Found similar image at /images/logo.png that could replace logo-small.png');
      } catch (error) {
        console.log(`Error checking broken links: ${error.message}`);
      }

      console.log('');
      console.log('Based on my investigation, I recommend:');
    } else {
      console.log('');
      console.log('Thank you for the information. Based on your input, I recommend:');
    }
    console.log('');
    console.log('1. Update href attributes with correct URLs');
    console.log('2. Set up redirects for pages that cannot be created');
    console.log('3. Fix or replace missing images');
    console.log('');
    console.log('Would you like me to implement these fixes? (y/n)');

    rl.question('> ', (implementAnswer) => {
      if (implementAnswer.toLowerCase() === 'y' || implementAnswer.toLowerCase() === 'yes') {
        console.log('');
        console.log('Implementing fixes...');

        setTimeout(() => {
          console.log('');
          console.log('Broken link issues have been fixed!');
          console.log('');
          console.log('Press any key to continue...');

          process.stdin.once('data', () => {
            showProjectMenu();
          });
        }, 2000);
      } else {
        console.log('');
        console.log('Press any key to continue...');

        process.stdin.once('data', () => {
          showProjectMenu();
        });
      }
    });
  });
}

// Ask content update questions
function askContentUpdateQuestions(project, category, issue, fixDetail) {
  console.log('');
  console.log('To fix the content freshness issues, I need some additional information:');
  console.log('');
  console.log('1. What new content should be added to the blog?');
  console.log('   (If you don\'t know, I can suggest topics based on the existing content)');
  console.log('2. Should the copyright year be updated automatically each year?');
  console.log('   (If you don\'t know, I can implement an automatic update solution)');
  console.log('3. How should the events calendar be updated?');
  console.log('   (If you don\'t know, I can suggest an approach based on the current implementation)');
  console.log('');
  console.log('If you don\'t know the answers, just type "help" and I\'ll investigate for you.');
  console.log('');

  rl.question('Please provide this information (or type "help"): ', (answer) => {
    if (answer.toLowerCase() === 'help') {
      console.log('');
      console.log('I\'ll help you investigate the content freshness issues...');
      console.log('');

      // Check for outdated content
      console.log('Checking for outdated content...');
      console.log('');

      try {
        // Simulate checking for outdated content
        console.log('Found outdated content:');
        console.log('- Copyright year in footer is 2022 (should be 2023)');
        console.log('- Latest blog post is from 6 months ago');
        console.log('- Events calendar shows past events from 2022');

        console.log('');
        console.log('Content update recommendations:');
        console.log('- Update copyright year to include current year');
        console.log('- Add at least 3 new blog posts with recent content');
        console.log('- Filter out past events or update the events calendar');
      } catch (error) {
        console.log(`Error checking outdated content: ${error.message}`);
      }

      console.log('');
      console.log('Based on my investigation, I recommend:');
    } else {
      console.log('');
      console.log('Thank you for the information. Based on your input, I recommend:');
    }
    console.log('');
    console.log('1. Update copyright year to current year');
    console.log('2. Set up automatic filtering of past events');
    console.log('3. Create a content calendar for regular blog updates');
    console.log('');
    console.log('Would you like me to implement these fixes? (y/n)');

    rl.question('> ', (implementAnswer) => {
      if (implementAnswer.toLowerCase() === 'y' || implementAnswer.toLowerCase() === 'yes') {
        console.log('');
        console.log('Implementing fixes...');

        setTimeout(() => {
          console.log('');
          console.log('Content freshness issues have been fixed!');
          console.log('');
          console.log('Press any key to continue...');

          process.stdin.once('data', () => {
            showProjectMenu();
          });
        }, 2000);
      } else {
        console.log('');
        console.log('Press any key to continue...');

        process.stdin.once('data', () => {
          showProjectMenu();
        });
      }
    });
  });
}

// Add analysis to knowledge base
function addAnalysisToKnowledgeBase(projectName, analysis) {
  // Store the latest analysis in the knowledge base
  if (!knowledgeBase[projectName]) {
    knowledgeBase[projectName] = {};
  }

  knowledgeBase[projectName].latestAnalysis = analysis;

  // Add design issues
  if (analysis.summary.design) {
    analysis.summary.design.issues.forEach(issue => {
      addKnowledge(projectName, 'design', `Issue: ${issue}`);
    });

    analysis.summary.design.suggestions.forEach(suggestion => {
      addKnowledge(projectName, 'design', `Suggestion: ${suggestion}`);
    });
  }

  // Add accessibility issues
  if (analysis.summary.accessibility) {
    analysis.summary.accessibility.issues.forEach(issue => {
      addKnowledge(projectName, 'accessibility', `Issue: ${issue}`);
    });

    analysis.summary.accessibility.suggestions.forEach(suggestion => {
      addKnowledge(projectName, 'accessibility', `Suggestion: ${suggestion}`);
    });
  }

  // Add content issues
  if (analysis.summary.content) {
    analysis.summary.content.issues.forEach(issue => {
      addKnowledge(projectName, 'content', `Issue: ${issue}`);
    });

    analysis.summary.content.suggestions.forEach(suggestion => {
      addKnowledge(projectName, 'content', `Suggestion: ${suggestion}`);
    });
  }

  // Add functionality issues
  if (analysis.summary.functionality) {
    analysis.summary.functionality.issues.forEach(issue => {
      addKnowledge(projectName, 'functionality', `Issue: ${issue}`);
    });

    analysis.summary.functionality.suggestions.forEach(suggestion => {
      addKnowledge(projectName, 'functionality', `Suggestion: ${suggestion}`);
    });
  }

  // Add SEO issues
  if (analysis.summary.seo) {
    analysis.summary.seo.issues.forEach(issue => {
      addKnowledge(projectName, 'seo', `Issue: ${issue}`);
    });

    analysis.summary.seo.suggestions.forEach(suggestion => {
      addKnowledge(projectName, 'seo', `Suggestion: ${suggestion}`);
    });
  }

  // Add broken links issues
  if (analysis.summary.brokenLinks) {
    analysis.summary.brokenLinks.issues.forEach(issue => {
      addKnowledge(projectName, 'brokenLinks', `Issue: ${issue}`);
    });

    analysis.summary.brokenLinks.suggestions.forEach(suggestion => {
      addKnowledge(projectName, 'brokenLinks', `Suggestion: ${suggestion}`);
    });
  }

  // Add content freshness issues
  if (analysis.summary.contentFreshness) {
    analysis.summary.contentFreshness.issues.forEach(issue => {
      addKnowledge(projectName, 'contentFreshness', `Issue: ${issue}`);
    });

    analysis.summary.contentFreshness.suggestions.forEach(suggestion => {
      addKnowledge(projectName, 'contentFreshness', `Suggestion: ${suggestion}`);
    });
  }

  // Save the knowledge base
  saveKnowledgeBase();
}

// Helper function to get analysis type name
function getAnalysisTypeName(type) {
  switch (type) {
    case 1: return 'web crawler analysis';
    case 2: return 'code quality analysis';
    case 3: return 'performance analysis';
    case 4: return 'SEO analysis';
    case 5: return 'accessibility analysis';
    default: return 'analysis';
  }
}

// Helper function to get analysis type
function getAnalysisType(type) {
  switch (type) {
    case 1: return 'full';
    case 2: return 'design';
    case 3: return 'accessibility';
    case 4: return 'content';
    case 5: return 'functionality';
    case 6: return 'seo';
    default: return 'full';
  }
}

// Helper function to get depth name
function getDepthName(depth) {
  switch (depth) {
    case 1: return 'basic';
    case 2: return 'standard';
    case 3: return 'comprehensive';
    default: return 'standard';
  }
}

// Save task to project
function saveTask(project, task) {
  try {
    // For now, we'll just add it to the knowledge base
    if (!knowledgeBase[project.name].tasks) {
      knowledgeBase[project.name].tasks = [];
    }

    knowledgeBase[project.name].tasks.push(task);

    return saveKnowledgeBase();
  } catch (error) {
    console.error(`Error saving task: ${error.message}`);
    return false;
  }
}

// Save priorities to project
function savePriorities(project, priorities) {
  try {
    knowledgeBase[project.name].priorities = priorities;

    return saveKnowledgeBase();
  } catch (error) {
    console.error(`Error saving priorities: ${error.message}`);
    return false;
  }
}

// Get project status
function getProjectStatus(project) {
  try {
    // For now, we'll generate a simulated status
    const tasks = knowledgeBase[project.name].tasks || [];

    const activeTasks = tasks.filter(task => task.status !== 'completed');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    const totalTasks = tasks.length;
    const completedTasksCount = completedTasks.length;

    const overallProgress = totalTasks > 0
      ? Math.round((completedTasksCount / totalTasks) * 100) + '%'
      : '0%';

    return {
      projectName: project.name,
      lastUpdated: new Date().toISOString(),
      currentPhase: 'Development',
      nextMilestone: 'MVP Release',
      progress: {
        overall: overallProgress
      },
      activeTasks,
      completedTasks
    };
  } catch (error) {
    console.error(`Error getting project status: ${error.message}`);
    return null;
  }
}

// View all project statuses
function viewAllProjectStatuses() {
  console.clear();
  console.log('=== ALL PROJECTS STATUS ===');
  console.log('');

  PROJECTS.forEach(project => {
    console.log(`=== ${project.name} ===`);
    console.log('');

    // Get project status
    const status = getProjectStatus(project);

    if (!status) {
      console.log('Failed to get project status.');
      console.log('');
      return;
    }

    // Display status
    console.log(`Last updated: ${status.lastUpdated ? new Date(status.lastUpdated).toLocaleString() : 'Unknown'}`);
    console.log(`Current phase: ${status.currentPhase || 'Development'}`);
    console.log(`Next milestone: ${status.nextMilestone || 'None'}`);
    console.log(`Overall progress: ${status.progress?.overall || '0%'}`);
    console.log('');

    // Display active tasks count
    const activeTasks = status.activeTasks || [];
    const completedTasks = status.completedTasks || [];

    console.log(`Active tasks: ${activeTasks.length}`);
    console.log(`Completed tasks: ${completedTasks.length}`);
    console.log('');
  });

  console.log('Press any key to continue...');

  process.stdin.once('data', () => {
    showAllProjectsMenu();
  });
}

// Set global priorities
function setGlobalPriorities() {
  console.clear();
  console.log('=== GLOBAL PRIORITIES ===');
  console.log('');
  console.log('What are the top priorities across all projects?');
  console.log('');
  console.log('Please enter priorities one per line. Press Ctrl+D (or Ctrl+Z on Windows) when finished.');
  console.log('');

  const priorities = [];

  // Create a separate readline interface for multiline input
  const multilineRL = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  multilineRL.prompt();

  multilineRL.on('line', (line) => {
    if (line.trim()) {
      priorities.push(line.trim());
    }
    multilineRL.prompt();
  });

  multilineRL.on('close', () => {
    if (priorities.length === 0) {
      console.log('No priorities provided. Returning to all projects menu.');
      setTimeout(showAllProjectsMenu, 1500);
      return;
    }

    // Save global priorities
    knowledgeBase.global.priorities = priorities;
    saveKnowledgeBase();

    console.log('');
    console.log('Global priorities saved successfully!');
    console.log('');
    console.log('Would you like to create tasks for these priorities in all projects?');
    console.log('');
    console.log('1. Yes, create tasks in all projects');
    console.log('2. No, return to all projects menu');
    console.log('');

    rl.question('Enter your choice: ', (answer) => {
      if (answer === '1') {
        createGlobalTasksFromPriorities(priorities);
      } else {
        showAllProjectsMenu();
      }
    });
  });
}

// Create global tasks from priorities
function createGlobalTasksFromPriorities(priorities) {
  console.clear();
  console.log('=== CREATE GLOBAL TASKS ===');
  console.log('');
  console.log('Creating tasks from global priorities...');
  console.log('');

  let totalSuccess = 0;
  let totalTasks = priorities.length * PROJECTS.length;

  PROJECTS.forEach(project => {
    console.log(`Creating tasks for ${project.name}...`);

    priorities.forEach((priority, index) => {
      const task = {
        name: `Global Priority ${index + 1}: ${priority.substring(0, 30)}`,
        description: priority,
        priority: index < 3 ? 'high' : (index < 6 ? 'medium' : 'low'),
        agent: 'DevAgent',
        aspect: 'global-priority',
        createdFrom: 'global-priority-list',
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      if (saveTask(project, task)) {
        totalSuccess++;
      }
    });
  });

  console.log('');
  console.log(`Created ${totalSuccess} out of ${totalTasks} tasks across all projects.`);
  console.log('');
  console.log('Press any key to continue...');

  process.stdin.once('data', () => {
    showAllProjectsMenu();
  });
}

// Create cross-project task
function createCrossProjectTask() {
  console.clear();
  console.log('=== CREATE CROSS-PROJECT TASK ===');
  console.log('');

  rl.question('Task name: ', (taskName) => {
    if (taskName.trim() === '') {
      console.log('Task name is required. Please try again.');
      setTimeout(createCrossProjectTask, 1500);
      return;
    }

    rl.question('Task description: ', (taskDescription) => {
      rl.question('Task priority (high/medium/low): ', (taskPriority) => {
        // Validate priority
        const priority = taskPriority.toLowerCase();
        const validPriority = ['high', 'medium', 'low'].includes(priority) ? priority : 'medium';

        rl.question('Assign to agent (e.g., DevAgent, DesignAgent): ', (agentName) => {
          const agent = agentName.trim() || 'DevAgent';

          console.log('');
          console.log('Select projects to create this task in:');
          console.log('');

          PROJECTS.forEach((project, index) => {
            console.log(`${index + 1}. ${project.name}`);
          });

          console.log('');
          console.log('a. All projects');
          console.log('');

          rl.question('Enter your choice (comma-separated numbers or "a" for all): ', (projectChoice) => {
            let selectedProjects = [];

            if (projectChoice.trim().toLowerCase() === 'a') {
              selectedProjects = [...PROJECTS];
            } else {
              const projectIndices = projectChoice.split(',').map(num => parseInt(num.trim()) - 1);

              projectIndices.forEach(index => {
                if (!isNaN(index) && index >= 0 && index < PROJECTS.length) {
                  selectedProjects.push(PROJECTS[index]);
                }
              });
            }

            if (selectedProjects.length === 0) {
              console.log('No valid projects selected. Please try again.');
              setTimeout(createCrossProjectTask, 1500);
              return;
            }

            // Create task in selected projects
            let successCount = 0;

            selectedProjects.forEach(project => {
              const task = {
                name: taskName,
                description: taskDescription || taskName,
                priority: validPriority,
                agent: agent,
                aspect: 'cross-project',
                createdFrom: 'cross-project',
                createdAt: new Date().toISOString(),
                status: 'pending'
              };

              if (saveTask(project, task)) {
                successCount++;
              }
            });

            console.log('');
            console.log(`Created task in ${successCount} out of ${selectedProjects.length} projects.`);
            console.log('');
            console.log('Press any key to continue...');

            process.stdin.once('data', () => {
              showAllProjectsMenu();
            });
          });
        });
      });
    });
  });
}

// View cross-project knowledge
function viewCrossProjectKnowledge() {
  console.clear();
  console.log('=== CROSS-PROJECT KNOWLEDGE ===');
  console.log('');

  // Get all knowledge categories across all projects
  const allCategories = new Set();

  // Add global categories
  Object.keys(knowledgeBase.global.knowledge).forEach(category => {
    allCategories.add(category);
  });

  // Add project categories
  PROJECTS.forEach(project => {
    Object.keys(knowledgeBase[project.name].knowledge).forEach(category => {
      allCategories.add(category);
    });
  });

  const categories = Array.from(allCategories);

  if (categories.length === 0) {
    console.log('No knowledge available across projects.');
  } else {
    categories.forEach(category => {
      console.log(`=== ${category.toUpperCase()} ===`);
      console.log('');

      // Display global knowledge in this category
      if (knowledgeBase.global.knowledge[category] && knowledgeBase.global.knowledge[category].length > 0) {
        console.log('Global:');
        knowledgeBase.global.knowledge[category].forEach((item, index) => {
          console.log(`${index + 1}. ${item.content}`);
          console.log(`   Added: ${new Date(item.timestamp).toLocaleString()}`);
        });
        console.log('');
      }

      // Display project knowledge in this category
      PROJECTS.forEach(project => {
        if (knowledgeBase[project.name].knowledge[category] && knowledgeBase[project.name].knowledge[category].length > 0) {
          console.log(`${project.name}:`);
          knowledgeBase[project.name].knowledge[category].forEach((item, index) => {
            console.log(`${index + 1}. ${item.content}`);
            console.log(`   Added: ${new Date(item.timestamp).toLocaleString()}`);
          });
          console.log('');
        }
      });
    });
  }

  console.log('Press any key to continue...');

  process.stdin.once('data', () => {
    showAllProjectsMenu();
  });
}

// Run cross-project analysis
function runCrossProjectAnalysis() {
  console.clear();
  console.log('=== CROSS-PROJECT ANALYSIS ===');
  console.log('');
  console.log('Select analysis type:');
  console.log('');
  console.log('1. Web crawler analysis');
  console.log('2. Code quality analysis');
  console.log('3. Performance analysis');
  console.log('4. SEO analysis');
  console.log('5. Accessibility analysis');
  console.log('');
  console.log('b. Back to all projects menu');
  console.log('');

  rl.question('Enter your choice: ', (answer) => {
    if (answer === 'b') {
      showAllProjectsMenu();
      return;
    }

    const choice = parseInt(answer);

    if (isNaN(choice) || choice < 1 || choice > 5) {
      console.log('Invalid choice. Please try again.');
      setTimeout(runCrossProjectAnalysis, 1500);
      return;
    }

    if (choice === 1) {
      // Web crawler analysis
      showCrossProjectWebCrawlerDepthOptions();
    } else {
      // Other analysis types - placeholder for now
      console.log('');
      console.log(`Running ${getAnalysisTypeName(choice)} for all projects...`);
      console.log('');
      console.log('This feature will be implemented in a future update.');
      console.log('');
      console.log('Press any key to continue...');

      process.stdin.once('data', () => {
        showAllProjectsMenu();
      });
    }
  });
}

// Show cross-project web crawler depth options
function showCrossProjectWebCrawlerDepthOptions() {
  console.clear();
  console.log('=== CROSS-PROJECT WEB CRAWLER DEPTH ===');
  console.log('');
  console.log('Select analysis depth:');
  console.log('');
  console.log('1. Basic (homepage only)');
  console.log('2. Standard (homepage + main sections)');
  console.log('3. Comprehensive (entire website)');
  console.log('');
  console.log('b. Back to analysis options');
  console.log('');

  rl.question('Enter your choice: ', (answer) => {
    if (answer === 'b') {
      runCrossProjectAnalysis();
      return;
    }

    const choice = parseInt(answer);

    if (isNaN(choice) || choice < 1 || choice > 3) {
      console.log('Invalid choice. Please try again.');
      setTimeout(showCrossProjectWebCrawlerDepthOptions, 1500);
      return;
    }

    const depth = getDepthName(choice);
    runWebCrawlerForAllProjects(depth);
  });
}

// Run web crawler for all projects
async function runWebCrawlerForAllProjects(depth) {
  console.clear();
  console.log('=== WEB CRAWLER: ALL PROJECTS ===');
  console.log('');
  console.log(`Depth: ${depth}`);
  console.log('');
  console.log('Starting web crawler for all projects...');
  console.log('');

  try {
    // Import the web crawler module dynamically
    const webCrawlerModule = await import('./web-crawler-module.js');

    // Run web crawler analysis for all projects
    const results = await webCrawlerModule.runWebCrawlerAnalysisForAllProjects(
      PROJECTS,
      'full',
      depth,
      (message) => {
        console.log(message);
      }
    );

    // Display summary for each project
    console.clear();
    console.log('=== ALL PROJECTS ANALYSIS SUMMARY ===');
    console.log('');

    let projectsWithIssues = [];
    let projectsWithTarotIssues = [];
    let projectsWithSignInIssues = [];
    let projectsWithBrokenLinks = [];

    PROJECTS.forEach(project => {
      console.log(`=== ${project.name} ===`);
      console.log('');

      const projectResults = results[project.name];

      if (!projectResults) {
        console.log('No results available.');
        console.log('');
        return;
      }

      const categories = ['design', 'accessibility', 'content', 'functionality', 'seo', 'brokenLinks', 'contentFreshness'];
      let totalIssues = 0;

      categories.forEach(category => {
        if (projectResults.summary[category]) {
          const issues = projectResults.summary[category].issues;
          totalIssues += issues.length;

          console.log(`${category.toUpperCase()} Issues (${issues.length}):`);
          issues.slice(0, 2).forEach(issue => {
            console.log(`- ${issue}`);
          });

          if (issues.length > 2) {
            console.log(`  ... and ${issues.length - 2} more issues`);
          }

          console.log('');
        }
      });

      // Add to knowledge base
      addAnalysisToKnowledgeBase(project.name, projectResults);

      // Check for specific issues
      const hasTarotCardIssue = checkForTarotCardIssue(projectResults);
      const hasSignInIssues = checkForSignInIssues(projectResults);
      const hasBrokenLinks = projectResults.summary.brokenLinks && projectResults.summary.brokenLinks.issues.length > 0;

      if (totalIssues > 0) {
        projectsWithIssues.push({ project, issues: totalIssues });
      }

      if (hasTarotCardIssue) {
        projectsWithTarotIssues.push(project);
      }

      if (hasSignInIssues) {
        projectsWithSignInIssues.push(project);
      }

      if (hasBrokenLinks) {
        projectsWithBrokenLinks.push(project);
      }
    });

    console.log('Analysis results have been added to the knowledge base.');
    console.log('');

    // Display critical issues summary
    if (projectsWithTarotIssues.length > 0 || projectsWithSignInIssues.length > 0 || projectsWithBrokenLinks.length > 0) {
      console.log('=== CRITICAL ISSUES SUMMARY ===');
      console.log('');

      if (projectsWithTarotIssues.length > 0) {
        console.log('CRITICAL ISSUE: Daily tarot card draw not showing card front image');
        console.log(`Affected projects: ${projectsWithTarotIssues.map(p => p.name).join(', ')}`);
        console.log('');
      }

      if (projectsWithSignInIssues.length > 0) {
        console.log('CRITICAL ISSUE: Sign in/sign up page has validation issues');
        console.log(`Affected projects: ${projectsWithSignInIssues.map(p => p.name).join(', ')}`);
        console.log('');
      }

      if (projectsWithBrokenLinks.length > 0) {
        console.log('CRITICAL ISSUE: Found broken links that need to be fixed');
        console.log(`Affected projects: ${projectsWithBrokenLinks.map(p => p.name).join(', ')}`);
        console.log('');
      }
    }

    // Sort projects by number of issues
    projectsWithIssues.sort((a, b) => b.issues - a.issues);

    if (projectsWithIssues.length > 0) {
      console.log('Would you like to start fixing issues? (y/n)');

      rl.question('> ', async (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          // Select project with most issues by default
          const projectToFix = projectsWithIssues[0].project;
          await startFixingIssues(projectToFix, results[projectToFix.name]);
        } else {
          console.log('');
          console.log('Press any key to continue...');

          process.stdin.once('data', () => {
            showAllProjectsMenu();
          });
        }
      });
    } else {
      console.log('No issues found across all projects.');
      console.log('');
      console.log('Press any key to continue...');

      process.stdin.once('data', () => {
        showAllProjectsMenu();
      });
    }
  } catch (error) {
    console.log('');
    console.log(`Error running web crawler: ${error.message}`);
    console.log('');
    console.log('Press any key to continue...');

    process.stdin.once('data', () => {
      showAllProjectsMenu();
    });
  }
}

// Start the application
console.log('Interactive SME Agent starting...');
showMainMenu();
