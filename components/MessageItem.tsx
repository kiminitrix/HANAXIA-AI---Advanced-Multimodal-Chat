
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

  const displayLanguage = language 
    ? language.charAt(0).toUpperCase() + language.slice(1) 
    : 'Code';

  return (
    <div className="code-block-container not-prose my-4 shadow-lg">
      <div className="code-block-header flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-white/5 rounded-t-xl">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-medium text-gray-400 font-sans tracking-wide">{displayLanguage}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className={`
            flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-all duration-200
            ${copied 
              ? 'text-green-400 bg-green-400/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'}
          `}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="bg-[#1e1e1e] rounded-b-xl overflow-hidden">
        <SyntaxHighlighter
          language={language || 'text'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            background: 'transparent',
            padding: '1.25rem',
            fontSize: '0.85rem',
            lineHeight: '1.5',
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
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
        </div>
      </div>
    </div>
  );
};
