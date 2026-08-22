import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const BlogDetailCta: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="mt-14 p-6 md:p-8 bg-[#0a1f33] border border-[#1b3450] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
      <div>
        <h3 className="text-base font-bold text-[#d4e4fa] mb-1">
          {t('blog.ctaTitle', 'Need Expert Architecture Consultation?')}
        </h3>
        <p className="text-xs text-[#9cb2cd]">
          {t(
            'blog.ctaDescription',
            'Discuss system integration, PEPPOL compliance pipelines, or microservices scalability directly.'
          )}
        </p>
      </div>
      <Link
        to="/contact"
        className="shrink-0 px-5 py-2.5 bg-[#00a6e0] hover:bg-[#38bdf8] text-[#00374d] text-xs font-bold rounded-xl transition-colors shadow-md"
      >
        {t('blog.ctaButton', 'Contact the Architect')}
      </Link>
    </div>
  );
};

export default BlogDetailCta;
