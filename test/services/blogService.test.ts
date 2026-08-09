import { describe, it, expect } from 'vitest';
import { blogService } from './blogService';

describe('blogService', () => {
  it('should fetch all blog posts', async () => {
    const posts = await blogService.getBlogPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  it('should fetch blog post by slug', async () => {
    const post = await blogService.getBlogPostBySlug('zero-flicker-spas-hydration');
    expect(post).toBeDefined();
    expect(post?.title).toContain('Architecting Zero-Flicker SPAs');
  });

  it('should filter posts by search query', async () => {
    const results = await blogService.searchPosts('hydration');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].slug).toBe('zero-flicker-spas-hydration');
  });

  it('should return categories including "All"', async () => {
    const categories = await blogService.getCategories();
    expect(categories).toContain('All');
    expect(categories.length).toBeGreaterThan(1);
  });
});
