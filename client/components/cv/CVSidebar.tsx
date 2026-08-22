import React from 'react';
import { EngineerInfo, ServiceItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Mail, Phone, MapPin, CheckCircle2, Shield, Filter, Sparkles, FileDown, ArrowDownToLine } from 'lucide-react';

interface CVSidebarProps {
  engineer: EngineerInfo;
  services: ServiceItem[];
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;
  onOpenPdfModal?: () => void;
}

export const CVSidebar: React.FC<CVSidebarProps> = ({
  engineer,
  services,
  selectedServiceId,
  setSelectedServiceId,
  onOpenPdfModal,
}) => {
  const { t } = useLanguage();

  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Profile Card */}
      <div className="bg-[#0a1f33]/80 border border-[#1b3450] rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
        <div className="relative inline-block mx-auto mb-4">
          <img
            src={engineer.avatar || engineer.avatarUrl || './images/my_picture.png'}
            alt={engineer.name}
            className="w-28 h-28 rounded-2xl object-cover border-2 border-[#00a6e0]/40 shadow-xl"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop';
            }}
          />
          <span className="absolute -bottom-1 -right-1 bg-[#34d399] w-4 h-4 rounded-full border-2 border-[#051424]" title={t('cv.sidebar.statusAvailable', 'Available for Engagements')} />
        </div>

        <h1 className="text-lg font-bold text-[#d4e4fa]">
          {engineer.name}
        </h1>
        <p className="text-xs font-mono text-[#00a6e0] mt-1">
          {engineer.title}
        </p>

        {/* Contact Info List */}
        <div className="mt-5 space-y-2.5 text-left border-t border-[#1b3450] pt-4 text-xs text-[#9cb2cd]">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#00a6e0] shrink-0" />
            <span className="truncate">{engineer.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#00a6e0] shrink-0" />
            <a href={`mailto:${engineer.email}`} className="truncate hover:underline text-[#d4e4fa]">
              {engineer.email}
            </a>
          </div>

          {engineer.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#00a6e0] shrink-0" />
              <span className="font-mono text-[#d4e4fa]">{engineer.phone}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399] shrink-0" />
            <span className="text-[#34d399] font-medium">{t('cv.sidebar.statusAvailable', 'Available for Engagements')}</span>
          </div>
        </div>
      </div>

      {/* Action Button: Dedicated PDF CV Export on CV Page */}
      {onOpenPdfModal && (
        <button
          onClick={onOpenPdfModal}
          className="w-full p-4 bg-gradient-to-r from-[#0a1f33] to-[#0e2742] hover:from-[#0e2742] hover:to-[#15385e] border border-[#00a6e0]/40 hover:border-[#00a6e0] rounded-2xl transition-all shadow-lg flex items-center justify-between group text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#00a6e0]/15 text-[#00a6e0] rounded-xl group-hover:scale-105 transition-transform">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#d4e4fa] group-hover:text-white">
                {selectedServiceId !== 'all'
                  ? t('cv.sidebar.downloadTargetedPdfCv', 'Export Targeted PDF CV')
                  : t('cv.sidebar.downloadPdfCv', 'Download PDF CV')}
              </div>
              <div className="text-[11px] font-mono text-[#00a6e0] truncate max-w-[160px]">
                {selectedServiceId !== 'all'
                  ? services.find((s) => s.id === selectedServiceId)?.title || 'Custom Perspective'
                  : t('cv.sidebar.allServices', 'Comprehensive Full Profile')}
              </div>
            </div>
          </div>
          <ArrowDownToLine className="w-4 h-4 text-[#34d399] group-hover:translate-y-0.5 transition-transform shrink-0" />
        </button>
      )}

      {/* Target Service Filter Selector */}
      <div className="bg-[#0a1f33]/80 border border-[#1b3450] rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#1b3450]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#00a6e0]">
            <Filter className="w-3.5 h-3.5" />
            <span>{t('sidebar.targetedPerspective', 'Targeted Perspective')}</span>
          </div>
          {selectedServiceId !== 'all' && (
            <button
              onClick={() => setSelectedServiceId('all')}
              className="text-[11px] text-[#9cb2cd] hover:text-[#d4e4fa] hover:underline"
            >
              {t('sidebar.showAll', 'Show All')}
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          <button
            onClick={() => setSelectedServiceId('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
              selectedServiceId === 'all'
                ? 'bg-[#00a6e0] text-[#00374d] shadow-sm'
                : 'text-[#9cb2cd] hover:bg-[#0e2742] hover:text-[#d4e4fa]'
            }`}
          >
            <span>{t('sidebar.allDomains', 'All Engineering Domains')}</span>
            {selectedServiceId === 'all' && <Shield className="w-3.5 h-3.5" />}
          </button>

          {services.map((srv) => {
            const isSelected = selectedServiceId === srv.id;
            return (
              <button
                key={srv.id}
                onClick={() => setSelectedServiceId(srv.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#00a6e0] text-[#00374d] font-bold shadow-sm'
                    : 'text-[#9cb2cd] hover:bg-[#0e2742] hover:text-[#d4e4fa]'
                }`}
              >
                <span className="truncate">{srv.title}</span>
                {isSelected && <Sparkles className="w-3.5 h-3.5 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
