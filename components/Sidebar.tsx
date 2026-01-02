
import React from 'react';
import { Conversation } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onClearHistory: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  onClearHistory,
  isDarkMode,
  toggleTheme
}) => {
  return (
    <aside className={`
      fixed md:relative z-40 h-full w-80 bg-gray-50 dark:bg-[#161b22] border-r border-gray-200 dark:border-gray-800 transition-all duration-300
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:w-0 overflow-hidden'}
    `}>
      <div className="flex flex-col h-full w-80">
        <div className="p-4 flex flex-col gap-4 h-full">
          {/* Action Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Nexus AI</h2>
            <button 
              onClick={onClose}
              className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <button 
            onClick={onNewChat}
            className="flex items-center gap-2 w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all active:scale-95 shadow-md shadow-indigo-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Conversation
          </button>

          {/* History List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-4 mb-2 ml-2">Recent chats</p>
            {conversations.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-8 px-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                Your chat history will appear here.
              </div>
            ) : (
              conversations.map((convo) => (
                <div 
                  key={convo.id}
                  className={`
                    group relative flex items-center p-3 rounded-xl cursor-pointer transition-all
                    ${activeId === convo.id 
                      ? 'bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}
                  `}
                  onClick={() => onSelect(convo.id)}
                >
                  <div className="flex-1 overflow-hidden">
                    <p className={`text-sm truncate ${activeId === convo.id ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                      {convo.title}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                      {new Date(convo.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(convo.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 transition-all rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Settings Footer */}
          <div className="mt-auto border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2">
             <button 
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
            >
              {isDarkMode ? (
                <><svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg> Light Mode</>
              ) : (
                <><svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg> Dark Mode</>
              )}
            </button>
            <button 
              onClick={onClearHistory}
              className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-sm font-medium text-red-600 dark:text-red-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Clear conversations
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
