
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message, Role } from '../types';

interface MessageItemProps {
  message: Message;
  isLast: boolean;
}

// Fixed: Changed children type to React.ReactNode for better compatibility with JSX children and markdown parsing
const CodeBlock = ({ language, children }: { language: string; children: React.ReactNode }) => {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).trim();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="code-block-container not-prose">
      <div className="code-block-header">
        <span>{language || 'code'}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          {copied ? (
            <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Copied!</>
          ) : (
            <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copy code</>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          background: 'transparent',
          padding: '1rem',
          fontSize: '0.85rem',
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export const MessageItem: React.FC<MessageItemProps> = ({ message, isLast }) => {
  const isUser = message.role === Role.USER;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`group flex gap-4 ${isUser ? 'flex-row-reverse animate-in slide-in-from-right-4' : 'animate-in slide-in-from-left-4'} duration-300 relative`}>
      {/* Avatar */}
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md z-10
        ${isUser ? 'bg-indigo-600' : 'bg-gradient-to-tr from-indigo-500 to-purple-500'}
      `}>
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Bubble Container */}
      <div className={`
        flex flex-col max-w-[90%]
        ${isUser ? 'items-end' : 'items-start'}
      `}>
        <div className={`
          relative p-4 rounded-2xl text-sm transition-all
          ${isUser 
            ? 'bg-indigo-600 text-white shadow-lg rounded-tr-none' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700/50 rounded-tl-none'}
        `}>
          <div className={`
            prose prose-sm md:prose-base max-w-none break-words
            ${isUser ? 'prose-invert' : 'dark:prose-invert'}
            prose-headings:font-semibold prose-a:text-indigo-400 prose-blockquote:border-indigo-500
            prose-pre:bg-transparent prose-pre:p-0
          `}>
            {message.content ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    // Fixed: Pass children as a prop to satisfy TypeScript's children property requirements on line 106
                    return !inline ? (
                      <CodeBlock language={language} children={children} />
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              isLast && !isUser ? (
                <span className="inline-block w-1.5 h-4 bg-gray-400 dark:bg-gray-500 animate-pulse ml-1 align-middle" />
              ) : "..."
            )}
          </div>
          
          <div className={`text-[9px] mt-2 opacity-60 ${isUser ? 'text-indigo-100 text-right' : 'text-gray-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className={`
          flex items-center gap-2 mt-1 px-1 transition-opacity duration-200
          ${copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          ${isUser ? 'flex-row-reverse' : 'flex-row'}
        `}>
          {/* Copy Button */}
          <button 
            onClick={handleCopy}
            className={`
              flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-all
              ${copied 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 border border-transparent'}
            `}
            title="Copy to clipboard"
          >
            {copied ? (
              <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Copied!</>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copy</>
            )}
          </button>

          {!isUser && message.content && (
            <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-800 ml-1 pl-1">
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-400 transition-colors" title="Helpful">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
