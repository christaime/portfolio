import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CVPdfExportModal } from '@/client/components/cv/CVPdfExportModal';
import { LanguageProvider } from '@/client/context/LanguageContext';
import {
  EngineerInfo,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  SkillCategory,
  LanguageItem,
} from '@/client/types';

vi.mock('@/client/utils/cvPdfGenerator', () => ({
  generateCvPdf: vi.fn().mockResolvedValue(true),
}));

const mockEngineer: EngineerInfo = {
  name: 'Christelle Mamekem Ngueguim',
  title: 'Senior Software Engineer',
  avatarUrl: '/avatar.jpg',
  email: 'mnchristelle@gmail.com',
  phone: '+237 695 282 983',
  location: 'Bafoussam, Cameroon',
  remoteAvailable: true,
  introduction: 'Senior Software Engineer with 10+ years experience.',
  github: 'https://github.com/christaime',
  linkedin: 'https://linkedin.com',
};

const mockExperiences: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Lead Architect',
    company: 'Alpha Corp',
    companyUrl: 'https://alpha.com',
    location: 'Remote',
    period: '2020 - Present',
    description: 'Architecture and lead engineering',
    achievements: ['Achieved 99.99% uptime', 'Reduced build latency'],
    technologies: ['C#', '.NET Core', 'PostgreSQL'],
  },
];

const mockEducation: EducationItem[] = [
  {
    id: 'edu-1',
    degree: 'Master of Science in Computer Science',
    institution: 'University of Yaounde I',
    year: '2014',
    description: 'Distributed systems and network protocols',
  },
];

const mockCertifications: CertificationItem[] = [
  {
    id: 'cert-1',
    title: 'Cisco Certified Network Associate (CCNA)',
    issuer: 'Cisco',
    year: '2023',
    credentialUrl: 'https://cisco.com',
  },
];

const mockSkills: SkillCategory[] = [
  {
    category: 'Languages & Frameworks',
    skills: ['C#', '.NET', 'Java EE', 'Angular'],
  },
];

const mockLanguages: LanguageItem[] = [
  {
    name: 'French',
    level: 'Native',
    proficiency: 100,
  },
  {
    name: 'English',
    level: 'Fluent',
    proficiency: 90,
  },
];

describe('CVPdfExportModal Component', () => {
  it('renders nothing when isOpen is false', () => {
    render(
      <LanguageProvider>
        <CVPdfExportModal
          isOpen={false}
          onClose={vi.fn()}
          engineer={mockEngineer}
          experiences={mockExperiences}
          education={mockEducation}
          certifications={mockCertifications}
          skillCategories={mockSkills}
          languages={mockLanguages}
        />
      </LanguageProvider>
    );

    expect(screen.queryByText(/Curriculum Vitae Preview & Export/i)).not.toBeInTheDocument();
  });

  it('renders PDF export modal in English and toggles calligraphy styles', () => {
    localStorage.setItem('portfolio_lang', 'en');
    const handleClose = vi.fn();

    render(
      <LanguageProvider>
        <CVPdfExportModal
          isOpen={true}
          onClose={handleClose}
          engineer={mockEngineer}
          experiences={mockExperiences}
          education={mockEducation}
          certifications={mockCertifications}
          skillCategories={mockSkills}
          languages={mockLanguages}
        />
      </LanguageProvider>
    );

    expect(screen.getByText('Curriculum Vitae Preview & Export')).toBeInTheDocument();
    expect(screen.getByText('Modern Sans')).toBeInTheDocument();
    expect(screen.getByText('Executive Serif')).toBeInTheDocument();
    expect(screen.getByText('Tech Mono')).toBeInTheDocument();
    expect(screen.getByText('Classic Editorial')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Tech Mono'));
    expect(screen.getByText('Tech Mono')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders in French translation', () => {
    localStorage.setItem('portfolio_lang', 'fr');
    render(
      <LanguageProvider>
        <CVPdfExportModal
          isOpen={true}
          onClose={vi.fn()}
          engineer={mockEngineer}
          experiences={mockExperiences}
          education={mockEducation}
          certifications={mockCertifications}
          skillCategories={mockSkills}
          languages={mockLanguages}
        />
      </LanguageProvider>
    );

    expect(screen.getByText('Aperçu & Exportation du Curriculum Vitae')).toBeInTheDocument();
    expect(screen.getAllByText('Télécharger le PDF')[0]).toBeInTheDocument();
    expect(screen.getByText('Annuler')).toBeInTheDocument();
  });
});
