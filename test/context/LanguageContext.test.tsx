import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getDefaultLanguage } from '../../src/context/LanguageContext';

describe('LanguageContext getDefaultLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return saved language if localStorage has en or fr', () => {
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

  it('should fallback to "en" when browser language is not French or English', () => {
    Object.defineProperty(window.navigator, 'languages', {
      value: ['de-DE', 'es-ES'],
      configurable: true,
    });
    expect(getDefaultLanguage()).toBe('en');
  });
});
