import React from 'react';
import { ChevronRight, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProfileHeaderProps {
  avatar: string;
  name: string;
  onChangeAvatar: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ avatar, name, onChangeAvatar }) => {
  const { t } = useLanguage();

  return (
    <section className="bg-white dark:bg-[#191919] px-6 pt-16 pb-8 flex items-center gap-4 border-b border-gray-100 dark:border-[#222222]">
      <div className="relative group">
        <div 
          onClick={onChangeAvatar}
          className="w-16 h-16 bg-gray-100 dark:bg-[#2a2a2a] rounded-xl flex items-center justify-center text-3xl cursor-pointer hover:brightness-95 transition-all"
        >
          {avatar}
        </div>
        <button 
          onClick={onChangeAvatar}
          className="absolute -bottom-1 -right-1 bg-white dark:bg-[#333333] p-1 rounded-full shadow-sm border border-gray-100 dark:border-[#444444] text-gray-400"
        >
          <Camera size={12} />
        </button>
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold dark:text-white">{name}</h2>
        <p className="text-sm text-gray-400 mt-1">{t('wechatId')}: wxid_88888888</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] border border-gray-200 dark:border-[#333333] px-1.5 py-0.5 rounded text-gray-400">+ {t('status')}</span>
        </div>
      </div>
      <ChevronRight size={20} className="text-gray-300" />
    </section>
  );
};

export default ProfileHeader;
