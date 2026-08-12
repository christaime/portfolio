import React, { useState } from 'react';
import html2canvas from 'html2canvas';
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
} from '../../types';
import {
  X,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { generateCvPdf } from '../../utils/cvPdfGenerator';
import { CVPdfPreview } from './CVPdfPreview';

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
  projects?: Project[];
  selectedServiceId?: string;
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
  projects = [],
  selectedServiceId = 'all',
}) => {
  const [templateTheme, setTemplateTheme] = useState<'executive' | 'modern' | 'classic'>('executive');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    try {
      setIsGenerating(true);
      generateCvPdf({
        engineer,
        experiences,
        skillCategories,
        education,
        certifications,
        languages,
        hobbies,
        activeService,
        projects,
        selectedServiceId,
        templateTheme,
      });
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  const handleImageCaptureExport = async () => {
    try {
      setIsGenerating(true);
      const previewEl = document.getElementById('printable-cv-preview');
      if (!previewEl) return;

      const canvas = await html2canvas(previewEl, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${
        engineer?.name ? engineer.name.replace(/\s+/g, '_') : 'Christelle_Mamekem_Ngueguim'
      }_Visual_CV.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('Failed html2canvas capture:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                PDF CV Document Generator
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tailored for {selectedServiceId === 'all' ? 'Full Profile' : activeService?.title || 'Selected Service'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Actions Toolbar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Template Theme Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Style Theme:</span>
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setTemplateTheme('executive')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  templateTheme === 'executive'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Executive
              </button>
              <button
                onClick={() => setTemplateTheme('modern')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  templateTheme === 'modern'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Modern Clean
              </button>
              <button
                onClick={() => setTemplateTheme('classic')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  templateTheme === 'classic'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Classic Serif
              </button>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Building PDF...' : 'Download Vector PDF'}</span>
            </button>

            <button
              onClick={handleImageCaptureExport}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all"
              title="Alternative export via visual rendering"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Visual Capture</span>
            </button>

            <button
              onClick={handleBrowserPrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Preview */}
        <div className="p-4 sm:p-8 overflow-y-auto max-h-[70vh] bg-slate-950/60">
          <CVPdfPreview
            engineer={engineer}
            experiences={experiences}
            skillCategories={skillCategories}
            education={education}
            certifications={certifications}
            languages={languages}
            hobbies={hobbies}
            activeService={activeService}
            projects={projects}
            selectedServiceId={selectedServiceId}
            templateTheme={templateTheme}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Clean vector layout, multi-page breaks, and professional Cisco certifications.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
