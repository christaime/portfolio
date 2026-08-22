import React from 'react';
import { SpokenLanguage, Hobby } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Globe2, Heart, Cpu, Users, Activity, BookOpen } from 'lucide-react';

interface CVLanguagesHobbiesBlockProps {
  languages: SpokenLanguage[];
  hobbies: Hobby[];
}

export const CVLanguagesHobbiesBlock: React.FC<CVLanguagesHobbiesBlockProps> = ({
  languages,
  hobbies,
}) => {
  const { t } = useLanguage();

  const getHobbyIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'cpu':
        return <Cpu className="w-4 h-4 text-[#00a6e0]" />;
      case 'users':
        return <Users className="w-4 h-4 text-[#34d399]" />;
      case 'activity':
        return <Activity className="w-4 h-4 text-[#f59e0b]" />;
      default:
        return <BookOpen className="w-4 h-4 text-[#00a6e0]" />;
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {/* Languages */}
      <div className="bg-[#0a1f33]/60 border border-[#1b3450] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe2 className="w-4 h-4 text-[#00a6e0]" />
          <h3 className="text-sm font-bold text-[#d4e4fa]">
            {t('cv.languages.title', 'Languages')}
          </h3>
        </div>

        <div className="space-y-3">
          {languages.map((lang, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#051424] border border-[#1b3450]">
              <div className="flex items-center gap-2">
                {lang.flag && <span className="text-base">{lang.flag}</span>}
                <span className="text-xs font-semibold text-[#d4e4fa]">{lang.name}</span>
              </div>
              <span className="text-xs font-mono text-[#00a6e0]">{lang.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hobbies & Interests */}
      <div className="bg-[#0a1f33]/60 border border-[#1b3450] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-4 h-4 text-[#f43f5e]" />
          <h3 className="text-sm font-bold text-[#d4e4fa]">
            {t('cv.hobbies.title', 'Interests & Engagements')}
          </h3>
        </div>

        <div className="space-y-3">
          {hobbies.map((hobby, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-[#051424] border border-[#1b3450]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {getHobbyIcon(hobby.icon)}
                  <span className="text-xs font-semibold text-[#d4e4fa]">{hobby.name}</span>
                </div>
                {hobby.category && (
                  <span className="text-[10px] font-mono text-[#9cb2cd] bg-[#0a1f33] px-1.5 py-0.5 rounded border border-[#1b3450]">
                    {hobby.category}
                  </span>
                )}
              </div>
              {hobby.description && (
                <p className="text-[11px] text-[#9cb2cd] pl-6 leading-relaxed">
                  {hobby.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
