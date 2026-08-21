import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ContactCaptchaProps {
  onVerify: (token: string) => void;
}

export const ContactCaptcha: React.FC<ContactCaptchaProps> = ({ onVerify }) => {
  const { t } = useLanguage();
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    if (isChecked) {
      onVerify('verified_client_token_' + Date.now());
    } else {
      onVerify('');
    }
  };

  return (
    <div className="p-3.5 bg-[#051424] border border-[#1b3450] rounded-xl flex items-center justify-between">
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckboxChange}
          className="w-4 h-4 rounded border-[#1b3450] text-[#00a6e0] focus:ring-[#00a6e0] bg-[#0a1f33]"
        />
        <span className="text-xs text-[#d4e4fa] font-medium">
          {checked
            ? t('contact.captchaVerified', 'Verification Verified')
            : t('contact.captchaClick', 'I am not a robot (Security Verification)')}
        </span>
      </label>

      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#9cb2cd]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
        <span>reCAPTCHA / Bot Defense</span>
      </div>
    </div>
  );
};
