import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { blogService } from '../../services/blogService';
import { BlogPost } from '../../types';
import { Search, X, FileText, Clock, ArrowRight } from 'lucide-react';

export const BlogListPage = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    blogService.getCategories().then(setCategories).catch(() => {});
  }, [language]);

  useEffect(() => {
    setIsLoading(true);
    blogService
      .searchPosts(searchQuery, selectedCategory)
      .then((results) => {
        setPosts(results);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [searchQuery, selectedCategory, language]);

  return (
    <div className="animate-fadeIn flex flex-col gap-10">
      {/* Title & Description */}
      <div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-3">
          {t('blog.title')}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          {t('blog.subtitle')}
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-surface-container p-4 rounded-xl border border-outline-variant">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder={t('blog.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-outline-variant/80 rounded pl-10 pr-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-secondary-container"
            id="blog-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-label-caps text-[11px] px-3 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-secondary-container text-on-secondary-container font-semibold'
                  : 'bg-surface hover:bg-surface-container-high text-on-surface-variant border border-outline-variant/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-on-surface-variant animate-pulse font-code-md">
          {t('blog.fetching')}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-surface-container rounded-xl p-12 text-center border border-outline-variant flex flex-col items-center gap-3">
          <FileText className="w-10 h-10 text-on-surface-variant" />
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {t('blog.noArticlesFound')}
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant max-w-md">
            {t('blog.noArticlesSub')}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-2 text-secondary-container font-label-caps text-xs underline cursor-pointer"
          >
            {t('blog.resetFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="bg-surface-container rounded-xl p-6 border border-outline-variant hover:border-secondary-container transition-all flex flex-col justify-between cursor-pointer group shadow-sm"
              id={`blog-card-${post.slug}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-code-md text-xs text-secondary font-semibold">
                    {post.category}
                  </span>
                  <span className="font-code-md text-xs text-on-surface-variant/80">
                    {post.date}
                  </span>
                </div>

                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3 group-hover:text-secondary-container transition-colors line-clamp-2">
                  {post.title}
                </h2>

                <p className="font-body-md text-sm text-on-surface-variant line-clamp-3 mb-6 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {post.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-surface-container-high border border-outline-variant/60 text-on-surface-variant text-[11px] font-code-md px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-between">
                  <span className="font-code-md text-xs text-on-surface-variant/80 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime} {t('blog.readTime')}</span>
                  </span>

                  <span className="font-label-caps text-xs text-secondary-container group-hover:underline flex items-center gap-1 font-semibold">
                    <span>{t('blog.readMore')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

