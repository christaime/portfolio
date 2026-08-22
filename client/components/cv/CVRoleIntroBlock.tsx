import React from 'react';
import { EngineerInfo, ServiceItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, RotateCcw, Briefcase, Award } from 'lucide-react';

interface CVRoleIntroBlockProps {
  activeService?: ServiceItem;
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;
  engineer: EngineerInfo;
  filteredExperiencesCount: number;
  filteredCertificationsCount: number;
  onOpenPdfModal?: () => void;
}

export const CVRoleIntroBlock: React.FC<CVRoleIntroBlockProps> = ({
  activeService,
  selectedServiceId,
  setSelectedServiceId,
  engineer,
  filteredExperiencesCount,
  filteredCertificationsCount,
}) => {
  const { t } = useLanguage();

  if (activeService && selectedServiceId !== 'all') {
    return (
      <div className="bg-[#0a1f33] border border-[#00a6e0]/40 rounded-xl p-5 md:p-6 shadow-md mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-lg bg-[#00a6e0]/20 text-[#00a6e0]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] font-mono uppercase text-[#00a6e0] tracking-wider block">
                {t('cv.summary.targetedOffer', 'Targeted Offer')}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#d4e4fa]">
                {activeService.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setSelectedServiceId('all')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#9cb2cd] hover:text-[#d4e4fa] bg-[#0e2742] hover:bg-[#15385e] rounded-lg border border-[#1b3450] transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('cv.summary.resetView', 'Reset View')}</span>
          </button>
        </div>

        <p className="mt-3 text-xs md:text-sm text-[#9cb2cd] leading-relaxed">
          {activeService.description || activeService.shortDesc}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs font-mono text-[#00a6e0]">
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{filteredExperiencesCount} {t('cv.summary.roles', 'Roles')}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>{filteredCertificationsCount} {t('cv.summary.badges', 'Badges')}</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a1f33] border border-[#1b3450] rounded-xl p-5 md:p-6 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[#00a6e0] uppercase tracking-wider mb-1">
            {t('cv.summary.title', 'Executive Summary')}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#d4e4fa]">
            {engineer.title}
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#00a6e0] bg-[#051424] px-3.5 py-2 rounded-lg border border-[#1b3450]">
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{filteredExperiencesCount} {t('cv.summary.roles', 'Roles')}</span>
          </span>
          <span className="text-[#1b3450]">|</span>
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>{filteredCertificationsCount} {t('cv.summary.badges', 'Badges')}</span>
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs md:text-sm text-[#9cb2cd] leading-relaxed">
        {engineer.introduction || engineer.bio}
      </p>
    </div>
  );
};
