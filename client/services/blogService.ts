import blogEn from '../data/blogData.json';
import blogFr from '../data/blogData_fr.json';
import { BlogPost } from '../types';

class BlogService {
  private currentLanguage: string;
  private currentBlogPosts: BlogPost[];

  constructor() {
    this.currentLanguage =
      (typeof window !== 'undefined'
        ? localStorage.getItem('portfolio_lang') || localStorage.getItem('app_language')
        : null) || 'en';
    this.currentBlogPosts = (this.currentLanguage === 'fr' ? blogFr : blogEn) as unknown as BlogPost[];
  }

  /**
   * Sets the active language and loads the corresponding blog dataset into memory,
   * making all subsequent data extractions stateful.
   */
  public setLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.currentBlogPosts = (lang === 'fr' ? blogFr : blogEn) as unknown as BlogPost[];
  }

  public getLanguage(): string {
    return this.currentLanguage;
  }

  public async getBlogPosts(): Promise<BlogPost[]> {
    return this.currentBlogPosts;
  }

  public async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return this.currentBlogPosts.find((p) => p.slug === slug || p.id === slug);
  }

  public async searchPosts(query: string): Promise<BlogPost[]> {
    const q = query.toLowerCase().trim();
    if (!q) return this.currentBlogPosts;
    return this.currentBlogPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  public async getCategories(): Promise<string[]> {
    const cats = Array.from(new Set(this.currentBlogPosts.map((p) => p.category)));
    return ['All', ...cats];
  }
}

export const blogService = new BlogService();
