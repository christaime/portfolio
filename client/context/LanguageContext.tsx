import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../data/translations/en.json';
import frTranslations from '../data/translations/fr.json';
import { portfolioService } from '../services/portfolioService';
import { blogService } from '../services/blogService';

export interface AvailableLanguageOption {
  code: string;
  name: string;
  shortLabel: string;
  flag?: string;
}

export const available_languages: readonly AvailableLanguageOption[] = [
  { code: 'en', name: 'English', shortLabel: 'EN', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', shortLabel: 'FR', flag: '🇫🇷' },
] as const;

export const availableLanguages = available_languages;
export const AVAILABLE_LANGUAGES = available_languages;

export type SupportedLanguage = (typeof available_languages)[number]['code'];
export type Language = string;

const translationsRegistry: Record<string, Record<string, any>> = {
  en: enTranslations,
  fr: frTranslations,
};

export function getDefaultLanguage(): string {
  if (typeof window === 'undefined') return available_languages[0].code;

  const saved = localStorage.getItem('portfolio_lang') || localStorage.getItem('app_language');
  if (saved && available_languages.some((lang) => lang.code === saved)) {
    return saved;
  }

  const navLangs = window.navigator.languages || [window.navigator.language];
  for (const lang of navLangs) {
    if (!lang) continue;
    const lower = lang.toLowerCase();
    const match = available_languages.find(
      (l) => lower === l.code || lower.startsWith(`${l.code}-`) || lower.startsWith(l.code)
    );
    if (match) {
      return match.code;
    }
  }

  return available_languages[0].code;
}

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  availableLanguages: readonly AvailableLanguageOption[];
  available_languages: readonly AvailableLanguageOption[];
  t: (path: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => getDefaultLanguage());

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('portfolio_lang', lang);
    localStorage.setItem('app_language', lang);
    portfolioService.setLanguage(lang);
    blogService.setLanguage(lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    portfolioService.setLanguage(language);
    blogService.setLanguage(language);
  }, [language]);

  const t = (path: string, fallback?: string): string => {
    const currentDict = translationsRegistry[language] || translationsRegistry['en'] || enTranslations;
    const parts = path.split('.');
    let cur: any = currentDict;

    for (const part of parts) {
      if (cur && typeof cur === 'object' && part in cur) {
        cur = cur[part];
      } else {
        cur = undefined;
        break;
      }
    }

    if (typeof cur === 'string') {
      return cur;
    }

    return fallback || path;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        availableLanguages,
        available_languages,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

