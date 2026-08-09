import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CertificationItem } from '../../types';
import { BadgeCheck, Cloud, Award, Cpu } from 'lucide-react';

interface CVCertificationsBlockProps {
  filteredCertifications: CertificationItem[];
  selectedServiceId: string;
}

export const CVCertificationsBlock: React.FC<CVCertificationsBlockProps> = ({
  filteredCertifications,
  selectedServiceId,
}) => {
  const { t } = useLanguage();

  const renderCertIcon = (iconName?: string) => {
    switch (iconName) {
      case 'cloud':
        return <Cloud className="w-6 h-6" />;
      case 'cloud_done':
        return <Award className="w-6 h-6" />;
      case 'token':
        return <Cpu className="w-6 h-6" />;
      case 'verified':
      default:
        return <BadgeCheck className="w-6 h-6" />;
    }
  };

  return (
    <section
      id="block-certifications"
      className="bg-surface-container border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col gap-6"
    >
      <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4">
        <div className="flex items-center gap-3">
          <BadgeCheck className="w-6 h-6 text-tertiary" />
          <h2 className="font-headline-md text-xl md:text-2xl text-on-surface">
            {t('cv.certificationsTitle')}
          </h2>
        </div>
        {selectedServiceId !== 'all' && (
          <span className="font-code-md text-xs bg-tertiary/20 text-tertiary px-3 py-1 rounded-full border border-tertiary/30">
            Service Filtered ({filteredCertifications.length})
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredCertifications.length > 0 ? (
          filteredCertifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-surface border border-outline-variant rounded-xl p-4 flex items-start gap-3.5 hover:border-secondary-container transition-all"
            >
              <div className="p-2.5 bg-surface-container-high rounded-xl text-secondary-container shrink-0">
                {renderCertIcon(cert.icon)}
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="font-headline-sm text-xs md:text-sm text-on-surface font-bold leading-snug">
                  {cert.name}
                </h3>
                <p className="font-body-md text-xs text-secondary-container font-medium">
                  {cert.issuer}
                </p>
                <div className="flex items-center gap-2 mt-2 font-code-md text-[11px] text-on-surface-variant">
                  <span className="bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant/60">
                    Year: {cert.year}
                  </span>
                  {cert.credentialId && (
                    <span className="truncate max-w-[120px]">
                      ID: {cert.credentialId}
                    </span>
                  )}
                </div>
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
