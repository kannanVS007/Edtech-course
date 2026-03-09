'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTranslation, Language } from '@/lib/i18n';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set, get) => ({
            language: 'en',
            setLanguage: (lang) => set({ language: lang }),
            t: (key) => {
                const lang = get().language;
                return getTranslation(key, lang);
            },
        }),
        {
            name: 'language-storage',
        }
    )
);
