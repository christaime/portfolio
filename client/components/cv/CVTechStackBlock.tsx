import React from 'react';
import { SkillCategory, SkillItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Layers, Search } from 'lucide-react';

interface CVTechStackBlockProps {
  skillCategories: SkillCategory[];
  skillSearch: string;
  setSkillSearch: (search: string) => void;
  selectedServiceId: string;
  isItemLinkedToService?: (services?: string[]) => boolean;
}

export const CVTechStackBlock: React.FC<CVTechStackBlockProps> = ({
  skillCategories,
  skillSearch,
  setSkillSearch,
  selectedServiceId,
  isItemLinkedToService = () => true,
}) => {
  const { t } = useLanguage();

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-[#00a6e0]/10 text-[#00a6e0] border border-[#00a6e0]/20">
            <Layers className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#d4e4fa]">
              {t('cv.techStack.title', 'Technical Skills & Ecosystem')}
            </h2>
            <span className="text-xs text-[#9cb2cd]">
              {t('cv.techStack.subtitle', 'Categorized proficiency matrix')}
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#9cb2cd] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            placeholder={t('cv.techStack.searchPlaceholder', 'Search tech stack...')}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0a1f33] border border-[#1b3450] focus:border-[#00a6e0] rounded-lg text-[#d4e4fa] placeholder-[#9cb2cd]/60 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillCategories.map((cat, idx) => {
          const rawSkills = cat.skills || cat.items || [];
          const filteredSkills = rawSkills.filter((s) => {
            const skillName = typeof s === 'string' ? s : s.name;
            const matchesSearch = skillName.toLowerCase().includes(skillSearch.toLowerCase());
            const matchesService =
              selectedServiceId === 'all' ||
              typeof s === 'string' ||
              isItemLinkedToService(s.linkedServices);
            return matchesSearch && matchesService;
          });

          if (filteredSkills.length === 0) return null;

          return (
            <div
              key={idx}
              className="bg-[#0a1f33]/60 border border-[#1b3450] rounded-xl p-5"
            >
              <h3 className="text-xs font-mono font-bold uppercase text-[#00a6e0] tracking-wider mb-3">
                {cat.category}
              </h3>

              <div className="flex flex-wrap gap-2">
                {filteredSkills.map((s, sIdx) => {
                  const isObj = typeof s !== 'string';
                  const name = isObj ? (s as SkillItem).name : (s as string);
                  const level = isObj ? (s as SkillItem).level : undefined;
                  const years = isObj ? (s as SkillItem).years : undefined;

                  return (
                    <div
                      key={sIdx}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-[#051424] border border-[#1b3450] rounded-md text-xs"
                    >
                      <span className="font-semibold text-[#d4e4fa]">{name}</span>
                      {years && (
                        <span className="text-[10px] font-mono text-[#00a6e0] bg-[#0a1f33] px-1 rounded">
                          {years}
                        </span>
                      )}
                      {level && (
                        <span className="text-[10px] text-[#34d399] font-mono">
                          • {level}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
