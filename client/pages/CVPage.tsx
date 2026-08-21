import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { portfolioService } from '../services/portfolioService';
import { PortfolioData, SkillCategory, SkillItem } from '../types';
import { CVSidebar } from '../components/cv/CVSidebar';
import { CVRoleIntroBlock } from '../components/cv/CVRoleIntroBlock';
import { CVExperienceBlock } from '../components/cv/CVExperienceBlock';
import { CVProjectsBlock } from '../components/cv/CVProjectsBlock';
import { CVCertificationsBlock } from '../components/cv/CVCertificationsBlock';
import { CVTrainingBlock } from '../components/cv/CVTrainingBlock';
import { CVTechStackBlock } from '../components/cv/CVTechStackBlock';
import { CVLanguagesHobbiesBlock } from '../components/cv/CVLanguagesHobbiesBlock';
import { CVPdfExportModal } from '../components/cv/CVPdfExportModal';
import { Loader2 } from 'lucide-react';

const CVSeparator: React.FC = () => (
  <div className="my-8 md:my-10 relative flex items-center justify-center" aria-hidden="true">
    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#1b3450] to-transparent" />
    <div className="absolute flex items-center gap-1.5 px-3 bg-[#051424]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#00a6e0]/60" />
      <span className="w-4 h-[2px] rounded-full bg-[#00a6e0]/40" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#00a6e0]/60" />
    </div>
  </div>
);

export const CVPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('all');
  const [skillSearch, setSkillSearch] = useState<string>('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    portfolioService.getPortfolioData().then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [language]);

  const activeService = useMemo(() => {
    if (!data) return undefined;
    return data.services.find((s) => s.id === selectedServiceId);
  }, [data, selectedServiceId]);

  // Filter experiences based on selected service
  const filteredExperiences = useMemo(() => {
    if (!data) return [];
    if (selectedServiceId === 'all') return data.experiences;
    const matched = data.experiences.filter((exp: any) => {
      return exp.linkedServices && exp.linkedServices.includes(selectedServiceId);
    });
    return matched.length > 0 ? matched : data.experiences;
  }, [data, selectedServiceId]);

  // Filter projects based on selected service
  const filteredProjects = useMemo(() => {
    if (!data) return [];
    if (selectedServiceId === 'all') return data.projects;
    return data.projects.filter((p: any) => {
      return p.linkedServices && p.linkedServices.includes(selectedServiceId);
    });
  }, [data, selectedServiceId]);

  // Filter certifications based on selected service
  const filteredCertifications = useMemo(() => {
    if (!data) return [];
    if (selectedServiceId === 'all') return data.certifications;
    const matched = data.certifications.filter((c: any) => {
      return c.linkedServices && c.linkedServices.includes(selectedServiceId);
    });
    return matched.length > 0 ? matched : data.certifications;
  }, [data, selectedServiceId]);

  // Filter education
  const filteredEducation = useMemo(() => {
    if (!data) return [];
    if (selectedServiceId === 'all') return data.education;
    const matched = data.education.filter((e: any) => {
      return e.linkedServices && e.linkedServices.includes(selectedServiceId);
    });
    return matched.length > 0 ? matched : data.education;
  }, [data, selectedServiceId]);

  // Base and perspective-filtered skill categories
  const rawSkillCategories: SkillCategory[] = useMemo(() => {
    if (!data) return [];
    return (data as any).skillCategories || data.techStack || [];
  }, [data]);

  const filteredSkillCategories: SkillCategory[] = useMemo(() => {
    if (selectedServiceId === 'all') return rawSkillCategories;

    return rawSkillCategories
      .map((cat) => {
        const rawList: (string | SkillItem)[] = cat.skills || (cat.items ? cat.items.map((name) => ({ name })) : []);
        const filteredSkills = rawList.filter((s) => {
          if (typeof s === 'string') return true;
          const linked = (s as SkillItem).linkedServices || (s as any).services;
          if (!linked || linked.length === 0) return true;
          return linked.includes(selectedServiceId);
        });
        return {
          category: cat.category,
          skills: filteredSkills,
          items: filteredSkills.map((s) => (typeof s === 'string' ? s : s.name)),
        };
      })
      .filter((cat) => (cat.skills && cat.skills.length > 0) || (cat.items && cat.items.length > 0));
  }, [rawSkillCategories, selectedServiceId]);

  if (loading || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-mono text-[#00a6e0]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{t('common.loading', 'Loading Curriculum Vitae...')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sticky Sidebar */}
        <CVSidebar
          engineer={data.engineer}
          services={data.services}
          selectedServiceId={selectedServiceId}
          setSelectedServiceId={setSelectedServiceId}
          onOpenPdfModal={() => setIsPdfModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0">
          <CVRoleIntroBlock
            activeService={activeService}
            selectedServiceId={selectedServiceId}
            setSelectedServiceId={setSelectedServiceId}
            engineer={data.engineer}
            filteredExperiencesCount={filteredExperiences.length}
            filteredCertificationsCount={filteredCertifications.length}
            onOpenPdfModal={() => setIsPdfModalOpen(true)}
          />

          <CVSeparator />

          <CVExperienceBlock
            filteredExperiences={filteredExperiences}
            selectedServiceId={selectedServiceId}
          />

          <CVSeparator />

          <CVProjectsBlock
            filteredProjects={filteredProjects}
            selectedServiceId={selectedServiceId}
          />

          <CVSeparator />

          <CVTechStackBlock
            skillCategories={rawSkillCategories}
            skillSearch={skillSearch}
            setSkillSearch={setSkillSearch}
            selectedServiceId={selectedServiceId}
            isItemLinkedToService={(services) =>
              !services || services.length === 0 || services.includes(selectedServiceId)
            }
          />

          <CVSeparator />

          <CVCertificationsBlock
            filteredCertifications={filteredCertifications}
            selectedServiceId={selectedServiceId}
          />

          <CVSeparator />

          <CVTrainingBlock
            filteredEducation={filteredEducation}
            selectedServiceId={selectedServiceId}
          />

          <CVSeparator />

          <CVLanguagesHobbiesBlock
            languages={data.languages}
            hobbies={data.hobbies}
          />
        </main>
      </div>

      {/* Dedicated PDF CV Modal - targeted to the currently active perspective */}
      <CVPdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        engineer={data.engineer}
        experiences={filteredExperiences}
        education={filteredEducation}
        certifications={filteredCertifications}
        projects={filteredProjects}
        skillCategories={filteredSkillCategories.length > 0 ? filteredSkillCategories : rawSkillCategories}
        languages={data.languages}
        hobbies={data.hobbies}
        activeService={activeService}
        selectedServiceId={selectedServiceId}
      />
    </div>
  );
};
