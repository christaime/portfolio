import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { UserCircle, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenProfileModal: () => void;
}

export const Header = ({ onOpenProfileModal }: HeaderProps) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/cv', labelKey: 'nav.cv', id: 'cv' },
    { path: '/services', labelKey: 'nav.services', id: 'services' },
    { path: '/projects', labelKey: 'nav.projects', id: 'projects' },
    { path: '/contact', labelKey: 'nav.contact', id: 'contact' },
    { path: '/blog', labelKey: 'nav.blog', id: 'blog' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant text-primary font-headline-md text-headline-md font-label-caps text-label-caps">
      <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Brand Logo */}
        <Link
          to="/cv"
          onClick={() => setMobileMenuOpen(false)}
          className="font-headline-sm text-headline-sm font-bold text-primary hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
          id="brand-logo"
        >
          <span>Portfolio.dev</span>
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" title="Available for hire"></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              id={`nav-${item.id}`}
              className={({ isActive }) =>
                isActive
                  ? 'text-primary font-bold border-b-2 border-primary pb-1 opacity-100 transition-all cursor-pointer'
                  : 'text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 cursor-pointer'
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            id="lang-toggle-btn"
            className="font-label-caps text-label-caps text-secondary-container hover:text-secondary-fixed transition-colors px-2 py-1 rounded border border-secondary-container/20 hover:border-secondary-container/60 cursor-pointer flex items-center gap-1"
            title="Switch Language (EN/FR)"
          >
            <span className={language === 'en' ? 'font-bold underline' : 'opacity-70'}>EN</span>
            <span>/</span>
            <span className={language === 'fr' ? 'font-bold underline' : 'opacity-70'}>FR</span>
          </button>

          {/* Account Profile Button */}
          <button
            onClick={onOpenProfileModal}
            id="profile-overview-btn"
            className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container-high cursor-pointer flex items-center justify-center"
            title={t('accountModal.title')}
          >
            <UserCircle className="w-6 h-6" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-surface-variant hover:text-primary p-1 cursor-pointer"
            id="mobile-menu-toggle"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container border-b border-outline-variant px-margin-mobile py-4 flex flex-col gap-3 shadow-2xl animate-fadeIn">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-left py-2 px-3 rounded text-body-md font-medium transition-colors ${
                  isActive
                    ? 'bg-surface-container-high text-primary font-bold border-l-2 border-secondary-container'
                    : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

