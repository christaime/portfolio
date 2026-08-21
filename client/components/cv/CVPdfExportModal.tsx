import React, { useState } from 'react';
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
import { generateCvPdf } from '../../utils/cvPdfGenerator';
import { X, FileDown, Loader2, Type } from 'lucide-react';
import { CVPdfPreview, FontCalligraphyStyle } from './CVPdfPreview';
import { useLanguage } from '../../context/LanguageContext';

interface CVPdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

const CALLIGRAPHY_OPTIONS: { id: FontCalligraphyStyle; label: string; preview: string }[] = [
  { id: 'sans', label: 'Modern Sans', preview: 'Clean & Contemporary' },
  { id: 'serif', label: 'Executive Serif', preview: 'Formal & Authoritative' },
  { id: 'mono', label: 'Tech Mono', preview: 'Engineering Precision' },
  { id: 'garamond', label: 'Classic Editorial', preview: 'Elegant & Literary' },
];

export const CVPdfExportModal: React.FC<CVPdfExportModalProps> = ({
  isOpen,
  onClose,
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
}) => {
  const { t } = useLanguage();
  const [exporting, setExporting] = useState(false);
  const [fontStyle, setFontStyle] = useState<FontCalligraphyStyle>('sans');

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setExporting(true);
      const safeName = engineer.name.replace(/\s+/g, '_');
      const perspectiveSuffix =
        activeService && selectedServiceId !== 'all'
          ? `_${activeService.title.replace(/[^a-zA-Z0-9]/g, '_')}`
          : '';
      const filename = `${safeName}_CV${perspectiveSuffix}.pdf`;

      await generateCvPdf('cv-pdf-render-target', filename);
      onClose();
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#051424] border border-[#1b3450] rounded-2xl max-w-5xl w-full p-4 sm:p-6 relative shadow-2xl max-h-[96vh] flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1b3450] gap-3">
          <div className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-[#34d399]" />
            <div>
              <h3 className="text-base font-bold text-[#d4e4fa]">
                {t('pdfModal.title', 'Curriculum Vitae Preview & Export')}
              </h3>
              <p className="text-xs text-[#9cb2cd]">
                {activeService && selectedServiceId !== 'all' ? (
                  <span className="text-[#00a6e0] font-mono">
                    {activeService.title}
                  </span>
                ) : (
                  t('pdfModal.subtitle', 'High-fidelity printable format tailored for enterprise technical evaluation.')
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-[#34d399] hover:bg-[#10b981] text-[#051424] text-xs font-bold rounded-lg transition-colors shadow-md disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('pdfModal.generating', 'Generating PDF...')}</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>{t('pdfModal.downloadBtn', 'Download PDF')}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              aria-label={t('common.close', 'Close')}
              className="p-1.5 text-[#9cb2cd] hover:text-[#d4e4fa] rounded-lg hover:bg-[#0e2742]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calligraphy & Typography Style Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-2 px-3 bg-[#0a223a]/70 rounded-xl border border-[#1b3450]/70 mt-2">
          <div className="flex items-center gap-2 text-xs text-[#d4e4fa] font-medium">
            <Type className="w-4 h-4 text-[#00a6e0]" />
            <span>Calligraphy & Typography:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CALLIGRAPHY_OPTIONS.map((opt) => {
              const isActive = fontStyle === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setFontStyle(opt.id)}
                  className={`px-3 py-1 text-xs rounded-lg transition-all border ${
                    isActive
                      ? 'bg-[#00a6e0] text-[#051424] font-bold border-[#38bdf8] shadow-sm'
                      : 'bg-[#0e2742] text-[#9cb2cd] hover:text-white border-[#1b3450] hover:bg-[#15385e]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* PDF Document Preview Canvas Container with Double White Layer Effect */}
        <div className="overflow-auto flex-1 p-4 sm:p-6 bg-[#020b14] rounded-xl border border-[#1b3450]/60 flex justify-center items-start my-2.5">
          {/* Double White Layer Stack Wrapper */}
          <div className="relative">
            {/* Layer 2: Deep Underlay White Sheet (Stacked Page 2 effect) */}
            <div className="absolute -inset-2.5 top-3 left-4 bg-white/20 rounded border border-white/30 shadow-2xl pointer-events-none transform translate-x-3 translate-y-3" />
            {/* Layer 1: Middle Underlay White Sheet (Stacked Page 1 effect) */}
            <div className="absolute -inset-1.5 top-1.5 left-2 bg-white/50 rounded border border-white/50 shadow-xl pointer-events-none transform translate-x-1.5 translate-y-1.5" />

            {/* Main Document Layer */}
            <div
              id="cv-pdf-render-target"
              className="relative w-[794px] min-h-[1123px] bg-white text-slate-900 shadow-2xl transition-all origin-top rounded-sm"
            >
              <CVPdfPreview
                engineer={engineer}
                experiences={experiences}
                education={education}
                certifications={certifications}
                projects={projects}
                skillCategories={skillCategories}
                languages={languages}
                hobbies={hobbies}
                activeService={activeService}
                selectedServiceId={selectedServiceId}
                fontStyle={fontStyle}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-2.5 border-t border-[#1b3450] gap-3">
          <span className="text-xs font-mono text-[#00a6e0]">
            {t('pdfModal.pageNotice', 'Standard A4 Format • Vector Output')}
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#0e2742] hover:bg-[#15385e] text-[#d4e4fa] text-xs font-semibold rounded-lg border border-[#1b3450]"
            >
              {t('verification.cancel', 'Cancel')}
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-5 py-2 bg-[#34d399] hover:bg-[#10b981] text-[#051424] text-xs font-bold rounded-lg transition-colors shadow-md disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('pdfModal.generating', 'Generating PDF Document...')}</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>{t('pdfModal.downloadBtn', 'Download PDF')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
