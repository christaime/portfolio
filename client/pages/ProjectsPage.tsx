import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { portfolioService } from '../services/portfolioService';
import { ProjectItem } from '../types';
import { CVProjectItem } from '../components/cv/CVProjectItem';
import { Loader2 } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    portfolioService.getProjects().then((res) => {
      if (isMounted) {
        setProjects(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-mono text-[#00a6e0]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{t('projects.loading', 'Loading Projects...')}</span>
        </div>
      </div>
    );
  }

  const allCategoriesLabel = t('projects.allCategories', 'All');
  const rawCategories = Array.from(new Set(projects.map((p) => p.category)));
  const categories = ['All', ...rawCategories];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-mono text-[#00a6e0] font-bold uppercase tracking-wider bg-[#0a1f33] px-3 py-1 rounded-full border border-[#1b3450]">
          {t('projects.badge', 'Engineering Portfolio')}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-[#d4e4fa] mt-4 mb-3">
          {t('projects.title', 'Featured Projects & Architecture Implementations')}
        </h1>
        <p className="text-sm text-[#9cb2cd] leading-relaxed">
          {t(
            'projects.subtitle',
            'Production systems, PEPPOL compliance pipelines, fintech ledgers, and telemetry stacks designed for mission-critical reliability.'
          )}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono transition-colors ${
              selectedCategory === cat
                ? 'bg-[#00a6e0] text-[#00374d] font-bold shadow-sm'
                : 'bg-[#0a1f33] text-[#9cb2cd] hover:text-[#d4e4fa] border border-[#1b3450]'
            }`}
          >
            {cat === 'All' ? allCategoriesLabel : cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => (
          <CVProjectItem key={proj.id} project={proj} />
        ))}
      </div>
    </div>
  );
};
