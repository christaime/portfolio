import {
  PortfolioData,
  EngineerInfo,
  WorkExperience,
  SkillCategory,
  EducationItem,
  CertificationItem,
  ServiceItem,
  SpokenLanguage,
  Hobby,
  Project,
  Language,
} from '../types';
import rawPortfolioDataEn from '../data/portfolioData.json';
import rawPortfolioDataFr from '../data/portfolioData_fr.json';
import { getDefaultLanguage } from '../context/LanguageContext';

const portfolioDataMap: Record<Language, PortfolioData> = {
  en: rawPortfolioDataEn as PortfolioData,
  fr: rawPortfolioDataFr as PortfolioData,
};

type Listener = (data: PortfolioData) => void;

class PortfolioService {
  private currentLanguage: Language;
  private currentData: PortfolioData;
  private listeners: Set<Listener> = new Set();

  constructor(initialLang: Language = getDefaultLanguage()) {
    this.currentLanguage = initialLang;
    this.currentData = portfolioDataMap[initialLang] || portfolioDataMap.en;
  }

  setLanguage(lang: Language): void {
    if (this.currentLanguage === lang && this.currentData) return;
    this.currentLanguage = lang;
    this.currentData = portfolioDataMap[lang] || portfolioDataMap.en;
    this.notifyListeners();
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentData));
  }

  async getPortfolioData(): Promise<PortfolioData> {
    return Promise.resolve(this.currentData);
  }

  async getEngineerInfo(): Promise<EngineerInfo> {
    return Promise.resolve(this.currentData.engineer);
  }

  async getExperiences(): Promise<WorkExperience[]> {
    return Promise.resolve(this.currentData.experiences);
  }

  async getSkillCategories(): Promise<SkillCategory[]> {
    return Promise.resolve(this.currentData.skillCategories);
  }

  async getEducation(): Promise<EducationItem[]> {
    return Promise.resolve(this.currentData.education);
  }

  async getCertifications(): Promise<CertificationItem[]> {
    return Promise.resolve(this.currentData.certifications || []);
  }

  async getServices(): Promise<ServiceItem[]> {
    return Promise.resolve(this.currentData.services);
  }

  async getLanguages(): Promise<SpokenLanguage[]> {
    return Promise.resolve(this.currentData.languages || []);
  }

  async getHobbies(): Promise<Hobby[]> {
    return Promise.resolve(this.currentData.hobbies || []);
  }

  async getProjects(): Promise<Project[]> {
    return Promise.resolve(this.currentData.projects || []);
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const projects = await this.getProjects();
    return projects.find((p) => p.id === id);
  }
}

export const portfolioService = new PortfolioService();


