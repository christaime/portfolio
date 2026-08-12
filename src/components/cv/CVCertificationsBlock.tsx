import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CertificationItem } from '../../types';
import {
  BadgeCheck,
  Cloud,
  Award,
  Cpu,
  ExternalLink,
  Code2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CVCertificationsBlockProps {
  filteredCertifications: CertificationItem[];
  selectedServiceId: string;
}

export const CVCertificationsBlock = ({
  filteredCertifications,
  selectedServiceId,
}: CVCertificationsBlockProps) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | 'professional' | 'online_skill' | 'badge'>('all');

  const renderCertIcon = (iconName?: string) => {
    switch (iconName) {
      case 'code':
        return <Code2 className="w-5 h-5 text-emerald-500" />;
      case 'cloud':
        return <Cloud className="w-5 h-5 text-blue-500" />;
      case 'cloud_done':
        return <Award className="w-5 h-5 text-green-500" />;
      case 'token':
        return <Cpu className="w-5 h-5 text-purple-500" />;
      case 'award':
        return <Award className="w-5 h-5 text-indigo-500" />;
      case 'verified':
      default:
        return <BadgeCheck className="w-5 h-5 text-amber-500" />;
    }
  };

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'professional':
        return (
          <span className="inline-flex items-center gap-1 font-code-md text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-500/20">
            <ShieldCheck className="w-3 h-3 shrink-0" />
            Professional Cert
          </span>
        );
      case 'online_skill':
        return (
          <span className="inline-flex items-center gap-1 font-code-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            Skill Assessment
          </span>
        );
      case 'badge':
        return (
          <span className="inline-flex items-center gap-1 font-code-md text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/20">
            <Sparkles className="w-3 h-3 shrink-0" />
            Verified Badge
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 font-code-md text-[10px] font-semibold bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-md border border-outline-variant/60">
            Credential
          </span>
        );
    }
  };

  const displayedCertifications = filteredCertifications.filter((cert) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'online_skill') {
      return cert.category === 'online_skill' || cert.category === 'badge';
    }
    return cert.category === activeCategory;
  });

  const professionalCount = filteredCertifications.filter((c) => c.category === 'professional').length;
  const onlineSkillCount = filteredCertifications.filter((c) => c.category === 'online_skill' || c.category === 'badge').length;

  return (
    <section
      id="block-certifications"
      className="bg-surface-container border border-outline-variant rounded-2xl p-4 md:p-5 lg:p-6 flex flex-col gap-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/60 pb-3">
        <div className="flex items-center gap-3">
          <BadgeCheck className="w-5 h-5 md:w-6 md:h-6 text-tertiary" />
          <h2 className="font-headline-md text-xl md:text-2xl text-on-surface">
            {t('cv.certificationsTitle')}
          </h2>
        </div>
        
        {/* Category Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface p-1 rounded-xl border border-outline-variant/70 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition-all font-body-md ${
              activeCategory === 'all'
                ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All ({filteredCertifications.length})
          </button>
          <button
            onClick={() => setActiveCategory('professional')}
            className={`px-3 py-1.5 rounded-lg transition-all font-body-md ${
              activeCategory === 'professional'
                ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Professional ({professionalCount})
          </button>
          <button
            onClick={() => setActiveCategory('online_skill')}
            className={`px-3 py-1.5 rounded-lg transition-all font-body-md ${
              activeCategory === 'online_skill'
                ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Skill Badges & Platform Certs ({onlineSkillCount})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedCertifications.length > 0 ? (
          displayedCertifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col justify-between gap-3 hover:border-secondary-container transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-surface-container-high rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                  {renderCertIcon(cert.icon)}
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {getCategoryBadge(cert.category)}
                    <span className="font-code-md text-[11px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant/60">
                      Year: {cert.year}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-xs md:text-sm text-on-surface font-bold leading-snug mt-1">
                    {cert.name}
                  </h3>
                  <p className="font-body-md text-xs text-secondary-container font-semibold">
                    {cert.issuer}
                  </p>
                </div>
              </div>

              {/* Footer row with ID & Verification Link */}
              <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between gap-2 text-[11px] font-code-md">
                <span className="text-on-surface-variant truncate max-w-[160px]">
                  {cert.credentialId ? `ID: ${cert.credentialId}` : `Verified Credentials`}
                </span>
                
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-tertiary hover:underline font-semibold bg-tertiary/10 hover:bg-tertiary/20 px-2.5 py-1 rounded-md transition-colors"
                  >
                    <span>Verify Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-surface p-8 rounded-xl text-center border border-outline-variant">
            <p className="text-on-surface-variant text-sm font-body-md">
              No certifications linked to this specific service.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

