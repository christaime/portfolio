import { BlogPost } from '../types';
import rawBlogData from '../data/blogData.json';

class BlogService {
  private posts: BlogPost[] = rawBlogData as BlogPost[];

  async getBlogPosts(): Promise<BlogPost[]> {
    return Promise.resolve(this.posts);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Promise.resolve(this.posts.find((p) => p.slug === slug));
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    return Promise.resolve(this.posts.find((p) => p.id === id));
  }

  async getCategories(): Promise<string[]> {
    const categories = Array.from(new Set(this.posts.map((p) => p.category)));
    return Promise.resolve(['All', ...categories]);
  }

  async searchPosts(query: string, category: string = 'All'): Promise<BlogPost[]> {
    const q = query.toLowerCase().trim();
    return Promise.resolve(
      this.posts.filter((post) => {
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
