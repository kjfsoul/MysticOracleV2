#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TASK_QUEUE_PATH = path.join(__dirname, '../cline_docs/task-queue.json');

function loadTaskQueue() {
  try {
    return JSON.parse(fs.readFileSync(TASK_QUEUE_PATH, 'utf8'));
  } catch (error) {
    return { tasks: [] };
  }
}

function saveTaskQueue(queue) {
  fs.writeFileSync(TASK_QUEUE_PATH, JSON.stringify(queue, null, 2));
}

function addTask(taskData) {
  const queue = loadTaskQueue();
  queue.tasks.push({
    ...taskData,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
  saveTaskQueue(queue);
}

const task = {
  id: process.argv[2],
  title: process.argv[3],
  type: process.argv[4],
  priority: process.argv[5],
  assignedAgent: process.argv[6],
  description: process.argv[7] || ''
};

if (!task.id || !task.title || !task.assignedAgent) {
  console.error('Usage: node add-task.js <id> <title> <type> <priority> <assignedAgent> [description]');
  process.exit(1);
}

try {
  addTask(task);
  console.log(`Task "${task.title}" added successfully!`);
} catch (error) {
  console.error('Error adding task:', error.message);
}