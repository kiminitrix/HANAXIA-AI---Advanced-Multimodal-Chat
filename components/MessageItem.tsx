
import React from 'react';
import { Message, Role } from '../types';

interface MessageItemProps {
  message: Message;
  isLast: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isLast }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse animate-in slide-in-from-right-4' : 'animate-in slide-in-from-left-4'} duration-300`}>
      {/* Avatar */}
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md
        ${isUser ? 'bg-indigo-600' : 'bg-gradient-to-tr from-indigo-500 to-purple-500'}
      `}>
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Bubble */}
      <div className={`
        flex flex-col max-w-[85%]
        ${isUser ? 'items-end' : 'items-start'}
      `}>
        <div className={`
          relative p-4 rounded-2xl text-sm leading-relaxed
          ${isUser 
            ? 'bg-indigo-600 text-white shadow-lg rounded-tr-none' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700/50 rounded-tl-none'}
        `}>
          <div className="whitespace-pre-wrap break-words prose dark:prose-invert max-w-none">
            {message.content || (isLast && !isUser ? <span className="inline-block w-1.5 h-4 bg-gray-400 dark:bg-gray-500 animate-pulse ml-1 align-middle" /> : "...")}
          </div>
          
          <div className={`text-[9px] mt-2 opacity-60 ${isUser ? 'text-indigo-100 text-right' : 'text-gray-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Actions for assistant messages */}
        {!isUser && message.content && (
           <div className="flex items-center gap-3 mt-1 ml-1">
             <button 
              onClick={() => navigator.clipboard.writeText(message.content)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-400 transition-colors"
              title="Copy"
             >
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
             </button>
             <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-400 transition-colors" title="Helpful">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
             </button>
           </div>
        )}
      </div>
    </div>
  );
};
