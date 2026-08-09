import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative w-full py-12 bg-surface-container-lowest text-on-surface-variant font-body-md text-body-md font-label-caps text-label-caps border-t border-outline-variant mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-gutter">
        <Link
          to="/cv"
          className="font-headline-sm text-headline-sm text-primary hover:text-secondary-container transition-colors cursor-pointer text-left"
          id="footer-logo-btn"
        >
          Portfolio.dev
        </Link>

        <div className="flex gap-6">
          <a
            className="text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer flex items-center gap-1"
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            id="footer-github-link"
          >
            GitHub
          </a>
          <a
            className="text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer flex items-center gap-1"
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            id="footer-linkedin-link"
          >
            LinkedIn
          </a>
          <a
            className="text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer flex items-center gap-1"
            href="https://stackoverflow.com"
            target="_blank"
            rel="noreferrer"
            id="footer-stackoverflow-link"
          >
            Stack Overflow
          </a>
        </div>

        <div className="text-on-surface-variant text-sm opacity-90 text-center md:text-right">
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};
