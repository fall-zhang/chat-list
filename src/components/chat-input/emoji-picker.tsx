import React, { forwardRef } from 'react';
import { motion } from 'motion/react';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

const EMOJIS = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];


const EmojiPicker = forwardRef<HTMLDivElement, EmojiPickerProps>(({ onSelectEmoji }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className="absolute bottom-14 right-0 w-64 h-64 bg-white dark:bg-[#2a2a2a] border border-[#d1d1d1] dark:border-[#333333] rounded-lg shadow-xl z-50 overflow-y-auto p-2 grid grid-cols-7 gap-1"
    >
      {EMOJIS.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onSelectEmoji(emoji)}
          className="text-xl hover:bg-gray-100 dark:hover:bg-[#333333] rounded p-1 transition-colors"
        >
          {emoji}
        </button>
      ))}
    </motion.div>
  );
});

EmojiPicker.displayName = 'EmojiPicker';

export default EmojiPicker;
