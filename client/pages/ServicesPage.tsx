import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { portfolioService } from '../services/portfolioService';
import { ServiceItem, CertificationItem } from '../types';
import {
  Server,
  Code2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Loader2,
  Layers,
  Cpu,
  Award,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ServicesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      portfolioService.getServices(),
      portfolioService.getCertifications(),
    ]).then(([srvs, certs]) => {
      if (isMounted) {
        setServices(srvs);
        setCertifications(certs);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [language]);

  const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'server':
        return <Server className="w-6 h-6 text-[#00a6e0]" />;
      case 'code':
      case 'code2':
        return <Code2 className="w-6 h-6 text-[#34d399]" />;
      case 'verified':
      case 'shield':
      case 'shieldcheck':
        return <ShieldCheck className="w-6 h-6 text-[#f59e0b]" />;
      case 'speed':
        return <Cpu className="w-6 h-6 text-[#a855f7]" />;
      default:
        return <Layers className="w-6 h-6 text-[#00a6e0]" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-mono text-[#00a6e0]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{t('services.loading', 'Loading Services...')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono text-[#00a6e0] font-bold uppercase tracking-wider bg-[#0a1f33] px-3 py-1 rounded-full border border-[#1b3450]">
          {t('services.badge', 'Specialized Engineering & Advisory')}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-[#d4e4fa] mt-4 mb-3">
          {t('services.title', 'Technical Solutions & Consulting Capabilities')}
        </h1>
        <p className="text-sm text-[#9cb2cd] leading-relaxed">
          {t(
            'services.subtitle',
            'High-impact engineering, compliance integration, and cloud-native architecture delivered with precision, reliability, and enterprise-grade SLA standards.'
          )}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {services.map((srv) => {
          const linkedCerts = certifications.filter((c: any) =>
            c.linkedServices && c.linkedServices.includes(srv.id)
          );

          return (
            <div
              key={srv.id}
              className="bg-[#0a1f33]/80 border border-[#1b3450] hover:border-[#00a6e0]/50 rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="p-3 bg-[#051424] border border-[#1b3450] rounded-xl">
                    {getIcon(srv.icon)}
                  </div>
                  {srv.featured && (
                    <span className="text-[11px] font-mono text-[#00a6e0] bg-[#00a6e0]/10 border border-[#00a6e0]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{t('services.featured', 'Featured')}</span>
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-[#d4e4fa] mb-1">
                  {srv.title}
                </h2>
                {srv.subtitle && (
                  <div className="text-xs font-mono text-[#00a6e0] mb-4">
                    {srv.subtitle}
                  </div>
                )}

                <p className="text-xs md:text-sm text-[#9cb2cd] leading-relaxed mb-6">
                  {srv.description || srv.shortDesc}
                </p>

                {/* Deliverables / Features */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#d4e4fa] mb-3">
                    {t('services.keyDeliverables', 'Key Deliverables')}
                  </h4>
                  <ul className="space-y-2">
                    {(srv.deliverables || srv.features || []).map((item, idx) => (
                      <li key={idx} className="text-xs text-[#9cb2cd] flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Linked Certifications for this service */}
                {linkedCerts.length > 0 && (
                  <div className="mb-6 pt-4 border-t border-[#1b3450]">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#00a6e0] mb-2.5 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>{t('services.linkedCertifications', 'Verified Credentials & Certifications')}</span>
                    </h4>
                    <div className="space-y-2">
                      {linkedCerts.map((cert) => (
                        <div
                          key={cert.id}
                          className="bg-[#051424] border border-[#1b3450] rounded-xl p-2.5 flex items-start justify-between gap-2"
                        >
                          <div>
                            <div className="text-xs font-semibold text-[#d4e4fa]">
                              {cert.name || cert.title}
                            </div>
                            <div className="text-[10px] font-mono text-[#9cb2cd] mt-0.5 flex items-center gap-2">
                              <span>{cert.issuer}</span>
                              <span>•</span>
                              <span>{cert.year || cert.issueDate}</span>
                            </div>
                          </div>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Verify ${cert.name || cert.title}`}
                              className="p-1 text-[#9cb2cd] hover:text-[#00a6e0] shrink-0 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                {/* Technologies */}
                {srv.technologies && (
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#1b3450] mb-6">
                    {srv.technologies.map((tItem, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-mono bg-[#051424] text-[#9cb2cd] border border-[#1b3450] rounded"
                      >
                        {tItem}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  to={`/contact?service=${srv.id}`}
                  className="w-full py-2.5 bg-[#0e2742] hover:bg-[#00a6e0] text-[#d4e4fa] hover:text-[#00374d] text-xs font-bold rounded-xl border border-[#1b3450] hover:border-[#00a6e0] transition-colors flex items-center justify-center gap-2"
                >
                  <span>{t('services.engageBtn', 'Engage for')} {srv.title.split('(')[0].trim()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
