import React from 'react';
import { CheckCircle2, RotateCcw, MailCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ContactSuccessScreenProps {
  senderEmail: string;
  senderName: string;
  onReset: () => void;
}

export const ContactSuccessScreen: React.FC<ContactSuccessScreenProps> = ({
  senderEmail,
  senderName,
  onReset,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#0a1f33]/90 border border-[#34d399]/40 rounded-2xl p-8 text-center shadow-xl animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-[#34d399]/10 border border-[#34d399]/30 text-[#34d399] flex items-center justify-center mx-auto mb-4">
        <MailCheck className="w-8 h-8" />
      </div>

      <span className="text-xs font-mono text-[#34d399] font-bold uppercase tracking-wider">
        {t('contact.successTitle', 'Message Dispatched Successfully!')}
      </span>
      <h3 className="text-xl font-bold text-[#d4e4fa] mt-1 mb-2">
        {t('contact.successSubtitle', 'Message Received')}
      </h3>

      <p className="text-xs text-[#9cb2cd] max-w-md mx-auto leading-relaxed mb-6">
        {senderName}, your message from{' '}
        <span className="font-mono text-[#00a6e0]">{senderEmail}</span>{' '}
        {t('contact.successSubtitle', 'has been verified and dispatched to Christelle.')}
      </p>

      <div className="p-3 bg-[#051424] border border-[#1b3450] rounded-xl max-w-sm mx-auto mb-6 text-left text-xs">
        <div className="flex items-center gap-2 text-[#34d399] font-mono font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>{t('contact.antiAbuseTitle', 'Email Verified & Cached')}</span>
        </div>
        <p className="text-[11px] text-[#9cb2cd] mt-1">
          {t(
            'contact.antiAbuseDesc',
            'Verified email senders are cached in Redis for 24 hours. Messages are delivered directly to the inbox.'
          )}
        </p>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0e2742] hover:bg-[#15385e] text-[#d4e4fa] text-xs font-semibold rounded-xl border border-[#1b3450] transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{t('contact.sendAnother', 'Send Another Message')}</span>
      </button>
    </div>
  );
};
