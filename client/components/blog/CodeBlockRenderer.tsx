import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export interface CodeBlockProps {
  languageName?: string;
  children: React.ReactNode;
}

export const CodeBlockRenderer: React.FC<CodeBlockProps> = ({
  languageName,
  children,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const rawCode = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-[#1b3450] bg-[#04101d] shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0a1f33] border-b border-[#1b3450] text-[11px] font-mono text-[#9cb2cd]">
        <span className="flex items-center gap-2 text-[#00a6e0] font-semibold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#00a6e0]/80 inline-block" />
          {languageName || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#0e2742] hover:bg-[#15385e] text-[#9cb2cd] hover:text-[#d4e4fa] rounded transition-colors text-[11px]"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#34d399]" />
              <span className="text-[#34d399]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-[#d4e4fa] leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlockRenderer;
