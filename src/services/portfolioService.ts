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
} from '../types';
import rawPortfolioData from '../data/portfolioData.json';

class PortfolioService {
  private data: PortfolioData = rawPortfolioData as PortfolioData;

  async getPortfolioData(): Promise<PortfolioData> {
    // Simulated async delay to mirror API response behavior if migrated
    return Promise.resolve(this.data);
  }

  async getEngineerInfo(): Promise<EngineerInfo> {
    return Promise.resolve(this.data.engineer);
  }

  async getExperiences(): Promise<WorkExperience[]> {
    return Promise.resolve(this.data.experiences);
  }

  async getSkillCategories(): Promise<SkillCategory[]> {
    return Promise.resolve(this.data.skillCategories);
  }

  async getEducation(): Promise<EducationItem[]> {
    return Promise.resolve(this.data.education);
  }

  async getCertifications(): Promise<CertificationItem[]> {
    return Promise.resolve(this.data.certifications || []);
  }

  async getServices(): Promise<ServiceItem[]> {
    return Promise.resolve(this.data.services);
  }

  async getLanguages(): Promise<SpokenLanguage[]> {
    return Promise.resolve(this.data.languages || []);
  }

  async getHobbies(): Promise<Hobby[]> {
    return Promise.resolve(this.data.hobbies || []);
  }

  async getProjects(): Promise<Project[]> {
    return Promise.resolve(this.data.projects || []);
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const projects = await this.getProjects();
    return projects.find((p) => p.id === id);
  }
}

export const portfolioService = new PortfolioService();
