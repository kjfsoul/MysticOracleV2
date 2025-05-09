#!/usr/bin/env node

/**
 * This script identifies files in the root /src directory that might need to be
 * merged with client/src, and helps migrate them to the correct location.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ROOT_SRC = path.join(ROOT_DIR, 'src');
const CLIENT_SRC = path.join(ROOT_DIR, 'client/src');
const BACKUP_DIR = path.join(ROOT_DIR, 'backup-src');

// Check if root src exists
if (!fs.existsSync(ROOT_SRC)) {
  console.log('❌ No /src directory found at the root level. Nothing to merge.');
  process.exit(0);
}

// Create backup directory
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log(`✅ Created backup directory: ${BACKUP_DIR}`);
}

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

// Get all files in both directories
const rootSrcFiles = walkDir(ROOT_SRC);
const clientSrcFiles = walkDir(CLIENT_SRC);

// Convert to relative paths for comparison
const rootSrcRelative = rootSrcFiles.map(f => path.relative(ROOT_SRC, f));
const clientSrcRelative = clientSrcFiles.map(f => path.relative(CLIENT_SRC, f));

// Find files that exist only in root src
const uniqueToRootSrc = rootSrcRelative.filter(f => !clientSrcRelative.includes(f));

// Find files that exist in both directories
const commonFiles = rootSrcRelative.filter(f => clientSrcRelative.includes(f));

// Find files that need to be updated in scripts
const scriptsDir = path.join(ROOT_DIR, 'scripts');
const scriptFiles = walkDir(scriptsDir);

// Check each script file for references to ../src
const scriptsWithReferences = [];

scriptFiles.forEach(scriptFile => {
  const content = fs.readFileSync(scriptFile, 'utf8');
  if (content.includes('../client/client/src/') || content.includes('./client/client/src/') || content.includes('/client/src/')) {
    scriptsWithReferences.push({
      file: scriptFile,
      content
    });
  }
});

// Print report
console.log('\n=== SRC DIRECTORIES ANALYSIS ===\n');

console.log(`📁 Root /src directory: ${rootSrcFiles.length} files`);
console.log(`📁 Client /src directory: ${clientSrcFiles.length} files`);

console.log('\n=== FILES UNIQUE TO ROOT /SRC ===\n');
if (uniqueToRootSrc.length === 0) {
  console.log('✅ No unique files found in root /src. Safe to remove after updating scripts.');
} else {
  console.log(`⚠️ Found ${uniqueToRootSrc.length} files that exist only in root /src:`);
  uniqueToRootSrc.forEach(file => {
    console.log(`   - ${file}`);
  });
}

console.log('\n=== DUPLICATE FILES ===\n');
if (commonFiles.length === 0) {
  console.log('✅ No duplicate files found.');
} else {
  console.log(`ℹ️ Found ${commonFiles.length} files that exist in both directories.`);
  console.log('   These should be compared for differences before removing root /src.');
}

console.log('\n=== SCRIPTS REFERENCING ROOT /SRC ===\n');
if (scriptsWithReferences.length === 0) {
  console.log('✅ No scripts found referencing root /src.');
} else {
  console.log(`⚠️ Found ${scriptsWithReferences.length} scripts referencing root /src:`);
  scriptsWithReferences.forEach(({ file }) => {
    console.log(`   - ${path.relative(ROOT_DIR, file)}`);
  });
}

// Backup root src
console.log('\n=== CREATING BACKUP ===\n');
execSync(`cp -r ${ROOT_SRC}/* ${BACKUP_DIR}/`);
console.log(`✅ Backed up root /src to ${BACKUP_DIR}`);

// Generate migration commands
console.log('\n=== MIGRATION COMMANDS ===\n');

console.log('To copy unique files from root /src to client/src:');
uniqueToRootSrc.forEach(file => {
  const sourceDir = path.dirname(path.join(CLIENT_SRC, file));
  console.log(`mkdir -p "${sourceDir}" && cp "${path.join(ROOT_SRC, file)}" "${path.join(CLIENT_SRC, file)}"`);
});

console.log('\nTo update script references:');
scriptsWithReferences.forEach(({ file }) => {
  console.log(`sed -i 's|\\.\\.\/src\/|\\.\\.\/client\/src\/|g' "${file}"`);
  console.log(`sed -i 's|\\.\/src\/|\\.\/client\/src\/|g' "${file}"`);
  console.log(`sed -i 's|\/src\/|\/client\/src\/|g' "${file}"`);
});

console.log('\nTo remove root /src after migration:');
console.log(`rm -rf ${ROOT_SRC}`);

console.log('\n=== NEXT STEPS ===\n');
console.log('1. Review the analysis above');
console.log('2. Run the migration commands to copy unique files');
console.log('3. Update script references');
console.log('4. Test your application thoroughly');
console.log('5. Remove the root /src directory when everything works');
console.log('\nYour original files are backed up to:', BACKUP_DIR);
