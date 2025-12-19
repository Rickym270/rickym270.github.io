import { describe, it, expect, beforeEach } from 'vitest';
import { translate, getDefaultLanguage } from '../../html/js/lib/i18n-helpers.js';

describe('translate', () => {
  const translations = {
    en: {
      nav: {
        home: 'Home',
        about: 'About'
      },
      projects: {
        title: 'Projects',
        description: 'My projects'
      },
      simple: 'Simple text'
    },
    es: {
      nav: {
        home: 'Inicio',
        about: 'Acerca de'
      },
      projects: {
        title: 'Proyectos'
        // description is missing in Spanish
      }
    }
  };

  it('should translate simple keys', () => {
    expect(translate('simple', 'en', translations)).toBe('Simple text');
  });

  it('should translate nested keys', () => {
    expect(translate('nav.home', 'en', translations)).toBe('Home');
    expect(translate('nav.about', 'en', translations)).toBe('About');
    expect(translate('projects.title', 'en', translations)).toBe('Projects');
  });

  it('should translate in Spanish when available', () => {
    expect(translate('nav.home', 'es', translations)).toBe('Inicio');
    expect(translate('nav.about', 'es', translations)).toBe('Acerca de');
    expect(translate('projects.title', 'es', translations)).toBe('Proyectos');
  });

  it('should fallback to English when Spanish translation is missing', () => {
    // projects.description exists in English but not Spanish
    expect(translate('projects.description', 'es', translations)).toBe('My projects');
  });

  it('should return key when translation is not found in any language', () => {
    expect(translate('nonexistent.key', 'en', translations)).toBe('nonexistent.key');
    expect(translate('nonexistent.key', 'es', translations)).toBe('nonexistent.key');
  });

  it('should return key when translations object is missing language', () => {
    const incompleteTranslations = { en: translations.en };
    // When Spanish translations are missing, it should fallback to English first
    // If English has the key, it returns the English translation, not the key
    expect(translate('nav.home', 'es', incompleteTranslations)).toBe('Home');
    // Only returns key if both languages are missing
    expect(translate('nonexistent.key', 'es', incompleteTranslations)).toBe('nonexistent.key');
  });

  it('should handle empty translations object', () => {
    expect(translate('nav.home', 'en', {})).toBe('nav.home');
  });
});

describe('getDefaultLanguage', () => {
  it('should return saved language from localStorage', () => {
    const localStorage = {
      getItem: (key) => key === 'siteLanguage' ? 'es' : null
    };
    expect(getDefaultLanguage(localStorage, 'en-US')).toBe('es');
  });

  it('should return browser language when localStorage is empty', () => {
    const localStorage = {
      getItem: () => null
    };
    expect(getDefaultLanguage(localStorage, 'es-ES')).toBe('es');
    expect(getDefaultLanguage(localStorage, 'en-US')).toBe('en');
  });

  it('should default to English for non-Spanish browser languages', () => {
    const localStorage = {
      getItem: () => null
    };
    expect(getDefaultLanguage(localStorage, 'fr-FR')).toBe('en');
    expect(getDefaultLanguage(localStorage, 'de-DE')).toBe('en');
  });

  it('should handle null/undefined localStorage gracefully', () => {
    expect(getDefaultLanguage(null, 'es-ES')).toBe('es');
    expect(getDefaultLanguage(undefined, 'en-US')).toBe('en');
    expect(getDefaultLanguage(null, 'fr-FR')).toBe('en');
  });

  it('should handle missing browser language', () => {
    const localStorage = {
      getItem: () => null
    };
    expect(getDefaultLanguage(localStorage, null)).toBe('en');
    expect(getDefaultLanguage(localStorage, undefined)).toBe('en');
  });
});
