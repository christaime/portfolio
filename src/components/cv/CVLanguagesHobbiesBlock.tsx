import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SpokenLanguage, Hobby } from '../../types';
import {
  Sparkles,
  Languages,
  Trophy,
  Terminal,
  Activity,
  Code,
  Globe,
} from 'lucide-react';

interface CVLanguagesHobbiesBlockProps {
  languages: SpokenLanguage[];
  hobbies: Hobby[];
}

export const CVLanguagesHobbiesBlock: React.FC<CVLanguagesHobbiesBlockProps> = ({
  languages,
  hobbies,
}) => {
  const { t } = useLanguage();

  const renderHobbyIcon = (iconName?: string) => {
    switch (iconName) {
      case 'menu_book':
        return <Terminal className="w-5 h-5" />;
      case 'directions_run':
        return <Activity className="w-5 h-5" />;
      case 'headset':
        return <Code className="w-5 h-5" />;
      case 'flight_takeoff':
        return <Globe className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section
      id="block-language-hobbies"
      className="bg-surface-container border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col gap-6"
    >
      <div className="flex items-center gap-3 border-b border-outline-variant/60 pb-4">
        <Sparkles className="w-6 h-6 text-secondary-container" />
        <h2 className="font-headline-md text-xl md:text-2xl text-on-surface">
          {t('cv.languagesHobbiesTitle')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Spoken Languages Section */}
        <div className="bg-surface border border-outline-variant rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-outline-variant/60 pb-3">
            <Languages className="w-5 h-5 text-secondary-container" />
            <h3 className="font-headline-sm text-sm text-on-surface font-bold">
              {t('cv.languagesTitle')}
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {languages.map((lang, idx) => (
              <div
                key={idx}
                className="bg-surface-container/60 p-3 rounded-lg border border-outline-variant/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center font-bold text-xs text-primary shrink-0">
                    {lang.flag}
                  </div>
                  <span className="font-headline-sm text-xs font-semibold text-on-surface">
                    {lang.name}
                  </span>
                </div>
                <span className="font-code-md text-xs text-secondary font-medium bg-surface-container px-2.5 py-1 rounded border border-outline-variant/40">
                  {lang.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hobbies & Personal Interests Section */}
        <div className="bg-surface border border-outline-variant rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-outline-variant/60 pb-3">
            <Trophy className="w-5 h-5 text-tertiary" />
            <h3 className="font-headline-sm text-sm text-on-surface font-bold">
              {t('cv.hobbiesTitle')}
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {hobbies.map((hobby, idx) => (
              <div
                key={idx}
                className="bg-surface-container/60 p-3 rounded-lg border border-outline-variant/60 flex items-start gap-3"
              >
                <div className="p-2 bg-surface-container-high rounded-lg text-tertiary shrink-0">
                  {renderHobbyIcon(hobby.icon)}
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-body-md text-xs font-semibold text-on-surface">
                      {hobby.name}
                    </span>
                    <span className="font-code-md text-[9px] bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded border border-outline-variant/40">
                      {hobby.category}
                    </span>
                  </div>
                  <p className="font-body-md text-[11px] text-on-surface-variant leading-relaxed">
                    {hobby.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
