export interface EngineerInfo {
  name: string;
  title: string;
  role?: string;
  tagline?: string;
  bio?: string;
  introduction?: string;
  email: string;
  phone?: string;
  location: string;
  status?: string;
  remoteAvailable?: boolean;
  github?: string;
  linkedin?: string;
  website?: string;
  stackoverflow?: string;
  avatar?: string;
  avatarUrl?: string;
  metrics?: {
    label: string;
    value: string;
    description: string;
  }[];
  featuredServices?: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  type?: 'full-time' | 'contract' | 'consulting' | 'freelance';
  category?: 'advisory' | 'engineering' | 'leadership';
  summary?: string;
  description?: string;
  achievements?: string[];
  technologies?: string[];
}

export type WorkExperience = ExperienceItem;

export interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  location?: string;
  year: string;
  description?: string;
  details?: string;
  honors?: string;
}

export interface CertificationItem {
  id: string;
  title?: string;
  name?: string;
  issuer: string;
  issueDate?: string;
  year?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  badgeUrl?: string;
  icon?: string;
}

export interface TrainingItem {
  id: string;
  title: string;
  provider: string;
  year: string;
  description?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  summary?: string;
  longDescription?: string;
  skills: string[];
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  sourceUrl?: string;
  achievements?: string[];
  featured?: boolean;
}

export type Project = ProjectItem;

export interface LanguageItem {
  name: string;
  level: string;
  proficiency?: number;
  flag?: string;
}

export type SpokenLanguage = LanguageItem;

export interface HobbyItem {
  name: string;
  icon?: string;
  category?: string;
  description?: string;
}

export type Hobby = HobbyItem;

export interface SkillItem {
  name: string;
  level?: string;
  years?: string;
  linkedServices?: string[];
}

export interface SkillCategory {
  category: string;
  skills?: (string | SkillItem)[];
  items?: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle?: string;
  shortDesc?: string;
  description: string;
  deliverables?: string[];
  features?: string[];
  technologies?: string[];
  estimatedDuration?: string;
  baseRate?: string;
  icon: string;
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export interface TechStackCategory {
  category: string;
  items: string[];
}

export interface PortfolioData {
  engineer: EngineerInfo;
  experiences: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  trainings: TrainingItem[];
  projects: ProjectItem[];
  languages: LanguageItem[];
  hobbies: HobbyItem[];
  services: ServiceItem[];
  techStack: TechStackCategory[];
}
