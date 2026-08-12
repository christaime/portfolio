import React from 'react';
import { Project } from '../../types';
import { FolderGit2, ExternalLink, Code2 } from 'lucide-react';

interface CVProjectItemProps {
  key?: React.Key;
  project: Project;
}

export const CVProjectItem = ({ project }: CVProjectItemProps) => {
  return (
    <div className="bg-surface border border-outline-variant hover:border-secondary-container transition-all rounded-xl p-4 md:p-5 flex flex-col gap-3 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/40 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-secondary-container/10 text-secondary-container rounded-lg shrink-0">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline-sm text-base md:text-lg text-on-surface font-bold">
              {project.title}
            </h3>
            <p className="font-code-md text-xs text-secondary-container font-medium">
              {project.category}
            </p>
          </div>
        </div>

        {project.featured && (
          <span className="bg-tertiary-container/30 text-tertiary font-code-md text-[10px] px-2.5 py-0.5 rounded-full border border-tertiary/30 w-fit">
            Featured Deliverable
          </span>
        )}
      </div>

      <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
        {project.longDescription || project.description}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/40">
        <div className="flex flex-wrap items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-on-surface-variant/70 shrink-0 mr-1" />
          {project.skills.map((skill, sIdx) => (
            <span
              key={sIdx}
              className="bg-surface-container-high border border-outline-variant/80 text-on-surface font-code-md text-[11px] px-2.5 py-0.5 rounded"
            >
              {skill}
            </span>
          ))}
        </div>

        {(project.demoUrl || project.sourceUrl) && (
          <div className="flex items-center gap-2">
            {project.sourceUrl && (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-code-md text-xs text-secondary-container hover:underline bg-surface-container/80 px-2.5 py-1 rounded border border-outline-variant/60 transition-colors"
              >
                <span>Code Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
