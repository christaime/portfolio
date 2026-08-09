import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Project } from '../../types';
import { FolderGit2 } from 'lucide-react';
import { CVProjectItem } from './CVProjectItem';

interface CVProjectsBlockProps {
  filteredProjects: Project[];
  selectedServiceId: string;
}

export const CVProjectsBlock: React.FC<CVProjectsBlockProps> = ({
  filteredProjects,
  selectedServiceId,
}) => {
  const { t } = useLanguage();

  if (filteredProjects.length === 0) {
    return null;
  }

  return (
    <section
      id="block-projects"
      className="bg-surface-container border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col gap-6"
    >
      <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4">
        <div className="flex items-center gap-3">
          <FolderGit2 className="w-6 h-6 text-secondary-container" />
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

      <div className="flex flex-col gap-5">
        {filteredProjects.map((proj) => (
          <CVProjectItem key={proj.id} project={proj} />
        ))}
      </div>
    </section>
  );
};
