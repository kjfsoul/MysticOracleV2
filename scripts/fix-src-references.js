#!/usr/bin/env node

/**
 * This script automatically updates references from /src to /client/src
 * in all script files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SCRIPTS_DIR = path.join(ROOT_DIR, 'scripts');

// Function to walk directory and get all files
function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fileList = walkDir(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Get all script files
const scriptFiles = walkDir(SCRIPTS_DIR);

// Counter for modified files
let modifiedCount = 0;

// Process each script file
scriptFiles.forEach(file => {
  // Skip this script itself
  if (file.endsWith('fix-src-references.js')) return;
  
  // Read file content
  let content = fs.readFileSync(file, 'utf8');
  const originalContent = content;
  
  // Replace references to root /src with client/src
  content = content.replace(/\.\.\/src\//g, '../client/src/');
  content = content.replace(/\.\/src\//g, './client/src/');
  content = content.replace(/\/src\//g, '/client/src/');
  
  // If content was modified, write it back
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`✅ Updated references in: ${path.relative(ROOT_DIR, file)}`);
    modifiedCount++;
  }
});

console.log(`\n=== SUMMARY ===\n`);
console.log(`Modified ${modifiedCount} script files to reference client/src instead of src.`);

if (modifiedCount > 0) {
  console.log(`\n⚠️ Please test your application thoroughly to ensure all references work correctly.`);
}
