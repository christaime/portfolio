import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { portfolioService } from '../services/portfolioService';
import { Project } from '../types';
import { Info, Code, ExternalLink, X } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    portfolioService.getProjects().then(setProjects);
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter(
    (p) => selectedFilter === 'All' || p.category === selectedFilter
  );

  return (
    <div className="animate-fadeIn flex flex-col gap-10">
      {/* Title & Description */}
      <div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-3">
          Projects & Codebases
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          A collection of production applications, healthcare EHR platforms, open-source repositories, and high-performance microservices.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-outline-variant/60 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`font-label-caps text-label-caps px-4 py-2 rounded-DEFAULT transition-all cursor-pointer ${
              selectedFilter === cat
                ? 'bg-secondary-container text-on-secondary-container font-semibold'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-surface-container rounded-xl p-6 border border-outline-variant hover:border-secondary-container transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-code-md text-xs text-secondary font-bold">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="bg-tertiary-container/30 border border-tertiary/40 text-tertiary px-2.5 py-0.5 rounded font-code-md text-[10px] font-semibold">
                    Featured
                  </span>
                )}
              </div>

              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3 group-hover:text-secondary-container transition-colors">
                {project.title}
              </h3>

              <p className="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="bg-surface-container-high border border-outline-variant/60 text-on-surface text-[11px] font-code-md px-2.5 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-between">
                <button
                  onClick={() => setActiveProject(project)}
                  className="font-label-caps text-xs text-on-surface-variant hover:text-primary cursor-pointer flex items-center gap-1"
                >
                  <Info className="w-4 h-4" />
                  <span>Overview</span>
                </button>

                <div className="flex items-center gap-3">
                  {project.sourceUrl && (
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-label-caps text-xs text-on-surface-variant hover:text-secondary-container flex items-center gap-1"
                    >
                      <Code className="w-4 h-4" />
                      <span>Source</span>
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed px-3 py-1.5 rounded font-label-caps text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Overview Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container border border-outline-variant p-6 md:p-8 rounded-xl max-w-2xl w-full flex flex-col gap-6 relative">
            <div className="flex justify-between items-start border-b border-outline-variant/60 pb-4">
              <div>
                <span className="font-code-md text-xs text-secondary font-bold">
                  {activeProject.category}
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface mt-1">
                  {activeProject.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="text-on-surface-variant hover:text-primary cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {activeProject.longDescription || activeProject.description}
            </p>

            <div className="bg-surface-container-high p-4 rounded border border-outline-variant">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-2">
                Technologies & Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeProject.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-surface border border-outline-variant text-on-surface font-code-md text-xs px-3 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveProject(null)}
                className="px-5 py-2.5 rounded border border-outline-variant text-on-surface font-label-caps text-xs cursor-pointer"
              >
                Close
              </button>
              {activeProject.demoUrl && (
                <a
                  href={activeProject.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed px-6 py-2.5 rounded font-label-caps text-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

