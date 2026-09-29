import React from 'react';
import { ScreenType } from '../types';
import { LOGO_URL } from '../data/mockData';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenSafety: () => void;
  onOpenConcierge: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSafety, onOpenConcierge }) => {
  return (
    <footer className="w-full bg-[#f5f3f0] mt-16 border-t border-[#dac0c2]/40">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img 
                src={LOGO_URL} 
                alt="Apni Jodi" 
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
              />
              <span className="font-serif text-2xl text-[#4e051a] font-semibold">
                Apni Jodi
              </span>
            </div>
            <p className="text-sm text-[#544244] max-w-sm leading-relaxed">
              Where heritage meets intentional companionship. An editorial matchmaking experience curated for high-intent individuals, distinguished families, and sacred lifelong bonds.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eae8e5] text-xs font-semibold text-[#544244]">
                <span className="material-symbols-outlined text-[15px] text-[#735c00]">verified</span>
                18+ Verified Only
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eae8e5] text-xs font-semibold text-[#544244]">
                <span className="material-symbols-outlined text-[15px] text-[#4e051a]">lock</span>
                100% Privacy Shield
              </span>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className="flex flex-col gap-3">
            <span className="text-sm text-[#4e051a] font-bold tracking-wide">Explore</span>
            <button 
              onClick={() => onNavigate('discover')}
              className="text-left text-xs text-[#544244] hover:text-[#4e051a] transition-colors"
            >
              Curated Discovery
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="text-left text-xs text-[#544244] hover:text-[#4e051a] transition-colors"
            >
              Our Method & Ethics
            </button>
            <button 
              onClick={() => onNavigate('membership')}
              className="text-left text-xs text-[#544244] hover:text-[#4e051a] transition-colors"
            >
              Privilege Tiers
            </button>
            <button 
              onClick={() => onNavigate('matches')}
              className="text-left text-xs text-[#544244] hover:text-[#4e051a] transition-colors"
            >
              Unveiled Journeys
            </button>
          </div>

          {/* Column 2: Trust & Safety */}
          <div className="flex flex-col gap-3">
            <span className="text-sm text-[#4e051a] font-bold tracking-wide">Trust & Safety</span>
            <button 
              onClick={onOpenSafety}
              className="text-left text-xs text-[#544244] hover:text-[#4e051a] transition-colors"
            >
              Safety Guidelines
            </button>
            <button 
              onClick={onOpenSafety}
              className="text-left text-xs text-[#544244] hover:text-[#4e051a] transition-colors"
            >
              ID Verification Policy
            </button>
            <button 
              onClick={onOpenConcierge}
              className="text-left text-xs text-[#544244] hover:text-[#4e051a] transition-colors"
            >
              Concierge Support
            </button>
            <button 
              onClick={onOpenSafety}
              className="text-left text-xs text-[#544244] hover:text-[#4e051a] transition-colors"
            >
              Grievance Redressal
            </button>
          </div>

          {/* Column 3: Legal & Standards */}
          <div className="flex flex-col gap-3">
            <span className="text-sm text-[#4e051a] font-bold tracking-wide">Legal & Standards</span>
            <span className="text-xs text-[#544244] cursor-pointer hover:text-[#4e051a] transition-colors">
              Terms of Respect
            </span>
            <span className="text-xs text-[#544244] cursor-pointer hover:text-[#4e051a] transition-colors">
              Privacy Architecture
            </span>
            <span className="text-xs text-[#544244] cursor-pointer hover:text-[#4e051a] transition-colors">
              Cookie Preferences
            </span>
            <div className="flex items-center gap-3 pt-2 text-[#544244]">
              <span className="material-symbols-outlined text-[18px] hover:text-[#4e051a] cursor-pointer">language</span>
              <span className="material-symbols-outlined text-[18px] hover:text-[#4e051a] cursor-pointer">mail</span>
              <span className="material-symbols-outlined text-[18px] hover:text-[#4e051a] cursor-pointer">share</span>
            </div>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="h-px bg-[#e4e2df] mt-12 mb-8"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#544244] text-center md:text-left">
          <span>© 2025 Apni Jodi Matrimonial & Dating Private Limited. All sanctified rights reserved.</span>
          <span className="font-semibold text-[#4e051a] bg-[#efeeeb] px-3 py-1 rounded-md">
            Discreet Statement: Transactions appear as ‘AJ DIGITAL CONNECT’
          </span>
        </div>
      </div>
    </footer>
  );
};
