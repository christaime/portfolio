import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { blogService } from '../../services/blogService';
import { portfolioService } from '../../services/portfolioService';
import { BlogPost, EngineerInfo } from '../../types';
import { FileText, ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';

export const BlogPostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [engineer, setEngineer] = useState<EngineerInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    portfolioService.getEngineerInfo().then(setEngineer);
  }, []);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      blogService.getBlogPostBySlug(slug).then((res) => {
        setPost(res || null);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center font-code-md text-on-surface-variant animate-pulse">
        Loading article context...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-16 text-center flex flex-col items-center gap-4">
        <FileText className="w-12 h-12 text-error" />
        <h2 className="font-headline-md text-headline-md text-on-surface">Article Not Found</h2>
        <p className="font-body-md text-on-surface-variant max-w-md">
          The request article slug "{slug}" does not exist or has been relocated.
        </p>
        <button
          onClick={() => navigate('/blog')}
          className="bg-secondary-container text-on-secondary-container font-label-caps text-xs px-6 py-3 rounded cursor-pointer"
        >
          Return to Articles
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn max-w-3xl mx-auto flex flex-col gap-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/blog')}
        className="self-start text-on-surface-variant hover:text-secondary-container font-label-caps text-xs flex items-center gap-1.5 cursor-pointer py-1"
        id="back-to-blog-btn"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Articles</span>
      </button>

      {/* Article Header */}
      <header className="border-b border-outline-variant/60 pb-8 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-code-md text-xs text-secondary font-bold bg-surface-container-high px-3 py-1 rounded border border-outline-variant">
            {post.category}
          </span>
          <span className="font-code-md text-xs text-on-surface-variant/80 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.date}</span>
          </span>
          <span className="font-code-md text-xs text-on-surface-variant/80 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime} min read</span>
          </span>
        </div>

        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface leading-tight">
          {post.title}
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          {post.summary}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-surface-container-high text-on-surface-variant font-code-md text-xs px-2.5 py-0.5 rounded border border-outline-variant/40"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* Article Body Content */}
      <div className="font-body-md text-body-md text-on-surface leading-relaxed flex flex-col gap-6">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-headline-md text-headline-md text-on-surface mt-4 mb-2">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('```')) {
            const codeLines = paragraph.split('\n');
            const code = codeLines.slice(1, -1).join('\n');
            return (
              <pre
                key={idx}
                className="bg-surface-container-high p-4 rounded-xl border border-outline-variant overflow-x-auto font-code-md text-code-md text-primary my-2"
              >
                <code>{code}</code>
              </pre>
            );
          }
          return (
            <p key={idx} className="text-on-surface-variant leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Author Footer */}
      <footer className="mt-12 pt-8 border-t border-outline-variant/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={engineer?.avatarUrl || '/avatar.jpg'}
            alt={engineer?.name || 'Christelle Mamekem Ngueguim'}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== window.location.origin + '/avatar.jpg') {
                target.src = '/avatar.jpg';
              }
            }}
            className="w-10 h-10 rounded-full object-cover border border-secondary-container shrink-0 bg-surface-container-high"
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-sm text-on-surface">Written by {engineer?.name || 'Christelle Mamekem Ngueguim'}</span>
            <span className="font-code-md text-xs text-on-surface-variant">{engineer?.title || 'Senior Software Engineer'}</span>
          </div>
        </div>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: post.title, url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Article link copied to clipboard!');
            }
          }}
          className="bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface text-xs font-label-caps px-4 py-2 rounded flex items-center gap-1.5 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </footer>
    </div>
  );
};

