
import React, { useRef, useEffect } from 'react';
import { Message, Role } from '../types';
import { MessageItem } from './MessageItem';
import { ChatInput } from './ChatInput';

interface ChatWindowProps {
  messages: Message[];
  isStreaming: boolean;
  onSendMessage: (text: string) => void;
  onRegenerate: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isStreaming,
  onSendMessage,
  onRegenerate
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Message Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-4 pb-24 px-4 md:px-0">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center pt-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 rotate-3">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
               </div>
               <div className="text-center">
                 <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">How can I help you today?</h3>
                 <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    Ask questions, write code, analyze data, or just have a chat with Nexus AI.
                 </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full px-4">
                 {[
                   "Write a Python script for web scraping",
                   "Explain quantum computing in simple terms",
                   "Help me draft a professional email",
                   "What are some creative gift ideas?"
                 ].map((suggestion, idx) => (
                   <button 
                     key={idx}
                     onClick={() => onSendMessage(suggestion)}
                     className="p-4 text-left border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm group"
                   >
                     <p className="text-gray-800 dark:text-gray-200">{suggestion}</p>
                     <span className="text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">Try this →</span>
                   </button>
                 ))}
               </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <MessageItem key={msg.id} message={msg} isLast={idx === messages.length - 1} />
              ))}
              {isStreaming && (
                <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 mr-12 border border-gray-100 dark:border-gray-700/50 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4" />
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2" />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} className="h-10" />
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-[#0d1117] via-white dark:via-[#0d1117] pt-10 pb-6">
        <div className="max-w-3xl mx-auto px-4 relative">
          {messages.length > 0 && !isStreaming && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2">
              <button 
                onClick={onRegenerate}
                className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
              >
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Regenerate Response
              </button>
            </div>
          )}
          <ChatInput onSend={onSendMessage} disabled={isStreaming} />
          <p className="text-[10px] text-center text-gray-400 dark:text-gray-600 mt-2">
            Nexus AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
};
