import React from 'react';
import { EducationItem } from '../../types';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';

interface CVEducationItemProps {
  education: EducationItem;
}

export const CVEducationItem: React.FC<CVEducationItemProps> = ({ education }) => {
  return (
    <div className="bg-[#0a1f33]/60 hover:bg-[#0a1f33] border border-[#1b3450] hover:border-[#00a6e0]/40 rounded-xl p-4 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
        <h4 className="text-sm font-bold text-[#d4e4fa] flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#00a6e0] shrink-0" />
          <span>{education.degree}</span>
        </h4>
        <div className="flex items-center gap-2 text-xs font-mono text-[#00a6e0]">
          <Calendar className="w-3.5 h-3.5" />
          <span>{education.year}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-[#9cb2cd] mb-2">
        <span className="font-medium text-[#d4e4fa]/90">{education.institution}</span>
        {education.location && (
          <>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#00a6e0]" />
              <span>{education.location}</span>
            </span>
          </>
        )}
      </div>

      {(education.details || education.description) && (
        <p className="text-xs text-[#9cb2cd] leading-relaxed">
          {education.details || education.description}
        </p>
      )}

      {education.honors && (
        <div className="mt-2 text-[11px] font-mono text-[#34d399] bg-[#34d399]/10 border border-[#34d399]/20 px-2 py-0.5 rounded inline-block">
          {education.honors}
        </div>
      )}
    </div>
  );
};
