/**
 * Pure helper functions for API-related operations
 * Extracted for testability
 */

/**
 * Enhance error message for CORS/network issues
 * @param {Error} error - Original error
 * @returns {Error} - Enhanced error with better message for CORS/network issues
 */
export function enhanceNetworkError(error) {
  // Enhance error message for CORS/network issues
  if (error.name === 'TypeError' || error.message.includes('Failed to fetch') || error.message.includes('Load failed')) {
    const enhancedError = new Error(`Network error: ${error.message}. This may be a CORS issue if accessing from a local IP address.`);
    enhancedError.name = error.name;
    enhancedError.originalError = error;
    return enhancedError;
  }
  return error;
}
