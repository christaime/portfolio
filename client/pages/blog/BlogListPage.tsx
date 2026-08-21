import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { blogService } from '../../services/blogService';
import { BlogPost } from '../../types';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Loader2 } from 'lucide-react';

export const BlogListPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    blogService.getBlogPosts().then((res) => {
      if (isMounted) {
        setPosts(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-mono text-[#00a6e0]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{t('blog.loading', 'Loading Articles...')}</span>
        </div>
      </div>
    );
  }

  const allLabel = t('projects.allCategories', 'All');
  const allTags = ['All', ...Array.from(new Set(posts.flatMap((p) => p.tags || [])))];

  const filteredPosts =
    selectedTag === 'All'
      ? posts
      : posts.filter((p) => p.tags?.includes(selectedTag));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-mono text-[#00a6e0] font-bold uppercase tracking-wider bg-[#0a1f33] px-3 py-1 rounded-full border border-[#1b3450]">
          {t('blog.badge', 'Technical Insights & Publications')}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-[#d4e4fa] mt-4 mb-3">
          {t('blog.title', 'Architecture, Standards & Engineering Thoughts')}
        </h1>
        <p className="text-sm text-[#9cb2cd] leading-relaxed">
          {t(
            'blog.subtitle',
            'In-depth explorations of PEPPOL compliance, distributed transaction consistency, and enterprise Angular/Java architectures.'
          )}
        </p>
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors ${
              selectedTag === tag
                ? 'bg-[#00a6e0] text-[#00374d] font-bold shadow-sm'
                : 'bg-[#0a1f33] text-[#9cb2cd] hover:text-[#d4e4fa] border border-[#1b3450]'
            }`}
          >
            {tag === 'All' ? allLabel : `#${tag}`}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-[#0a1f33]/80 border border-[#1b3450] hover:border-[#00a6e0]/50 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-xl hover:-translate-y-1 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[#9cb2cd] mb-3">
                <span className="text-[#00a6e0] font-semibold">{post.category}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-[#d4e4fa] group-hover:text-[#00a6e0] transition-colors mb-2 leading-snug">
                <Link to={`/blog/${post.slug || post.id}`}>
                  {post.title}
                </Link>
              </h2>

              <p className="text-xs text-[#9cb2cd] leading-relaxed line-clamp-3 mb-4">
                {post.excerpt}
              </p>
            </div>

            <div>
              {/* Tags */}
              {post.tags && (
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#1b3450] mb-4">
                  {post.tags.map((tItem, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 bg-[#051424] text-[#9cb2cd] rounded border border-[#1b3450]"
                    >
                      #{tItem}
                    </span>
                  ))}
                </div>
              )}

              <Link
                to={`/blog/${post.slug || post.id}`}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#00a6e0] hover:text-[#38bdf8] font-bold group-hover:translate-x-1 transition-all"
              >
                <span>{t('blog.readArticle', 'Read Article')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
