#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function deploy() {
  try {
    // Build the project
    console.log('Building project...');
    await execAsync('npm run build');

    // Run tests
    console.log('Running tests...');
    await execAsync('npm test');

    // Deploy
    console.log('Deploying...');
    await execAsync('npm run build:netlify');

    console.log('Deployment successful!');
    process.exit(0);
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy();