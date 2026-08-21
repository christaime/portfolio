import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { emailService } from '../../services/emailService';
import { useLanguage } from '../../context/LanguageContext';

interface RequestCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestCallModal: React.FC<RequestCallModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [topic, setTopic] = useState('PEPPOL Compliance & E-Invoicing Strategy');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setSubmitting(true);
    try {
      await emailService.sendEmail({
        name,
        email,
        subject: `[Advisory Call Request] ${topic}`,
        message: `Advisory call requested for ${date || 'Earliest Available'}.\nTopic: ${topic}\nRequester: ${name} (${email})`,
      });
      setSubmitted(true);
    } catch {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#051424] border border-[#1b3450] rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#1b3450]">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#00a6e0]" />
            <h3 className="text-sm font-bold text-[#d4e4fa]">
              {t('callModal.title', 'Schedule Technical Advisory Call')}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label={t('common.close', 'Close')}
            className="p-1.5 text-[#9cb2cd] hover:text-[#d4e4fa] rounded-lg hover:bg-[#0e2742]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#34d399]/10 text-[#34d399] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#d4e4fa]">
              {t('callModal.successTitle', 'Advisory Call Requested!')}
            </h4>
            <p className="text-xs text-[#9cb2cd] mt-2">
              {t('callModal.successDesc', 'Your technical advisory request has been recorded. You will receive a calendar invite shortly at')}{' '}
              <span className="text-[#00a6e0] font-mono">{email}</span>.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-4 py-2 bg-[#0e2742] hover:bg-[#15385e] text-[#d4e4fa] text-xs font-semibold rounded-lg border border-[#1b3450]"
            >
              {t('callModal.close', 'Close Window')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#d4e4fa] mb-1">
                {t('callModal.nameLabel', 'Your Name')}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('callModal.namePlaceholder', 'Alice Smith')}
                className="w-full px-3 py-2 bg-[#0a1f33] border border-[#1b3450] focus:border-[#00a6e0] rounded-xl text-xs text-[#d4e4fa] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#d4e4fa] mb-1">
                {t('callModal.emailLabel', 'Work Email')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('callModal.emailPlaceholder', 'alice@company.com')}
                className="w-full px-3 py-2 bg-[#0a1f33] border border-[#1b3450] focus:border-[#00a6e0] rounded-xl text-xs text-[#d4e4fa] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#d4e4fa] mb-1">
                {t('callModal.topicLabel', 'Consulting Topic')}
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t('callModal.topicPlaceholder', 'e.g. PEPPOL Compliance Pipeline Review')}
                className="w-full px-3 py-2 bg-[#0a1f33] border border-[#1b3450] focus:border-[#00a6e0] rounded-xl text-xs text-[#d4e4fa] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#d4e4fa] mb-1">
                {t('callModal.dateLabel', 'Preferred Date')}
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Next Tuesday morning"
                className="w-full px-3 py-2 bg-[#0a1f33] border border-[#1b3450] focus:border-[#00a6e0] rounded-xl text-xs text-[#d4e4fa] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#00a6e0] hover:bg-[#38bdf8] text-[#00374d] text-xs font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('callModal.scheduling', 'Scheduling...')}</span>
                </>
              ) : (
                <span>{t('callModal.scheduleBtn', 'Confirm Advisory Session')}</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
