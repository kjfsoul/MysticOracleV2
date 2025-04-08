/**
 * Duplication Refactoring Strategy
 * 
 * This module identifies and refactors duplicated code.
 */

import fs from 'fs';
import path from 'path';

/**
 * Find duplicated code in a file
 * 
 * @param {string} filePath - Path to the file
 * @param {string} content - Content of the file
 * @returns {Array} - Array of changes to apply
 */
export async function findDuplication(filePath, content) {
  const changes = [];
  const fileExt = path.extname(filePath);
  
  // Only process JavaScript/TypeScript files
  if (!['.js', '.jsx', '.ts', '.tsx'].includes(fileExt)) {
    return changes;
  }
  
  try {
    // Find duplicated string literals
    const stringLiterals = findDuplicatedStringLiterals(content);
    for (const literal of stringLiterals) {
      if (literal.count >= 3 && literal.value.length > 15) {
        changes.push(createConstantExtraction(content, literal, fileExt));
      }
    }
    
    // Find duplicated function calls
    const functionCalls = findDuplicatedFunctionCalls(content);
    for (const call of functionCalls) {
      if (call.count >= 3) {
        changes.push(createHelperFunction(content, call, fileExt));
      }
    }
    
    // Find duplicated code blocks (simplified implementation)
    const codeBlocks = findDuplicatedCodeBlocks(content);
    for (const block of codeBlocks) {
      if (block.count >= 2 && block.lines.length >= 3) {
        changes.push(createExtractedFunction(content, block, fileExt));
      }
    }
  } catch (error) {
    console.error(`Error analyzing ${filePath} for duplication: ${error.message}`);
  }
  
  return changes;
}

/**
 * Find duplicated string literals in the content
 * 
 * @param {string} content - Content to analyze
 * @returns {Array} - Array of duplicated string literals
 */
function findDuplicatedStringLiterals(content) {
  const stringRegex = /'([^'\\]*(\\.[^'\\]*)*)'|"([^"\\]*(\\.[^"\\]*)*)"/g;
  const strings = {};
  let match;
  
  while ((match = stringRegex.exec(content)) !== null) {
    const value = match[0];
    if (value.length > 5) { // Only consider strings longer than 5 characters
      strings[value] = (strings[value] || 0) + 1;
    }
  }
  
  return Object.entries(strings)
    .filter(([_, count]) => count > 1)
    .map(([value, count]) => ({ value, count }));
}

/**
 * Find duplicated function calls in the content
 * 
 * @param {string} content - Content to analyze
 * @returns {Array} - Array of duplicated function calls
 */
function findDuplicatedFunctionCalls(content) {
  const functionCallRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\((.*?)\)/g;
  const calls = {};
  let match;
  
  while ((match = functionCallRegex.exec(content)) !== null) {
    const fullCall = match[0];
    const functionName = match[1];
    const args = match[2];
    
    // Skip simple calls or calls with no arguments
    if (args.length < 5) continue;
    
    const key = `${functionName}(${args})`;
    calls[key] = (calls[key] || 0) + 1;
  }
  
  return Object.entries(calls)
    .filter(([_, count]) => count > 1)
    .map(([value, count]) => ({ value, count }));
}

/**
 * Find duplicated code blocks in the content
 * 
 * @param {string} content - Content to analyze
 * @returns {Array} - Array of duplicated code blocks
 */
function findDuplicatedCodeBlocks(content) {
  // This is a simplified implementation
  // A real implementation would use a more sophisticated algorithm
  
  const lines = content.split('\n');
  const blocks = [];
  
  // Look for blocks of 3 or more lines that appear multiple times
  for (let i = 0; i < lines.length - 2; i++) {
    const blockLines = lines.slice(i, i + 3);
    const blockContent = blockLines.join('\n');
    
    // Skip blocks that are too short or contain only whitespace
    if (blockContent.trim().length < 50) continue;
    
    // Count occurrences
    let count = 0;
    let pos = -1;
    while ((pos = content.indexOf(blockContent, pos + 1)) !== -1) {
      count++;
    }
    
    if (count > 1) {
      blocks.push({
        lines: blockLines,
        content: blockContent,
        count
      });
    }
  }
  
  return blocks;
}

/**
 * Create a change to extract a string literal to a constant
 * 
 * @param {string} content - Original content
 * @param {Object} literal - String literal information
 * @param {string} fileExt - File extension
 * @returns {Object} - Change object
 */
function createConstantExtraction(content, literal, fileExt) {
  const isTypeScript = ['.ts', '.tsx'].includes(fileExt);
  const constName = generateConstantName(literal.value);
  
  // Find a good place to insert the constant
  // For simplicity, we'll insert at the beginning of the file
  const declaration = isTypeScript
    ? `const ${constName}: string = ${literal.value};\n\n`
    : `const ${constName} = ${literal.value};\n\n`;
  
  return {
    type: 'replace',
    oldCode: literal.value,
    newCode: constName,
    description: `Extract duplicated string literal to constant: ${constName}`,
    additionalChanges: [
      {
        type: 'insert',
        position: 0,
        code: declaration
      }
    ]
  };
}

/**
 * Create a change to extract a function call to a helper function
 * 
 * @param {string} content - Original content
 * @param {Object} call - Function call information
 * @param {string} fileExt - File extension
 * @returns {Object} - Change object
 */
function createHelperFunction(content, call, fileExt) {
  const isTypeScript = ['.ts', '.tsx'].includes(fileExt);
  const helperName = generateHelperName(call.value);
  
  // Extract function name and arguments
  const match = /([a-zA-Z_$][a-zA-Z0-9_$]*)\((.*)\)/.exec(call.value);
  if (!match) return null;
  
  const functionName = match[1];
  const args = match[2];
  
  // Create helper function
  const helperFunction = isTypeScript
    ? `function ${helperName}(): any {\n  return ${call.value};\n}\n\n`
    : `function ${helperName}() {\n  return ${call.value};\n}\n\n`;
  
  return {
    type: 'replace',
    oldCode: call.value,
    newCode: `${helperName}()`,
    description: `Extract duplicated function call to helper: ${helperName}`,
    additionalChanges: [
      {
        type: 'insert',
        position: 0,
        code: helperFunction
      }
    ]
  };
}

/**
 * Create a change to extract a code block to a function
 * 
 * @param {string} content - Original content
 * @param {Object} block - Code block information
 * @param {string} fileExt - File extension
 * @returns {Object} - Change object
 */
function createExtractedFunction(content, block, fileExt) {
  const isTypeScript = ['.ts', '.tsx'].includes(fileExt);
  const functionName = generateFunctionName(block.content);
  
  // Create extracted function
  const extractedFunction = isTypeScript
    ? `function ${functionName}(): void {\n${block.content}\n}\n\n`
    : `function ${functionName}() {\n${block.content}\n}\n\n`;
  
  return {
    type: 'replace',
    oldCode: block.content,
    newCode: `${functionName}()`,
    description: `Extract duplicated code block to function: ${functionName}`,
    additionalChanges: [
      {
        type: 'insert',
        position: 0,
        code: extractedFunction
      }
    ]
  };
}

/**
 * Generate a constant name from a string literal
 * 
 * @param {string} value - String literal
 * @returns {string} - Constant name
 */
function generateConstantName(value) {
  // Remove quotes
  const cleanValue = value.replace(/^['"]|['"]$/g, '');
  
  // Convert to uppercase with underscores
  const constName = cleanValue
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .toUpperCase();
  
  // Limit length and add prefix
  return `STRING_${constName.substring(0, 20)}`;
}

/**
 * Generate a helper function name from a function call
 * 
 * @param {string} value - Function call
 * @returns {string} - Helper function name
 */
function generateHelperName(value) {
  // Extract function name
  const match = /([a-zA-Z_$][a-zA-Z0-9_$]*)\(/.exec(value);
  if (!match) return 'helperFunction';
  
  return `get${match[1].charAt(0).toUpperCase() + match[1].slice(1)}Result`;
}

/**
 * Generate a function name from a code block
 * 
 * @param {string} content - Code block content
 * @returns {string} - Function name
 */
function generateFunctionName(content) {
  // Try to infer a meaningful name from the content
  // This is a simplified implementation
  
  // Look for assignments
  const assignmentMatch = /(\w+)\s*=/.exec(content);
  if (assignmentMatch) {
    return `set${assignmentMatch[1].charAt(0).toUpperCase() + assignmentMatch[1].slice(1)}`;
  }
  
  // Look for if statements
  const ifMatch = /if\s*\(\s*(\w+)/.exec(content);
  if (ifMatch) {
    return `check${ifMatch[1].charAt(0).toUpperCase() + ifMatch[1].slice(1)}`;
  }
  
  // Default name
  return `extractedFunction${Math.floor(Math.random() * 1000)}`;
}
