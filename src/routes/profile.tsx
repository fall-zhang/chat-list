import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { 
  Settings, 
  Moon, 
  CreditCard, 
  Heart, 
  Package, 
  Languages 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import ProfileHeader from '../components/ProfileHeader';
import ProfileMenuItem from '../components/ProfileMenuItem';
import LanguageModal from '../components/LanguageModal';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const { language, t } = useLanguage();
  const [avatar, setAvatar] = useState(() => localStorage.getItem('user-avatar') || '👤');
  const [name] = useState(() => localStorage.getItem('user-name') || (language === 'zh' ? '微信用户' : 'WeChat User'));
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const changeAvatar = () => {
    const avatars = ['👤', '🐱', '🐶', '🦊', '🐻', '🐼', '🦁', '🐯'];
    const currentIndex = avatars.indexOf(avatar);
    const nextIndex = (currentIndex + 1) % avatars.length;
    const newAvatar = avatars[nextIndex];
    setAvatar(newAvatar);
    localStorage.setItem('user-avatar', newAvatar);
  };

  const menuItems = [
    { icon: <CreditCard size={20} className="text-blue-500" />, label: t('service') },
    { icon: <Package size={20} className="text-orange-500" />, label: t('favorites') },
    { icon: <Heart size={20} className="text-red-500" />, label: t('moments') },
    { icon: <Package size={20} className="text-blue-400" />, label: t('cards') },
    { icon: <Package size={20} className="text-yellow-500" />, label: t('stickers') },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f7f7f7] dark:bg-[#111111] font-sans text-[#1a1a1a] dark:text-gray-200 transition-colors duration-300 overflow-y-auto relative">
      <ProfileHeader 
        avatar={avatar} 
        name={name} 
        onChangeAvatar={changeAvatar} 
      />

      <div className="mt-2 space-y-2">
        <div className="bg-white dark:bg-[#191919] divide-y divide-gray-50 dark:divide-[#222222]">
          {menuItems.slice(0, 1).map((item, idx) => (
            <ProfileMenuItem key={idx} icon={item.icon} label={item.label} />
          ))}
        </div>

        <div className="bg-white dark:bg-[#191919] divide-y divide-gray-50 dark:divide-[#222222]">
          {menuItems.slice(1).map((item, idx) => (
            <ProfileMenuItem key={idx} icon={item.icon} label={item.label} />
          ))}
        </div>

        <div className="bg-white dark:bg-[#191919] divide-y divide-gray-50 dark:divide-[#222222]">
          {/* Theme Mode */}
          <div className="px-5 py-4 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 flex items-center justify-center">
                <Moon size={20} className="text-indigo-500" />
              </div>
              <span className="flex-1 text-[15px]">{t('theme')}</span>
            </div>
            
            <div className="flex bg-gray-100 dark:bg-[#2a2a2a] p-1 rounded-lg">
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <button 
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${theme === mode ? 'bg-white dark:bg-[#333333] shadow-sm text-[#07c160]' : 'text-gray-400 dark:text-gray-500'}`}
                >
                  {t(mode)}
                </button>
              ))}
            </div>
          </div>

          <ProfileMenuItem 
            icon={<Languages size={20} className="text-green-500" />} 
            label={t('language')}
            extra={<span className="text-sm text-gray-400">{language === 'zh' ? '简体中文' : 'English'}</span>}
            onClick={() => setIsLanguageModalOpen(true)}
          />

          <ProfileMenuItem 
            icon={<Settings size={20} className="text-gray-400" />} 
            label={t('settings')} 
          />
        </div>
      </div>

      <footer className="mt-8 pb-12 text-center">
        <p className="text-[10px] text-gray-300 dark:text-gray-600">WeChat Clone {t('version')} 1.0.0</p>
      </footer>

      <LanguageModal 
        isOpen={isLanguageModalOpen} 
        onClose={() => setIsLanguageModalOpen(false)} 
      />
    </div>
  );
}
