import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CVPdfPreview } from '@/client/components/cv/CVPdfPreview';
import { LanguageProvider } from '@/client/context/LanguageContext';
import {
  EngineerInfo,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  SkillCategory,
  LanguageItem,
  HobbyItem,
  ServiceItem,
} from '@/client/types';

const mockEngineer: EngineerInfo = {
  name: 'Christelle Mamekem Ngueguim',
  title: 'Senior Software Engineer (.NET C# / Java EE / Angular / DevOps)',
  avatarUrl: '/avatar.jpg',
  email: 'mnchristelle@gmail.com',
  phone: '+237 695 282 983',
  location: 'Bafoussam, Cameroon',
  remoteAvailable: true,
  introduction: 'Senior Software Engineer with 10+ years experience in distributed architectures.',
  github: 'https://github.com/christaime',
  linkedin: 'https://linkedin.com',
};

const mockExperiences: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Principal Software Architect',
    company: 'Enterprise Solutions Ltd',
    companyUrl: 'https://example.com',
    location: 'Remote',
    period: '2021 - Present',
    description: 'Spearheaded microservices and automated CI/CD pipelines.',
    achievements: ['Decreased deployment cycle by 60%'],
    technologies: ['C#', '.NET 8', 'Docker', 'Kubernetes'],
  },
];

const mockEducation: EducationItem[] = [
  {
    id: 'edu-1',
    degree: 'Master of Science in Computer Science',
    institution: 'University of Yaounde I',
    year: '2014',
    description: 'Specialization in Software Engineering and Networks',
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

const mockSkillCategories: SkillCategory[] = [
  {
    category: 'Backend & Cloud',
    skills: ['C#', '.NET Core', 'Java EE', 'Spring Boot', 'PostgreSQL'],
  },
];

const mockLanguages: LanguageItem[] = [
  {
    name: 'French',
    level: 'Native',
    proficiency: 100,
    flag: '🇫🇷',
  },
  {
    name: 'English',
    level: 'Fluent',
    proficiency: 90,
    flag: '🇬🇧',
  },
];

const mockHobbies: HobbyItem[] = [
  {
    name: 'Music',
    category: 'Interests & Culture',
    description: 'Diverse genres and acoustics',
  },
  {
    name: 'Travel',
    category: 'Exploration',
    description: 'Discovering regions',
  },
];

const mockService: ServiceItem = {
  id: 'srv-1',
  title: '.NET & C# Enterprise Solutions',
  icon: 'code',
  shortDesc: 'High throughput enterprise services',
  description: 'Full stack development with .NET Core and modern frontends.',
  features: ['Microservices Architecture', 'Clean Architecture'],
  estimatedDuration: '2-4 weeks',
  baseRate: '€650 / day',
};

describe('CVPdfPreview Component', () => {
  it('renders general CV layout with engineer profile, contact info, languages and hobbies in sidebar', () => {
    localStorage.setItem('portfolio_lang', 'en');
    render(
      <LanguageProvider>
        <CVPdfPreview
          engineer={mockEngineer}
          experiences={mockExperiences}
          education={mockEducation}
          certifications={mockCertifications}
          skillCategories={mockSkillCategories}
          languages={mockLanguages}
          hobbies={mockHobbies}
          fontStyle="sans"
        />
      </LanguageProvider>
    );

    expect(screen.getAllByText('Christelle Mamekem Ngueguim')[0]).toBeInTheDocument();
    expect(screen.getAllByText('mnchristelle@gmail.com')[0]).toBeInTheDocument();
    expect(screen.getAllByText('+237 695 282 983')[0]).toBeInTheDocument();
    expect(screen.getByText('Principal Software Architect')).toBeInTheDocument();
    expect(screen.getByText(/Enterprise Solutions Ltd/i)).toBeInTheDocument();
    expect(screen.getByText('Cisco Certified Network Associate (CCNA)')).toBeInTheDocument();

    // Verify Languages in sidebar
    expect(screen.getByText('French')).toBeInTheDocument();
    expect(screen.getByText('Native')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();

    // Verify Hobbies in sidebar
    expect(screen.getByText('Music')).toBeInTheDocument();
    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Interests & Culture')).toBeInTheDocument();
    expect(screen.getByText('Exploration')).toBeInTheDocument();
  });

  it('renders targeted service perspective banner when activeService is specified', () => {
    localStorage.setItem('portfolio_lang', 'en');
    render(
      <LanguageProvider>
        <CVPdfPreview
          engineer={mockEngineer}
          experiences={mockExperiences}
          education={mockEducation}
          certifications={mockCertifications}
          skillCategories={mockSkillCategories}
          languages={mockLanguages}
          activeService={mockService}
          selectedServiceId="srv-1"
          fontStyle="serif"
        />
      </LanguageProvider>
    );

    expect(screen.getAllByText('.NET & C# Enterprise Solutions')[0]).toBeInTheDocument();
  });
});
