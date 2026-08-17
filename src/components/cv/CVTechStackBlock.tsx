import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SkillCategory } from '../../types';
import { Layers, Search } from 'lucide-react';

interface CVTechStackBlockProps {
  skillCategories: SkillCategory[];
  skillSearch: string;
  setSkillSearch: (search: string) => void;
  selectedServiceId: string;
  isItemLinkedToService: (linkedServices?: string[]) => boolean;
}

export const CVTechStackBlock = ({
  skillCategories,
  skillSearch,
  setSkillSearch,
  selectedServiceId,
  isItemLinkedToService,
}: CVTechStackBlockProps) => {
  const { t } = useLanguage();

  return (
    <section
      id="block-tech-stack"
      className="bg-surface-container border border-outline-variant rounded-2xl p-4 md:p-5 lg:p-6 flex flex-col gap-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/60 pb-3">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 md:w-6 md:h-6 text-tertiary" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-xl md:text-2xl text-on-surface">
                {t('cv.techStackTitle')}
              </h2>
              {selectedServiceId !== 'all' && (
                <span className="font-code-md text-[11px] bg-secondary-container/20 text-secondary-container px-2.5 py-0.5 rounded-full border border-secondary-container/30">
                  {t('cv.serviceFiltered')}
                </span>
              )}
            </div>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              {t('cv.techStackSubtitle')}
            </p>
          </div>
        </div>

        {/* Filter Search */}
        <div className="relative w-full sm:w-60">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-on-surface-variant" />
          <input
            type="text"
            placeholder={t('cv.searchTechPlaceholder')}
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            className="w-full bg-surface border border-outline-variant rounded-lg pl-8 pr-3 py-1.5 text-xs font-code-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-secondary-container"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skillCategories.map((cat, idx) => {
          const matchingSkills = cat.skills.filter((s) => {
            const matchesSearch = s.name
              .toLowerCase()
              .includes(skillSearch.toLowerCase());
            const matchesService = isItemLinkedToService(s.linkedServices);
            return matchesSearch && matchesService;
          });

          if (matchingSkills.length === 0) return null;

          return (
            <div
              key={idx}
              className="bg-surface border border-outline-variant/80 rounded-xl p-5 flex flex-col gap-4 shadow-2xs"
            >
              <h3 className="font-headline-sm text-sm text-on-surface font-semibold border-b border-outline-variant/60 pb-2 flex items-center justify-between">
                <span>{cat.category}</span>
                <span className="font-code-md text-[10px] text-secondary bg-surface-container-high px-2 py-0.5 rounded">
                  {matchingSkills.length} {t('cv.skillsCount')}
                </span>
              </h3>

              <div className="flex flex-col gap-3">
                {matchingSkills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="bg-surface-container/60 hover:bg-surface-container p-2.5 rounded-lg border border-outline-variant/40 transition-colors flex flex-col gap-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-body-md text-xs text-on-surface font-semibold">
                        {skill.name}
                      </span>
                      <span className="font-code-md text-[10px] text-secondary font-bold">
                        {skill.level}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-code-md text-on-surface-variant/80">
                      <span>{t('cv.experienceLabel')}</span>
                      <span>{skill.years}</span>
                    </div>
                    {/* Visual Skill Level Bar */}
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          skill.level === 'Expert'
                            ? 'w-full bg-secondary-container'
                            : skill.level === 'Advanced'
                            ? 'w-3/4 bg-tertiary'
                            : 'w-1/2 bg-primary'
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
