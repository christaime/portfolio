import React from 'react';
import {
  EngineerInfo,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  SkillCategory,
  ProjectItem,
  LanguageItem,
  HobbyItem,
  ServiceItem,
} from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award, Layers, FolderKanban, Heart } from 'lucide-react';

export type FontCalligraphyStyle = 'sans' | 'serif' | 'mono' | 'garamond' | 'modern';

interface CVPdfPreviewProps {
  engineer: EngineerInfo;
  experiences: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  projects?: ProjectItem[];
  skillCategories: SkillCategory[];
  languages?: LanguageItem[];
  hobbies?: HobbyItem[];
  activeService?: ServiceItem;
  selectedServiceId?: string;
  fontStyle?: FontCalligraphyStyle;
}

interface RankedTool {
  name: string;
  level: string;
  years?: string;
  percentage: number;
}

const getLevelPercentage = (level = '', years = ''): number => {
  const l = level.toLowerCase();
  if (l.includes('expert') || years.includes('10') || years.includes('10+')) return 95;
  if (l.includes('advanced') || years.includes('8') || years.includes('7') || years.includes('6')) return 85;
  if (l.includes('intermediate') || years.includes('5') || years.includes('4') || years.includes('3')) return 75;
  return 70;
};

// Curated default fallback tool priority per domain if categories are flat strings
const DOMAIN_DEFAULTS: Record<string, RankedTool[]> = {
  'backend-engineer': [
    { name: 'C# / .NET Core', level: 'Expert', years: '10+ yrs', percentage: 95 },
    { name: 'Java 17+ / Spring Boot', level: 'Advanced', years: '8+ yrs', percentage: 85 },
    { name: 'SQL Server (T-SQL, SSMS)', level: 'Expert', years: '10 yrs', percentage: 95 },
    { name: 'PostgreSQL & Flyway', level: 'Expert', years: '8 yrs', percentage: 90 },
    { name: 'RESTful Web APIs', level: 'Expert', years: '10 yrs', percentage: 95 },
    { name: 'Docker & Microservices', level: 'Expert', years: '6 yrs', percentage: 85 },
    { name: 'Keycloak SSO & JWT', level: 'Advanced', years: '4 yrs', percentage: 80 },
    { name: 'RabbitMQ / ActiveMQ', level: 'Advanced', years: '5 yrs', percentage: 80 },
    { name: 'PEPPOL & UBL 2.1', level: 'Advanced', years: '3 yrs', percentage: 80 },
    { name: 'GitLab CI & CI/CD', level: 'Advanced', years: '5 yrs', percentage: 80 },
  ],
  'frontend-engineer': [
    { name: 'Angular 14 - 18', level: 'Expert', years: '8+ yrs', percentage: 95 },
    { name: 'TypeScript & JavaScript', level: 'Expert', years: '8+ yrs', percentage: 95 },
    { name: 'RxJS & Reactive Signals', level: 'Expert', years: '7 yrs', percentage: 90 },
    { name: 'Tailwind CSS & Material', level: 'Expert', years: '8 yrs', percentage: 95 },
    { name: 'React.js SPA', level: 'Advanced', years: '4 yrs', percentage: 80 },
    { name: 'REST API Integration', level: 'Expert', years: '10 yrs', percentage: 95 },
    { name: 'Cypress E2E Testing', level: 'Advanced', years: '5 yrs', percentage: 80 },
    { name: 'Responsive UI Architecture', level: 'Expert', years: '8 yrs', percentage: 90 },
    { name: 'HTML5 & CSS3 Standard', level: 'Expert', years: '10 yrs', percentage: 95 },
    { name: 'Git & Version Control', level: 'Expert', years: '10 yrs', percentage: 95 },
  ],
  'qa-testing': [
    { name: 'Unit Testing (JUnit, MSTest)', level: 'Expert', years: '8+ yrs', percentage: 95 },
    { name: 'E2E Testing (Cypress, Jest)', level: 'Expert', years: '6 yrs', percentage: 90 },
    { name: 'SonarQube & Quality Gates', level: 'Expert', years: '5 yrs', percentage: 90 },
    { name: 'Postman & REST API Testing', level: 'Expert', years: '8 yrs', percentage: 90 },
    { name: 'Schematron XML Validation', level: 'Advanced', years: '3 yrs', percentage: 85 },
    { name: 'PR Reviews & Dev Coaching', level: 'Expert', years: '5 yrs', percentage: 90 },
    { name: 'Azure DevOps Test Plans', level: 'Advanced', years: '4 yrs', percentage: 80 },
    { name: 'CI/CD Automated Pipelines', level: 'Advanced', years: '5 yrs', percentage: 85 },
    { name: 'Static Code Analysis', level: 'Expert', years: '5 yrs', percentage: 85 },
    { name: 'SQL Server Query Testing', level: 'Expert', years: '8 yrs', percentage: 90 },
  ],
  'sys-infra': [
    { name: 'Docker & Docker Compose', level: 'Expert', years: '6 yrs', percentage: 90 },
    { name: 'Azure DevOps & Pipelines', level: 'Expert', years: '4 yrs', percentage: 85 },
    { name: 'Ansible & VPS Hardening', level: 'Advanced', years: '4 yrs', percentage: 80 },
    { name: 'Linux / VPS & macOS', level: 'Expert', years: '10 yrs', percentage: 95 },
    { name: 'Web Servers (Nginx, IIS)', level: 'Expert', years: '7 yrs', percentage: 85 },
    { name: 'GitLab CI/CD Automation', level: 'Advanced', years: '4 yrs', percentage: 80 },
    { name: 'CISCO CCNA Networking', level: 'Certified', years: '8 yrs', percentage: 85 },
    { name: 'PostgreSQL & MySQL Admin', level: 'Expert', years: '8 yrs', percentage: 90 },
    { name: 'SonarQube Quality Gates', level: 'Advanced', years: '5 yrs', percentage: 80 },
    { name: 'Bash & Shell Scripting', level: 'Advanced', years: '6 yrs', percentage: 80 },
  ],
  all: [
    { name: 'SQL Server', level: 'Expert', years: '10+ yrs', percentage: 95 },
    { name: 'C# / .NET Core', level: 'Expert', years: '10+ yrs', percentage: 95 },
    { name: 'Java 17+', level: 'Advanced', years: '8+ yrs', percentage: 85 },
    { name: 'Angular 14 - 18', level: 'Expert', years: '8+ yrs', percentage: 90 },
    { name: 'PostgreSQL', level: 'Expert', years: '8+ yrs', percentage: 90 },
    { name: 'RESTful APIs', level: 'Expert', years: '10+ yrs', percentage: 95 },
    { name: 'Docker & Compose', level: 'Expert', years: '6 yrs', percentage: 85 },
    { name: 'Azure DevOps & CI/CD', level: 'Advanced', years: '5 yrs', percentage: 80 },
    { name: 'Testing (JUnit, Cypress)', level: 'Expert', years: '8 yrs', percentage: 90 },
    { name: 'Linux / VPS & Nginx', level: 'Expert', years: '8 yrs', percentage: 85 },
  ],
};

const FONT_MAP: Record<FontCalligraphyStyle, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  garamond: "font-['Georgia',_serif]",
  modern: "font-['Trebuchet_MS',_sans-serif]",
};

function extractTopTools(
  skillCategories: SkillCategory[],
  selectedServiceId: string
): RankedTool[] {
  const result: RankedTool[] = [];
  const seen = new Set<string>();

  for (const cat of skillCategories) {
    const list = cat.skills || [];
    for (const item of list) {
      if (typeof item === 'object' && item.name) {
        const linked = item.linkedServices || [];
        const matchesRole =
          selectedServiceId === 'all' ||
          linked.length === 0 ||
          linked.includes(selectedServiceId);

        if (matchesRole && !seen.has(item.name.toLowerCase())) {
          seen.add(item.name.toLowerCase());
          const level = item.level || 'Expert';
          const years = item.years || '';
          result.push({
            name: item.name,
            level,
            years,
            percentage: getLevelPercentage(level, years),
          });
        }
      }
    }
  }

  if (result.length >= 6) {
    return result.slice(0, 10);
  }

  const defaults = DOMAIN_DEFAULTS[selectedServiceId] || DOMAIN_DEFAULTS.all;
  return defaults.slice(0, 10);
}

export const CVPdfPreview: React.FC<CVPdfPreviewProps> = ({
  engineer,
  experiences,
  education,
  certifications,
  projects = [],
  skillCategories,
  languages = [],
  hobbies = [],
  activeService,
  selectedServiceId = 'all',
  fontStyle = 'sans',
}) => {
  const { t } = useLanguage();

  const isTargeted = Boolean(activeService && selectedServiceId !== 'all');
  const displayedTitle = isTargeted && activeService ? activeService.title : engineer.title;
  const displayedSummary =
    isTargeted && activeService
      ? activeService.description || activeService.shortDesc || engineer.introduction || engineer.bio
      : engineer.introduction || engineer.bio;

  const topTools = extractTopTools(skillCategories, selectedServiceId);
  const activeFontClass = FONT_MAP[fontStyle] || 'font-sans';

  return (
    <div
      className={`w-[794px] min-h-[1123px] bg-white text-[#1e293b] ${activeFontClass} text-[10.5px] leading-relaxed flex flex-row overflow-hidden shadow-2xl relative`}
    >
      {/* =========================================================================
          LEFT SIDEBAR RAIL (Profile Photo, Contact, Top 10 Technical Tools, Languages)
          ========================================================================= */}
      <aside className="w-[245px] bg-[#07192d] text-[#d4e4fa] p-4 sm:p-5 flex flex-col gap-3.5 shrink-0 border-r border-[#1b3450]">
        {/* Avatar / Photo */}
        <div className="text-center pt-1">
          <img
            src={engineer.avatar || engineer.avatarUrl || './images/my_picture.png'}
            alt={engineer.name}
            className="w-24 h-24 mx-auto rounded-2xl object-cover border-2 border-[#00a6e0] shadow-md mb-2"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop';
            }}
          />
          <h2 className="text-sm font-bold text-white tracking-tight leading-tight">
            {engineer.name}
          </h2>
          <p className="text-[9.5px] font-mono text-[#00a6e0] mt-0.5 leading-snug">
            {displayedTitle}
          </p>
        </div>

        {/* Contact Info */}
        <div className="border-t border-[#1b3450] pt-2.5">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00a6e0] pb-1 mb-1.5">
            {t('sidebar.contact', 'Contact Details')}
          </h3>
          <div className="space-y-1 text-[9px] text-[#9cb2cd]">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-[#00a6e0] shrink-0" />
              <span>{engineer.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-[#00a6e0] shrink-0" />
              <span className="truncate">{engineer.email}</span>
            </div>
            {engineer.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-[#00a6e0] shrink-0" />
                <span className="font-mono text-white">{engineer.phone}</span>
              </div>
            )}
            {engineer.github && (
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-[#00a6e0] shrink-0" />
                <span className="font-mono text-slate-300">github.com/christaime</span>
              </div>
            )}
          </div>
        </div>

        {/* Technical Tools & Experience Level Bars (At most 10 tools) */}
        <div className="border-t border-[#1b3450] pt-2.5">
          <div className="flex items-center justify-between pb-0.5 mb-2">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00a6e0] flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-[#00a6e0]" />
              <span>{t('cv.techStack.title', 'Key Technical Tools')}</span>
            </h3>
            <span className="text-[8px] font-mono text-[#9cb2cd]">Top {topTools.length}</span>
          </div>

          <div className="space-y-1.5">
            {topTools.map((tool, idx) => {
              const isExpert = tool.level.toLowerCase().includes('expert') || tool.percentage >= 95;
              return (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-[8.5px]">
                    <span className="font-semibold text-white truncate max-w-[130px]" title={tool.name}>
                      {tool.name}
                    </span>
                    <span className={`text-[8px] font-mono ${isExpert ? 'text-[#34d399]' : 'text-[#38bdf8]'}`}>
                      {tool.level} {tool.years ? `(${tool.years})` : ''}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-[#0f2847] rounded-full overflow-hidden border border-[#1b3450]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isExpert
                          ? 'bg-gradient-to-r from-[#10b981] to-[#34d399]'
                          : 'bg-gradient-to-r from-[#00a6e0] to-[#38bdf8]'
                      }`}
                      style={{ width: `${tool.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Spoken Languages and Interests/Hobbies */}
        {((languages && languages.length > 0) || (hobbies && hobbies.length > 0)) && (
          <div className="mt-auto pt-2 flex flex-col gap-2.5">
            {/* Spoken Languages */}
            {languages && languages.length > 0 && (
              <div className="border-t border-[#1b3450] pt-2">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00a6e0] mb-1 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-[#00a6e0]" />
                  <span>{t('cv.languagesHobbies.languagesTitle', 'Languages')}</span>
                </h3>
                <div className="space-y-1 text-[8.5px] text-[#9cb2cd]">
                  {languages.map((lang, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-white font-medium flex items-center gap-1.5">
                        {lang.flag && <span className="text-[9px] leading-none">{lang.flag}</span>}
                        <span>{lang.name}</span>
                      </span>
                      <span className="text-[8px] font-mono text-[#38bdf8]">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hobbies / Interests - Placed right after Languages at the bottom of the side zone */}
            {hobbies && hobbies.length > 0 && (
              <div className="border-t border-[#1b3450] pt-2">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00a6e0] mb-1 flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-[#00a6e0]" />
                  <span>{t('cv.languagesHobbies.hobbiesTitle', 'Interests & Hobbies')}</span>
                </h3>
                <div className="space-y-1 text-[8.5px] text-[#9cb2cd]">
                  {hobbies.map((hobby, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-white font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00a6e0] shrink-0" />
                        <span>{hobby.name}</span>
                      </span>
                      {hobby.category && (
                        <span className="text-[7.5px] font-mono text-[#38bdf8] truncate max-w-[95px]">
                          {hobby.category}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* =========================================================================
          RIGHT MAIN ZONE (Header, Summary, Experience, Projects, Education, Certs)
          Framed with clean double white layer border styling
          ========================================================================= */}
      <main className="flex-1 p-6 sm:p-7 flex flex-col gap-4 justify-start bg-white text-[#1e293b] border-l border-[#e2e8f0]">
        {/* Top Header (Name + Title) */}
        <div className="border-b-2 border-[#0f172a] pb-3 mb-1">
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight leading-none">
            {engineer.name}
          </h1>
          <div className="text-xs font-bold text-[#0369a1] mt-1.5 tracking-wide">
            {displayedTitle}
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-1.5">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#cbd5e1] pb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#0369a1]" />
            <span>{t('cv.summary.title', 'Professional Summary')}</span>
          </h2>
          <p className="text-[9px] text-[#334155] leading-relaxed text-justify">
            {displayedSummary}
          </p>
        </div>

        {/* Work Experience */}
        <div className="space-y-2">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#cbd5e1] pb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#0369a1]" />
            <span>{t('cv.experience.title', 'Work Experience')}</span>
          </h2>
          <div className="space-y-3">
            {experiences.slice(0, 3).map((exp) => (
              <div key={exp.id} className="border-l-2 border-[#0284c7]/50 pl-2.5 space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[#0f172a] text-[10px]">{exp.role}</span>
                  <span className="text-[8.5px] text-[#64748b] font-mono font-medium">{exp.period}</span>
                </div>
                <div className="text-[9px] font-bold text-[#075985]">
                  {exp.company} • {exp.location}
                </div>
                <p className="text-[8.5px] text-[#334155] leading-snug">
                  {exp.description || exp.summary}
                </p>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-[8px] text-[#475569] space-y-0.5 pt-0.5">
                    {exp.achievements.slice(0, 2).map((ach, idx) => (
                      <li key={idx}>{ach}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {exp.technologies.slice(0, 7).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-1 py-0.2 bg-[#f1f5f9] text-[#334155] text-[7.5px] font-mono rounded border border-[#e2e8f0]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Featured Projects / Architecture Deliverables */}
        {projects && projects.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#cbd5e1] pb-1 flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5 text-[#0369a1]" />
              <span>{t('cv.projects.title', 'Key Projects & Deliverables')}</span>
            </h2>
            <div className="space-y-2">
              {projects.slice(0, 2).map((p) => (
                <div key={p.id} className="p-2 rounded bg-[#f8fafc] border border-[#e2e8f0]">
                  <div className="flex justify-between items-baseline font-bold text-[9px] text-[#0f172a]">
                    <span>{p.title}</span>
                    <span className="text-[8px] font-mono text-[#0369a1]">{p.category}</span>
                  </div>
                  <p className="text-[8px] text-[#475569] mt-1 leading-normal">{p.description || p.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certifications in bottom grid */}
        <div className="grid grid-cols-2 gap-4 pt-2.5 mt-auto border-t border-[#e2e8f0]">
          {/* Education & Academic Training */}
          <div className="space-y-1.5">
            <h2 className="text-[9.5px] font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#cbd5e1] pb-1 flex items-center gap-1.5">
              <GraduationCap className="w-3 h-3 text-[#0369a1]" />
              <span>{t('cv.education.title', 'Education & Academic Training')}</span>
            </h2>
            <div className="space-y-1.5">
              {education.map((edu, idx) => (
                <div key={idx} className="text-[8px] leading-snug">
                  <div className="font-bold text-[#0f172a]">{edu.degree}</div>
                  <div className="text-[#475569]">
                    {edu.institution} ({edu.year})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Accreditations */}
          <div className="space-y-1.5">
            <h2 className="text-[9.5px] font-bold uppercase tracking-wider text-[#0f172a] border-b border-[#cbd5e1] pb-1 flex items-center gap-1.5">
              <Award className="w-3 h-3 text-[#0369a1]" />
              <span>{t('cv.certifications.title', 'Certifications & Accreditations')}</span>
            </h2>
            <div className="space-y-1.5">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-[8px] leading-snug">
                  <div className="font-bold text-[#0f172a]">{cert.name || cert.title}</div>
                  <div className="text-[#0369a1] font-medium">
                    {cert.issuer} • {cert.year || cert.issueDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
