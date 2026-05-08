import { createFileRoute, Link } from '@tanstack/react-router';
import { MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#f5f5f5] dark:bg-[#111111] transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-6 h-full"
      >
        <div className="w-24 h-24 bg-white dark:bg-[#191919] rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-sm border border-gray-100 dark:border-[#222222]">
          <MessageSquare size={40} className="text-[#07c160] opacity-80" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">微信助手</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-50 mx-auto">选择左侧聊天列表开始对话，或查看您的任务进度</p>
      </motion.div>
    </div>
  );
}
