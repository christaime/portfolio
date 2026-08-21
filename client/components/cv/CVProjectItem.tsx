import React from 'react';
import { ProjectItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Github, ExternalLink, CheckCircle2 } from 'lucide-react';

interface CVProjectItemProps {
  project: ProjectItem;
}

export const CVProjectItem: React.FC<CVProjectItemProps> = ({ project }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#0a1f33]/70 hover:bg-[#0a1f33] border border-[#1b3450] hover:border-[#00a6e0]/40 rounded-xl p-5 transition-all flex flex-col justify-between">
      <div>
        {/* Category & Badge */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-mono text-[#00a6e0] uppercase tracking-wider bg-[#051424] px-2.5 py-0.5 rounded border border-[#1b3450]">
            {project.category}
          </span>
          {project.featured && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-2 py-0.5 rounded">
              <Sparkles className="w-3 h-3" />
              <span>{t('services.featured', 'Featured')}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[#d4e4fa] mb-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-xs md:text-sm text-[#9cb2cd] leading-relaxed mb-4">
          {project.longDescription || project.description || project.summary}
        </p>

        {/* Achievements if any */}
        {project.achievements && project.achievements.length > 0 && (
          <ul className="mb-4 space-y-1">
            {project.achievements.map((ach, i) => (
              <li key={i} className="text-xs text-[#d4e4fa]/80 flex items-start gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[#34d399] shrink-0 mt-0.5" />
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        {/* Skills */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] font-mono bg-[#051424] text-[#9cb2cd] border border-[#1b3450] rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Action Links */}
        <div className="flex items-center gap-3 pt-3 border-t border-[#1b3450]/60">
          {(project.sourceUrl || project.githubUrl) && (
            <a
              href={project.sourceUrl || project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#9cb2cd] hover:text-[#00a6e0] font-mono transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>{t('cv.projects.sourceCode', 'Source Code')}</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#9cb2cd] hover:text-[#00a6e0] font-mono transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t('cv.projects.viewLive', 'Live Demo')}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
