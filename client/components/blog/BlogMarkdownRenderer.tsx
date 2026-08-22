import React from "react";
import Markdown, { type Components } from "react-markdown";
import { CodeBlockRenderer } from "./CodeBlockRenderer";

export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl sm:text-3xl font-bold text-[#d4e4fa] pt-8 pb-3 border-b border-[#1b3450] first:pt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl sm:text-2xl font-bold text-[#d4e4fa] pt-8 pb-2 border-b border-[#1b3450]/60 first:pt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg sm:text-xl font-bold text-[#00a6e0] pt-6 pb-2 border-b border-[#1b3450]/40 first:pt-0">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base font-semibold text-[#38bdf8] pt-4 pb-1">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-sm md:text-[15px] text-[#d4e4fa]/90 leading-relaxed my-4">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-[#ffffff]">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-[#9cb2cd]">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-4 space-y-2 pl-5 list-disc text-sm text-[#d4e4fa]/90 marker:text-[#00a6e0]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 space-y-2 pl-5 list-decimal text-sm text-[#d4e4fa]/90 marker:text-[#00a6e0] font-mono">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed pl-1 text-[#d4e4fa]/90">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 pl-4 py-2 border-l-2 border-[#00a6e0] bg-[#0a1f33]/60 rounded-r-lg text-sm text-[#9cb2cd] italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const isMultiline = String(children).includes("\n") || Boolean(match);

    if (!isMultiline) {
      return (
        <code
          className="px-1.5 py-0.5 mx-0.5 rounded bg-[#0e2742] border border-[#1b3450] text-[#38bdf8] font-mono text-xs font-medium"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <CodeBlockRenderer languageName={match ? match[1] : undefined}>
        {children}
      </CodeBlockRenderer>
    );
  },
};

export interface BlogMarkdownRendererProps {
  content: string;
}

export const BlogMarkdownRenderer: React.FC<BlogMarkdownRendererProps> = ({
  content,
}) => {
  return (
    <div className="markdown-body space-y-5 text-sm md:text-[15px] leading-relaxed">
      <Markdown components={markdownComponents}>{content}</Markdown>
    </div>
  );
};

export default BlogMarkdownRenderer;
