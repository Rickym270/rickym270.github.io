/**
 * Global type declarations for the project
 */

interface TranslationManager {
  currentLanguage: string;
  translations: Record<string, any>;
  loadedLanguages: Set<string>;
  isApplying: boolean;
  observerTimeout: number | null;
  
  init(): void;
  loadLanguage(lang: string): Promise<void>;
  t(key: string): string;
  applyTranslations(): void;
  switchLanguage(lang: string): Promise<void>;
  updateLanguageSwitcher(): void;
}

interface Window {
  TranslationManager?: TranslationManager;
}

