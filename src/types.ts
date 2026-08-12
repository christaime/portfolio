export type Language = 'en' | 'fr';

export type NavTab = 'contact' | 'cv' | 'services' | 'blog' | 'projects';

export interface EngineerInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  remoteAvailable: boolean;
  avatarUrl?: string;
  introduction: string;
  github: string;
  linkedin: string;
  stackoverflow: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
  linkedServices?: string[];
}

export interface SkillItem {
  name: string;
  level: string;
  years: string;
  linkedServices?: string[];
}

export interface SkillCategory {
  category: string;
  skills: SkillItem[];
  linkedServices?: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  details: string;
  linkedServices?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
  credentialUrl?: string;
  category?: 'professional' | 'online_skill' | 'badge' | string;
  icon?: string;
  badgeColor?: string;
  linkedServices?: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  shortDesc: string;
  description: string;
  features: string[];
  estimatedDuration: string;
  baseRate: string;
}

export interface SpokenLanguage {
  name: string;
  level: string; // e.g. "Native / Full Professional", "Intermediate / Professional"
  flag: string;
}

export interface Hobby {
  name: string;
  category: string;
  icon: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  skills: string[];
  demoUrl?: string;
  sourceUrl?: string;
  featured?: boolean;
  image?: string;
  linkedServices?: string[];
}

export interface PortfolioData {
  engineer: EngineerInfo;
  experiences: WorkExperience[];
  skillCategories: SkillCategory[];
  education: EducationItem[];
  certifications: CertificationItem[];
  services: ServiceItem[];
  languages: SpokenLanguage[];
  hobbies: Hobby[];
  projects: Project[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  readTime: string;
  category: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
