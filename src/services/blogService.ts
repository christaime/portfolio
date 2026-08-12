import { BlogPost, Language } from '../types';
import rawBlogDataEn from '../data/blogData.json';
import rawBlogDataFr from '../data/blogData_fr.json';
import { getDefaultLanguage } from '../context/LanguageContext';

const blogDataMap: Record<Language, BlogPost[]> = {
  en: rawBlogDataEn as BlogPost[],
  fr: rawBlogDataFr as BlogPost[],
};

type Listener = (posts: BlogPost[]) => void;

class BlogService {
  private currentLanguage: Language;
  private currentPosts: BlogPost[];
  private listeners: Set<Listener> = new Set();

  constructor(initialLang: Language = getDefaultLanguage()) {
    this.currentLanguage = initialLang;
    this.currentPosts = blogDataMap[initialLang] || blogDataMap.en;
  }

  setLanguage(lang: Language): void {
    if (this.currentLanguage === lang && this.currentPosts) return;
    this.currentLanguage = lang;
    this.currentPosts = blogDataMap[lang] || blogDataMap.en;
    this.notifyListeners();
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentPosts));
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Promise.resolve(this.currentPosts);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Promise.resolve(this.currentPosts.find((p) => p.slug === slug));
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    return Promise.resolve(this.currentPosts.find((p) => p.id === id));
  }

  async getCategories(): Promise<string[]> {
    const categories = Array.from(new Set(this.currentPosts.map((p) => p.category)));
    return Promise.resolve(['All', ...categories]);
  }

  async searchPosts(query: string, category: string = 'All'): Promise<BlogPost[]> {
    const q = query.toLowerCase().trim();
    return Promise.resolve(
      this.currentPosts.filter((post) => {
        const matchesCategory = category === 'All' || post.category === category;
        const matchesQuery =
          !q ||
          post.title.toLowerCase().includes(q) ||
          post.summary.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q));
        return matchesCategory && matchesQuery;
      })
    );
  }
}

export const blogService = new BlogService();


