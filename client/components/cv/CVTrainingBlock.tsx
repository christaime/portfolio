import React from 'react';
import { EducationItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { CVEducationItem } from './CVEducationItem';
import { BookOpen } from 'lucide-react';

interface CVTrainingBlockProps {
  filteredEducation: EducationItem[];
  selectedServiceId: string;
}

export const CVTrainingBlock: React.FC<CVTrainingBlockProps> = ({
  filteredEducation,
}) => {
  const { t } = useLanguage();

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2.5 mb-6">
        <span className="p-2 rounded-lg bg-[#00a6e0]/10 text-[#00a6e0] border border-[#00a6e0]/20">
          <BookOpen className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-[#d4e4fa]">
            {t('cv.education.title', 'Education & Specialized Training')}
          </h2>
          <span className="text-xs text-[#9cb2cd]">
            {t('cv.education.subtitle', 'Academic background and continuous professional development')}
          </span>
        </div>
      </div>

      {filteredEducation.length === 0 ? (
        <div className="bg-[#0a1f33]/40 border border-[#1b3450] rounded-xl p-6 text-center text-xs text-[#9cb2cd]">
          {t('cv.education.empty', 'No training/education entries linked to this specific service.')}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEducation.map((edu, idx) => (
            <CVEducationItem key={edu.id || idx} education={edu} />
          ))}
        </div>
      )}
    </section>
  );
};
