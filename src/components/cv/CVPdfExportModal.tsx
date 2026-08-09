import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  EngineerInfo,
  WorkExperience,
  SkillCategory,
  EducationItem,
  CertificationItem,
  SpokenLanguage,
  Hobby,
  ServiceItem,
} from '../../types';
import {
  X,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  Code,
} from 'lucide-react';

interface CVPdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  engineer: EngineerInfo | null;
  experiences: WorkExperience[];
  skillCategories: SkillCategory[];
  education: EducationItem[];
  certifications: CertificationItem[];
  languages: SpokenLanguage[];
  hobbies: Hobby[];
  activeService?: ServiceItem;
}

export const CVPdfExportModal: React.FC<CVPdfExportModalProps> = ({
  isOpen,
  onClose,
  engineer,
  experiences,
  skillCategories,
  education,
  certifications,
  languages,
  hobbies,
  activeService,
}) => {
  const [templateTheme, setTemplateTheme] = useState<'executive' | 'modern' | 'classic'>('executive');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
      const margin = 15;
      const contentWidth = pageWidth - margin * 2; // 180mm
      let y = margin;

      // Theme Color Palette
      const primaryColor =
        templateTheme === 'executive'
          ? [15, 23, 42] // Slate 900
          : templateTheme === 'modern'
          ? [30, 27, 75] // Indigo 950
          : [24, 24, 27]; // Zinc 900

      const accentColor =
        templateTheme === 'executive'
          ? [37, 99, 235] // Blue 600
          : templateTheme === 'modern'
          ? [79, 70, 229] // Indigo 600
          : [82, 82, 91]; // Zinc 600

      const textColor = [51, 65, 85]; // Slate 700
      const lightBg = [248, 250, 252]; // Slate 50

      const checkAddPage = (requiredHeight: number) => {
        if (y + requiredHeight > pageHeight - margin) {
          pdf.addPage();
          y = margin;
          // Add subtle top border on new page
          pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
          pdf.setLineWidth(1);
          pdf.line(margin, margin - 5, pageWidth - margin, margin - 5);
        }
      };

      // Header Bar Top Border
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(0, 0, pageWidth, 5, 'F');

      y += 2;

      // Engineer Name
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      const name = engineer?.name || 'Christelle Mamekem Ngueguim';
      pdf.text(name, margin, y + 8);

      y += 14;

      // Title & Active Service
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      const title = activeService
        ? `${engineer?.title || 'Senior Software Engineer'} • (${activeService.title})`
        : engineer?.title || 'Senior Software Engineer (.NET / Java / Angular / DevOps)';
      pdf.text(title, margin, y);

      y += 6;

      // Contact Information Row
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      const contactInfo = [
        engineer?.email || 'mnchristelle@gmail.com',
        engineer?.phone || '+237 695 282 983',
        engineer?.location || 'Limbé, Cameroon',
        'GitHub Profile',
      ].join('   |   ');
      pdf.text(contactInfo, margin, y);

      y += 6;

      // Divider Line
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);

      y += 8;

      // Section Helper
      const drawSectionHeader = (titleText: string) => {
        checkAddPage(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text(titleText.toUpperCase(), margin, y);

        y += 2;
        pdf.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
        pdf.setLineWidth(0.75);
        pdf.line(margin, y, margin + 40, y);

        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.25);
        pdf.line(margin + 40, y, pageWidth - margin, y);

        y += 6;
      };

      // 1. Executive Summary
      drawSectionHeader('Executive Summary');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);

      const summaryText =
        engineer?.introduction ||
        'Senior Software Engineer with 12+ years of experience designing and delivering enterprise-grade software solutions across .NET C#, Java EE / Spring Boot, Angular, and DevOps CI/CD pipelines.';
      const splitSummary = pdf.splitTextToSize(summaryText, contentWidth);
      checkAddPage(splitSummary.length * 5);
      pdf.text(splitSummary, margin, y);
      y += splitSummary.length * 5 + 6;

      // 2. Technical Skills & Core Competencies
      drawSectionHeader('Technical Skills & Core Competencies');

      const colWidth = (contentWidth - 6) / 2;
      let startY = y;
      let maxY = y;

      skillCategories.forEach((cat, idx) => {
        const isRight = idx % 2 === 1;
        const currentX = isRight ? margin + colWidth + 6 : margin;
        let currentY = isRight ? startY : y;

        const skillsStr = cat.skills.map((s) => s.name).join(', ');
        const splitSkills = pdf.splitTextToSize(skillsStr, colWidth - 6);
        const boxHeight = 8 + splitSkills.length * 4;

        if (currentY + boxHeight > pageHeight - margin) {
          pdf.addPage();
          y = margin;
          startY = margin;
          currentY = margin;
        }

        // Draw Light Box
        pdf.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
        pdf.setDrawColor(226, 232, 240);
        pdf.roundedRect(currentX, currentY, colWidth, boxHeight, 1.5, 1.5, 'FD');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text(cat.category, currentX + 3, currentY + 5);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8.5);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(splitSkills, currentX + 3, currentY + 9);

        const nextY = currentY + boxHeight + 4;
        if (isRight) {
          startY = nextY;
          if (nextY > maxY) maxY = nextY;
        } else {
          y = nextY;
          if (nextY > maxY) maxY = nextY;
        }
      });

      y = maxY + 4;

      // 3. Professional Experience
      drawSectionHeader('Professional Experience');

      experiences.forEach((exp) => {
        const titleLine = `${exp.role}  —  ${exp.company}`;
        const periodLine = `${exp.period} | ${exp.location}`;

        checkAddPage(18);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text(titleLine, margin, y);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        pdf.text(periodLine, pageWidth - margin, y, { align: 'right' });

        y += 5;

        // Description
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        const splitDesc = pdf.splitTextToSize(exp.description, contentWidth);
        checkAddPage(splitDesc.length * 4.5);
        pdf.text(splitDesc, margin, y);
        y += splitDesc.length * 4.5 + 2;

        // Achievements
        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.forEach((ach) => {
            const splitAch = pdf.splitTextToSize(`• ${ach}`, contentWidth - 4);
            checkAddPage(splitAch.length * 4);
            pdf.text(splitAch, margin + 4, y);
            y += splitAch.length * 4;
          });
        }

        // Technologies
        if (exp.technologies && exp.technologies.length > 0) {
          y += 1;
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(100, 116, 139);
          const techStr = `Technologies: ${exp.technologies.join(' • ')}`;
          const splitTech = pdf.splitTextToSize(techStr, contentWidth);
          checkAddPage(splitTech.length * 4);
          pdf.text(splitTech, margin, y);
          y += splitTech.length * 4;
        }

        y += 5;
      });

      // 4. Education & Certifications (Side-by-side)
      drawSectionHeader('Education & Certifications');

      const halfWidth = (contentWidth - 8) / 2;
      let leftY = y;
      let rightY = y;

      // Education Column
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text('EDUCATION', margin, leftY);
      leftY += 5;

      education.forEach((edu) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(edu.degree, margin, leftY);
        leftY += 4;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        pdf.text(`${edu.institution} (${edu.year})`, margin, leftY);
        leftY += 6;
      });

      // Certifications Column
      const rightX = margin + halfWidth + 8;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text('CERTIFICATIONS', rightX, rightY);
      rightY += 5;

      certifications.forEach((cert) => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(cert.name, rightX, rightY);
        rightY += 4;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        pdf.text(`${cert.issuer} (${cert.year})`, rightX, rightY);
        rightY += 6;
      });

      y = Math.max(leftY, rightY) + 4;

      // 5. Languages & Hobbies Footer Line
      checkAddPage(10);
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 5;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      const langStr = `Languages: ${languages.map((l) => `${l.name} (${l.level})`).join(', ')}`;
      const hobbyStr = `Hobbies: ${hobbies.map((h) => h.name).join(', ')}`;

      pdf.text(langStr, margin, y);
      pdf.text(hobbyStr, pageWidth - margin, y, { align: 'right' });

      // Save PDF
      const fileName = `${
        engineer?.name ? engineer.name.replace(/\s+/g, '_') : 'Christelle_Mamekem_Ngueguim'
      }_CV.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-surface-container border border-outline-variant rounded-2xl max-w-5xl w-full my-auto flex flex-col max-h-[92vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-outline-variant/60 flex flex-wrap items-center justify-between gap-4 bg-surface-container-high shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-secondary-container text-on-secondary-container rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-headline-sm text-lg sm:text-xl text-on-surface font-bold">
                Export CV as PDF Document
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant">
                Predefined print template with zero page clutter or web navigation.
              </p>
            </div>
          </div>

          {/* Template Theme Selector & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-surface rounded-lg p-1 border border-outline-variant/60 text-xs font-label-caps">
              <button
                onClick={() => setTemplateTheme('executive')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  templateTheme === 'executive'
                    ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Executive Navy
              </button>
              <button
                onClick={() => setTemplateTheme('modern')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  templateTheme === 'modern'
                    ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Modern Clean
              </button>
              <button
                onClick={() => setTemplateTheme('classic')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  templateTheme === 'classic'
                    ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Classic Mono
              </button>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-label-caps text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              id="download-pdf-confirm-btn"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handleBrowserPrint}
              className="bg-surface border border-outline-variant hover:border-secondary-container text-on-surface font-label-caps text-xs px-3 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print via browser"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body Preview */}
        <div className="p-4 sm:p-8 overflow-y-auto flex justify-center bg-slate-900/40 custom-scrollbar">
          {/* Printable A4 Canvas Wrapper */}
          <div
            id="cv-pdf-template-content"
            className={`w-full max-w-[210mm] bg-white text-slate-900 p-8 sm:p-10 shadow-2xl font-sans rounded-sm text-left ${
              templateTheme === 'executive'
                ? 'border-t-8 border-slate-900'
                : templateTheme === 'modern'
                ? 'border-t-8 border-indigo-700'
                : 'border-t-8 border-slate-700'
            }`}
            style={{ minHeight: '297mm' }}
          >
            {/* Header Section */}
            <header className="border-b border-slate-200 pb-6 mb-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {engineer?.name || 'Christelle Mamekem Ngueguim'}
                  </h1>
                  <p className="text-base font-semibold text-indigo-700 mt-1">
                    {activeService
                      ? `${engineer?.title || 'Senior Software Engineer'} • (${activeService.title})`
                      : engineer?.title || 'Senior Software Engineer (.NET / Java / Angular / DevOps)'}
                  </p>
                </div>
                {activeService && (
                  <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-mono px-3 py-1 rounded">
                    Targeted Offer: {activeService.title}
                  </div>
                )}
              </div>

              {/* Contact Info Row */}
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-600 mt-4 font-mono">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {engineer?.email || 'mnchristelle@gmail.com'}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {engineer?.phone || '+237 695 282 983'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {engineer?.location || 'Limbé, Cameroon'}
                </span>
                {engineer?.github && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    GitHub
                  </span>
                )}
              </div>
            </header>

            {/* Profile Summary */}
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                <span>Executive Summary</span>
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                {engineer?.introduction ||
                  'Senior Software Engineer with 12+ years of experience designing and delivering enterprise-grade software solutions across .NET C#, Java EE / Spring Boot, Angular, and DevOps CI/CD pipelines.'}
              </p>
            </section>

            {/* Tech Stack Summary */}
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-3 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-indigo-600" />
                <span>Technical Skills & Core Competencies</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skillCategories.map((cat, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
                    <div className="font-semibold text-slate-800 text-[11px] mb-1">{cat.category}</div>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-white text-slate-700 border border-slate-300 text-[10px] font-mono px-1.5 py-0.5 rounded"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Work Experience */}
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-3 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                <span>Professional Experience</span>
              </h2>
              <div className="flex flex-col gap-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between items-baseline flex-wrap">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {exp.role} <span className="font-normal text-slate-600">| {exp.company}</span>
                      </h3>
                      <span className="font-mono text-[11px] text-slate-500">
                        {exp.period} ({exp.location})
                      </span>
                    </div>
                    <p className="text-slate-700 text-xs mt-1 mb-1.5">{exp.description}</p>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 pl-1">
                        {exp.achievements.map((ach, aIdx) => (
                          <li key={aIdx}>{ach}</li>
                        ))}
                      </ul>
                    )}
                    {exp.technologies && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {exp.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-slate-100 text-slate-600 text-[9px] font-mono px-1.5 py-0.2 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Education & Certifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Education */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Education</span>
                </h2>
                <div className="flex flex-col gap-2">
                  {education.map((edu, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="font-bold text-slate-800">{edu.degree}</div>
                      <div className="text-slate-600 text-[11px]">{edu.institution} • {edu.year}</div>
                      {edu.details && <p className="text-slate-500 text-[10px]">{edu.details}</p>}
                    </div>
                  ))}
                </div>
              </section>

              {/* Certifications */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Certifications</span>
                </h2>
                <div className="flex flex-col gap-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="text-xs">
                      <div className="font-bold text-slate-800">{cert.name}</div>
                      <div className="text-slate-600 text-[11px]">
                        {cert.issuer} ({cert.year})
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Languages & Hobbies */}
            <section className="pt-2 border-t border-slate-200 flex flex-wrap justify-between gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-700 mr-2">Spoken Languages:</span>
                {languages.map((l) => `${l.name} (${l.level})`).join(' • ')}
              </div>
              <div>
                <span className="font-bold text-slate-700 mr-2">Hobbies:</span>
                {hobbies.map((h) => h.name).join(' • ')}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
