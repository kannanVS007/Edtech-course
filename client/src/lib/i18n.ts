import en from '@/locales/en.json';
import ta from '@/locales/ta.json';

const translations: Record<string, any> = { en, ta };

/**
 * Helper function to get translation based on current language
 * @param key - The translation key
 * @param language - The current language ('en' or 'ta')
 * @returns The translated string or the key if not found
 */
export const getTranslation = (key: string, language: 'en' | 'ta'): string => {
    return translations[language]?.[key] || key;
};

// Types for better IntelliSense if needed
export type TranslationKey = keyof typeof en;
export type Language = 'en' | 'ta';
