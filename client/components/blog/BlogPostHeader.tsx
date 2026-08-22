import React from "react";
import { BlogPost } from "../../types";
import { Clock, Calendar, User, Shield } from "lucide-react";

export interface BlogPostHeaderProps {
  post: BlogPost;
}

export const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ post }) => {
  return (
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
          {post.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 bg-[#0a1f33] text-[#9cb2cd] rounded border border-[#1b3450]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default BlogPostHeader;
