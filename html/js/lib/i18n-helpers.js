/**
 * Pure helper functions for internationalization/translation
 * Extracted for testability
 */

/**
 * Get translation for a key from translations object
 * @param {string} key - Translation key (e.g., "nav.home" or "projects.title")
 * @param {string} currentLanguage - Current language code (e.g., "en", "es")
 * @param {Object} translations - Translations object { en: {...}, es: {...} }
 * @returns {string} - Translated string or key if not found
 */
export function translate(key, currentLanguage, translations) {
  const keys = key.split('.');
  let value = translations[currentLanguage];
  
  // Navigate through nested object keys
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found in current language
      if (currentLanguage !== 'en' && translations.en) {
        value = translations.en;
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2];
          } else {
            return key; // Return key if translation not found
          }
        }
      } else {
        return key; // Return key if translation not found
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

/**
 * Get default language from localStorage and browser language
 * @param {Object} localStorage - localStorage mock or actual localStorage
 * @param {string} browserLanguage - Browser language (e.g., "en-US", "es-ES")
 * @returns {string} - Language code ("en" or "es")
 */
export function getDefaultLanguage(localStorage, browserLanguage) {
  const savedLang = localStorage?.getItem('siteLanguage');
  const browserLang = browserLanguage?.split('-')[0];
  return savedLang || (browserLang === 'es' ? 'es' : 'en');
}
