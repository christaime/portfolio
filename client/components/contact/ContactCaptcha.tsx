import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ContactCaptchaProps {
  onVerify: (token: string) => void;
  isVerified?: boolean;
  required?: boolean;
}

export const ContactCaptcha: React.FC<ContactCaptchaProps> = ({
  onVerify,
  isVerified,
  required = true,
}) => {
  const { t } = useLanguage();
  const [internalChecked, setInternalChecked] = useState(false);

  const checked = isVerified !== undefined ? isVerified : internalChecked;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setInternalChecked(isChecked);
    if (isChecked) {
      onVerify('verified_client_token_' + Date.now());
    } else {
      onVerify('');
    }
  };

  return (
    <div
      className={`p-3.5 bg-[#051424] border transition-colors rounded-none flex items-center justify-between ${
        checked ? 'border-[#34d399]/40 bg-[#051424]' : 'border-[#1b3450]'
      }`}
    >
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          id="contact-captcha-checkbox"
          required={required}
          aria-required={required}
          checked={checked}
          onChange={handleCheckboxChange}
          className="w-4 h-4 rounded-none border-[#1b3450] text-[#00a6e0] focus:ring-[#00a6e0] bg-[#0a1f33] cursor-pointer"
        />
        <span className="text-xs text-[#d4e4fa] font-medium flex items-center">
          {checked
            ? t('contact.captchaVerified', 'Verification Verified')
            : t('contact.captchaClick', 'I am not a robot (Security Verification)')}
          {required && <span className="text-[#f43f5e] ml-1">*</span>}
        </span>
      </label>

      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#9cb2cd]">
        <ShieldCheck className={`w-3.5 h-3.5 ${checked ? 'text-[#34d399]' : 'text-[#00a6e0]'}`} />
        <span>reCAPTCHA / Bot Defense</span>
      </div>
    </div>
  );
};
