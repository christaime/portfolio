import React, { useState } from 'react';
import { X, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SandboxNotice {
  mode?: string;
  code?: string;
  warning?: string;
  message?: string;
}

interface VerificationDialogProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  error?: string;
  isVerifying?: boolean;
  sandboxNotice?: SandboxNotice | null;
}

export const VerificationDialog: React.FC<VerificationDialogProps> = ({
  isOpen,
  email,
  onClose,
  onVerify,
  onResend,
  error,
  isVerifying = false,
  sandboxNotice,
}) => {
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      await onVerify(code.trim());
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await onResend();
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 4000);
    } catch {
      // Ignored
    } finally {
      setResending(false);
    }
  };

  const handleUseSandboxCode = (testCode: string) => {
    setCode(testCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#051424] border border-[#1b3450] rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1b3450]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00a6e0]" />
            <h3 className="text-sm font-bold text-[#d4e4fa]">
              {t('verification.title', 'Verify Your Email Address')}
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

        {/* Content */}
        <div className="mt-4">
          <p className="text-xs text-[#9cb2cd] leading-relaxed">
            {t('verification.subtitle', "We've sent a 6-digit passcode to")}
          </p>
          <div className="mt-2 p-2.5 bg-[#0a1f33] border border-[#1b3450] rounded-lg text-center font-mono text-xs text-[#00a6e0] font-semibold">
            {email}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {sandboxNotice && (
              <div className="p-3 bg-[#0a2744] border border-[#00a6e0]/40 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-[#00a6e0] uppercase tracking-wider">
                    {sandboxNotice.mode === 'simulated' ? 'Sandbox / Dev Mode' : 'Test Mode Notice'}
                  </span>
                  {sandboxNotice.code && (
                    <button
                      type="button"
                      onClick={() => handleUseSandboxCode(sandboxNotice.code!)}
                      className="px-2 py-0.5 bg-[#00a6e0]/20 hover:bg-[#00a6e0]/30 text-[#38bdf8] text-[11px] font-mono rounded font-semibold border border-[#00a6e0]/30 transition-colors"
                    >
                      Autofill: {sandboxNotice.code}
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#9cb2cd] leading-relaxed">
                  {sandboxNotice.warning ||
                    sandboxNotice.message ||
                    (sandboxNotice.code
                      ? `Generated test passcode: ${sandboxNotice.code}`
                      : 'Verification passcode generated.')}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="otp-input" className="block text-xs font-semibold text-[#d4e4fa] mb-1.5">
                {t('verification.enterCode', 'Enter 6-Digit Passcode')}
              </label>
              <input
                id="otp-input"
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. 482915"
                className="w-full px-4 py-2.5 bg-[#0a1f33] border border-[#1b3450] focus:border-[#00a6e0] rounded-xl text-[#d4e4fa] text-center font-mono text-lg tracking-widest focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-2.5 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg flex items-center gap-2 text-xs text-[#ef4444]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {resendSuccess && (
              <div className="p-2.5 bg-[#34d399]/10 border border-[#34d399]/30 rounded-lg text-xs text-[#34d399] text-center font-medium">
                {t('verification.subtitle', "We've sent a 6-digit passcode to")} {email}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !code.trim()}
              className="w-full py-2.5 bg-[#00a6e0] hover:bg-[#38bdf8] text-[#00374d] text-xs font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('verification.verifying', 'Verifying...')}</span>
                </>
              ) : (
                <span>{t('verification.confirm', 'Confirm & Send Message')}</span>
              )}
            </button>
          </form>

          {/* Resend Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-xs text-[#9cb2cd] hover:text-[#00a6e0] hover:underline transition-colors disabled:opacity-50"
            >
              {resending ? t('contact.sending', 'Sending...') : t('verification.resend', 'Resend Code')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
