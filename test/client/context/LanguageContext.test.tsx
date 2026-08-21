import { describe, it, expect, beforeEach } from 'vitest';
import { getDefaultLanguage, available_languages, availableLanguages } from '@/client/context/LanguageContext';

describe('LanguageContext and available_languages', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('exports available_languages with configured languages and codes', () => {
    expect(available_languages).toBeDefined();
    expect(available_languages.length).toBeGreaterThanOrEqual(2);
    expect(availableLanguages).toBe(available_languages);

    const codes = available_languages.map((l) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('fr');
  });

  it('should return saved language if localStorage has supported language', () => {
    localStorage.setItem('portfolio_lang', 'fr');
    expect(getDefaultLanguage()).toBe('fr');

    localStorage.setItem('portfolio_lang', 'en');
    expect(getDefaultLanguage()).toBe('en');
  });

  it('should detect browser French language when no localStorage choice exists', () => {
    Object.defineProperty(window.navigator, 'languages', {
      value: ['fr-FR', 'fr', 'en-US'],
      configurable: true,
    });
    expect(getDefaultLanguage()).toBe('fr');
  });

  it('should fallback to default available language when browser language is unsupported', () => {
    Object.defineProperty(window.navigator, 'languages', {
      value: ['xx-YY'],
      configurable: true,
    });
    expect(getDefaultLanguage()).toBe(available_languages[0].code);
  });
});
