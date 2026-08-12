import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import enTranslations from '../data/translations/en.json';
import frTranslations from '../data/translations/fr.json';
import { portfolioService } from '../services/portfolioService';
import { blogService } from '../services/blogService';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (path: string) => string;
}

const translationsMap: Record<Language, any> = {
  en: enTranslations,
  fr: frTranslations,
};

/**
 * Helper to determine default language:
 * 1. Saved localStorage choice
 * 2. Navigator browser language (if starting with 'fr' -> 'fr', else 'en')
 */
export function getDefaultLanguage(): Language {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('portfolio_lang') as Language;
    if (saved === 'en' || saved === 'fr') {
      return saved;
    }

    const browserLangs = navigator.languages || [navigator.language || ''];
    for (const lang of browserLangs) {
      if (lang.toLowerCase().startsWith('fr')) {
        return 'fr';
      }
      if (lang.toLowerCase().startsWith('en')) {
        return 'en';
      }
    }
  }
  return 'en';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(getDefaultLanguage);

  useEffect(() => {
    // Sync browser language if no explicitly saved user selection yet
    const saved = localStorage.getItem('portfolio_lang');
    if (!saved) {
      setLanguageState(getDefaultLanguage());
    }
  }, []);

  useEffect(() => {
    portfolioService.setLanguage(language);
    blogService.setLanguage(language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('portfolio_lang', lang);
    portfolioService.setLanguage(lang);
    blogService.setLanguage(lang);
  };


  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  // Helper function to resolve nested keys like "contact.form.submitBtn"
  const t = (path: string): string => {
    const dict = translationsMap[language] || enTranslations;
    const fallbackDict = enTranslations;

    const keys = path.split('.');
    let current: any = dict;
    let fallback: any = fallbackDict;

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        current = undefined;
      }

      if (fallback && fallback[key] !== undefined) {
        fallback = fallback[key];
      } else {
        fallback = undefined;
      }
    }

    if (typeof current === 'string') return current;
    if (typeof fallback === 'string') return fallback;
    return path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
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
