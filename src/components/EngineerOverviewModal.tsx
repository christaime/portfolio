import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { portfolioService } from '../services/portfolioService';
import { EngineerInfo } from '../types';
import { X, Send } from 'lucide-react';

interface EngineerOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  engineer?: EngineerInfo | null;
}

export const EngineerOverviewModal = ({
  isOpen,
  onClose,
}: EngineerOverviewModalProps) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [sfTime, setSfTime] = useState<string>('');
  const [engineer, setEngineer] = useState<EngineerInfo | null>(null);

  useEffect(() => {
    portfolioService.getEngineerInfo().then(setEngineer);
  }, [language]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setSfTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-surface-container border border-outline-variant rounded-xl max-w-lg w-full p-6 md:p-8 space-y-6 relative shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary p-1 rounded hover:bg-surface-container-high transition-colors cursor-pointer"
          id="close-overview-modal-btn"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 border-b border-outline-variant/60 pb-5">
          <img
            src={engineer?.avatarUrl || '/avatar.jpg'}
            alt={engineer?.name || 'Christelle Mamekem Ngueguim'}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== window.location.origin + '/avatar.jpg') {
                target.src = '/avatar.jpg';
              }
            }}
            className="w-16 h-16 rounded-full object-cover border-2 border-secondary-container shadow-md shrink-0 bg-surface-container-high"
          />
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {engineer?.name || 'Christelle Mamekem Ngueguim'}
            </h2>
            <div className="text-body-md text-secondary font-medium">
              {engineer?.title || 'Senior Software Engineer (.NET C# / Java EE / Angular / DevOps)'}
            </div>
            <div className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span>{engineer?.location || 'Limbé, Cameroon'} • {engineer?.email || 'mnchristelle@gmail.com'}</span>
            </div>
          </div>
        </div>

        {/* Live Status & Clock */}
        <div className="bg-surface-container-high/70 p-4 rounded-lg border border-outline-variant/60 space-y-3 font-code-md text-sm">
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">{t('accountModal.localTime')}:</span>
            <span className="text-tertiary font-bold tracking-wider">{sfTime || '10:42:00 AM'}</span>
          </div>
          <div className="flex justify-between items-center border-t border-outline-variant/40 pt-2 text-xs">
            <span className="text-on-surface-variant">Status:</span>
            <span className="text-secondary font-semibold">{t('accountModal.status')}</span>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-surface p-3 rounded border border-outline-variant">
            <div className="font-headline-sm text-headline-sm text-secondary font-bold">10+</div>
            <div className="font-label-caps text-[10px] text-on-surface-variant mt-1">Years Exp</div>
          </div>
          <div className="bg-surface p-3 rounded border border-outline-variant">
            <div className="font-headline-sm text-headline-sm text-tertiary font-bold">15M+</div>
            <div className="font-label-caps text-[10px] text-on-surface-variant mt-1">Daily Requests</div>
          </div>
          <div className="bg-surface p-3 rounded border border-outline-variant">
            <div className="font-headline-sm text-headline-sm text-primary font-bold">98/100</div>
            <div className="font-label-caps text-[10px] text-on-surface-variant mt-1">Web Vitals</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex gap-3">
          <button
            onClick={() => {
              onClose();
              navigate('/contact');
            }}
            className="flex-1 bg-secondary-container text-on-secondary-container font-label-caps text-label-caps py-3.5 rounded hover:bg-secondary-fixed transition-colors text-center cursor-pointer flex items-center justify-center gap-2"
            id="overview-modal-contact-btn"
          >
            <span>{t('contact.title')}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

