import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { blogService } from '../../services/blogService';
import { BlogPost } from '../../types';
import { ArrowLeft, Clock, Calendar, Tag, User, Shield, Share2, Sparkles, Loader2 } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (slug) {
      blogService.getBlogPostBySlug(slug).then((res) => {
        if (isMounted) {
          setPost(res || null);
          setLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [slug, language]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-mono text-[#00a6e0]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading Analysis...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#d4e4fa] mb-4">Article Not Found</h2>
        <p className="text-sm text-[#9cb2cd] mb-8">
          The requested engineering article could not be located.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0e2742] hover:bg-[#15385e] text-[#00a6e0] font-mono text-xs rounded-xl border border-[#1b3450] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-xs font-mono text-[#9cb2cd] hover:text-[#00a6e0] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Articles</span>
      </Link>

      {/* Header / Meta */}
      <header className="mb-10 pb-8 border-b border-[#1b3450]">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[#00a6e0] bg-[#00a6e0]/10 border border-[#00a6e0]/30 px-3 py-1 rounded-full font-semibold">
            {post.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#9cb2cd]">
            <Clock className="w-3.5 h-3.5 text-[#00a6e0]" />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#9cb2cd] hidden sm:flex">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.date}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#d4e4fa] leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author Card */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#1b3450]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0e2742] border border-[#00a6e0]/40 flex items-center justify-center text-[#00a6e0]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#d4e4fa] flex items-center gap-2">
                <span>{post.author.name}</span>
                <Shield className="w-3.5 h-3.5 text-[#34d399]" />
              </div>
              <div className="text-xs text-[#9cb2cd]">{post.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {post.tags?.map((t, idx) => (
              <span
                key={idx}
                className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 bg-[#0a1f33] text-[#9cb2cd] rounded border border-[#1b3450]"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed text-[#d4e4fa]/90 space-y-6">
        <div className="p-4 bg-[#0a1f33] border border-[#00a6e0]/20 rounded-2xl text-xs sm:text-sm text-[#9cb2cd] leading-relaxed italic">
          {post.excerpt}
        </div>

        {post.content.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={index} className="text-xl font-bold text-[#00a6e0] pt-4 pb-2 border-b border-[#1b3450]">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={index} className="text-2xl font-bold text-[#d4e4fa] pt-6 pb-2">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          return (
            <p key={index} className="text-sm text-[#d4e4fa] leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </article>

      {/* Bottom CTA */}
      <div className="mt-14 p-6 md:p-8 bg-[#0a1f33] border border-[#1b3450] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-base font-bold text-[#d4e4fa] mb-1">
            Need Expert Architecture Consultation?
          </h3>
          <p className="text-xs text-[#9cb2cd]">
            Discuss system integration, PEPPOL compliance pipelines, or microservices scalability directly.
          </p>
        </div>
        <Link
          to="/contact"
          className="shrink-0 px-5 py-2.5 bg-[#00a6e0] hover:bg-[#38bdf8] text-[#00374d] text-xs font-bold rounded-xl transition-colors shadow-md"
        >
          Contact the Architect
        </Link>
      </div>
    </div>
  );
};
