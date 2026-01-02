
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { SystemPromptModal } from './components/SystemPromptModal';
import { 
  Message, 
  Role, 
  Conversation, 
  ModelProvider 
} from './types';
import { MODELS, INITIAL_SYSTEM_PROMPT } from './constants';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState(INITIAL_SYSTEM_PROMPT);
  const [selectedModelId, setSelectedModelId] = useState(MODELS[0].id);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    const savedConvos = localStorage.getItem('hanaxia_conversations');
    const savedTheme = localStorage.getItem('hanaxia_theme');
    const savedPrompt = localStorage.getItem('hanaxia_system_prompt');

    if (savedConvos) setConversations(JSON.parse(savedConvos));
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    if (savedPrompt) setSystemPrompt(savedPrompt);

    const parsedConvos = savedConvos ? JSON.parse(savedConvos) : [];
    if (parsedConvos.length === 0) {
      handleNewChat();
    } else {
      setActiveId(parsedConvos[0].id);
    }
  }, []);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('hanaxia_conversations', JSON.stringify(conversations));
    localStorage.setItem('hanaxia_theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('hanaxia_system_prompt', systemPrompt);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [conversations, isDarkMode, systemPrompt]);

  const activeConversation = conversations.find(c => c.id === activeId);

  const handleNewChat = useCallback(() => {
    const newConvo: Conversation = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      model: selectedModelId,
      provider: MODELS.find(m => m.id === selectedModelId)?.provider || ModelProvider.GEMINI,
      createdAt: Date.now()
    };
    setConversations(prev => [newConvo, ...prev]);
    setActiveId(newConvo.id);
  }, [selectedModelId]);

  const handleSendMessage = async (text: string) => {
    if (!activeId || !text.trim() || isStreaming) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: Role.USER,
      content: text,
      timestamp: Date.now()
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          messages: [...c.messages, userMessage],
          title: c.messages.length === 0 ? text.slice(0, 30) : c.title
        };
      }
      return c;
    }));

    setIsStreaming(true);

    const assistantId = uuidv4();
    const assistantMessage: Message = {
      id: assistantId,
      role: Role.ASSISTANT,
      content: '',
      timestamp: Date.now()
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeId) {
        return { ...c, messages: [...c.messages, assistantMessage] };
      }
      return c;
    }));

    try {
      const activeConvo = conversations.find(c => c.id === activeId);
      const history = activeConvo ? [...activeConvo.messages, userMessage] : [userMessage];
      const model = MODELS.find(m => m.id === selectedModelId) || MODELS[0];

      if (model.provider === ModelProvider.GEMINI) {
        const stream = geminiService.streamChat(model.id, history, systemPrompt);
        let accumulatedResponse = '';

        for await (const chunk of stream) {
          accumulatedResponse += chunk;
          setConversations(prev => prev.map(c => {
            if (c.id === activeId) {
              const newMessages = [...c.messages];
              const lastIdx = newMessages.length - 1;
              newMessages[lastIdx] = { ...newMessages[lastIdx], content: accumulatedResponse };
              return { ...c, messages: newMessages };
            }
            return c;
          }));
        }
      } else {
        const dummyText = `This is a simulated response from ${model.name}.`;
        let partial = '';
        for (const word of dummyText.split(' ')) {
          partial += word + ' ';
          setConversations(prev => prev.map(c => {
            if (c.id === activeId) {
              const newMessages = [...c.messages];
              const lastIdx = newMessages.length - 1;
              newMessages[lastIdx] = { ...newMessages[lastIdx], content: partial };
              return { ...c, messages: newMessages };
            }
            return c;
          }));
          await new Promise(r => setTimeout(r, 50));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeId === id) {
      const remaining = conversations.filter(c => c.id !== id);
      setActiveId(remaining[0]?.id || null);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-white dark:bg-[#0d1117] transition-colors duration-300">
      <SystemPromptModal 
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        currentPrompt={systemPrompt}
        onSave={setSystemPrompt}
      />

      {/* Floating Re-open Button for Mobile */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-4 left-4 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg md:hidden hover:bg-indigo-700 transition-all active:scale-95 animate-in fade-in zoom-in"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
      )}

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNewChat={handleNewChat}
        onDelete={handleDeleteConversation}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="flex-1 flex flex-col min-w-0 relative h-full transition-all duration-300">
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-8 bg-white/80 dark:bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3 overflow-hidden">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all hidden md:block"
              title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
               <svg 
                 className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} 
                 fill="none" 
                 stroke="currentColor" 
                 viewBox="0 0 24 24"
               >
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
               </svg>
            </button>
            <h1 className="font-semibold text-lg truncate text-gray-800 dark:text-gray-100">
              {activeConversation?.title || 'New Chat'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <select 
               value={selectedModelId}
               onChange={(e) => setSelectedModelId(e.target.value)}
               className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer outline-none"
             >
               {MODELS.map(m => (
                 <option key={m.id} value={m.id}>{m.name}</option>
               ))}
             </select>
             <button 
              onClick={() => setIsPromptModalOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400"
              title="System Prompt"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
             </button>
          </div>
        </header>

        <ChatWindow 
          messages={activeConversation?.messages || []}
          isStreaming={isStreaming}
          onSendMessage={handleSendMessage}
          onRegenerate={() => {
            const lastUserMsg = activeConversation?.messages.filter(m => m.role === Role.USER).pop();
            if (lastUserMsg) {
              setConversations(prev => prev.map(c => {
                if (c.id === activeId) {
                  const newMsgs = [...c.messages];
                  if (newMsgs[newMsgs.length - 1].role === Role.ASSISTANT) {
                    newMsgs.pop();
                  }
                  return { ...c, messages: newMsgs };
                }
                return c;
              }));
              handleSendMessage(lastUserMsg.content);
            }
          }}
        />
      </main>
    </div>
  );
};

export default App;
