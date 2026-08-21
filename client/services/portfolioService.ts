import portfolioEn from '../data/portfolioData.json';
import portfolioFr from '../data/portfolioData_fr.json';
import {
  PortfolioData,
  EngineerInfo,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  TrainingItem,
  ProjectItem,
  LanguageItem,
  HobbyItem,
  ServiceItem,
  TechStackCategory,
} from '../types';

class PortfolioService {
  private currentLanguage: string;
  private currentPortfolioData: PortfolioData;

  constructor() {
    this.currentLanguage =
      (typeof window !== 'undefined'
        ? localStorage.getItem('portfolio_lang') || localStorage.getItem('app_language')
        : null) || 'en';
    this.currentPortfolioData = (this.currentLanguage === 'fr' ? portfolioFr : portfolioEn) as unknown as PortfolioData;
  }

  /**
   * Sets the active language and loads the corresponding portfolio dataset into memory,
   * making all subsequent data extractions stateful.
   */
  public setLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.currentPortfolioData = (lang === 'fr' ? portfolioFr : portfolioEn) as unknown as PortfolioData;
  }

  public getLanguage(): string {
    return this.currentLanguage;
  }

  public async getPortfolioData(): Promise<PortfolioData> {
    return this.currentPortfolioData;
  }

  public async getEngineerInfo(): Promise<EngineerInfo> {
    return this.currentPortfolioData.engineer;
  }

  public async getExperiences(): Promise<ExperienceItem[]> {
    return this.currentPortfolioData.experiences;
  }

  public async getEducation(): Promise<EducationItem[]> {
    return this.currentPortfolioData.education;
  }

  public async getCertifications(): Promise<CertificationItem[]> {
    return this.currentPortfolioData.certifications;
  }

  public async getTrainings(): Promise<TrainingItem[]> {
    return this.currentPortfolioData.trainings;
  }

  public async getProjects(): Promise<ProjectItem[]> {
    return this.currentPortfolioData.projects;
  }

  public async getLanguages(): Promise<LanguageItem[]> {
    return this.currentPortfolioData.languages;
  }

  public async getHobbies(): Promise<HobbyItem[]> {
    return this.currentPortfolioData.hobbies;
  }

  public async getServices(): Promise<ServiceItem[]> {
    return this.currentPortfolioData.services;
  }

  public async getTechStack(): Promise<TechStackCategory[]> {
    return this.currentPortfolioData.techStack;
  }
}

export const portfolioService = new PortfolioService();
