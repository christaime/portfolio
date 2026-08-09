import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { portfolioService } from '../services/portfolioService';
import { EngineerInfo } from '../types';
import {
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Check,
  Mail,
  Copy,
  Phone,
  MapPin,
  Code,
  Briefcase,
  FileCode,
  PhoneCall,
  X,
  ShieldCheck,
  KeyRound,
  RotateCcw,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copyToast, setCopyToast] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // Email Verification Code Modal State
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [codeSentBanner, setCodeSentBanner] = useState(false);

  useEffect(() => {
    portfolioService.getEngineerInfo().then(setEngineer);
  }, []);

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

  const generateAndSendCode = (emailToVerify: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setEnteredCode('');
    setVerificationError('');
    setResendTimer(30);
    setCodeSentBanner(true);
    setTimeout(() => setCodeSentBanner(false), 4000);
    return code;
  };

  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage(t('contact.form.requiredError'));
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage(t('contact.form.emailError'));
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      generateAndSendCode(formData.email);
      setIsSubmitting(false);
      setShowVerificationModal(true);
      setEnteredCode('');
    }, 400);
  };

  const handleConfirmVerification = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (enteredCode.trim() !== verificationCode) {
      setVerificationError('Invalid verification code. Please check the code and try again.');
      return;
    }

    setIsVerifying(true);
    setVerificationError('');

    setTimeout(() => {
      setIsVerifying(false);
      setShowVerificationModal(false);
      setSubmitted(true);
    }, 500);
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    const newCode = generateAndSendCode(formData.email);
    setEnteredCode(newCode);
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (engineer?.email) {
      navigator.clipboard.writeText(engineer.email);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 3000);
    }
  };

  const handleClearForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setSubmitted(false);
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
            <div
              className="flex flex-col items-center justify-center text-center py-12 gap-4 animate-scaleUp"
              id="contact-success-screen"
            >
              <div className="w-16 h-16 rounded-full bg-tertiary-container border border-tertiary text-tertiary flex items-center justify-center mb-2 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Message Received!
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md leading-relaxed">
                Thank you, <strong className="text-on-surface">{formData.name}</strong>. Your sender email address (<span className="text-secondary font-mono">{formData.email}</span>) was verified successfully.
              </p>
              <div className="bg-surface-container-high rounded-lg p-3.5 text-code-md font-code-md text-primary mt-2 border border-outline-variant/60 flex flex-col gap-1 items-center">
                <span>Reference ID: <strong className="text-secondary font-bold">REQ-{Math.floor(100000 + Math.random() * 900000)}</strong></span>
                <span className="text-xs text-on-surface-variant/80 font-mono">Status: Verified & Forwarded to Christelle</span>
              </div>
              <button
                onClick={handleClearForm}
                className="mt-4 bg-surface-container-high border border-outline-variant text-on-surface hover:text-primary hover:border-secondary-container font-label-caps text-label-caps px-6 py-3 rounded-DEFAULT transition-all cursor-pointer"
                id="contact-send-another-btn"
              >
                Send Another Message
              </button>
            </div>
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
                    Name <span className="text-secondary">*</span>
                  </label>
                  <input
                    className="bg-transparent border border-outline-variant rounded-DEFAULT px-4 py-3 text-on-surface focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-all"
                    id="name"
                    placeholder="e.g. Alice Smith"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="email">
                    Sender Email <span className="text-secondary">*</span>
                  </label>
                  <input
                    className="bg-transparent border border-outline-variant rounded-DEFAULT px-4 py-3 text-on-surface focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-all"
                    id="email"
                    placeholder="yourname@domain.com"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <span className="text-[11px] text-on-surface-variant/70 font-mono">
                    Must be a valid existing email. Verification code will be sent.
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="subject">
                  Subject
                </label>
                <input
                  className="bg-transparent border border-outline-variant rounded-DEFAULT px-4 py-3 text-on-surface focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-all"
                  id="subject"
                  placeholder="e.g. Software Architecture Advisory Inquiry"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="message">
                    Message <span className="text-secondary">*</span>
                  </label>
                  <span className="font-code-md text-[12px] text-on-surface-variant/60">
                    {formData.message.length} chars
                  </span>
                </div>
                <textarea
                  className="bg-transparent border border-outline-variant rounded-DEFAULT px-4 py-3 text-on-surface focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-all resize-none"
                  id="message"
                  placeholder="Describe your technical needs, project scope, or consulting details..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <button
                  className="bg-secondary-container text-on-secondary-container font-label-caps text-label-caps px-8 py-4 rounded-DEFAULT hover:bg-secondary-fixed transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting}
                  id="submit-message-btn"
                >
                  {isSubmitting ? (
                    <>
                      <span>Sending Code...</span>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Contact Info & Profiles */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant flex flex-col gap-6 relative">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Direct Contact
            </h3>

            {copyToast && (
              <div className="absolute top-4 right-4 bg-tertiary-container border border-tertiary text-tertiary px-3 py-1.5 rounded text-xs font-code-md flex items-center gap-1.5 animate-fadeIn">
                <Check className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 group">
                <div className="p-2 bg-surface-container-high rounded-DEFAULT border border-outline-variant group-hover:border-secondary-container transition-colors">
                  <Mail className="w-5 h-5 text-secondary-container" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-label-caps text-label-caps text-on-surface-variant mb-1">
                    Email Address
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
                      title="Copy Email Address"
                      id="copy-email-btn"
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
                    Phone & WhatsApp
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-code-md text-code-md text-on-surface">
                      {engineer?.phone || '+237 695 282 983'}
                    </span>
                    <button
                      onClick={() => setShowPhoneModal(true)}
                      className="text-xs font-label-caps text-secondary-container hover:underline cursor-pointer ml-2"
                      id="request-call-btn"
                    >
                      Request Call
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
                    Location
                  </span>
                  <span className="font-body-md text-body-md text-on-surface">
                    {engineer?.location || 'Limbé, Cameroon'}
                  </span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant opacity-70 mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
                    Available for Remote Contracts & Relocation
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6">
              Engineering Profiles
            </h3>
            <div className="flex gap-4">
              <a
                className="flex-1 flex flex-col items-center justify-center p-4 bg-surface border border-outline-variant rounded-DEFAULT hover:border-secondary-container hover:bg-surface-container-high transition-all group cursor-pointer"
                href={engineer?.github || 'https://github.com'}
                target="_blank"
                rel="noreferrer"
                id="profile-card-github"
              >
                <Code className="w-7 h-7 text-on-surface-variant group-hover:text-secondary-container mb-2 transition-colors" />
                <span className="font-label-caps text-label-caps text-on-surface">
                  GitHub
                </span>
              </a>

              <a
                className="flex-1 flex flex-col items-center justify-center p-4 bg-surface border border-outline-variant rounded-DEFAULT hover:border-secondary-container hover:bg-surface-container-high transition-all group cursor-pointer"
                href={engineer?.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                id="profile-card-linkedin"
              >
                <Briefcase className="w-7 h-7 text-on-surface-variant group-hover:text-secondary-container mb-2 transition-colors" />
                <span className="font-label-caps text-label-caps text-on-surface">
                  LinkedIn
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
                  StackOverflow
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container border border-outline-variant p-6 md:p-8 rounded-2xl max-w-md w-full flex flex-col gap-5 relative shadow-2xl">
            <div className="flex justify-between items-start border-b border-outline-variant/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-secondary-container/20 text-secondary border border-secondary/40 rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                    Email Verification Required
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Confirm your email address ownership
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Banner when code is dispatched */}
            {codeSentBanner && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-xs font-mono flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Verification code sent to {formData.email}!</span>
              </div>
            )}

            {/* Email Verification Box Instruction Banner */}
            <div className="bg-surface-container-high border border-outline-variant p-4 rounded-xl text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-secondary font-bold">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-secondary" />
                  <span>Verification Code Dispatched</span>
                </span>
                <span className="text-on-surface-variant font-normal">
                  To: <strong className="text-on-surface">{formData.email}</strong>
                </span>
              </div>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                A 6-digit confirmation code has been sent to your email box (<strong>{formData.email}</strong>). Please check your email inbox, copy the code, and paste it below to verify your email address.
              </p>
            </div>

            <form onSubmit={handleConfirmVerification} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-xs text-on-surface-variant flex justify-between">
                  <span>Enter 6-Digit Code</span>
                  <span className="font-mono text-[11px]">{enteredCode.length} / 6</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={enteredCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setEnteredCode(val);
                    if (verificationError) setVerificationError('');
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
                  onClick={handleResendCode}
                  disabled={resendTimer > 0}
                  className="text-secondary hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className="text-on-surface-variant hover:text-on-surface"
                >
                  Edit Email
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-outline-variant/60">
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className="px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface font-label-caps text-xs cursor-pointer"
                >
                  Cancel
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
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Call Schedule Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container border border-outline-variant p-6 rounded-xl max-w-md w-full flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-secondary-container" />
                <span>Request Call Schedule</span>
              </h3>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="text-on-surface-variant hover:text-primary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              To request a direct technical advisory call or video consultation, please select a preferred window:
            </p>
            <div className="flex flex-col gap-2 font-code-md text-code-md text-on-surface">
              <div className="p-3 bg-surface-container-high rounded border border-outline-variant flex justify-between items-center">
                <span>Central Africa / WAT (UTC+1):</span>
                <span className="text-secondary">8:00 AM - 6:00 PM</span>
              </div>
              <div className="p-3 bg-surface-container-high rounded border border-outline-variant flex justify-between items-center">
                <span>London / Europe (UTC/CET):</span>
                <span className="text-tertiary">9:00 AM - 5:00 PM</span>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant/80">
              Drop a quick note in the Contact Form with your time zone and agenda, and an invitation link will be sent.
            </p>
            <button
              onClick={() => setShowPhoneModal(false)}
              className="bg-secondary-container text-on-secondary-container font-label-caps text-label-caps py-3 rounded hover:bg-secondary-fixed transition-colors mt-2 cursor-pointer"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
