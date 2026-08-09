import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { EducationItem } from '../../types';
import { GraduationCap } from 'lucide-react';
import { CVEducationItem } from './CVEducationItem';

interface CVTrainingBlockProps {
  filteredEducation: EducationItem[];
  selectedServiceId: string;
}

export const CVTrainingBlock: React.FC<CVTrainingBlockProps> = ({
  filteredEducation,
  selectedServiceId,
}) => {
  const { t } = useLanguage();

  return (
    <section
      id="block-training"
      className="bg-surface-container border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col gap-6"
    >
      <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-secondary" />
          <h2 className="font-headline-md text-xl md:text-2xl text-on-surface">
            {t('cv.trainingTitle')}
          </h2>
        </div>
        {selectedServiceId !== 'all' && (
          <span className="font-code-md text-xs bg-secondary/20 text-secondary px-3 py-1 rounded-full border border-secondary/30">
            Service Filtered ({filteredEducation.length})
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {filteredEducation.length > 0 ? (
          filteredEducation.map((edu, idx) => (
            <CVEducationItem key={idx} education={edu} />
          ))
        ) : (
          <div className="bg-surface p-8 rounded-xl text-center border border-outline-variant">
            <p className="text-on-surface-variant text-sm font-body-md">
              No training/education entries linked to this specific service.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
