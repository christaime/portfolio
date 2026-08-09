import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { EngineerInfo, ServiceItem } from '../../types';
import {
  MapPin,
  Mail,
  Download,
  Send,
  Wrench,
  LayoutGrid,
  CheckCircle2,
  Code,
  Cloud,
  Activity,
  User,
} from 'lucide-react';

interface CVSidebarProps {
  engineer: EngineerInfo | null;
  services: ServiceItem[];
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;
  isExporting: boolean;
  handleExportCV: () => void;
  onNavigateContact: () => void;
}

export const CVSidebar: React.FC<CVSidebarProps> = ({
  engineer,
  services,
  selectedServiceId,
  setSelectedServiceId,
  isExporting,
  handleExportCV,
  onNavigateContact,
}) => {
  const { t } = useLanguage();

  const renderServiceIcon = (iconName?: string) => {
    switch (iconName) {
      case 'code':
        return <Code className="w-4 h-4 shrink-0" />;
      case 'cloud':
        return <Cloud className="w-4 h-4 shrink-0" />;
      case 'speed':
        return <Activity className="w-4 h-4 shrink-0" />;
      case 'groups':
        return <User className="w-4 h-4 shrink-0" />;
      default:
        return <Wrench className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto custom-scrollbar pr-0.5">
      {/* Top Profile & Availability Card */}
      <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
        {/* Avatar Picture with Availability Pulse Dot */}
        <div className="relative mb-4">
          <img
            src={engineer?.avatarUrl || '/avatar.jpg'}
            alt={engineer?.name || 'Christelle Mamekem Ngueguim'}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== window.location.origin + '/avatar.jpg') {
                target.src = '/avatar.jpg';
              }
            }}
            className="w-28 h-28 rounded-full object-cover border-2 border-secondary-container shadow-md bg-surface-container-high"
          />
          <span className="absolute bottom-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-surface"></span>
          </span>
        </div>

        <h2 className="font-headline-sm text-xl text-on-surface font-bold">
          {engineer?.name || 'Christelle Mamekem Ngueguim'}
        </h2>
        <p className="font-body-md text-sm text-secondary-container font-semibold mt-0.5">
          {engineer?.title || 'Senior Software Engineer'}
        </p>

        {/* Availability Status Badge */}
        <div className="mt-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-code-md text-xs px-3 py-1.5 rounded-full flex items-center justify-center gap-1.5 w-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{t('cv.availabilityStatus')}</span>
        </div>

        {/* Location & Email Info */}
        <div className="flex flex-col gap-2 mt-4 text-xs font-code-md text-on-surface-variant/90 w-full text-left bg-surface/50 p-3 rounded-lg border border-outline-variant/60">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-secondary shrink-0" />
            <span>{engineer?.location || 'Limbé, Cameroon'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-tertiary shrink-0" />
            <span className="truncate">{engineer?.email || 'mnchristelle@gmail.com'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-5 w-full">
          <button
            onClick={handleExportCV}
            disabled={isExporting}
            id="export-cv-btn"
            className="w-full bg-surface-container-high border border-outline-variant hover:border-secondary-container text-on-surface hover:text-secondary-container font-label-caps text-xs py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t('cv.exportBtn')}</span>
          </button>
          <button
            onClick={onNavigateContact}
            id="cv-hire-btn"
            className="w-full bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-label-caps text-xs py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>{t('cv.hireMeBtn')}</span>
          </button>
        </div>
      </div>

      {/* Sidebar Menu: Services Provided Options */}
      <div className="bg-surface-container border border-outline-variant rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2.5">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-secondary-container shrink-0" />
            <h3 className="font-headline-sm text-sm text-on-surface font-semibold">
              {t('cv.jobRolesMenu')}
            </h3>
          </div>
          <span className="text-[10px] font-code-md text-on-surface-variant/70 bg-surface/50 px-2 py-0.5 rounded-full border border-outline-variant/50">
            {services.length} {services.length === 1 ? 'service' : 'services'}
          </span>
        </div>

        <div
          className="flex flex-col gap-1.5 max-h-60 sm:max-h-72 overflow-y-auto pr-1.5 custom-scrollbar"
          id="services-sidebar-menu"
        >
          {/* All Services Option */}
          <button
            onClick={() => setSelectedServiceId('all')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-headline-sm transition-all flex items-center justify-between cursor-pointer ${
              selectedServiceId === 'all'
                ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>{t('cv.allRoles')}</span>
            </span>
            <span className="bg-surface/40 px-1.5 py-0.5 rounded text-[10px] font-code-md">
              All
            </span>
          </button>

          {/* Individual Services Options */}
          {services.map((srv) => {
            const isSelected = selectedServiceId === srv.id;
            return (
              <button
                key={srv.id}
                onClick={() => setSelectedServiceId(srv.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-headline-sm transition-all flex flex-col gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="flex items-center gap-2 line-clamp-1">
                    {renderServiceIcon(srv.icon)}
                    <span className="line-clamp-1">{srv.title}</span>
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                </div>
                <span
                  className={`text-[10px] font-code-md ${
                    isSelected
                      ? 'text-on-secondary-container/80'
                      : 'text-on-surface-variant/70'
                  }`}
                >
                  {srv.estimatedDuration} • {srv.baseRate}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
