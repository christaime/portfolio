import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import enTranslations from '@/client/data/translations/en.json';
import frTranslations from '@/client/data/translations/fr.json';
import { LanguageProvider, useLanguage } from '@/client/context/LanguageContext';
import { Header } from '@/client/components/Header';
import { Footer } from '@/client/components/Footer';
import { CVSidebar } from '@/client/components/cv/CVSidebar';
import { CVExperienceBlock } from '@/client/components/cv/CVExperienceBlock';
import { CVProjectsBlock } from '@/client/components/cv/CVProjectsBlock';
import { CVTechStackBlock } from '@/client/components/cv/CVTechStackBlock';
import { CVCertificationsBlock } from '@/client/components/cv/CVCertificationsBlock';
import { ContactDirectInfo } from '@/client/components/contact/ContactDirectInfo';
import {
  EngineerInfo,
  ExperienceItem,
  ProjectItem,
  CertificationItem,
  SkillCategory,
} from '@/client/types';

const mockEngineer: EngineerInfo = {
  name: 'Christelle Mamekem Ngueguim',
  title: 'Senior Software Engineer (.NET C# / Java EE / Angular / DevOps)',
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
    location: 'Remote',
    period: '2020 - Present',
    description: 'Enterprise architecture',
    achievements: ['Achieved high availability'],
    technologies: ['C#', '.NET Core'],
  },
];

const mockProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'PEPPOL E-Invoicing Engine',
    category: 'Enterprise Backend',
    description: 'High compliance invoice dispatcher',
    skills: ['C#', 'Docker', 'PostgreSQL'],
    technologies: ['C#', 'Docker', 'PostgreSQL'],
  },
];

const mockSkillCategories: SkillCategory[] = [
  {
    category: 'Backend Ecosystem',
    skills: ['C#', '.NET 8', 'Spring Boot', 'PostgreSQL'],
  },
];

const mockCertifications: CertificationItem[] = [
  {
    id: 'cert-1',
    name: 'Cisco Certified Network Associate (CCNA)',
    issuer: 'Cisco Systems',
    year: '2023',
  },
];

/**
 * Helper to recursively extract all dot-notation keys from a JSON object
 */
function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value as Record<string, unknown>, currentPath));
    } else {
      keys.push(currentPath);
    }
  }
  return keys;
}

describe('Translation and Layout Consistency Suite', () => {
  describe('Dictionary Parity and Completeness', () => {
    it('ensures en.json and fr.json have matching key structures without missing entries', () => {
      const enKeys = getAllKeys(enTranslations as unknown as Record<string, unknown>).sort();
      const frKeys = getAllKeys(frTranslations as unknown as Record<string, unknown>).sort();

      const missingInFr = enKeys.filter((k) => !frKeys.includes(k));
      const missingInEn = frKeys.filter((k) => !enKeys.includes(k));

      expect(missingInFr, `Keys present in en.json but missing in fr.json: ${missingInFr.join(', ')}`).toEqual([]);
      expect(missingInEn, `Keys present in fr.json but missing in en.json: ${missingInEn.join(', ')}`).toEqual([]);
      expect(enKeys.length).toBeGreaterThan(50);
      expect(enKeys.length).toEqual(frKeys.length);
    });

    it('ensures no translation key contains empty strings or placeholder whitespace', () => {
      const checkEmpty = (obj: Record<string, unknown>, lang: string) => {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'string') {
            expect(value.trim().length, `Empty translation for key ${key} in ${lang}`).toBeGreaterThan(0);
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            checkEmpty(value as Record<string, unknown>, lang);
          }
        }
      };

      checkEmpty(enTranslations as unknown as Record<string, unknown>, 'en');
      checkEmpty(frTranslations as unknown as Record<string, unknown>, 'fr');
    });
  });

  describe('Core UI Components Cross-Language Layout Consistency', () => {
    it('maintains Header navigation structure and updates textual labels when switching language', () => {
      const LanguageToggleTest = () => {
        const { language, setLanguage } = useLanguage();
        return (
          <div>
            <Header />
            <button data-testid="toggle-lang" onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}>
              Toggle
            </button>
          </div>
        );
      };

      localStorage.setItem('portfolio_lang', 'en');
      render(
        <LanguageProvider>
          <MemoryRouter>
            <LanguageToggleTest />
          </MemoryRouter>
        </LanguageProvider>
      );

      // Verify English Labels
      expect(screen.getByRole('link', { name: /cv & experience/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /services & advisory/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /articles/i })).toBeInTheDocument();

      // Switch to French
      fireEvent.click(screen.getByTestId('toggle-lang'));

      // Verify French Labels
      expect(screen.getByRole('link', { name: /cv & expérience/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /services & conseil/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /projets/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /articles/i })).toBeInTheDocument();
    });

    it('maintains Footer layout and updates translated text seamlessly', () => {
      localStorage.setItem('portfolio_lang', 'en');
      const { rerender } = render(
        <LanguageProvider key="en">
          <MemoryRouter>
            <Footer />
          </MemoryRouter>
        </LanguageProvider>
      );

      expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
      expect(screen.getByText(/Christelle Mamekem Ngueguim/i)).toBeInTheDocument();

      localStorage.setItem('portfolio_lang', 'fr');
      rerender(
        <LanguageProvider key="fr">
          <MemoryRouter>
            <Footer />
          </MemoryRouter>
        </LanguageProvider>
      );

      expect(screen.getByText(/Tous Droits Réservés/i)).toBeInTheDocument();
    });

    it('maintains CVSidebar actions and status indicators across languages', () => {
      localStorage.setItem('portfolio_lang', 'en');
      const { rerender } = render(
        <LanguageProvider key="en">
          <CVSidebar
            engineer={mockEngineer}
            services={[]}
            selectedServiceId="all"
            setSelectedServiceId={() => {}}
            onOpenPdfModal={() => {}}
          />
        </LanguageProvider>
      );

      expect(screen.getByText('Download PDF CV')).toBeInTheDocument();
      expect(screen.getByText('Available for Engagements')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive Full Profile')).toBeInTheDocument();

      localStorage.setItem('portfolio_lang', 'fr');
      rerender(
        <LanguageProvider key="fr">
          <CVSidebar
            engineer={mockEngineer}
            services={[]}
            selectedServiceId="all"
            setSelectedServiceId={() => {}}
            onOpenPdfModal={() => {}}
          />
        </LanguageProvider>
      );

      expect(screen.getByText('Télécharger le CV PDF')).toBeInTheDocument();
      expect(screen.getByText('Disponible pour Missions')).toBeInTheDocument();
      expect(screen.getByText('Profil Complet & Polyvalent')).toBeInTheDocument();
    });

    it('maintains CV content blocks layout and updates headers correctly', () => {
      // Experience Block
      localStorage.setItem('portfolio_lang', 'en');
      const { rerender } = render(
        <LanguageProvider key="en">
          <CVExperienceBlock filteredExperiences={mockExperiences} selectedServiceId="all" />
          <CVProjectsBlock filteredProjects={mockProjects} selectedServiceId="all" />
          <CVTechStackBlock
            skillCategories={mockSkillCategories}
            skillSearch=""
            setSkillSearch={() => {}}
            selectedServiceId="all"
            isItemLinkedToService={() => true}
          />
          <CVCertificationsBlock filteredCertifications={mockCertifications} selectedServiceId="all" />
          <ContactDirectInfo engineer={mockEngineer} />
        </LanguageProvider>
      );

      expect(screen.getByRole('heading', { name: 'Work Experience' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Featured Engineering Projects' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Technical Skills & Ecosystem' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Certifications & Accreditations' })).toBeInTheDocument();
      expect(screen.getByText('Direct & Consulting Channels')).toBeInTheDocument();

      // Switch to French
      localStorage.setItem('portfolio_lang', 'fr');
      rerender(
        <LanguageProvider key="fr">
          <CVExperienceBlock filteredExperiences={mockExperiences} selectedServiceId="all" />
          <CVProjectsBlock filteredProjects={mockProjects} selectedServiceId="all" />
          <CVTechStackBlock
            skillCategories={mockSkillCategories}
            skillSearch=""
            setSkillSearch={() => {}}
            selectedServiceId="all"
            isItemLinkedToService={() => true}
          />
          <CVCertificationsBlock filteredCertifications={mockCertifications} selectedServiceId="all" />
          <ContactDirectInfo engineer={mockEngineer} />
        </LanguageProvider>
      );

      expect(screen.getByRole('heading', { name: 'Expérience Professionnelle' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Projets Techniques Phares' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Compétences Techniques & Écosystème' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Certifications & Accréditations' })).toBeInTheDocument();
      expect(screen.getByText('Canaux Directs & Conseil')).toBeInTheDocument();
    });
  });
});
