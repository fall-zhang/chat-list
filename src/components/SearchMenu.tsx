import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Newspaper, Globe, PlayCircle, Music, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SearchMenu: React.FC = () => {
  const { t } = useLanguage();

  const quickSearchItems = [
    { icon: <MessageSquare size={18} className="text-blue-500" />, label: t('moments') },
    { icon: <Newspaper size={18} className="text-orange-500" />, label: t('articles') },
    { icon: <Globe size={18} className="text-blue-400" />, label: t('officialAccounts') },
    { icon: <PlayCircle size={18} className="text-red-500" />, label: t('channels') },
    { icon: <Music size={18} className="text-yellow-500" />, label: t('music') },
    { icon: <Users size={18} className="text-indigo-500" />, label: t('stickers') },
  ];

  return (
    <motion.div
      key="search-menu"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute inset-0 bg-[#f7f7f7] dark:bg-[#191919] z-10 p-6"
    >
      <div className="text-center mb-8">
        <p className="text-xs text-gray-400 dark:text-gray-500">{t('searchPlaceholder')}</p>
      </div>
      <div className="grid grid-cols-3 gap-y-8">
        {quickSearchItems.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#2a2a2a] flex items-center justify-center shadow-sm group-active:scale-95 transition-transform">
              {item.icon}
            </div>
            <span className="text-[11px] text-gray-600 dark:text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchMenu;
