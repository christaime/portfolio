import React from 'react';
import {
  EngineerInfo,
  WorkExperience,
  SkillCategory,
  EducationItem,
  CertificationItem,
  SpokenLanguage,
  Hobby,
  ServiceItem,
  Project,
} from '../../types';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  BookOpen,
  Award,
  Briefcase,
  Code,
  FolderGit2,
} from 'lucide-react';

export interface CVPdfPreviewProps {
  engineer: EngineerInfo | null;
  experiences: WorkExperience[];
  skillCategories: SkillCategory[];
  education: EducationItem[];
  certifications: CertificationItem[];
  languages: SpokenLanguage[];
  hobbies: Hobby[];
  activeService?: ServiceItem;
  projects?: Project[];
  selectedServiceId?: string;
  templateTheme?: 'executive' | 'modern' | 'classic';
}

export const CVPdfPreview: React.FC<CVPdfPreviewProps> = ({
  engineer,
  experiences,
  skillCategories,
  education,
  certifications,
  languages,
  hobbies,
  activeService,
  projects = [],
  selectedServiceId = 'all',
  templateTheme = 'executive',
}) => {
  const effectiveServiceId = selectedServiceId || (activeService ? activeService.id : 'all');

  const isItemLinked = (linkedServices?: string[]) => {
    if (!effectiveServiceId || effectiveServiceId === 'all') return true;
    if (!linkedServices || linkedServices.length === 0) return true;
    return linkedServices.includes(effectiveServiceId);
  };

  const displayExperiences = experiences.filter((exp) => isItemLinked(exp.linkedServices));
  const displayEducation = education.filter((edu) => isItemLinked(edu.linkedServices));

  // Only include professional certifications in the PDF preview
  const displayCertifications = certifications.filter((cert) => {
    const isProfessional = cert.category === 'professional' || cert.id === 'cert-cisco-ccna' || (!cert.category && cert.issuer.includes('CISCO'));
    return isProfessional && isItemLinked(cert.linkedServices);
  });

  const displayProjects = projects.filter((proj) => isItemLinked(proj.linkedServices));

  const displaySkillCategories = skillCategories
    .map((cat) => {
      if (
        cat.linkedServices &&
        cat.linkedServices.length > 0 &&
        effectiveServiceId !== 'all' &&
        !cat.linkedServices.includes(effectiveServiceId)
      ) {
        return null;
      }
      const matchingSkills = cat.skills.filter((s) => isItemLinked(s.linkedServices));
      if (matchingSkills.length === 0) return null;
      return { ...cat, skills: matchingSkills };
    })
    .filter((cat): cat is SkillCategory => cat !== null);

  return (
    <div
      id="printable-cv-preview"
      className={`bg-white text-slate-800 p-8 sm:p-12 shadow-2xl rounded-sm border border-slate-200 max-w-4xl mx-auto font-sans leading-relaxed transition-all ${
        templateTheme === 'executive'
          ? 'theme-executive'
          : templateTheme === 'modern'
          ? 'theme-modern'
          : 'theme-classic font-serif'
      }`}
    >
      {/* Header */}
      <header className="border-b-2 border-slate-900 pb-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {engineer?.name || 'Christelle Mamekem Ngueguim'}
            </h1>
            <p className="text-sm font-semibold text-indigo-600 mt-1">
              {activeService && effectiveServiceId !== 'all'
                ? activeService.title
                : engineer?.title || 'Senior Software Engineer (.NET / Java / Angular / DevOps)'}
            </p>
          </div>
        </div>

        {/* Contact Info Rows */}
        <div className="flex flex-col gap-2 text-xs text-slate-600 mt-4 font-mono">
          {/* Row 1: Email, Phone, Location */}
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <a href={`mailto:${engineer?.email || 'mnchristelle@gmail.com'}`} className="hover:underline">
                {engineer?.email || 'mnchristelle@gmail.com'}
              </a>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{engineer?.phone || '+237 695 282 983'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{engineer?.location || 'Bafoussam, Cameroon'}</span>
            </span>
          </div>

          {/* Row 2: LinkedIn and GitHub */}
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4">
            <span className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <a
                href={engineer?.linkedin || 'https://www.linkedin.com/in/christelle-mamekem-ngueguim/'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline font-semibold"
              >
                linkedin.com/in/christelle-mamekem-ngueguim
              </a>
            </span>
            <span className="flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-slate-800 shrink-0" />
              <a
                href={engineer?.github || 'https://github.com/christaime'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-800 hover:underline font-semibold"
              >
                github.com/christaime
              </a>
            </span>
          </div>
        </div>
      </header>

      {/* Executive Summary */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
          <span>Executive Summary</span>
        </h2>
        <p className="text-xs text-slate-700 leading-normal whitespace-pre-line">
          {activeService && effectiveServiceId !== 'all'
            ? `${activeService.description}\n\nKey Deliverables:\n• ${activeService.features.join('\n• ')}`
            : engineer?.introduction ||
              'Senior Software Engineer with 10+ years of expertise in software architecture, microservices, and web applications.'}
        </p>
      </section>

      {/* Skills */}
      {displaySkillCategories.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-3 flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-indigo-600" />
            <span>Technical Skills & Core Competencies</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {displaySkillCategories.map((cat, idx) => (
              <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">{cat.category}</span>
                <p className="text-slate-600 text-[11px]">
                  {cat.skills.map((s) => s.name).join(' • ')}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {displayExperiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-3 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            <span>Professional Experience</span>
          </h2>
          <div className="flex flex-col gap-4">
            {displayExperiences.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                  <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {exp.period} | {exp.location}
                  </span>
                </div>
                <div className="text-indigo-600 font-semibold mb-1">{exp.company}</div>
                <p className="text-slate-700 mb-1.5 leading-relaxed">{exp.description}</p>
                {exp.achievements && (
                  <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5 mb-1.5 pl-1">
                    {exp.achievements.map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies && (
                  <div className="text-[10px] text-slate-500 font-mono">
                    Stack: {exp.technologies.join(' • ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {displayProjects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-3 flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Featured Service Projects</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {displayProjects.map((proj) => (
              <div key={proj.id} className="border border-slate-200 p-2.5 rounded">
                <div className="font-bold text-slate-800">{proj.title}</div>
                <div className="text-indigo-600 text-[10px] font-semibold mb-1">{proj.category}</div>
                <p className="text-slate-600 text-[11px] mb-1.5">{proj.description}</p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Key Stack: {proj.skills.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Professional Certifications Grid */}
      {(displayEducation.length > 0 || displayCertifications.length > 0) && (
        <div className={`grid grid-cols-1 ${displayEducation.length > 0 && displayCertifications.length > 0 ? 'sm:grid-cols-2' : ''} gap-8 mb-6`}>
          {/* Education */}
          {displayEducation.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Education</span>
              </h2>
              <div className="flex flex-col gap-3">
                {displayEducation.map((edu, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="font-bold text-slate-800">{edu.degree}</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">{edu.institution} • {edu.year}</div>
                    {edu.details && <p className="text-slate-500 text-[10px] mt-0.5">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {displayCertifications.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                <span>Professional Certifications</span>
              </h2>
              <div className="flex flex-col gap-3">
                {displayCertifications.map((cert) => (
                  <div key={cert.id} className="text-xs">
                    <div className="font-bold text-slate-800">{cert.name}</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      {cert.issuer} ({cert.year})
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Languages & Hobbies Footer */}
      {(languages.length > 0 || hobbies.length > 0) && (
        <footer className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-2 text-[11px] text-slate-600 font-mono">
          {languages.length > 0 && (
            <div>
              <span className="font-bold text-slate-800">Languages: </span>
              {languages.map((l) => `${l.name} (${l.level})`).join(', ')}
            </div>
          )}
          {hobbies.length > 0 && (
            <div>
              <span className="font-bold text-slate-800">Hobbies: </span>
              {hobbies.map((h) => h.name).join(', ')}
            </div>
          )}
        </footer>
      )}
    </div>
  );
};
