import React from 'react';
import { ExperienceItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { CVExperienceItem } from './CVExperienceItem';
import { Briefcase } from 'lucide-react';

interface CVExperienceBlockProps {
  filteredExperiences: ExperienceItem[];
  selectedServiceId: string;
}

export const CVExperienceBlock: React.FC<CVExperienceBlockProps> = ({
  filteredExperiences,
}) => {
  const { t } = useLanguage();

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2.5 mb-6">
        <span className="p-2 rounded-lg bg-[#00a6e0]/10 text-[#00a6e0] border border-[#00a6e0]/20">
          <Briefcase className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-[#d4e4fa]">
            {t('cv.experience.title', 'Work Experience')}
          </h2>
          <span className="text-xs text-[#9cb2cd]">
            {t('cv.experience.subtitle', 'Professional Engineering & Leadership Roles')}
          </span>
        </div>
      </div>

      {filteredExperiences.length === 0 ? (
        <div className="bg-[#0a1f33]/40 border border-[#1b3450] rounded-xl p-8 text-center text-xs text-[#9cb2cd]">
          {t('cv.experience.empty', 'No work experience entries linked to this specific service.')}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExperiences.map((exp) => (
            <CVExperienceItem key={exp.id} experience={exp} />
          ))}
        </div>
      )}
    </section>
  );
};
