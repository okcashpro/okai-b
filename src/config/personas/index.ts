import { personaManager } from '../../utils/personas';
import { restoreManager } from '../../utils/restore';
import { logger } from '../../utils/logger';

// Initialize persona system
async function initializePersonas() {
  try {
    // Get current personas
    const current = await personaManager.listPersonas();
    
    // If no personas exist, restore original ones
    if (current.length === 0) {
      await restoreManager.restoreOriginalPersonas();
      logger.info('Initialized with original personas');
    }
  } catch (error) {
    logger.error('Error initializing personas:', error);
  }
}

// Initialize on module load
void initializePersonas();

// Export persona manager for direct access
export { personaManager as personas };