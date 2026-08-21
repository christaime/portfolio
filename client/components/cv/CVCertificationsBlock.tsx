import React from 'react';
import { CertificationItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Award, CheckCircle, ExternalLink } from 'lucide-react';

interface CVCertificationsBlockProps {
  filteredCertifications: CertificationItem[];
  selectedServiceId: string;
}

export const CVCertificationsBlock: React.FC<CVCertificationsBlockProps> = ({
  filteredCertifications,
}) => {
  const { t } = useLanguage();

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2.5 mb-6">
        <span className="p-2 rounded-lg bg-[#00a6e0]/10 text-[#00a6e0] border border-[#00a6e0]/20">
          <Award className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-[#d4e4fa]">
            {t('cv.certifications.title', 'Certifications & Accreditations')}
          </h2>
          <span className="text-xs text-[#9cb2cd]">
            {t('cv.certifications.subtitle', 'Industry-recognized credentials & compliance standards')}
          </span>
        </div>
      </div>

      {filteredCertifications.length === 0 ? (
        <div className="bg-[#0a1f33]/40 border border-[#1b3450] rounded-xl p-6 text-center text-xs text-[#9cb2cd]">
          {t('cv.certifications.empty', 'No certifications linked to this specific service.')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCertifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-[#0a1f33]/60 hover:bg-[#0a1f33] border border-[#1b3450] hover:border-[#00a6e0]/40 rounded-xl p-4 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono text-[#00a6e0] flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-[#34d399]" />
                    <span>{t('cv.certifications.year', 'Year')}: {cert.year || cert.issueDate}</span>
                  </span>
                  {cert.credentialId && (
                    <span className="text-[10px] font-mono text-[#9cb2cd] bg-[#051424] px-1.5 py-0.5 rounded border border-[#1b3450]">
                      {t('cv.certifications.id', 'ID')}: {cert.credentialId}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-[#d4e4fa] mb-1">
                  {cert.name || cert.title}
                </h4>
                <p className="text-xs text-[#9cb2cd]">{cert.issuer}</p>
              </div>

              {cert.credentialUrl && (
                <div className="mt-3 pt-2 border-t border-[#1b3450]/60">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#00a6e0] hover:underline font-mono"
                  >
                    <span>{t('cv.certifications.verify', 'Verify Credential')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
