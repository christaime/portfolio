import React, { useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, Zap, ShieldCheck } from 'lucide-react';

export interface ContactSuccessScreenProps {
  name: string;
  email: string;
  wasCached: boolean;
  onClear: () => void;
}

export const ContactSuccessScreen: React.FC<ContactSuccessScreenProps> = ({
  name,
  email,
  wasCached,
  onClear,
}) => {
  const { t } = useLanguage();

  const referenceId = useMemo(
    () => `REQ-${Math.floor(100000 + Math.random() * 900000)}`,
    []
  );

  return (
    <div
      className="flex flex-col items-center justify-center text-center py-12 gap-4 animate-scaleUp"
      id="contact-success-screen"
    >
      <div className="w-16 h-16 rounded-full bg-tertiary-container border border-tertiary text-tertiary flex items-center justify-center mb-2 shadow-sm">
        <CheckCircle2 className="w-9 h-9" />
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface">
        {t('contact.form.successTitle')}
      </h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md leading-relaxed">
        {t('contact.form.successMsgDetail')
          .replace('{name}', name)
          .replace('{email}', email)}
      </p>

      {/* Status Badge */}
      {wasCached ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{t('contact.form.cachedNotice')}</span>
        </div>
      ) : (
        <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>{t('contact.form.verifiedNotice')}</span>
        </div>
      )}

      <div className="bg-surface-container-high rounded-lg p-3.5 text-code-md font-code-md text-primary mt-2 border border-outline-variant/60 flex flex-col gap-1 items-center">
        <span>
          {t('contact.form.referenceId')}{' '}
          <strong className="text-secondary font-bold">{referenceId}</strong>
        </span>
        <span className="text-xs text-on-surface-variant/80 font-mono">
          {t('contact.form.deliveredStatus')}
        </span>
      </div>
      <button
        onClick={onClear}
        className="mt-4 bg-surface-container-high border border-outline-variant text-on-surface hover:text-primary hover:border-secondary-container font-label-caps text-label-caps px-6 py-3 rounded-DEFAULT transition-all cursor-pointer"
        id="contact-send-another-btn"
      >
        {t('contact.form.clearBtn')}
      </button>
    </div>
  );
};
