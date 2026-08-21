import React from 'react';
import { ProjectItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { CVProjectItem } from './CVProjectItem';
import { FolderGit2 } from 'lucide-react';

interface CVProjectsBlockProps {
  filteredProjects: ProjectItem[];
  selectedServiceId: string;
}

export const CVProjectsBlock: React.FC<CVProjectsBlockProps> = ({
  filteredProjects,
}) => {
  const { t } = useLanguage();

  if (filteredProjects.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2.5 mb-6">
        <span className="p-2 rounded-lg bg-[#00a6e0]/10 text-[#00a6e0] border border-[#00a6e0]/20">
          <FolderGit2 className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-[#d4e4fa]">
            {t('cv.projects.title', 'Featured Projects & Engineering Milestones')}
          </h2>
          <span className="text-xs text-[#9cb2cd]">
            {t('cv.projects.subtitle', 'Key architectural implementations & open-source solutions')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <CVProjectItem key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};
