import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { WorkExperience } from '../../types';

interface CVExperienceItemProps {
  key?: React.Key;
  experience: WorkExperience;
}

export const CVExperienceItem = ({ experience }: CVExperienceItemProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-surface border border-outline-variant hover:border-outline transition-all rounded-xl p-4 md:p-5 flex flex-col gap-3 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-outline-variant/40 pb-3">
        <div>
          <h3 className="font-headline-sm text-lg text-on-surface font-bold">
            {experience.role}
          </h3>
          <p className="font-body-md text-sm text-secondary-container font-semibold flex items-center gap-1.5 flex-wrap">
            {experience.companyUrl ? (
              <a
                href={experience.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary hover:text-secondary-container transition-colors inline-flex items-center gap-1"
                title={`Visit ${experience.company} website`}
              >
                <span>{experience.company}</span>
                <ExternalLink className="w-3.5 h-3.5 inline shrink-0 opacity-80" />
              </a>
            ) : (
              <span>{experience.company}</span>
            )}
            <span className="text-on-surface-variant font-normal">• {experience.location}</span>
          </p>
        </div>
        <div className="bg-surface-container-high border border-outline-variant text-primary font-code-md text-xs px-3 py-1 rounded-full w-fit">
          {experience.period}
        </div>
      </div>

      <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
        {experience.description}
      </p>

      <div>
        <h4 className="font-label-caps text-xs text-on-surface-variant mb-2">
          {t('cv.keyAchievements')}
        </h4>
        <ul className="list-disc list-inside flex flex-col gap-1.5 font-body-md text-xs text-on-surface-variant/90">
          {experience.achievements.map((ach, aIdx) => (
            <li key={aIdx} className="leading-relaxed">
              {ach}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-outline-variant/40">
        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech, tIdx) => (
            <span
              key={tIdx}
              className="bg-surface-container-high border border-outline-variant/80 text-on-surface font-code-md text-[11px] px-2.5 py-1 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
