import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Pin, PinOff } from 'lucide-react';
import { Message } from '../types';

interface PinnedMessagesBarProps {
  pinnedMessages: Message[];
  isPinnedExpanded: boolean;
  setIsPinnedExpanded: (expanded: boolean) => void;
  onTogglePin: (messageId: string) => void;
}

const PinnedMessagesBar: React.FC<PinnedMessagesBarProps> = ({
  pinnedMessages,
  isPinnedExpanded,
  setIsPinnedExpanded,
  onTogglePin
}) => {
  if (pinnedMessages.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-white/80 dark:bg-[#191919]/80 backdrop-blur-md border-b border-gray-100 dark:border-[#222222] overflow-hidden z-10"
      >
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <Pin size={14} className="text-blue-500 fill-current rotate-45 flex-shrink-0" />
            <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {pinnedMessages.length === 1 
                ? pinnedMessages[0].text 
                : `${pinnedMessages.length} 条置顶消息`}
            </div>
          </div>
          <button 
            onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
            className="text-[10px] text-blue-500 font-medium px-2 py-1 hover:bg-blue-50 rounded-md transition-colors"
          >
            {isPinnedExpanded ? '收起' : '查看全部'}
          </button>
        </div>
        
        <AnimatePresence>
          {isPinnedExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-4 pb-3 space-y-2 max-h-40 overflow-y-auto"
            >
              {pinnedMessages.map(msg => (
                <div 
                  key={msg.id} 
                  className="flex items-center justify-between gap-3 p-2 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg group"
                >
                  <div className="text-xs text-gray-700 dark:text-gray-300 truncate flex-1">{msg.text}</div>
                  <button 
                    onClick={() => onTogglePin(msg.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <PinOff size={12} />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default PinnedMessagesBar;
