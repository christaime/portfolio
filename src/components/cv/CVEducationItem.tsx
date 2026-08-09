import React from 'react';
import { EducationItem } from '../../types';

interface CVEducationItemProps {
  education: EducationItem;
}

export const CVEducationItem: React.FC<CVEducationItemProps> = ({ education }) => {
  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-headline-sm text-base text-on-surface font-bold">
          {education.degree}
        </h3>
        <p className="font-body-md text-sm text-secondary-container font-semibold">
          {education.institution}
        </p>
        <p className="font-body-md text-xs text-on-surface-variant mt-1 leading-relaxed">
          {education.details}
        </p>
      </div>
      <div className="bg-surface-container-high border border-outline-variant font-code-md text-xs text-primary px-3 py-1 rounded-full h-fit w-fit shrink-0">
        {education.year}
      </div>
    </div>
  );
};
