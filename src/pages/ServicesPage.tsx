import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { portfolioService } from '../services/portfolioService';
import { ServiceItem } from '../types';
import {
  Code,
  Cloud,
  Layers,
  Zap,
  CheckCircle2,
  ArrowRight,
  X,
  Send,
  HelpCircle,
  FileText,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    portfolioService.getServices().then(setServices);
  }, []);

  const handleBookService = (service: ServiceItem) => {
    const subject = encodeURIComponent(`Service Inquiry: ${service.title}`);
    const message = encodeURIComponent(
      `Hello Christelle,\n\nI am interested in your "${service.title}" service.\nEstimated Duration: ${service.estimatedDuration}\nBudget Range: ${service.baseRate}\n\nKey Project Details:\n- `
    );
    navigate(`/contact?subject=${subject}&message=${message}`);
  };

  const handleViewInCV = (serviceId: string) => {
    navigate(`/cv?service=${serviceId}`);
  };

  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code className="w-7 h-7" />;
      case 'cloud':
        return <Cloud className="w-7 h-7" />;
      case 'architecture':
        return <Layers className="w-7 h-7" />;
      case 'speed':
        return <Zap className="w-7 h-7" />;
      default:
        return <HelpCircle className="w-7 h-7" />;
    }
  };

  return (
    <div className="animate-fadeIn flex flex-col gap-12">
      {/* Title & Header */}
      <div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
          {t('services.title')}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          {t('services.subtitle')}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-surface-container rounded-xl p-6 md:p-8 border border-outline-variant hover:border-secondary-container transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-surface-container-high rounded-DEFAULT border border-outline-variant group-hover:border-secondary-container text-secondary-container transition-colors">
                  {renderServiceIcon(service.icon)}
                </div>
                <span className="font-code-md text-code-md bg-surface-container-high border border-outline-variant text-primary px-3 py-1 rounded">
                  {service.baseRate}
                </span>
              </div>

              <h3 className="font-headline-md text-headline-md text-on-surface mb-3 group-hover:text-secondary-container transition-colors">
                {service.title}
              </h3>

              <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                {service.description}
              </p>

              <div className="mb-6">
                <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-3">
                  {t('services.deliverables')}
                </h4>
                <ul className="flex flex-col gap-2">
                  {service.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-sm text-on-surface-variant">
                      <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-outline-variant/60 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-caps text-[11px] text-on-surface-variant/70">
                  {t('services.estDuration')}
                </span>
                <span className="font-code-md text-xs text-on-surface font-semibold">
                  {service.estimatedDuration}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleViewInCV(service.id)}
                  className="bg-surface-container-high hover:bg-surface border border-outline-variant text-on-surface text-xs font-label-caps px-3 py-2.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Filter CV view by this service"
                >
                  <FileText className="w-3.5 h-3.5 text-secondary" />
                  <span>CV Filter</span>
                </button>
                <button
                  onClick={() => setSelectedService(service)}
                  className="bg-surface-container-high hover:bg-surface border border-outline-variant text-on-surface text-xs font-label-caps px-3.5 py-2.5 rounded transition-colors cursor-pointer"
                >
                  Details
                </button>
                <button
                  onClick={() => handleBookService(service)}
                  className="bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container text-xs font-label-caps px-4 py-2.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                  id={`book-service-${service.id}`}
                >
                  <span>{t('services.inquireBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container border border-outline-variant p-6 md:p-8 rounded-xl max-w-xl w-full flex flex-col gap-6 relative">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-surface-container-high rounded text-secondary-container">
                  {renderServiceIcon(selectedService.icon)}
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    {selectedService.title}
                  </h3>
                  <span className="font-code-md text-xs text-secondary font-semibold">
                    {selectedService.baseRate} • {selectedService.estimatedDuration}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-on-surface-variant hover:text-primary cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {selectedService.description}
            </p>

            <div className="bg-surface-container-high p-4 rounded border border-outline-variant">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-2">
                What is Included
              </h4>
              <ul className="flex flex-col gap-2">
                {selectedService.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2 text-sm text-on-surface">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedService(null)}
                className="px-5 py-2.5 rounded border border-outline-variant text-on-surface font-label-caps text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const s = selectedService;
                  setSelectedService(null);
                  handleBookService(s);
                }}
                className="bg-secondary-container text-on-secondary-container px-6 py-2.5 rounded font-label-caps text-xs flex items-center gap-2 cursor-pointer hover:bg-secondary-fixed"
              >
                <span>Request Consultation</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

