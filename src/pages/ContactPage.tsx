import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { portfolioService } from '../services/portfolioService';
import { emailService } from '../services/emailService';
import { EngineerInfo } from '../types';
import {
  AlertCircle,
  RefreshCw,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { VerificationDialog } from '../components/contact/VerificationDialog';
import { RequestCallModal } from '../components/contact/RequestCallModal';
import { ContactDirectInfo } from '../components/contact/ContactDirectInfo';
import { ContactSuccessScreen } from '../components/contact/ContactSuccessScreen';
import { ContactCaptcha } from '../components/contact/ContactCaptcha';

const RECAPTCHA_SITE_KEY =
  (import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
   import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY ||
   '')
    .replace(/['"]/g, '')
    .trim();

export const ContactPage = () => {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();

  const prefilledSubject = searchParams.get('subject') || '';
  const prefilledMessage = searchParams.get('message') || '';

  const [engineer, setEngineer] = useState<EngineerInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: prefilledSubject,
    message: prefilledMessage,
  });

  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [captchaError, setCaptchaError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [wasCached, setWasCached] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // Email Verification Code Modal State
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [fallbackCodeNotice, setFallbackCodeNotice] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [codeSentBanner, setCodeSentBanner] = useState(false);

  useEffect(() => {
    portfolioService.getEngineerInfo().then(setEngineer).catch(() => {});
  }, [language]);

  useEffect(() => {
    if (prefilledSubject || prefilledMessage) {
      setFormData((prev) => ({
        ...prev,
        subject: prefilledSubject || prev.subject,
        message: prefilledMessage || prev.message,
      }));
    }
  }, [prefilledSubject, prefilledMessage]);

  // Resend Timer Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showVerificationModal && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showVerificationModal, resendTimer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errorMessage) setErrorMessage('');
  };

  /**
   * Request sending OTP code via server
   */
  const requestVerificationCode = async (emailToVerify: string) => {
    setEnteredCode('');
    setVerificationError('');
    setFallbackCodeNotice('');
    setResendTimer(30);
    setCodeSentBanner(true);
    setTimeout(() => setCodeSentBanner(false), 4000);

    const res = await emailService.sendVerificationCode({
      email: emailToVerify,
      recaptchaToken: captchaToken || 'simulated_token',
    });
    if (res && res.code) {
      setEnteredCode(res.code);
      if (res.warning) {
        setFallbackCodeNotice(res.warning);
      }
    }
    return res;
  };

  /**
   * Primary Submit Handler:
   * 1. Validates form inputs & captcha check.
   * 2. Checks if email is already verified in Redis cache (24h).
   * 3. If cached -> sends contact message directly with NO OTP modal!
   * 4. If not cached -> triggers verification code delivery and opens modal.
   */
  const handleInitiateSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage(t('contact.form.requiredError'));
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage(t('contact.form.emailError'));
      return;
    }

    if (!captchaToken) {
      setCaptchaError('Please check the reCAPTCHA box to verify you are human.');
      return;
    }

    setErrorMessage('');
    setCaptchaError('');
    setIsSubmitting(true);
    setFallbackCodeNotice('');

    try {
      // 1. Check Redis 24h verification cache first!
      const statusRes = await emailService.checkEmailStatus(formData.email);

      if (statusRes && statusRes.isVerified) {
        // Email is ALREADY verified in 24h Redis cache -> Bypass verification email!
        await emailService.sendContactEmail({ ...formData, recaptchaToken: captchaToken });
        setIsSubmitting(false);
        setWasCached(true);
        setSubmitted(true);
        return;
      }

      // 2. Email is not in 24h cache -> Send verification email
      const verifyRes = await emailService.sendVerificationCode({
        email: formData.email,
        recaptchaToken: captchaToken,
      });

      if (verifyRes && verifyRes.isVerified) {
        // Automatically verified (e.g. simulation mode)
        await emailService.sendContactEmail({ ...formData, recaptchaToken: captchaToken });
        setIsSubmitting(false);
        setWasCached(true);
        setSubmitted(true);
        return;
      }

      if (verifyRes && verifyRes.code) {
        setEnteredCode(verifyRes.code);
        if (verifyRes.warning) {
          setFallbackCodeNotice(verifyRes.warning);
        }
      } else {
        setEnteredCode('');
      }

      setIsSubmitting(false);
      setShowVerificationModal(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || t('contact.form.initError'));
    }
  };

  /**
   * Confirm Verification Code & Send Message
   */
  const handleConfirmVerification = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (enteredCode.trim().length < 6) {
      setVerificationError(t('contact.verificationModal.codeLengthError'));
      return;
    }

    setIsVerifying(true);
    setVerificationError('');

    try {
      // 1. Verify code with backend & store in Redis for 24h
      await emailService.verifyCode({ email: formData.email, code: enteredCode.trim() });

      // 2. Send contact form message
      await emailService.sendContactEmail({ ...formData, recaptchaToken: captchaToken });

      setIsVerifying(false);
      setShowVerificationModal(false);
      setWasCached(false);
      setSubmitted(true);
    } catch (err: any) {
      setIsVerifying(false);
      setVerificationError(err.message || t('contact.verificationModal.codeInvalidError'));
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    try {
      await requestVerificationCode(formData.email);
    } catch (err: any) {
      setVerificationError(t('contact.verificationModal.resendError'));
    }
  };

  const handleClearForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setCaptchaToken('');
    setCaptchaError('');
    setSubmitted(false);
    setWasCached(false);
    setShowVerificationModal(false);
  };

  return (
    <div className="animate-fadeIn">
      {/* Title & Description */}
      <div className="mb-12">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
          {t('contact.title')}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Contact Form Container */}
        <div className="lg:col-span-7 bg-surface-container rounded-xl p-6 md:p-8 border border-outline-variant relative shadow-sm">
          {submitted ? (
            <ContactSuccessScreen
              name={formData.name}
              email={formData.email}
              wasCached={wasCached}
              onClear={handleClearForm}
            />
          ) : (
            <form className="flex flex-col gap-6" onSubmit={handleInitiateSend} id="contact-form">
              {errorMessage && (
                <div className="bg-error-container/40 border border-error text-error p-3.5 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="name">
                    {t('contact.form.nameLabel')} <span className="text-secondary">*</span>
                  </label>
                  <input
                    className="bg-transparent border border-outline-variant rounded-DEFAULT px-4 py-3 text-on-surface focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-all"
                    id="name"
                    placeholder={t('contact.form.namePlaceholder')}
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="email">
                    {t('contact.form.emailLabel')} <span className="text-secondary">*</span>
                  </label>
                  <input
                    className="bg-transparent border border-outline-variant rounded-DEFAULT px-4 py-3 text-on-surface focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-all"
                    id="email"
                    placeholder={t('contact.form.emailPlaceholder')}
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <span className="text-[11px] text-on-surface-variant/70 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-indigo-500" />
                    <span>{t('contact.form.cachedInfo')}</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="subject">
                  {t('contact.form.subjectLabel')}
                </label>
                <input
                  className="bg-transparent border border-outline-variant rounded-DEFAULT px-4 py-3 text-on-surface focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-all"
                  id="subject"
                  placeholder={t('contact.form.subjectPlaceholder')}
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="message">
                    {t('contact.form.messageLabel')} <span className="text-secondary">*</span>
                  </label>
                  <span className="font-code-md text-[12px] text-on-surface-variant/60">
                    {formData.message.length} {t('contact.form.chars')}
                  </span>
                </div>
                <textarea
                  className="bg-transparent border border-outline-variant rounded-DEFAULT px-4 py-3 text-on-surface focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-all resize-none"
                  id="message"
                  placeholder={t('contact.form.messagePlaceholder')}
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {/* Action Bar: Captcha on the Left, Send Message on the Right */}
              <div className="pt-2 border-t border-outline-variant/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* reCAPTCHA Widget on the Left */}
                <div className="flex items-center">
                  <ContactCaptcha
                    siteKey={RECAPTCHA_SITE_KEY}
                    isVerified={Boolean(captchaToken)}
                    onVerify={(token) => {
                      setCaptchaToken(token);
                      setCaptchaError('');
                    }}
                    onExpire={() => {
                      setCaptchaToken('');
                    }}
                    error={captchaError}
                  />
                </div>

                {/* Send Message Button on the Right */}
                <div className="flex items-center justify-end">
                  <button
                    className="w-full sm:w-auto bg-secondary-container text-on-secondary-container font-label-caps text-label-caps px-8 py-4 rounded-DEFAULT hover:bg-secondary-fixed transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    type="submit"
                    disabled={isSubmitting}
                    id="submit-message-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <span>{t('contact.form.checkingStatus')}</span>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        <span>{t('contact.form.submitBtn')}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-on-surface-variant/70 font-mono flex items-center gap-1.5 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary-container shrink-0" />
                <span>Protected by Google reCAPTCHA &amp; anti-spam email OTP verification.</span>
              </p>
            </form>
          )}
        </div>

        {/* Contact Info & Profiles */}
        <div className="lg:col-span-5">
          <ContactDirectInfo
            engineer={engineer}
            onRequestCall={() => setShowPhoneModal(true)}
          />
        </div>
      </div>

      {/* Email Verification Modal */}
      <VerificationDialog
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={formData.email}
        enteredCode={enteredCode}
        onCodeChange={setEnteredCode}
        verificationError={verificationError}
        onClearVerificationError={() => setVerificationError('')}
        fallbackCodeNotice={fallbackCodeNotice}
        isVerifying={isVerifying}
        resendTimer={resendTimer}
        codeSentBanner={codeSentBanner}
        onConfirm={handleConfirmVerification}
        onResend={handleResendCode}
      />

      {/* Request Call Schedule Modal */}
      <RequestCallModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
      />
    </div>
  );
};
