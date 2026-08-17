import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { EngineerInfo } from '../../types';
import { Mail, Copy, Check, Phone, MapPin, Code, Briefcase, FileCode } from 'lucide-react';

export interface ContactDirectInfoProps {
  engineer: EngineerInfo | null;
  onRequestCall: () => void;
}

export const ContactDirectInfo: React.FC<ContactDirectInfoProps> = ({
  engineer,
  onRequestCall,
}) => {
  const { t } = useLanguage();
  const [copyToast, setCopyToast] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    const emailToCopy = engineer?.email || 'mnchristelle@gmail.com';
    navigator.clipboard.writeText(emailToCopy);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-surface-container rounded-xl p-6 border border-outline-variant flex flex-col gap-6 relative">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          {t('contact.directContact.title')}
        </h3>

        {copyToast && (
          <div className="absolute top-4 right-4 bg-tertiary-container border border-tertiary text-tertiary px-3 py-1.5 rounded text-xs font-code-md flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>{t('contact.directContact.copied')}</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4 group">
            <div className="p-2 bg-surface-container-high rounded-DEFAULT border border-outline-variant group-hover:border-secondary-container transition-colors">
              <Mail className="w-5 h-5 text-secondary-container" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant mb-1">
                {t('contact.directContact.emailLabel')}
              </span>
              <div className="flex items-center gap-2">
                <a
                  className="font-code-md text-code-md text-on-surface hover:text-secondary-container transition-colors cursor-pointer"
                  href={`mailto:${engineer?.email || 'mnchristelle@gmail.com'}`}
                  id="direct-email-link"
                >
                  {engineer?.email || 'mnchristelle@gmail.com'}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="text-on-surface-variant hover:text-secondary-container transition-colors p-1 rounded cursor-pointer"
                  title={t('contact.directContact.copyEmail')}
                  id="copy-email-btn"
                  aria-label="Copy email"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 group">
            <div className="p-2 bg-surface-container-high rounded-DEFAULT border border-outline-variant group-hover:border-secondary-container transition-colors">
              <Phone className="w-5 h-5 text-secondary-container" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant mb-1">
                {t('contact.directContact.phoneLabel')}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-code-md text-code-md text-on-surface">
                  {engineer?.phone || '+237 695 282 983'}
                </span>
                <button
                  onClick={onRequestCall}
                  className="text-xs font-label-caps text-secondary-container hover:underline cursor-pointer ml-2"
                  id="request-call-btn"
                >
                  {t('contact.directContact.requestCall')}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 group">
            <div className="p-2 bg-surface-container-high rounded-DEFAULT border border-outline-variant group-hover:border-secondary-container transition-colors">
              <MapPin className="w-5 h-5 text-secondary-container" />
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant mb-1">
                {t('contact.directContact.locationLabel')}
              </span>
              <span className="font-body-md text-body-md text-on-surface">
                {engineer?.location || 'Limbé, Cameroon'}
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant opacity-70 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                {t('contact.directContact.remoteAvailable')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6">
          {t('contact.profiles.title')}
        </h3>
        <div className="flex gap-4">
          <a
            className="flex-1 flex flex-col items-center justify-center p-4 bg-surface border border-outline-variant rounded-DEFAULT hover:border-secondary-container hover:bg-surface-container-high transition-all group cursor-pointer"
            href={engineer?.github || 'https://github.com/christaime'}
            target="_blank"
            rel="noreferrer"
            id="profile-card-github"
          >
            <Code className="w-7 h-7 text-on-surface-variant group-hover:text-secondary-container mb-2 transition-colors" />
            <span className="font-label-caps text-label-caps text-on-surface">
              {t('contact.profiles.github')}
            </span>
          </a>

          <a
            className="flex-1 flex flex-col items-center justify-center p-4 bg-surface border border-outline-variant rounded-DEFAULT hover:border-secondary-container hover:bg-surface-container-high transition-all group cursor-pointer"
            href={engineer?.linkedin || 'https://www.linkedin.com/in/christelle-mamekem-ngueguim/'}
            target="_blank"
            rel="noreferrer"
            id="profile-card-linkedin"
          >
            <Briefcase className="w-7 h-7 text-on-surface-variant group-hover:text-secondary-container mb-2 transition-colors" />
            <span className="font-label-caps text-label-caps text-on-surface">
              {t('contact.profiles.linkedin')}
            </span>
          </a>

          <a
            className="flex-1 flex flex-col items-center justify-center p-4 bg-surface border border-outline-variant rounded-DEFAULT hover:border-secondary-container hover:bg-surface-container-high transition-all group cursor-pointer"
            href={engineer?.stackoverflow || 'https://stackoverflow.com'}
            target="_blank"
            rel="noreferrer"
            id="profile-card-stackoverflow"
          >
            <FileCode className="w-7 h-7 text-on-surface-variant group-hover:text-secondary-container mb-2 transition-colors" />
            <span className="font-label-caps text-label-caps text-on-surface text-center">
              {t('contact.profiles.stackoverflow')}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
