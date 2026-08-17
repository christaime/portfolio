import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { WorkExperience } from '../../types';
import { Briefcase } from 'lucide-react';
import { CVExperienceItem } from './CVExperienceItem';

interface CVExperienceBlockProps {
  filteredExperiences: WorkExperience[];
  selectedServiceId: string;
}

export const CVExperienceBlock = ({
  filteredExperiences,
  selectedServiceId,
}: CVExperienceBlockProps) => {
  const { t } = useLanguage();

  return (
    <section
      id="block-experience"
      className="bg-surface-container border border-outline-variant rounded-2xl p-4 md:p-5 lg:p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
        <div className="flex items-center gap-3">
          <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-secondary-container" />
          <h2 className="font-headline-md text-xl md:text-2xl text-on-surface">
            {t('cv.experienceTitle')}
          </h2>
        </div>
        {selectedServiceId !== 'all' && (
          <span className="font-code-md text-xs bg-secondary-container/20 text-secondary-container px-3 py-1 rounded-full border border-secondary-container/30">
            {t('cv.serviceFiltered')} ({filteredExperiences.length})
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {filteredExperiences.length > 0 ? (
          filteredExperiences.map((exp) => (
            <CVExperienceItem key={exp.id} experience={exp} />
          ))
        ) : (
          <div className="bg-surface p-8 rounded-xl text-center border border-outline-variant">
            <p className="text-on-surface-variant text-sm font-body-md">
              {t('cv.noExperiences')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
