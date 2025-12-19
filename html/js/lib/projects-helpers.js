/**
 * Pure helper functions for project-related operations
 * Extracted for testability
 */

/**
 * Normalize project name for matching (case-insensitive, handle variations)
 * @param {string} name - Project name
 * @returns {string} - Normalized name for comparison
 */
export function normalizeProjectName(name) {
  if (!name) return '';
  // Remove spaces, convert to lowercase for comparison
  return name.replace(/\s+/g, '').toLowerCase();
}

/**
 * Check if a project name matches any name in a classification array
 * @param {string} projectName - Project name to check
 * @param {Array} classificationArray - Array of names from classification
 * @returns {boolean} - True if project matches any name in array
 */
export function matchesClassification(projectName, classificationArray) {
  if (!projectName || !classificationArray) return false;
  const normalizedProject = normalizeProjectName(projectName);
  return classificationArray.some(classifiedName => 
    normalizeProjectName(classifiedName) === normalizedProject
  );
}

/**
 * Get image path for a project
 * @param {string} projectName - Name of the project
 * @returns {string} - Image path (returns path, but image may not exist - handled in render)
 */
export function getProjectImage(projectName) {
  const basePath = '/html/imgs/';
  
  // Explicit mappings for known exceptions or special filenames
  const imageMap = {
    'Blue Manager': 'Blue_Manager.png',
    'BlueManager': 'Blue_Manager.png',
    'KappaSigmaHC': 'KappaSigmaHC.png',
    // Xpress Transit variants
    'Xpress Transit': 'Xpress_Transit.jpg',
    'XPress Transit': 'Xpress_Transit.jpg',
    'XpressTransit': 'Xpress_Transit.jpg',
    'xpress transit': 'Xpress_Transit.jpg'
  };
  if (imageMap[projectName]) {
    return `${basePath}${imageMap[projectName]}`;
  }
  
  // Generate common filename variations
  const noSpaces = projectName.replace(/\s+/g, '');
  const underscores = projectName.replace(/\s+/g, '_');
  const hyphens = projectName.replace(/\s+/g, '-');
  const lowerNoSpaces = noSpaces.toLowerCase();
  const lowerUnderscores = underscores.toLowerCase();
  
  const candidates = [
    // Preferred variations (underscore style first)
    `${underscores}.png`,
    `${underscores}.jpg`,
    `${noSpaces}.png`,
    `${noSpaces}.jpg`,
    `${hyphens}.png`,
    `${hyphens}.jpg`,
    // Lowercase fallbacks
    `${lowerUnderscores}.png`,
    `${lowerNoSpaces}.png`,
    `${lowerUnderscores}.jpg`,
    `${lowerNoSpaces}.jpg`,
    // Last resort: original with encoding (if any spaces/specials)
    `${encodeURIComponent(projectName)}.png`,
    `${encodeURIComponent(projectName)}.jpg`
  ];
  
  // Return the first candidate; missing file will be hidden by onerror
  return `${basePath}${candidates[0]}`;
}
