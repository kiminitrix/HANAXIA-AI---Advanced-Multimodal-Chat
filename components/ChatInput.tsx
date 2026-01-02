
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <form 
      onSubmit={handleSubmit}
      className={`
        flex items-end gap-2 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl transition-all duration-300
        ${disabled ? 'opacity-70 bg-gray-50 dark:bg-gray-900 cursor-not-allowed' : 'focus-within:ring-2 focus-within:ring-indigo-500/50'}
      `}
    >
      <button 
        type="button"
        className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </button>

      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 resize-none max-h-48 dark:text-gray-100 placeholder-gray-400"
      />

      <button
        type="submit"
        disabled={!input.trim() || disabled}
        className={`
          p-2.5 rounded-2xl transition-all active:scale-95 flex-shrink-0
          ${!input.trim() || disabled 
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'}
        `}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </button>
    </form>
  );
};
