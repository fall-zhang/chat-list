import { Link } from '@tanstack/react-router';
import { MessageSquare, ListTodo, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNav() {
  const { t } = useLanguage();
  
  return (
    <nav className="flex items-center justify-around h-14 w-full bg-[#f7f7f7] dark:bg-[#191919] border-t border-[#d1d1d1] dark:border-[#222222] pb-safe">
      <Link
        to="/"
        activeProps={{ className: 'text-[#07c160]' }}
        inactiveProps={{ className: 'text-gray-500 dark:text-gray-400' }}
        className="flex flex-col items-center gap-0.5 px-4"
      >
        <MessageSquare size={22} />
        <span className="text-[10px] font-medium">{t('chats')}</span>
      </Link>
      <Link
        to="/tasks"
        activeProps={{ className: 'text-[#07c160]' }}
        inactiveProps={{ className: 'text-gray-500 dark:text-gray-400' }}
        className="flex flex-col items-center gap-0.5 px-4"
      >
        <ListTodo size={22} />
        <span className="text-[10px] font-medium">{t('tasks')}</span>
      </Link>
      <Link
        to="/profile"
        activeProps={{ className: 'text-[#07c160]' }}
        inactiveProps={{ className: 'text-gray-500 dark:text-gray-400' }}
        className="flex flex-col items-center gap-0.5 px-4"
      >
        <User size={22} />
        <span className="text-[10px] font-medium">{t('me')}</span>
      </Link>
    </nav>
  );
}
