import { describe, it, expect } from 'vitest';
import { blogService } from '@/client/services/blogService';

describe('blogService', () => {
  it('should fetch all blog posts', async () => {
    const posts = await blogService.getBlogPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  it('should fetch blog post by slug', async () => {
    const post = await blogService.getBlogPostBySlug('angular-signals-vs-rxjs-state-management');
    expect(post).toBeDefined();
    expect(post?.title).toContain('Angular Signals');
  });

  it('should filter posts by search query', async () => {
    const results = await blogService.searchPosts('Angular');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].slug).toBe('angular-signals-vs-rxjs-state-management');
  });

  it('should return categories including "All"', async () => {
    const categories = await blogService.getCategories();
    expect(categories).toContain('All');
    expect(categories.length).toBeGreaterThan(1);
  });

  it('should switch dataset when setLanguage is invoked', async () => {
    blogService.setLanguage('fr');
    const postsFr = await blogService.getBlogPosts();
    expect(postsFr.length).toBeGreaterThan(0);
    const postFr = await blogService.getBlogPostBySlug('zero-flicker-spas-hydration');
    expect(postFr).toBeDefined();

    blogService.setLanguage('en');
    const postsEn = await blogService.getBlogPosts();
    expect(postsEn.length).toBeGreaterThan(0);
    const postEn = await blogService.getBlogPostBySlug('angular-signals-vs-rxjs-state-management');
    expect(postEn).toBeDefined();
  });
});
