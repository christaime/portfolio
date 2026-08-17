import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PhoneCall, X } from 'lucide-react';

export interface RequestCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestCallModal: React.FC<RequestCallModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-surface-container border border-outline-variant p-6 rounded-xl max-w-md w-full flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-secondary-container" />
            <span>{t('contact.phoneModal.title')}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary cursor-pointer p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {t('contact.phoneModal.description')}
        </p>
        <div className="flex flex-col gap-2 font-code-md text-code-md text-on-surface">
          <div className="p-3 bg-surface-container-high rounded border border-outline-variant flex justify-between items-center">
            <span>{t('contact.phoneModal.watZone')}</span>
            <span className="text-secondary">8:00 AM - 6:00 PM</span>
          </div>
          <div className="p-3 bg-surface-container-high rounded border border-outline-variant flex justify-between items-center">
            <span>{t('contact.phoneModal.utcZone')}</span>
            <span className="text-tertiary">9:00 AM - 5:00 PM</span>
          </div>
        </div>
        <p className="text-xs text-on-surface-variant/80">
          {t('contact.phoneModal.note')}
        </p>
        <button
          onClick={onClose}
          className="bg-secondary-container text-on-secondary-container font-label-caps text-label-caps py-3 rounded hover:bg-secondary-fixed transition-colors mt-2 cursor-pointer"
        >
          {t('contact.phoneModal.gotIt')}
        </button>
      </div>
    </div>
  );
};
