import React from 'react';
import { Terminal, Github, Linkedin, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-[#051424] border-t border-[#1b3450] py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-[#00a6e0]" />
          <div>
            <div className="text-sm font-semibold text-[#d4e4fa] flex items-center gap-2">
              <span>Portfolio.dev</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#00a6e0]/10 text-[#00a6e0] border border-[#00a6e0]/20 inline-block">
                v2.4
              </span>
              <span className="text-xs text-[#9cb2cd]">• Christelle Mamekem Ngueguim</span>
            </div>
            <p className="text-xs text-[#9cb2cd]/80 mt-0.5">
              {t('footer.tagline', 'Senior Software Engineer')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[#9cb2cd]">
          <a
            href="https://github.com/mnchristelle"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#00a6e0] transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/mnchristelle"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#00a6e0] transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>
          <a
            href="https://stackoverflow.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#00a6e0] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Stack Overflow</span>
          </a>
        </div>

        <div className="text-xs text-[#9cb2cd]/60 flex items-center gap-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
          <span>© {new Date().getFullYear()} {t('footer.rightsReserved', 'All Rights Reserved')}</span>
        </div>
      </div>
    </footer>
  );
};
