import React, { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { mockChats } from '../mockData';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import SearchHeader from './SearchHeader';
import SearchMenu from './SearchMenu';

export default function ChatList() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return mockChats;
    const query = searchQuery.toLowerCase();
    return mockChats.filter(chat => 
      chat.name.toLowerCase().includes(query) || 
      chat.lastMessage.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="w-full bg-[#ededed] dark:bg-[#111111] border-r border-[#d1d1d1] dark:border-[#222222] flex flex-col h-full overflow-hidden relative">
      <SearchHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
      />

      {/* Search Menu / Results */}
      <div className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          {isSearching && !searchQuery ? (
            <SearchMenu />
          ) : (
            <motion.div
              key="chat-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="divide-y divide-[#dcdcdc] dark:divide-[#222222]"
            >
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => {
                  const userMessages = chat.messages.filter(m => m.sender === 'user');
                  const total = userMessages.length;
                  const completed = userMessages.filter(m => m.isCompleted).length;
                  const progress = total > 0 ? (completed / total) * 100 : 0;

                  return (
                    <Link
                      key={chat.id}
                      to="/chat/$chatId"
                      params={{ chatId: chat.id }}
                      activeProps={{ className: 'bg-[#c5c5c5] dark:bg-[#2a2a2a]' }}
                      className="flex items-center gap-3 p-3 hover:bg-[#dbdbdb] dark:hover:bg-[#222222] cursor-pointer transition-colors group"
                    >
                      <div className="w-12 h-12 bg-[#07c160] rounded-md flex items-center justify-center text-white font-bold text-xl flex-shrink-0 relative">
                        {chat.avatar}
                        {total > 0 && progress === 100 && (
                          <div className="absolute -top-1 -right-1 bg-white dark:bg-[#191919] rounded-full p-0.5 shadow-sm">
                            <CheckCircle2 size={12} className="text-[#07c160] fill-current" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-medium text-sm truncate dark:text-white">{chat.name}</h3>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">10:55</span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1 mr-2">{chat.lastMessage}</p>
                          {total > 0 && (
                            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                              <span className="text-[9px] font-bold text-[#07c160]">{completed}/{total}</span>
                              <div className="w-10 h-1 bg-gray-200 dark:bg-[#333333] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#07c160]" 
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="p-10 text-center">
                  <p className="text-sm text-gray-400">{t('noSearchResults')}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
