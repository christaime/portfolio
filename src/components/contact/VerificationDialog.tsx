import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';

export interface VerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  enteredCode: string;
  onCodeChange: (code: string) => void;
  verificationError: string;
  onClearVerificationError: () => void;
  fallbackCodeNotice: string;
  isVerifying: boolean;
  resendTimer: number;
  codeSentBanner: boolean;
  onConfirm: (e?: React.FormEvent) => void;
  onResend: () => void;
}

export const VerificationDialog: React.FC<VerificationDialogProps> = ({
  isOpen,
  onClose,
  email,
  enteredCode,
  onCodeChange,
  verificationError,
  onClearVerificationError,
  fallbackCodeNotice,
  isVerifying,
  resendTimer,
  codeSentBanner,
  onConfirm,
  onResend,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-surface-container border border-outline-variant p-6 md:p-8 rounded-2xl max-w-md w-full flex flex-col gap-5 relative shadow-2xl">
        <div className="flex justify-between items-start border-b border-outline-variant/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-secondary-container/20 text-secondary border border-secondary/40 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                {t('contact.verificationModal.title')}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {t('contact.verificationModal.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface cursor-pointer p-1"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Banner when code is dispatched */}
        {codeSentBanner && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{t('contact.verificationModal.sentNotice').replace('{email}', email)}</span>
          </div>
        )}

        {/* Fallback Code Notice Banner for Resend testing domain limitation */}
        {fallbackCodeNotice && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3.5 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 text-xs">
              <strong className="text-amber-200">{t('contact.verificationModal.resendNoticeTitle')}</strong>
              <span className="leading-relaxed text-amber-300/90">{fallbackCodeNotice}</span>
              <span className="text-[11px] text-amber-400 font-mono mt-1">
                {t('contact.verificationModal.autoFilledCode')}{' '}
                <strong className="text-amber-200 underline">{enteredCode}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Email Verification Box Instruction Banner */}
        <div className="bg-surface-container-high border border-outline-variant p-4 rounded-xl text-xs flex flex-col gap-2">
          <div className="flex items-center justify-between font-mono text-[11px] text-secondary font-bold">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-secondary" />
              <span>{t('contact.verificationModal.codeSent')}</span>
            </span>
            <span className="text-on-surface-variant font-normal">
              {t('contact.verificationModal.to')} <strong className="text-on-surface">{email}</strong>
            </span>
          </div>
          <p className="text-on-surface-variant text-xs leading-relaxed">
            {t('contact.verificationModal.instructions').replace('{email}', email)}
          </p>
        </div>

        <form onSubmit={onConfirm} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-xs text-on-surface-variant flex justify-between">
              <span>{t('contact.verificationModal.enterCode')}</span>
              <span className="font-mono text-[11px]">{enteredCode.length} / 6</span>
            </label>
            <input
              type="text"
              maxLength={6}
              value={enteredCode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                onCodeChange(val);
                if (verificationError) onClearVerificationError();
              }}
              placeholder="e.g. 482915"
              className="bg-transparent border border-outline-variant rounded-lg px-4 py-3 text-center text-xl tracking-widest font-mono text-on-surface focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-all"
              autoFocus
            />
            {verificationError && (
              <p className="text-xs text-error font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{verificationError}</span>
              </p>
            )}
          </div>

          <div className="flex justify-between items-center text-xs font-mono pt-1">
            <button
              type="button"
              onClick={onResend}
              disabled={resendTimer > 0}
              className="text-secondary hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>
                {resendTimer > 0
                  ? t('contact.verificationModal.resendIn').replace('{seconds}', resendTimer.toString())
                  : t('contact.verificationModal.resendBtn')}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              {t('contact.verificationModal.editEmail')}
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-outline-variant/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface font-label-caps text-xs cursor-pointer"
            >
              {t('contact.verificationModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={isVerifying || enteredCode.length < 6}
              className="bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container px-6 py-2.5 rounded-lg font-label-caps text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              id="confirm-verification-btn"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('contact.verificationModal.verifying')}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('contact.verificationModal.verifyBtn')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
