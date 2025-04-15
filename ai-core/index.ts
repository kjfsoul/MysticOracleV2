/**
 * MysticArcana AI Core System
 * 
 * This is the main entry point for the autonomous agent system.
 * It initializes and manages all agent processes.
 */

import { startAgentSystem } from './scripts/start';
import { getAgentStatus } from './scripts/status';

// Export main functions
export {
  startAgentSystem,
  getAgentStatus
};

// Main function to initialize the agent system
async function initializeAgentSystem() {
  console.log('Initializing MysticArcana AI Core System...');
  
  try {
    // Start the agent system
    await startAgentSystem();
    console.log('Agent system started successfully');
    
    // Log initial status
    const status = await getAgentStatus();
    console.log('Current agent status:', status);
    
    return { success: true, message: 'Agent system initialized successfully' };
  } catch (error) {
    console.error('Failed to initialize agent system:', error);
    return { success: false, message: `Initialization failed: ${error.message}` };
  }
}

// If this file is executed directly, initialize the agent system
if (process.argv[1] === import.meta.url) {
  initializeAgentSystem()
    .then(result => {
      if (!result.success) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unhandled error during initialization:', error);
      process.exit(1);
    });
}
