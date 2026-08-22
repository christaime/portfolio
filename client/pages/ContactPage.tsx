import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { portfolioService } from '../services/portfolioService';
import { emailService } from '../services/emailService';
import { EngineerInfo, ServiceItem } from '../types';
import { ContactDirectInfo } from '../components/contact/ContactDirectInfo';
import { ContactCaptcha } from '../components/contact/ContactCaptcha';
import { VerificationDialog } from '../components/contact/VerificationDialog';
import { ContactSuccessScreen } from '../components/contact/ContactSuccessScreen';
import { Send, Loader2, AlertCircle, Sparkles, X, Briefcase } from 'lucide-react';
import { useSearchParams, useLocation } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [engineer, setEngineer] = useState<EngineerInfo | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    searchParams.get('service') || (location.state as any)?.serviceId || ''
  );

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');

  // Track if user manually typed custom content to avoid overwriting on language change
  const userEditedSubjectRef = useRef(false);
  const userEditedMessageRef = useRef(false);

  // Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | undefined>(undefined);
  const [sandboxNotice, setSandboxNotice] = useState<{
    mode?: string;
    code?: string;
    warning?: string;
    message?: string;
  } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch engineer info and services list
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      portfolioService.getEngineerInfo(),
      portfolioService.getServices(),
    ]).then(([eng, srvs]) => {
      if (isMounted) {
        setEngineer(eng);
        setServices(srvs);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [language]);

  // Sync selected service if URL query parameter changes
  useEffect(() => {
    const queryService = searchParams.get('service') || (location.state as any)?.serviceId || '';
    if (queryService && queryService !== selectedServiceId) {
      setSelectedServiceId(queryService);
    }
  }, [searchParams, location.state]);

  // Pre-fill subject and message whenever selected service or services data or language updates
  useEffect(() => {
    if (!selectedServiceId) {
      if (!userEditedSubjectRef.current && !searchParams.get('service')) {
        setSubject('');
      }
      if (!userEditedMessageRef.current && !searchParams.get('service')) {
        setMessage('');
      }
      return;
    }

    const matchedService = services.find((s) => s.id === selectedServiceId);
    const serviceTitle = matchedService ? matchedService.title : selectedServiceId;
    const duration = matchedService?.estimatedDuration || (language === 'fr' ? 'À définir' : 'To be determined');

    const generatedSubject =
      language === 'fr'
        ? `Demande de mission : ${serviceTitle}`
        : `Inquiry: ${serviceTitle}`;

    const generatedMessage =
      language === 'fr'
        ? `Bonjour Christelle,\n\nJe souhaite échanger avec vous au sujet d'une mission pour : ${serviceTitle}.\n\nPérimètre & Exigences du projet :\n- Objectifs principaux : \n- Stack technique & Contraintes : \n- Calendrier estimé : ${duration}\n\nDans l'attente de votre retour.`
        : `Hello Christelle,\n\nI would like to discuss an engagement for: ${serviceTitle}.\n\nProject Scope & Key Requirements:\n- Target Objectives: \n- Technology Stack / Constraints: \n- Estimated Timeline & Milestones: ${duration}\n\nLooking forward to hearing from you.`;

    if (!userEditedSubjectRef.current) {
      setSubject(generatedSubject);
    }

    if (!userEditedMessageRef.current) {
      setMessage(generatedMessage);
    }
  }, [selectedServiceId, services, language]);

  const handleServiceChange = (newServiceId: string) => {
    setSelectedServiceId(newServiceId);
    userEditedSubjectRef.current = false;
    userEditedMessageRef.current = false;

    if (newServiceId) {
      setSearchParams({ service: newServiceId });
    } else {
      setSearchParams({});
    }
  };

  const handleClearService = () => {
    handleServiceChange('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormError(t('contact.requiredFields', 'Please fill out all required fields.'));
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Check if email is already verified in Redis cache (with reCAPTCHA validation)
      const statusRes = await emailService.checkEmailStatus(email.trim(), recaptchaToken);

      if (statusRes.isVerified || statusRes.isVerifiedCached) {
        // Already verified, send directly
        const sendRes = await emailService.sendContactEmail({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          recaptchaToken,
        });

        if (sendRes.success) {
          setIsSuccess(true);
        } else {
          setFormError(sendRes.error || t('contact.failedToSend', 'Failed to send message.'));
        }
      } else {
        // Needs OTP Verification
        const codeRes = await emailService.sendVerificationCode(email.trim(), recaptchaToken);
        if (codeRes.success) {
          if (codeRes.code || codeRes.mode === 'simulated' || codeRes.mode === 'simulated_fallback' || codeRes.warning) {
            setSandboxNotice({
              mode: codeRes.mode,
              code: codeRes.code,
              warning: codeRes.warning,
              message: codeRes.message,
            });
          } else {
            setSandboxNotice(null);
          }
          setIsVerificationOpen(true);
        } else {
          setFormError(codeRes.error || t('contact.failedToSend', 'Failed to send verification passcode.'));
        }
      }
    } catch {
      setFormError(t('contact.unexpectedError', 'An unexpected network error occurred.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    setVerificationError(undefined);
    setIsVerifying(true);

    try {
      const verifyRes = await emailService.verifyCode(email.trim(), code);
      if (verifyRes.success) {
        setIsVerificationOpen(false);
        // Now dispatch the contact message
        const sendRes = await emailService.sendContactEmail({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          code,
          recaptchaToken,
        });

        if (sendRes.success) {
          setIsSuccess(true);
        } else {
          setFormError(sendRes.error || t('contact.failedToSend', 'Failed to dispatch email.'));
        }
      } else {
        setVerificationError(verifyRes.error || t('verification.invalidCode', 'Invalid or expired passcode.'));
      }
    } catch {
      setVerificationError(t('contact.unexpectedError', 'Verification communication failure.'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    const resendRes = await emailService.sendVerificationCode(email.trim(), recaptchaToken);
    if (resendRes.code || resendRes.mode === 'simulated' || resendRes.mode === 'simulated_fallback' || resendRes.warning) {
      setSandboxNotice({
        mode: resendRes.mode,
        code: resendRes.code,
        warning: resendRes.warning,
        message: resendRes.message,
      });
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setRecaptchaToken('');
    setSelectedServiceId('');
    userEditedSubjectRef.current = false;
    userEditedMessageRef.current = false;
    setSearchParams({});
    setIsSuccess(false);
    setFormError(null);
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isFormValid =
    name.trim().length > 0 &&
    isEmailValid &&
    message.trim().length > 0 &&
    recaptchaToken.trim().length > 0;

  const activeMatchedService = services.find((s) => s.id === selectedServiceId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-xs font-mono text-[#00a6e0] font-bold uppercase tracking-wider bg-[#0a1f33] px-3 py-1 rounded-full border border-[#1b3450]">
          {t('contact.badge', 'Connect & Collaborate')}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-[#d4e4fa] mt-4 mb-3">
          {t('contact.title', "Let's work together")}
        </h1>
        <p className="text-sm text-[#9cb2cd] leading-relaxed">
          {t(
            'contact.subtitle',
            'Available for freelance opportunities and technical consulting. Drop a message to discuss your next project.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Contact Direct Info */}
        <div className="lg:col-span-5">
          <ContactDirectInfo engineer={engineer || undefined} />
        </div>

        {/* Right Side: Form or Success Screen */}
        <div className="lg:col-span-7">
          {isSuccess ? (
            <ContactSuccessScreen
              senderName={name}
              senderEmail={email}
              onReset={handleResetForm}
            />
          ) : (
            <div className="bg-[#0a1f33]/80 border border-[#1b3450] rounded-2xl p-6 md:p-8 shadow-xl">
              {/* Active Service Notification Banner */}
              {activeMatchedService && (
                <div className="mb-5 p-3.5 bg-[#00a6e0]/10 border border-[#00a6e0]/30 rounded-xl flex items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-2.5 text-xs text-[#d4e4fa]">
                    <Sparkles className="w-4 h-4 text-[#34d399] shrink-0" />
                    <div>
                      <span className="text-[#9cb2cd]">{t('contact.servicePrefilledNotice', 'Inquiry pre-configured for')}: </span>
                      <strong className="text-[#38bdf8]">{activeMatchedService.title}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearService}
                    aria-label={t('contact.clearService', 'Clear Selection')}
                    className="text-[#9cb2cd] hover:text-[#f43f5e] p-1 rounded transition-colors text-xs flex items-center gap-1"
                    title={t('contact.clearService', 'Clear Selection')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Target Service Selector Dropdown */}
                <div>
                  <label htmlFor="contact-service-select" className="block text-xs font-semibold text-[#d4e4fa] mb-1.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#00a6e0]" />
                    <span>{t('contact.serviceSelectLabel', 'Target Service & Advisory Area')}</span>
                  </label>
                  <select
                    id="contact-service-select"
                    value={selectedServiceId}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#051424] border border-[#1b3450] focus:border-[#00a6e0] rounded-none text-xs text-[#d4e4fa] focus:outline-none transition-colors"
                  >
                    <option value="">{t('contact.generalInquiry', 'General Consultation / Other Technical Inquiry')}</option>
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input - unrounded as requested */}
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-[#d4e4fa] mb-1.5">
                      {t('contact.nameLabel', 'Name')} <span className="text-[#f43f5e]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('contact.namePlaceholder', 'e.g. Alice Smith')}
                      className="w-full px-3.5 py-2.5 bg-[#051424] border border-[#1b3450] focus:border-[#00a6e0] rounded-none text-xs text-[#d4e4fa] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email Input - unrounded as requested */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-[#d4e4fa] mb-1.5">
                      {t('contact.emailLabel', 'Sender Email')} <span className="text-[#f43f5e]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('contact.emailPlaceholder', 'yourname@domain.com')}
                      className="w-full px-3.5 py-2.5 bg-[#051424] border border-[#1b3450] focus:border-[#00a6e0] rounded-none text-xs text-[#d4e4fa] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Subject Input - unrounded as requested */}
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#d4e4fa] mb-1.5">
                    {t('contact.subjectLabel', 'Subject')}
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      userEditedSubjectRef.current = true;
                      setSubject(e.target.value);
                    }}
                    placeholder={t('contact.subjectPlaceholder', 'e.g. Software Architecture Advisory Inquiry')}
                    className="w-full px-3.5 py-2.5 bg-[#051424] border border-[#1b3450] focus:border-[#00a6e0] rounded-none text-xs text-[#d4e4fa] focus:outline-none transition-colors"
                  />
                </div>

                {/* Message Input - unrounded as requested */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-[#d4e4fa] mb-1.5">
                    {t('contact.messageLabel', 'Message')} <span className="text-[#f43f5e]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    required
                    value={message}
                    onChange={(e) => {
                      userEditedMessageRef.current = true;
                      setMessage(e.target.value);
                    }}
                    placeholder={t(
                      'contact.messagePlaceholder',
                      'Describe your project requirements, compliance scope, or technical challenges...'
                    )}
                    className="w-full px-3.5 py-2.5 bg-[#051424] border border-[#1b3450] focus:border-[#00a6e0] rounded-none text-xs text-[#d4e4fa] focus:outline-none transition-colors resize-none leading-relaxed font-sans"
                  />
                </div>

                {/* Captcha - Required */}
                <ContactCaptcha
                  onVerify={setRecaptchaToken}
                  isVerified={Boolean(recaptchaToken)}
                  required={true}
                />

                {/* Error Banner */}
                {formError && (
                  <div className="p-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg flex items-center gap-2 text-xs text-[#ef4444]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="w-full py-3 bg-[#00a6e0] hover:bg-[#38bdf8] text-[#00374d] text-xs font-bold rounded-none transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#00a6e0] cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('contact.sending', 'Sending...')}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t('contact.sendBtn', 'Send Message')}</span>
                      </>
                    )}
                  </button>

                  {!isFormValid && (
                    <p className="text-[11px] text-center text-[#9cb2cd]/80 font-mono">
                      {!name.trim() || !email.trim() || !message.trim()
                        ? t('contact.requiredFieldsHint', '* Name, sender email, and message are required')
                        : !isEmailValid
                        ? t('contact.invalidEmailHint', '* Please enter a valid email address (e.g. name@domain.com)')
                        : !recaptchaToken.trim()
                        ? t('contact.captchaRequiredHint', '* Please complete the security verification (reCAPTCHA) to enable submission')
                        : ''}
                    </p>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Verification OTP Modal */}
      <VerificationDialog
        isOpen={isVerificationOpen}
        email={email}
        onClose={() => setIsVerificationOpen(false)}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        error={verificationError}
        isVerifying={isVerifying}
        sandboxNotice={sandboxNotice}
      />
    </div>
  );
};
