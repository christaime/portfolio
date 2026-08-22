import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { blogService } from '../../services/blogService';
import { BlogPost } from '../../types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { BlogPostHeader } from '../../components/blog/BlogPostHeader';
import { BlogMarkdownRenderer } from '../../components/blog/BlogMarkdownRenderer';
import { BlogDetailCta } from '../../components/blog/BlogDetailCta';

export const BlogPostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
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
          <span>{t('blog.loading', 'Loading Article...')}</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#d4e4fa] mb-4">
          {t('common.error', 'Article Not Found')}
        </h2>
        <p className="text-sm text-[#9cb2cd] mb-8">
          The requested engineering article could not be located.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0e2742] hover:bg-[#15385e] text-[#00a6e0] font-mono text-xs rounded-xl border border-[#1b3450] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('blog.backToList', 'Back to Insights')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back to list navigation */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-xs font-mono text-[#9cb2cd] hover:text-[#00a6e0] mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('blog.backToList', 'Back to Insights')}</span>
      </Link>

      {/* Article Header & Metadata */}
      <BlogPostHeader post={post} />

      {/* Main Article Body */}
      <article className="max-w-none text-sm md:text-base leading-relaxed text-[#d4e4fa] space-y-6">
        <div className="p-4 bg-[#0a1f33] border border-[#00a6e0]/20 rounded-2xl text-xs sm:text-sm text-[#9cb2cd] leading-relaxed italic">
          {post.excerpt}
        </div>

        <BlogMarkdownRenderer content={post.content} />
      </article>

      {/* Bottom CTA Card */}
      <BlogDetailCta />
    </div>
  );
};

export default BlogPostDetailPage;
