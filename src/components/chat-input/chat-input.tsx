import { useRef, useLayoutEffect, KeyboardEvent, useState, useEffect } from 'react';
import { Mic, Smile, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Assistant } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import EmojiPicker from './emoji-picker';
import AssistantPicker from './assistant-picker';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSend: () => void;
  assistants?: Assistant[];
  onSelectAssistant?: (assistant: Assistant) => void;
}


export default function ChatInput({ 
  inputValue, 
  setInputValue, 
  onSend, 
  assistants = [],
  onSelectAssistant 
}: ChatInputProps) {
  const { t } = useLanguage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAssistantPicker, setShowAssistantPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const assistantPickerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '40px';
      if (inputValue) {
        const scrollHeight = textarea.scrollHeight;
        const newHeight = Math.min(scrollHeight, 100);
        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = scrollHeight > 100 ? 'auto' : 'hidden';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }

    // Detect @ for assistant picker
    if (inputValue.endsWith('@')) {
      setShowAssistantPicker(true);
    } else if (showAssistantPicker && !inputValue.includes('@')) {
      setShowAssistantPicker(false);
    }
  }, [inputValue]);

  // Close pickers when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (assistantPickerRef.current && !assistantPickerRef.current.contains(event.target as Node)) {
        setShowAssistantPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const addEmoji = (emoji: string) => {
    setInputValue(inputValue + emoji);
    textareaRef.current?.focus();
  };

  const handleSelectAssistant = (assistant: Assistant) => {
    // Replace the last @ with the assistant name
    const lastAtIndex = inputValue.lastIndexOf('@');
    const newValue = inputValue.substring(0, lastAtIndex) + `@${assistant.name} `;
    setInputValue(newValue);
    setShowAssistantPicker(false);
    onSelectAssistant?.(assistant);
    textareaRef.current?.focus();
  };

  return (
    <footer className="bg-[#f7f7f7] dark:bg-[#191919] border-t border-[#d1d1d1] dark:border-[#222222] p-3 pb-safe relative">
      <div className="flex items-end gap-3 max-w-5xl mx-auto">
        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#07c160] transition-colors">
          <Mic size={24} />
        </button>
        
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t('inputPlaceholder')}
            className="w-full bg-white dark:bg-[#2a2a2a] border border-[#e0e0e0] dark:border-[#333333] rounded-md pl-3 pr-1 py-2 text-sm focus:outline-none focus:border-[#07c160] resize-none min-h-[40px] max-h-[100px] leading-[20px] dark:text-white dark:placeholder-gray-500"
            style={{ height: '40px', overflowY: 'hidden' }}
          />

          {/* Assistant Picker */}
          <AnimatePresence>
            {showAssistantPicker && assistants.length > 0 && (
              <AssistantPicker 
                ref={assistantPickerRef}
                assistants={assistants}
                onSelectAssistant={handleSelectAssistant}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 transition-colors ${showEmojiPicker ? 'text-[#07c160]' : 'text-gray-600 dark:text-gray-400 hover:text-[#07c160]'}`}
          >
            <Smile size={24} />
          </button>

          <AnimatePresence>
            {showEmojiPicker && (
              <EmojiPicker 
                ref={emojiPickerRef}
                onSelectEmoji={addEmoji}
              />
            )}
          </AnimatePresence>
        </div>

        {inputValue.trim() ? (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={onSend}
            className="bg-[#07c160] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#06ae56] active:scale-95 transition-all flex items-center gap-2"
          >
            {t('send')}
          </motion.button>
        ) : (
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#07c160] transition-colors">
            <PlusCircle size={24} />
          </button>
        )}
      </div>
    </footer>
  );
}
