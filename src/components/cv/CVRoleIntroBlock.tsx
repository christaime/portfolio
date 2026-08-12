import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { EngineerInfo, ServiceItem } from '../../types';
import { User, X, CheckCircle } from 'lucide-react';

interface CVRoleIntroBlockProps {
  activeService: ServiceItem | undefined;
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;
  engineer: EngineerInfo | null;
  filteredExperiencesCount: number;
  filteredCertificationsCount: number;
}

export const CVRoleIntroBlock = ({
  activeService,
  selectedServiceId,
  setSelectedServiceId,
  engineer,
  filteredExperiencesCount,
  filteredCertificationsCount,
}: CVRoleIntroBlockProps) => {
  const { t } = useLanguage();

  return (
    <section
      id="block-role-intro"
      className="bg-surface-container border border-outline-variant rounded-2xl p-4 md:p-5 lg:p-6 flex flex-col gap-3.5 relative overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/60 pb-3">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-secondary-container" />
          <h2 className="font-headline-md text-xl md:text-2xl text-on-surface">
            {activeService ? `Targeted Offer: ${activeService.title}` : t('cv.roleIntroTitle')}
          </h2>
        </div>
        {selectedServiceId !== 'all' && (
          <button
            onClick={() => setSelectedServiceId('all')}
            className="text-xs font-code-md text-secondary-container hover:underline flex items-center gap-1.5 cursor-pointer bg-secondary-container/10 px-3 py-1 rounded-full border border-secondary-container/20 transition-all hover:bg-secondary-container/20"
          >
            <span>Reset View</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-extrabold">
            {activeService ? activeService.title : (engineer?.title || 'Senior Staff Software Engineer')}
          </h1>
          {activeService && (
            <span className="bg-tertiary-container/30 text-tertiary font-code-md text-xs px-2.5 py-0.5 rounded-full border border-tertiary/30">
              Targeted Service Profile
            </span>
          )}
        </div>

        {activeService ? (
          <div className="flex flex-col gap-3">
            <p className="font-body-lg text-base text-on-surface-variant/95 leading-relaxed">
              {activeService.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {activeService.features.map((feature, fIdx) => (
                <span
                  key={fIdx}
                  className="bg-surface/80 border border-outline-variant text-on-surface font-body-md text-xs px-3 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-secondary-container shrink-0" />
                  <span>{feature}</span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="font-body-lg text-base text-on-surface-variant/95 leading-relaxed">
            {engineer?.introduction ||
              'Passionate Senior Staff Software Engineer with over 10 years of experience architecting high-concurrency microservices, resilient web applications, and real-time collaboration engines.'}
          </p>
        )}

        {/* Service Filter Key Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-outline-variant/40">
          <div className="bg-surface/60 p-3 rounded-lg border border-outline-variant/60 flex flex-col">
            <span className="font-code-md text-[10px] uppercase tracking-wider text-on-surface-variant">
              Overall Experience
            </span>
            <span className="font-headline-sm text-base font-bold text-secondary-container">
              10+ Years
            </span>
          </div>
          <div className="bg-surface/60 p-3 rounded-lg border border-outline-variant/60 flex flex-col">
            <span className="font-code-md text-[10px] uppercase tracking-wider text-on-surface-variant">
              Relevant Roles
            </span>
            <span className="font-headline-sm text-base font-bold text-primary">
              {filteredExperiencesCount} {filteredExperiencesCount === 1 ? 'Role' : 'Roles'}
            </span>
          </div>
          <div className="bg-surface/60 p-3 rounded-lg border border-outline-variant/60 flex flex-col">
            <span className="font-code-md text-[10px] uppercase tracking-wider text-on-surface-variant">
              Linked Certs
            </span>
            <span className="font-headline-sm text-base font-bold text-tertiary">
              {filteredCertificationsCount} {filteredCertificationsCount === 1 ? 'Badge' : 'Badges'}
            </span>
          </div>
          <div className="bg-surface/60 p-3 rounded-lg border border-outline-variant/60 flex flex-col">
            <span className="font-code-md text-[10px] uppercase tracking-wider text-on-surface-variant">
              Availability
            </span>
            <span className="font-headline-sm text-base font-bold text-on-surface">
              Contract / Full-Time
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
