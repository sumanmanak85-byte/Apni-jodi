import React, { useState, useRef, useEffect } from 'react';
import { ScreenType } from '../types';
import { LOGO_URL } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { matchmakingService } from '../services/matchmakingService';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenConcierge: () => void;
  onOpenSafety: () => void;
  onOpenEditProfile?: () => void;
  onOpenCheckout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenConcierge,
  onOpenSafety,
  onOpenEditProfile,
  onOpenCheckout
}) => {
  const { user, isAuthenticated, isAdmin, setIsAuthModalOpen, setAuthModalTab, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [matchesCount, setMatchesCount] = useState(matchmakingService.getMatches().length);
  const [interestsCount, setInterestsCount] = useState(matchmakingService.getInboundInterests().length);

  useEffect(() => {
    const unsub = matchmakingService.subscribe(() => {
      setMatchesCount(matchmakingService.getMatches().length);
      setInterestsCount(matchmakingService.getInboundInterests().length);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-xl border-b border-[#DAC0C2]/30 shadow-[0_1px_8px_rgba(78,5,26,0.04)]">
      <div className="h-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
        >
          <img 
            src={LOGO_URL} 
            alt="Apni Jodi" 
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105" 
          />
          <div className="hidden sm:flex flex-col">
            <span className="font-serif text-xl sm:text-2xl text-[#4E051A] leading-tight font-semibold tracking-tight">
              Apni Jodi
            </span>
            <span className="text-[10px] tracking-[0.12em] text-[#544244] uppercase font-bold">
              Matchmaking & Dating
            </span>
          </div>
        </div>

        {/* Primary Desktop Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <button
            onClick={() => onNavigate('discover')}
            className={`relative py-2 text-sm font-semibold transition-colors cursor-pointer ${
              currentScreen === 'discover' 
                ? 'text-[#4E051A] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#4E051A]' 
                : 'text-[#544244] hover:text-[#4E051A]'
            }`}
          >
            Discover
          </button>

          <button
            onClick={() => onNavigate('matches')}
            className={`relative py-2 text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentScreen === 'matches' 
                ? 'text-[#4E051A] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#4E051A]' 
                : 'text-[#544244] hover:text-[#4E051A]'
            }`}
          >
            <span>Matches</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#735C00] text-white text-[11px] leading-none font-bold">
              {matchesCount}
            </span>
          </button>

          <button
            onClick={() => onNavigate('interests')}
            className={`relative py-2 text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentScreen === 'interests' 
                ? 'text-[#4E051A] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#4E051A]' 
                : 'text-[#544244] hover:text-[#4E051A]'
            }`}
          >
            <span>Interests</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#EAE8E5] text-[#544244] text-[11px] leading-none font-bold">
              {interestsCount}
            </span>
          </button>

          <button
            onClick={() => onNavigate('private-letters')}
            className={`relative py-2 text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentScreen === 'private-letters' 
                ? 'text-[#4E051A] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#4E051A]' 
                : 'text-[#544244] hover:text-[#4E051A]'
            }`}
          >
            <span>Private Letters</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#6B1D2F] text-white text-[11px] leading-none font-bold">
              2
            </span>
          </button>

          <button
            onClick={() => onNavigate('membership')}
            className={`relative py-2 text-sm transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentScreen === 'membership' 
                ? 'text-[#4E051A] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#4E051A]' 
                : 'text-[#544244] hover:text-[#4E051A]'
            }`}
          >
            <span>Membership</span>
            <span className="px-1.5 py-0.5 rounded bg-[#FFE088] text-[#241A00] text-[10px] font-bold tracking-wider uppercase">
              {user?.membershipTier || 'Basic'}
            </span>
          </button>

          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`relative py-2 text-sm font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                currentScreen === 'admin' 
                  ? 'text-amber-800 underline' 
                  : 'text-amber-900 hover:text-[#4E051A]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              <span>Admin Desk</span>
            </button>
          )}

          <button
            onClick={onOpenSafety}
            className="relative py-2 text-sm font-semibold text-[#544244] hover:text-[#4E051A] transition-colors cursor-pointer"
          >
            Safety Center
          </button>
        </nav>

        {/* Action Controls & Authentication */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* Notifications Button */}
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-full text-[#544244] hover:bg-[#EFEEEB] hover:text-[#1B1C1A] transition-colors cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#4E051A] text-white text-[10px] flex items-center justify-center font-bold">
                2
              </span>
            </button>

            {/* Notification Drawer */}
            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 p-4 bg-white rounded-2xl shadow-2xl border border-[#DAC0C2]/40 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[#EFEEEB]">
                  <span className="font-semibold text-sm text-[#4E051A]">Sanctuary Notifications</span>
                  <span className="text-[11px] text-[#735C00] font-bold uppercase">2 Unread</span>
                </div>
                <div className="space-y-3 py-3">
                  <div 
                    onClick={() => { onNavigate('private-letters'); setNotificationsOpen(false); }}
                    className="p-2.5 rounded-xl hover:bg-[#F5F3F0] cursor-pointer transition-colors"
                  >
                    <p className="text-xs font-semibold text-[#1B1C1A]">Meera Sen sent a letter</p>
                    <p className="text-[11px] text-[#544244] mt-0.5">Approved phone and letter exchange permissions.</p>
                    <span className="text-[10px] text-[#877274]">Just now</span>
                  </div>
                  <div 
                    onClick={() => { onNavigate('matches'); setNotificationsOpen(false); }}
                    className="p-2.5 rounded-xl hover:bg-[#F5F3F0] cursor-pointer transition-colors"
                  >
                    <p className="text-xs font-semibold text-[#1B1C1A]">New Bilateral Spark</p>
                    <p className="text-[11px] text-[#544244] mt-0.5">Kabir Mehta mutually accepted your introduction.</p>
                    <span className="text-[10px] text-[#877274]">2 hours ago</span>
                  </div>
                </div>
                <button 
                  onClick={() => setNotificationsOpen(false)}
                  className="w-full py-1.5 text-center text-xs text-[#4E051A] font-semibold hover:underline cursor-pointer"
                >
                  Close Notifications
                </button>
              </div>
            )}
          </div>

          {/* Upgrade Membership CTA */}
          <button
            onClick={() => {
              if (onOpenCheckout) onOpenCheckout();
              else onNavigate('membership');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4E051A] text-white hover:bg-[#6B1D2F] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
            <span>Upgrade (₹{user?.membershipTier === 'VIP' ? 499 : user?.membershipTier === 'Premium' ? 289 : 189}/m)</span>
          </button>

          {/* User authenticated vs Guest state */}
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#EFEEEB] transition-colors cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={user.photoUrl}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#DAC0C2]"
                  />
                  {user.isVerified && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-600 rounded-full border border-white"></span>
                  )}
                </div>
                <span className="material-symbols-outlined text-[#544244] text-[18px] hidden md:inline-block">
                  expand_more
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 py-2 rounded-2xl bg-white shadow-[0_12px_32px_-4px_rgba(74,14,23,0.15)] border border-[#DAC0C2]/40 z-50 flex flex-col animate-in fade-in zoom-in-95">
                  <div className="px-4 py-3 border-b border-[#EFEEEB]">
                    <p className="text-sm font-bold text-[#1B1C1A]">{user.fullName}</p>
                    <p className="text-xs text-[#735C00] font-semibold flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">
                        {user.isVerified ? 'verified' : 'hourglass_top'}
                      </span>
                      {user.isVerified ? 'Govt ID Verified Member' : 'Pending Verification'}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-[#4E051A] font-bold">
                      <span className="px-2 py-0.5 bg-amber-100 rounded text-amber-900">{user.membershipTier} Tier</span>
                      {user.role === 'admin' && <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded">Admin</span>}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        if (onOpenEditProfile) onOpenEditProfile();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#544244] hover:bg-[#F5F3F0] hover:text-[#1B1C1A] flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit_note</span>
                      Edit My Profile & Bio
                    </button>

                    <button
                      onClick={() => { onNavigate('create-profile'); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#544244] hover:bg-[#F5F3F0] hover:text-[#1B1C1A] flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">badge</span>
                      Profile Builder (18+)
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => { onNavigate('admin'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-50/70 hover:bg-amber-100 flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                        Admin Command Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => { onNavigate('membership'); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#544244] hover:bg-[#F5F3F0] hover:text-[#1B1C1A] flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">diamond</span>
                      Subscription & Tax Invoices
                    </button>

                    <button
                      onClick={() => { onOpenConcierge(); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#544244] hover:bg-[#F5F3F0] hover:text-[#1B1C1A] flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">support_agent</span>
                      Support Concierge Desk
                    </button>

                    <div className="h-px bg-[#EFEEEB] my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#BA1A1A] hover:bg-[#FFDAD6]/40 flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-full border border-[#DFCEBD] text-xs font-serif font-semibold text-[#4E051A] hover:bg-[#F3ECE4] cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthModalTab('signup');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-1.5 rounded-full bg-[#4E051A] text-white text-xs font-serif font-semibold hover:bg-[#680C25] cursor-pointer shadow-sm"
              >
                Enroll (18+)
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
