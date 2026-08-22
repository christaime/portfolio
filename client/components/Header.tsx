import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage, available_languages } from '../context/LanguageContext';
import { Terminal, Globe, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenProfileModal?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('header.navCv', 'CV & Experience') },
    { path: '/services', label: t('header.navServices', 'Services & Advisory') },
    { path: '/projects', label: t('header.navProjects', 'Projects') },
    { path: '/blog', label: t('header.navBlog', 'Articles') },
    { path: '/contact', label: t('header.navContact', 'Contact') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#051424]/90 border-b border-[#1b3450]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 text-[#00a6e0] font-mono font-bold tracking-tight hover:opacity-90 transition-opacity">
          <Terminal className="w-5 h-5 text-[#00a6e0]" />
          <span className="text-[#d4e4fa] text-base font-semibold">Portfolio.dev</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#0e2742] text-[#00a6e0] font-medium border border-[#00a6e0]/30'
                    : 'text-[#9cb2cd] hover:text-[#d4e4fa] hover:bg-[#0e2742]/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Language Selection Dropdown */}
          <div className="relative inline-flex items-center">
            <label htmlFor="language-select" className="sr-only">
              {t('header.selectLanguage', 'Select Language')}
            </label>
            <div className="flex items-center gap-1 px-2 py-1 text-xs font-mono text-[#9cb2cd] bg-[#0e2742]/80 hover:bg-[#0e2742] hover:text-[#d4e4fa] rounded-md border border-[#1b3450] focus-within:border-[#00a6e0]/60 focus-within:ring-1 focus-within:ring-[#00a6e0]/30 transition-colors">
              <Globe className="w-3.5 h-3.5 text-[#00a6e0] shrink-0 pointer-events-none" />
              <select
                id="language-select"
                data-testid="language-select"
                aria-label={t('header.selectLanguage', 'Language')}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-[#d4e4fa] text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1 py-0.5 border-none outline-none"
              >
                {available_languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#051424] text-[#d4e4fa] py-1">
                    {lang.shortLabel} - {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#9cb2cd] hover:text-[#d4e4fa] focus:outline-none"
            aria-label={t('header.toggleMenu', 'Toggle Navigation Menu')}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-[#051424] border-b border-[#1b3450]">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-[#9cb2cd] hover:text-[#d4e4fa] hover:bg-[#0e2742] rounded-md"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
