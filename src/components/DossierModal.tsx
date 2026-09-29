import React, { useState } from 'react';
import { Profile } from '../types';

interface DossierModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onSendInterest: (profileId: string) => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSendInterest
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [interestSent, setInterestSent] = useState(false);

  if (!isOpen || !profile) return null;

  const photos = profile.secondaryImages && profile.secondaryImages.length > 0 
    ? [profile.image, ...profile.secondaryImages]
    : [profile.image];

  const handleInterest = () => {
    setInterestSent(true);
    onSendInterest(profile.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#371e1f]/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white max-w-4xl w-full max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 border border-[#dac0c2]/40">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#efeeeb]">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#735c00]/15 text-[#735c00] text-xs font-bold uppercase tracking-wider">
              Curated Dossier #{profile.id.toUpperCase().slice(0, 8)}
            </span>
            {profile.isVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffe088] text-[#241a00] text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Govt ID Verified
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#544244] hover:bg-[#efeeeb] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* 2-Column Dossier Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left: Gallery (5 Cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#f5f3f0] shadow-md">
              <img
                src={photos[activePhotoIdx]}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#4e051a] font-bold text-xs shadow-sm">
                {profile.matchScore}% Resonance
              </div>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
                Photo {activePhotoIdx + 1} of {photos.length}
              </div>
            </div>

            {/* Thumbnails */}
            {photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {photos.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIdx(i)}
                    className={`aspect-square rounded-xl overflow-hidden ring-2 transition-all ${
                      activePhotoIdx === i ? 'ring-[#4e051a] scale-95' : 'ring-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-[#f5f3f0] flex items-center gap-3 text-xs text-[#544244]">
              <span className="material-symbols-outlined text-[20px] text-[#735c00]">shield</span>
              <span>Visuals protected by Apni Jodi Watermark & Sovereign Privacy Policy.</span>
            </div>
          </div>

          {/* Right: Personal & Background Details (7 Cols) */}
          <div className="md:col-span-7 space-y-6">
            
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4e051a]">
                  {profile.name}, {profile.age}
                </h2>
                {profile.horoscopeScore && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#735c00] bg-[#ffe088]/30 px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-[16px]">stars</span>
                    Guna Milan {profile.horoscopeScore}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#544244] mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#735c00]">location_on</span>
                {profile.city}
              </p>
            </div>

            {/* Quote */}
            <div className="p-4 rounded-2xl bg-[#f5f3f0] border-l-4 border-[#4e051a]">
              <p className="text-sm text-[#1b1c1a] italic font-serif leading-relaxed">
                {profile.bioQuote}
              </p>
            </div>

            {/* Background & Values Bento */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#735c00]">
                Background & Ethos
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#dac0c2]/50">
                  <span className="text-[#877274] block mb-0.5">Profession</span>
                  <span className="font-semibold text-[#1b1c1a]">{profile.profession}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#dac0c2]/50">
                  <span className="text-[#877274] block mb-0.5">Alma Mater</span>
                  <span className="font-semibold text-[#1b1c1a]">{profile.education}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#dac0c2]/50">
                  <span className="text-[#877274] block mb-0.5">Heritage / Tradition</span>
                  <span className="font-semibold text-[#1b1c1a]">{profile.community}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#dac0c2]/50">
                  <span className="text-[#877274] block mb-0.5">Height & Lifestyle</span>
                  <span className="font-semibold text-[#1b1c1a]">{profile.height || "5'10\""} • {profile.diet || "Vegetarian"}</span>
                </div>
              </div>
            </div>

            {/* Passions & Wavelength */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#735c00]">
                Passions & Life Rhythms
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.passions.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-[#efeeeb] text-xs font-semibold text-[#544244]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#efeeeb] flex items-center gap-3">
              {interestSent ? (
                <div className="flex-1 py-3 px-4 rounded-xl bg-[#ffe088]/40 border border-[#735c00] text-center text-xs font-bold text-[#735c00] flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Interest Sent with Sacred Discretion • Awaiting Response</span>
                </div>
              ) : (
                <button
                  onClick={handleInterest}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-[#4e051a] hover:bg-[#6b1d2f] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                  <span>Send Dignified Interest</span>
                </button>
              )}

              <button
                onClick={() => alert(`Dossier for ${profile.name} added to your private shortlisted vault.`)}
                className="p-3.5 rounded-xl bg-[#efeeeb] hover:bg-[#eae8e5] text-[#544244] transition-colors"
                title="Shortlist Dossier"
              >
                <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
