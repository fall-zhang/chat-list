import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import { Assistant } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface AssistantPickerProps {
  assistants: Assistant[];
  onSelectAssistant: (assistant: Assistant) => void;
}

const AssistantPicker = forwardRef<HTMLDivElement, AssistantPickerProps>(({ assistants, onSelectAssistant }, ref) => {
  const { t } = useLanguage();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className="absolute bottom-14 left-0 w-64 bg-white dark:bg-[#2a2a2a] border border-[#d1d1d1] dark:border-[#333333] rounded-lg shadow-xl z-50 overflow-hidden"
    >
      <div className="p-2 bg-gray-50 dark:bg-[#1f1f1f] border-b border-gray-100 dark:border-[#333333] text-[10px] text-gray-500 font-bold uppercase tracking-wider">
        {t('selectAssistant')}
      </div>
      <div className="max-h-48 overflow-y-auto">
        {assistants.map((assistant) => (
          <button
            key={assistant.id}
            onClick={() => onSelectAssistant(assistant)}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-[#333333] transition-colors text-left border-b border-gray-50 dark:border-[#333333] last:border-none"
          >
            <div className="text-xl">{assistant.avatar}</div>
            <div>
              <div className="text-sm font-bold dark:text-white">{assistant.name}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{assistant.description}</div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
});

AssistantPicker.displayName = 'AssistantPicker';

export default AssistantPicker;
