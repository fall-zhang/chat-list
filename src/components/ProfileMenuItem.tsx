import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ProfileMenuItemProps {
  icon: React.ReactNode;
  label: string;
  extra?: React.ReactNode;
  onClick?: () => void;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({ icon, label, extra, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="px-5 py-4 flex items-center gap-4 active:bg-gray-50 dark:active:bg-[#222222] cursor-pointer transition-colors"
    >
      <div className="w-5 h-5 flex items-center justify-center">
        {icon}
      </div>
      <span className="flex-1 text-[15px]">{label}</span>
      <div className="flex items-center gap-1">
        {extra}
        <ChevronRight size={18} className="text-gray-200 dark:text-gray-700" />
      </div>
    </div>
  );
};

export default ProfileMenuItem;
