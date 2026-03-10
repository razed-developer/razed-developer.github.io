import { useState, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const rawCode = String(children ?? '').replace(/\n$/, '');
  const language = className?.replace('language-', '') || 'text';
  const isBlock = className?.startsWith('language-') || rawCode.includes('\n');

  if (!isBlock) {
    return <code className="inline-code">{children}</code>;
  }

  async function handleCopy(): Promise<void> {
    await navigator.clipboard.writeText(rawCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="code-block">
      <div className="code-block__toolbar">
        <span>{language}</span>
        <button type="button" onClick={() => void handleCopy()}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code className={className}>{rawCode}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ className, children }) => (
            <CodeBlock className={className} children={children} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
