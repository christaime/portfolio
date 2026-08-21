import React from 'react';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';
import { EngineerInfo } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ContactDirectInfoProps {
  engineer?: EngineerInfo;
}

export const ContactDirectInfo: React.FC<ContactDirectInfoProps> = ({ engineer }) => {
  const { t } = useLanguage();
  const email = engineer?.email || 'mnchristelle@gmail.com';
  const phone = engineer?.phone || '+237 695 282 983';
  const location = engineer?.location || 'Bafoussam, Cameroon / Remote';

  return (
    <div className="space-y-6">
      {/* Availability Banner */}
      <div className="bg-[#0a1f33]/80 border border-[#1b3450] rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] animate-pulse" />
          <span className="text-xs font-mono text-[#34d399] font-bold uppercase tracking-wider">
            {t('contact.directChannels', 'Direct & Consulting Channels')}
          </span>
        </div>

        <h3 className="text-base font-bold text-[#d4e4fa] mb-2">
          {t('contact.immediateAvailability', 'Immediate Availability')}
        </h3>
        <p className="text-xs text-[#9cb2cd] leading-relaxed mb-4">
          {t(
            'contact.immediateAvailabilityDesc',
            'Open for technical architecture reviews, PEPPOL / Factur-X compliance advisory, and lead engineering engagements.'
          )}
        </p>

        <div className="space-y-3 pt-3 border-t border-[#1b3450] text-xs">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-[#00a6e0] shrink-0" />
            <div>
              <span className="text-[#9cb2cd]/70 text-[10px] uppercase block">
                {t('contact.directEmail', 'Direct Email')}
              </span>
              <a href={`mailto:${email}`} className="text-[#d4e4fa] hover:underline font-mono">
                {email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-[#00a6e0] shrink-0" />
            <div>
              <span className="text-[#9cb2cd]/70 text-[10px] uppercase block">
                {t('contact.phoneWhatsapp', 'Phone / WhatsApp')}
              </span>
              <span className="text-[#d4e4fa] font-mono">{phone}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#00a6e0] shrink-0" />
            <div>
              <span className="text-[#9cb2cd]/70 text-[10px] uppercase block">
                {t('contact.primaryLocation', 'Primary Location')}
              </span>
              <span className="text-[#d4e4fa]">{location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Redis Badge */}
      <div className="bg-[#051424] border border-[#1b3450] rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#00a6e0] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-[#d4e4fa]">
            {t('contact.antiAbuseTitle', 'Anti-Abuse & Rate Limiting')}
          </h4>
          <p className="text-[11px] text-[#9cb2cd] mt-0.5 leading-relaxed">
            {t(
              'contact.antiAbuseDesc',
              "Verified email senders are cached in Redis for 24 hours. Messages are filtered against spam engines and delivered directly to the engineer's inbox."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
