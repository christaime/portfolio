import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { portfolioService } from '../services/portfolioService';
import {
  EngineerInfo,
  WorkExperience,
  SkillCategory,
  EducationItem,
  CertificationItem,
  ServiceItem,
  SpokenLanguage,
  Hobby,
  Project,
} from '../types';

import { CVSidebar } from '../components/cv/CVSidebar';
import { CVRoleIntroBlock } from '../components/cv/CVRoleIntroBlock';
import { CVTechStackBlock } from '../components/cv/CVTechStackBlock';
import { CVExperienceBlock } from '../components/cv/CVExperienceBlock';
import { CVTrainingBlock } from '../components/cv/CVTrainingBlock';
import { CVProjectsBlock } from '../components/cv/CVProjectsBlock';
import { CVCertificationsBlock } from '../components/cv/CVCertificationsBlock';
import { CVLanguagesHobbiesBlock } from '../components/cv/CVLanguagesHobbiesBlock';
import { CVPdfExportModal } from '../components/cv/CVPdfExportModal';

export const CVPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [engineer, setEngineer] = useState<EngineerInfo | null>(null);
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [languages, setLanguages] = useState<SpokenLanguage[]>([]);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // URL sync for serviceId
  const initialServiceFromUrl = searchParams.get('service') || searchParams.get('serviceId') || 'all';
  const [selectedServiceId, setSelectedServiceIdState] = useState<string>(initialServiceFromUrl);
  
  const [skillSearch, setSkillSearch] = useState<string>('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Sync state if URL query params change externally
  useEffect(() => {
    const serviceFromUrl = searchParams.get('service') || searchParams.get('serviceId') || 'all';
    if (serviceFromUrl !== selectedServiceId) {
      setSelectedServiceIdState(serviceFromUrl);
    }
  }, [searchParams]);

  const handleSelectService = (id: string) => {
    setSelectedServiceIdState(id);
    if (id === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ service: id });
    }
  };

  useEffect(() => {
    portfolioService.getEngineerInfo().then(setEngineer);
    portfolioService.getExperiences().then(setExperiences);
    portfolioService.getSkillCategories().then(setSkillCategories);
    portfolioService.getEducation().then(setEducation);
    portfolioService.getCertifications().then(setCertifications);
    portfolioService.getServices().then(setServices);
    portfolioService.getLanguages().then(setLanguages);
    portfolioService.getHobbies().then(setHobbies);
    portfolioService.getProjects().then(setProjects);
  }, [language]);

  const handleExportCV = () => {
    setIsPdfModalOpen(true);
  };

  const isItemLinkedToService = (linkedServices?: string[]) => {
    if (selectedServiceId === 'all') return true;
    if (!linkedServices || linkedServices.length === 0) return true;
    return linkedServices.includes(selectedServiceId);
  };

  const activeService = services.find((s) => s.id === selectedServiceId);

  const filteredExperiences = experiences.filter((exp) =>
    isItemLinkedToService(exp.linkedServices)
  );

  const filteredEducation = education.filter((edu) =>
    isItemLinkedToService(edu.linkedServices)
  );

  const filteredCertifications = certifications.filter((cert) =>
    isItemLinkedToService(cert.linkedServices)
  );

  const filteredProjects = projects.filter((proj) =>
    isItemLinkedToService(proj.linkedServices)
  );

  const filteredSkillCategories = skillCategories
    .map((cat) => {
      if (
        cat.linkedServices &&
        cat.linkedServices.length > 0 &&
        selectedServiceId !== 'all' &&
        !cat.linkedServices.includes(selectedServiceId)
      ) {
        return null;
      }
      const matchingSkills = cat.skills.filter((s) => isItemLinkedToService(s.linkedServices));
      if (matchingSkills.length === 0) return null;
      return { ...cat, skills: matchingSkills };
    })
    .filter((cat): cat is SkillCategory => cat !== null);

  return (
    <div className="animate-fadeIn flex flex-col lg:flex-row gap-5 lg:gap-6 items-start">
      {/* Left Sidebar: Profile & Services Options */}
      <CVSidebar
        engineer={engineer}
        services={services}
        selectedServiceId={selectedServiceId}
        setSelectedServiceId={handleSelectService}
        isExporting={false}
        handleExportCV={handleExportCV}
        onNavigateContact={() => navigate('/contact')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col gap-5 lg:gap-6">
        {/* Block 1: Service / Role & Introduction */}
        <CVRoleIntroBlock
          activeService={activeService}
          selectedServiceId={selectedServiceId}
          setSelectedServiceId={handleSelectService}
          engineer={engineer}
          filteredExperiencesCount={filteredExperiences.length}
          filteredCertificationsCount={filteredCertifications.length}
        />

        {/* Block 2: Tech Stack Grid */}
        <CVTechStackBlock
          skillCategories={skillCategories}
          skillSearch={skillSearch}
          setSkillSearch={setSkillSearch}
          selectedServiceId={selectedServiceId}
          isItemLinkedToService={isItemLinkedToService}
        />

        {/* Block 3: Work Experience */}
        <CVExperienceBlock
          filteredExperiences={filteredExperiences}
          selectedServiceId={selectedServiceId}
        />

        {/* Block 4: Training & Education */}
        <CVTrainingBlock
          filteredEducation={filteredEducation}
          selectedServiceId={selectedServiceId}
        />

        {/* Block 5: Projects (Rendered after Training Block if projects are linked to selected service) */}
        <CVProjectsBlock
          filteredProjects={filteredProjects}
          selectedServiceId={selectedServiceId}
        />

        {/* Block 6: Certifications */}
        <CVCertificationsBlock
          filteredCertifications={filteredCertifications}
          selectedServiceId={selectedServiceId}
        />

        {/* Block 7: Languages & Hobbies */}
        <CVLanguagesHobbiesBlock
          languages={languages}
          hobbies={hobbies}
        />
      </main>

      {/* Dedicated PDF Export Modal */}
      <CVPdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        engineer={engineer}
        experiences={filteredExperiences}
        skillCategories={filteredSkillCategories}
        education={filteredEducation}
        certifications={filteredCertifications}
        languages={languages}
        hobbies={hobbies}
        activeService={activeService}
        projects={filteredProjects}
        selectedServiceId={selectedServiceId}
      />
    </div>
  );
};
