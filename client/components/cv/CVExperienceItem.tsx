import React from 'react';
import { ExperienceItem } from '../../types';
import { Building2, MapPin, Calendar, ExternalLink, CheckCircle2 } from 'lucide-react';

interface CVExperienceItemProps {
  experience: ExperienceItem;
}

export const CVExperienceItem: React.FC<CVExperienceItemProps> = ({ experience }) => {
  return (
    <div className="relative pl-6 pb-8 border-l border-[#1b3450] last:border-l-0 last:pb-0">
      {/* Timeline Dot */}
      <span className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#051424] border-2 border-[#00a6e0]" />

      <div className="bg-[#0a1f33]/60 hover:bg-[#0a1f33] border border-[#1b3450] hover:border-[#00a6e0]/40 rounded-xl p-5 transition-all">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#d4e4fa]">
              {experience.role}
            </h3>
            <div className="flex items-center gap-2 text-xs text-[#00a6e0] font-medium mt-0.5">
              <Building2 className="w-3.5 h-3.5" />
              {experience.companyUrl ? (
                <a
                  href={experience.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  <span>{experience.company}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span>{experience.company}</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#9cb2cd]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#00a6e0]" />
              <span>{experience.location}</span>
            </span>
            <span className="flex items-center gap-1 bg-[#051424] px-2 py-0.5 rounded border border-[#1b3450]">
              <Calendar className="w-3.5 h-3.5 text-[#00a6e0]" />
              <span>{experience.period}</span>
            </span>
          </div>
        </div>

        {/* Description / Summary */}
        {(experience.description || experience.summary) && (
          <p className="mt-3 text-xs md:text-sm text-[#9cb2cd] leading-relaxed">
            {experience.description || experience.summary}
          </p>
        )}

        {/* Key Achievements */}
        {experience.achievements && experience.achievements.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {experience.achievements.map((ach, idx) => (
              <li key={idx} className="text-xs text-[#d4e4fa]/90 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399] shrink-0 mt-0.5" />
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Technologies Pills */}
        {experience.technologies && experience.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-[#1b3450]/60">
            {experience.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[11px] font-mono bg-[#051424] text-[#00a6e0] border border-[#1b3450] rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
