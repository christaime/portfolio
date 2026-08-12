import { jsPDF } from 'jspdf';
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
} from '../types';

export interface GenerateCvPdfParams {
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

export const generateCvPdf = ({
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
}: GenerateCvPdfParams): void => {
  const effectiveServiceId = selectedServiceId || (activeService ? activeService.id : 'all');

  const isItemLinked = (linkedServices?: string[]) => {
    if (!effectiveServiceId || effectiveServiceId === 'all') return true;
    if (!linkedServices || linkedServices.length === 0) return true;
    return linkedServices.includes(effectiveServiceId);
  };

  const displayExperiences = experiences.filter((exp) => isItemLinked(exp.linkedServices));
  const displayEducation = education.filter((edu) => isItemLinked(edu.linkedServices));

  // Only include professional certifications in the PDF CV (e.g. Cisco CCNA)
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
  const title =
    activeService && effectiveServiceId !== 'all'
      ? activeService.title
      : engineer?.title || 'Senior Software Engineer (.NET / Java / Angular / DevOps)';
  pdf.text(title, margin, y);

  y += 6;

  // Contact Information Rows (split into 2 rows to prevent horizontal overflow)
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  const contactRow1 = [
    engineer?.email || 'mnchristelle@gmail.com',
    engineer?.phone || '+237 695 282 983',
    engineer?.location || 'Bafoussam, Cameroon',
  ].join('   |   ');
  pdf.text(contactRow1, margin, y);

  y += 4.5;

  const contactRow2 = [
    `LinkedIn: linkedin.com/in/christelle-mamekem-ngueguim`,
    `GitHub: github.com/christaime`,
  ].join('   |   ');
  pdf.text(contactRow2, margin, y);

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
    activeService && effectiveServiceId !== 'all'
      ? `${activeService.description}\n\nKey Scope & Deliverables:\n• ${activeService.features.join('\n• ')}`
      : engineer?.introduction ||
        'Senior Software Engineer with 10+ years of experience designing and delivering enterprise-grade software solutions across .NET C#, Java EE / Spring Boot, Angular, and DevOps CI/CD pipelines.';
  const splitSummary = pdf.splitTextToSize(summaryText, contentWidth);
  checkAddPage(splitSummary.length * 5);
  pdf.text(splitSummary, margin, y);
  y += splitSummary.length * 5 + 6;

  // 2. Technical Skills & Core Competencies
  if (displaySkillCategories.length > 0) {
    drawSectionHeader('Technical Skills & Core Competencies');

    const colWidth = (contentWidth - 6) / 2;
    let startY = y;
    let maxY = y;

    displaySkillCategories.forEach((cat, idx) => {
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
  }

  // 3. Professional Experience
  if (displayExperiences.length > 0) {
    drawSectionHeader('Professional Experience');

    displayExperiences.forEach((exp) => {
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
  }

  // 4. Featured Service Projects
  if (displayProjects && displayProjects.length > 0) {
    drawSectionHeader('Featured Service Projects');

    displayProjects.forEach((proj) => {
      checkAddPage(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(proj.title, margin, y);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      pdf.text(proj.category, pageWidth - margin, y, { align: 'right' });

      y += 4.5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      const splitDesc = pdf.splitTextToSize(proj.description, contentWidth);
      checkAddPage(splitDesc.length * 4);
      pdf.text(splitDesc, margin, y);
      y += splitDesc.length * 4 + 2;

      if (proj.skills && proj.skills.length > 0) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        const skillsStr = `Key Stack: ${proj.skills.join(' • ')}`;
        const splitSkills = pdf.splitTextToSize(skillsStr, contentWidth);
        checkAddPage(splitSkills.length * 4);
        pdf.text(splitSkills, margin, y);
        y += splitSkills.length * 4;
      }

      y += 4;
    });
  }

  // 5. Education & Professional Certifications
  const hasEdu = displayEducation.length > 0;
  const hasCerts = displayCertifications.length > 0;

  if (hasEdu && hasCerts) {
    drawSectionHeader('Education & Certifications');

    const colGap = 12; // 12mm spacing
    const halfWidth = (contentWidth - colGap) / 2;
    let leftY = y;
    let rightY = y;

    // Education Column
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text('EDUCATION', margin, leftY);
    leftY += 6;

    displayEducation.forEach((edu) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.text(edu.degree, margin, leftY);
      leftY += 4.5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`${edu.institution} (${edu.year})`, margin, leftY);
      leftY += 6;
    });

    // Professional Certifications Column
    const rightX = margin + halfWidth + colGap;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text('CERTIFICATIONS', rightX, rightY);
    rightY += 6;

    displayCertifications.forEach((cert) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.text(cert.name, rightX, rightY);
      rightY += 4.5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`${cert.issuer} (${cert.year})`, rightX, rightY);
      rightY += 6;
    });

    y = Math.max(leftY, rightY) + 6;
  } else if (hasEdu) {
    drawSectionHeader('Education');

    displayEducation.forEach((edu) => {
      checkAddPage(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.text(edu.degree, margin, y);
      y += 4.5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`${edu.institution} (${edu.year})`, margin, y);
      y += 6;
    });

    y += 2;
  } else if (hasCerts) {
    drawSectionHeader('Professional Certifications');

    displayCertifications.forEach((cert) => {
      checkAddPage(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
      pdf.text(cert.name, margin, y);
      y += 4.5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`${cert.issuer} (${cert.year})`, margin, y);
      y += 6;
    });

    y += 2;
  }

  // 6. Languages & Hobbies Footer Line
  if (languages.length > 0 || hobbies.length > 0) {
    checkAddPage(10);
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 5;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

    if (languages.length > 0) {
      const langStr = `Languages: ${languages.map((l) => `${l.name} (${l.level})`).join(', ')}`;
      pdf.text(langStr, margin, y);
    }
    if (hobbies.length > 0) {
      const hobbyStr = `Hobbies: ${hobbies.map((h) => h.name).join(', ')}`;
      pdf.text(hobbyStr, pageWidth - margin, y, { align: 'right' });
    }
  }

  // Save PDF
  const fileName = `${
    engineer?.name ? engineer.name.replace(/\s+/g, '_') : 'Christelle_Mamekem_Ngueguim'
  }_CV.pdf`;
  pdf.save(fileName);
};
