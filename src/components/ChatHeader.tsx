import { User, PlusCircle, ChevronLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useLanguage } from '../context/LanguageContext';

interface ChatHeaderProps {
  name?: string;
  showBack?: boolean;
  totalTasks?: number;
  completedTasks?: number;
}

export default function ChatHeader({ 
  name = '微信助手', 
  showBack = false,
  totalTasks = 0,
  completedTasks = 0
}: ChatHeaderProps) {
  const { t } = useLanguage();
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <header className="flex flex-col bg-[#ededed] dark:bg-[#191919] border-b border-[#d1d1d1] dark:border-[#222222] sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link to="/" className="md:hidden mr-1 text-gray-600 dark:text-gray-400">
              <ChevronLeft size={24} />
            </Link>
          )}
          <div className="w-10 h-10 bg-[#07c160] rounded-md flex-shrink-0 flex items-center justify-center text-white">
            <User size={24} />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-lg leading-tight truncate dark:text-white">{name}</h1>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{t('online')}</p>
              {totalTasks > 0 && (
                <span className="text-[10px] bg-white dark:bg-[#2a2a2a] px-1.5 py-0.5 rounded-full border border-gray-200 dark:border-[#333333] text-gray-600 dark:text-gray-400 font-medium">
                  {t('taskProgress')}: {completedTasks}/{totalTasks}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-gray-600 dark:text-gray-400">
          <PlusCircle size={20} className="cursor-pointer hover:text-[#07c160] transition-colors" />
        </div>
      </div>
      
      {/* Task Progress Bar */}
      {totalTasks > 0 && (
        <div className="h-1 w-full bg-gray-200 dark:bg-[#333333] overflow-hidden">
          <div 
            className="h-full bg-[#07c160] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </header>
  );
}
