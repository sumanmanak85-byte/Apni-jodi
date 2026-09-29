import React from 'react';
import { ScreenType } from '../types';

interface MobileNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentScreen, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#fbf9f6]/95 backdrop-blur-xl md:hidden border-t border-[#dac0c2]/40 shadow-[0_-2px_12px_rgba(74,14,23,0.06)] px-2 py-1.5 flex items-center justify-around">
      
      <button 
        onClick={() => onNavigate('discover')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
          currentScreen === 'discover' ? 'text-[#4e051a] font-bold' : 'text-[#544244]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">explore</span>
        <span className="text-[10px]">Discover</span>
      </button>

      <button 
        onClick={() => onNavigate('matches')}
        className={`relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
          currentScreen === 'matches' ? 'text-[#4e051a] font-bold' : 'text-[#544244]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">favorite</span>
        <span className="text-[10px]">Matches</span>
        <span className="absolute top-0 right-1 px-1 py-0.2 rounded-full bg-[#735c00] text-white text-[9px] leading-tight font-bold">
          4
        </span>
      </button>

      <button 
        onClick={() => onNavigate('private-letters')}
        className={`relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
          currentScreen === 'private-letters' ? 'text-[#4e051a] font-bold' : 'text-[#544244]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">mail</span>
        <span className="text-[10px]">Letters</span>
        <span className="absolute top-0 right-1 px-1 py-0.2 rounded-full bg-[#4e051a] text-white text-[9px] leading-tight font-bold">
          3
        </span>
      </button>

      <button 
        onClick={() => onNavigate('membership')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
          currentScreen === 'membership' ? 'text-[#4e051a] font-bold' : 'text-[#544244]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">diamond</span>
        <span className="text-[10px]">VIP</span>
      </button>

      <button 
        onClick={() => onNavigate('create-profile')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
          currentScreen === 'create-profile' ? 'text-[#4e051a] font-bold' : 'text-[#544244]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">person</span>
        <span className="text-[10px]">Dossier</span>
      </button>

    </div>
  );
};
