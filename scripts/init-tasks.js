#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const TASK_QUEUE_PATH = path.join(process.cwd(), 'cline_docs/task-queue.json');
const COMPLETED_TASKS_PATH = path.join(process.cwd(), 'cline_docs/completed-tasks.json');

const initialTasks = {
  tasks: [
    {
      id: "memory-opt-001",
      title: "Memory Usage Optimization",
      type: "system",
      priority: "high",
      assignedAgent: "CodeAgent",
      status: "pending",
      createdAt: new Date().toISOString()
    },
    {
      id: "ui-audit-001",
      title: "Website UI Audit and Fixes",
      type: "ui",
      priority: "high",
      assignedAgent: "DesignAgent",
      status: "pending",
      createdAt: new Date().toISOString()
    },
    {
      id: "crawl-001",
      title: "Website Link Crawling",
      type: "maintenance",
      priority: "high",
      assignedAgent: "CodeAgent",
      status: "pending",
      createdAt: new Date().toISOString()
    }
  ]
};

const completedTasks = {
  tasks: []
};

// Initialize task files
fs.writeFileSync(TASK_QUEUE_PATH, JSON.stringify(initialTasks, null, 2));
fs.writeFileSync(COMPLETED_TASKS_PATH, JSON.stringify(completedTasks, null, 2));

console.log('Task queue initialized successfully!');