/**
 * Agent Service for MysticArcana
 * 
 * This service provides access to the autonomous agent system functionality.
 */

import AgentClient from '/Users/kfitz/Projects/agentscripts/agent-client.js';
import { CrewAI } from '/Users/kfitz/MysticOracleV2/MysticOracleV2/crewai/main.js';

// Create singleton instances
const agentClient = new AgentClient();
const crewAI = new CrewAI({
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
  maxTokens: 4000
});

// Project name constant for MysticArcana
const PROJECT_NAME = 'MysticArcana';

/**
 * Analyze the MysticArcana website
 * @param {string} depth - Analysis depth (basic, standard, comprehensive)
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeWebsite(depth = 'standard') {
  try {
    console.log(`Starting website analysis with depth: ${depth}`);
    return await agentClient.analyzeWebsite(PROJECT_NAME, depth);
  } catch (error) {
    console.error('Error analyzing website:', error);
    throw error;
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
    throw error;
  }
}

/**
 * Start all agents
 * @param {boolean} detached - Whether to run in detached mode
 * @returns {Promise<Object>} Result of starting agents
 */
export async function startAgents(detached = true) {
  try {
    return await agentClient.startAgents(detached);
  } catch (error) {
    console.error('Error starting agents:', error);
    throw error;
  }
}

/**
 * Generate a status report
 * @param {boolean} detached - Whether to run in detached mode
 * @returns {Promise<Object>} Status report
 */
export async function generateStatusReport(detached = false) {
  try {
    return await agentClient.generateStatusReport(detached);
  } catch (error) {
    console.error('Error generating status report:', error);
    throw error;
  }
}

/**
 * Enable away mode
 * @returns {Promise<Object>} Result of enabling away mode
 */
export async function enableAwayMode() {
  try {
    return await agentClient.enableAwayMode();
  } catch (error) {
    console.error('Error enabling away mode:', error);
    throw error;
  }
}

/**
 * Disable away mode
 * @returns {Promise<Object>} Result of disabling away mode
 */
export async function disableAwayMode() {
  try {
    return await agentClient.disableAwayMode();
  } catch (error) {
    console.error('Error disabling away mode:', error);
    throw error;
  }
}

// Export the raw client for advanced usage if needed
export { agentClient };
