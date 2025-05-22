/**
 * Agent Service
 * 
 * This service provides access to the autonomous agent system functionality.
 * It imports the agent client directly from the agentscripts project to maintain
 * a single source of truth.
 */

import AgentClient from '/Users/kfitz/Projects/agentscripts/agent-client.js';

// Create a singleton instance of the agent client
const agentClient = new AgentClient();

// Project name constant for MysticArcana
const PROJECT_NAME = 'MysticArcana';

/**
 * Check if the agent API server is running
 * @returns {Promise<boolean>} True if the server is running, false otherwise
 */
export async function isAgentServerRunning() {
  try {
    await agentClient.getStatus();
    return true;
  } catch (error) {
    console.warn('Agent API server is not running:', error.message);
    return false;
  }
}

/**
 * Analyze the MysticArcana website
 * @param {string} depth - Analysis depth (basic, standard, comprehensive)
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeWebsite(depth = 'standard') {
  try {
    console.log(`Starting website analysis with depth: ${depth}`);
    const results = await agentClient.analyzeWebsite(PROJECT_NAME, depth);
    console.log(`Analysis complete with ${Object.keys(results.results?.summary || {}).length} categories of issues`);
    return results;
  } catch (error) {
    console.error('Error analyzing website:', error);
    throw new Error(`Website analysis failed: ${error.message}`);
  }
}

/**
 * Start all autonomous agents
 * @param {boolean} detached - Whether to run in detached mode
 * @returns {Promise<Object>} Result of starting agents
 */
export async function startAgents(detached = true) {
  try {
    console.log('Starting autonomous agents...');
    const result = await agentClient.startAgents(detached);
    console.log('Agents started successfully');
    return result;
  } catch (error) {
    console.error('Error starting agents:', error);
    throw new Error(`Failed to start agents: ${error.message}`);
  }
}

/**
 * Generate a status report for the project
 * @param {boolean} detached - Whether to run in detached mode
 * @returns {Promise<Object>} Status report
 */
export async function generateStatusReport(detached = false) {
  try {
    console.log('Generating status report...');
    const result = await agentClient.generateStatusReport(detached);
    console.log('Status report generated successfully');
    return result;
  } catch (error) {
    console.error('Error generating status report:', error);
    throw new Error(`Failed to generate status report: ${error.message}`);
  }
}

/**
 * Get the current status of all agents
 * @returns {Promise<Object>} Agent status
 */
export async function getAgentStatus() {
  try {
    return await agentClient.getStatus();
  } catch (error) {
    console.error('Error getting agent status:', error);
    throw new Error(`Failed to get agent status: ${error.message}`);
  }
}

/**
 * Enable away mode for resource-intensive tasks
 * @returns {Promise<Object>} Result of enabling away mode
 */
export async function enableAwayMode() {
  try {
    console.log('Enabling away mode...');
    const result = await agentClient.enableAwayMode();
    console.log('Away mode enabled successfully');
    return result;
  } catch (error) {
    console.error('Error enabling away mode:', error);
    throw new Error(`Failed to enable away mode: ${error.message}`);
  }
}

/**
 * Disable away mode
 * @returns {Promise<Object>} Result of disabling away mode
 */
export async function disableAwayMode() {
  try {
    console.log('Disabling away mode...');
    const result = await agentClient.disableAwayMode();
    console.log('Away mode disabled successfully');
    return result;
  } catch (error) {
    console.error('Error disabling away mode:', error);
    throw new Error(`Failed to disable away mode: ${error.message}`);
  }
}

/**
 * Verify that the agent system is properly connected
 * @returns {Promise<boolean>} True if connected, throws an error otherwise
 */
export async function verifyAgentConnection() {
  const isRunning = await isAgentServerRunning();
  if (!isRunning) {
    throw new Error('Agent API server is not running. Please start it in the agentscripts project.');
  }
  return true;
}

// Export the raw client for advanced usage if needed
export { agentClient };
