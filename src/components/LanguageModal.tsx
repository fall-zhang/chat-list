import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { id: 'zh', label: t('chinese') },
    { id: 'en', label: t('english') },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#191919] rounded-t-2xl z-[101] pb-safe"
          >
            <div className="p-4 border-b border-gray-100 dark:border-[#222222] flex items-center justify-between">
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
              <h3 className="font-bold text-lg dark:text-white">{t('language')}</h3>
              <div className="w-10" /> {/* Spacer */}
            </div>
            <div className="p-2">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setLanguage(lang.id as any);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-[#222222] rounded-xl transition-colors"
                >
                  <span className={`text-[15px] ${language === lang.id ? 'text-[#07c160] font-bold' : 'dark:text-gray-300'}`}>
                    {lang.label}
                  </span>
                  {language === lang.id && (
                    <Check size={20} className="text-[#07c160]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LanguageModal;
