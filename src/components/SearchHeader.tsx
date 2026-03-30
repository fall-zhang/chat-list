import React from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  isSearching, 
  setIsSearching 
}) => {
  const { t } = useLanguage();

  return (
    <div className={`p-3 bg-[#f7f7f7] dark:bg-[#191919] border-b border-[#d1d1d1] dark:border-[#222222] sticky top-0 z-20 transition-all duration-300 ${isSearching ? 'pb-4' : ''}`}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search 
            size={14} 
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-opacity ${isSearching && searchQuery ? 'opacity-0' : 'opacity-100'}`} 
          />
          <input 
            type="text" 
            placeholder={t('search')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
            className={`w-full bg-[#e2e2e2] dark:bg-[#2a2a2a] border-none rounded-md py-1.5 text-sm focus:outline-none dark:text-white dark:placeholder-gray-500 transition-all ${isSearching && searchQuery ? 'pl-3' : 'pl-8'} ${isSearching ? 'pr-8' : 'pr-3'}`}
          />
          {isSearching && searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {isSearching && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => {
              setIsSearching(false);
              setSearchQuery('');
            }}
            className="text-sm text-[#07c160] font-medium whitespace-nowrap"
          >
            {t('cancel')}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default SearchHeader;
