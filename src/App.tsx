import React, { useState } from 'react';
import { ScreenType, Profile, MembershipTier } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { DossierModal } from './components/DossierModal';
import { ConciergeModal } from './components/ConciergeModal';
import { SafetyModal } from './components/SafetyModal';
import { AuthModal } from './components/AuthModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { CheckoutModal } from './components/CheckoutModal';

import { HomeScreen } from './screens/HomeScreen';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { MatchesScreen } from './screens/MatchesScreen';
import { PrivateLettersScreen } from './screens/PrivateLettersScreen';
import { MembershipScreen } from './screens/MembershipScreen';
import { CreateProfileScreen } from './screens/CreateProfileScreen';
import { SafetyScreen } from './screens/SafetyScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { matchmakingService } from './services/matchmakingService';

function AppContent() {
  const { user, isAdmin } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<MembershipTier>('Premium');

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsDossierOpen(true);
  };

  const handleSendInterest = (profileId: string) => {
    matchmakingService.sendInterest(profileId);
    showToast('✨ Sacred Interest sealed & transmitted via 256-bit bilateral vault.', 'success');
  };

  const handleOpenCheckoutModal = (tier: MembershipTier = 'Premium') => {
    setCheckoutTier(tier);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E1919] font-sans antialiased selection:bg-[#4E051A] selection:text-white pt-20">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 max-w-md bg-[#1E1919] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-300/40 flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-amber-400 text-xl">
            {toastType === 'success' ? 'verified' : 'info'}
          </span>
          <div className="text-xs md:text-sm font-medium leading-snug">
            {toastMessage}
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white ml-2 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onOpenSafety={() => setIsSafetyModalOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenCheckout={() => handleOpenCheckoutModal('Premium')}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onSelectProfile={handleSelectProfile}
            onOpenConcierge={() => setIsConciergeOpen(true)}
          />
        )}

        {currentScreen === 'discover' && (
          <DiscoverScreen
            onNavigate={handleNavigate}
            onSelectProfile={handleSelectProfile}
            onSendInterest={handleSendInterest}
          />
        )}

        {(currentScreen === 'matches' || currentScreen === 'interests') && (
          <MatchesScreen
            onNavigate={handleNavigate}
            onSelectProfile={handleSelectProfile}
            onOpenChat={(_profileId: string) => {
              handleNavigate('private-letters');
            }}
          />
        )}

        {currentScreen === 'private-letters' && (
          <PrivateLettersScreen
            onNavigate={handleNavigate}
            onSelectProfile={handleSelectProfile}
          />
        )}

        {currentScreen === 'membership' && (
          <MembershipScreen
            onNavigate={handleNavigate}
            onOpenConcierge={() => setIsConciergeOpen(true)}
            onOpenCheckout={(tier) => handleOpenCheckoutModal(tier || 'Premium')}
          />
        )}

        {currentScreen === 'create-profile' && (
          <CreateProfileScreen
            onNavigate={handleNavigate}
            onProfileCreated={(profileData) => {
              showToast(`Profile for ${profileData.fullName} created successfully! Welcome to Apni Jodi.`, 'success');
            }}
          />
        )}

        {currentScreen === 'safety' && (
          <SafetyScreen
            onNavigate={handleNavigate}
            onOpenConcierge={() => setIsConciergeOpen(true)}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminDashboardScreen
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Modals */}
      <DossierModal
        profile={selectedProfile}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        onSendInterest={handleSendInterest}
      />

      <ConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />

      <SafetyModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      <AuthModal />

      <ProfileEditModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSaved={() => showToast('Sanctuary dossier and preferences updated successfully.', 'success')}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedTier={checkoutTier}
        onSuccess={(upgradedTier) => {
          showToast(`✨ Privileges Elevated to ${upgradedTier} Tier! Tax invoice generated.`, 'success');
        }}
      />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSafety={() => setIsSafetyModalOpen(true)}
        onOpenConcierge={() => setIsConciergeOpen(true)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
