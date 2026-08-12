import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Project } from '../../types';
import { FolderGit2 } from 'lucide-react';
import { CVProjectItem } from './CVProjectItem';

interface CVProjectsBlockProps {
  filteredProjects: Project[];
  selectedServiceId: string;
}

export const CVProjectsBlock = ({
  filteredProjects,
  selectedServiceId,
}: CVProjectsBlockProps) => {
  const { t } = useLanguage();

  if (filteredProjects.length === 0) {
    return null;
  }

  return (
    <section
      id="block-projects"
      className="bg-surface-container border border-outline-variant rounded-2xl p-4 md:p-5 lg:p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
        <div className="flex items-center gap-3">
          <FolderGit2 className="w-5 h-5 md:w-6 md:h-6 text-secondary-container" />
          <h2 className="font-headline-md text-xl md:text-2xl text-on-surface">
            {t('cv.projectsTitle')}
          </h2>
        </div>
        {selectedServiceId !== 'all' && (
          <span className="font-code-md text-xs bg-secondary-container/20 text-secondary-container px-3 py-1 rounded-full border border-secondary-container/30">
            Service Filtered ({filteredProjects.length})
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {filteredProjects.map((proj) => (
          <CVProjectItem key={proj.id} project={proj} />
        ))}
      </div>
    </section>
  );
};
