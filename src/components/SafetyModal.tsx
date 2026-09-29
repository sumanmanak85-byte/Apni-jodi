import React from 'react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#371e1f]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 border border-[#dac0c2]/40">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#efeeeb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#735c00]/10 flex items-center justify-center text-[#735c00]">
              <span className="material-symbols-outlined text-[24px]">shield</span>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#4e051a]">Apni Jodi Safety Sanctuary</h3>
              <p className="text-xs text-[#544244]">Bilateral Consent, Masked Coordinates & ID Verification Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#544244] hover:bg-[#efeeeb] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-2xl bg-[#f5f3f0] space-y-2">
            <div className="flex items-center gap-2 text-[#735c00]">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span className="text-xs font-bold uppercase tracking-wider">100% ID Authenticated</span>
            </div>
            <p className="text-xs text-[#544244] leading-relaxed">
              Every prospective member passes an official government identity verification (Aadhaar / Passport / Driving License) cross-referenced with a mandatory live 3D liveness scan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f5f3f0] space-y-2">
            <div className="flex items-center gap-2 text-[#4e051a]">
              <span className="material-symbols-outlined text-[20px]">phonelink_lock</span>
              <span className="text-xs font-bold uppercase tracking-wider">No Cold Calls / Spam Shield</span>
            </div>
            <p className="text-xs text-[#544244] leading-relaxed">
              Your cell phone number and personal email remain cryptographically masked. Contact details are only exchanged when both individuals click ‘Authorize Release’.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f5f3f0] space-y-2">
            <div className="flex items-center gap-2 text-[#735c00]">
              <span className="material-symbols-outlined text-[20px]">visibility_off</span>
              <span className="text-xs font-bold uppercase tracking-wider">Sovereign Photo Blur</span>
            </div>
            <p className="text-xs text-[#544244] leading-relaxed">
              Enable the privacy shield so your imagery is blurred across all discovery grids. Photos unlock exclusively for members with whom mutual intent is confirmed.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f5f3f0] space-y-2">
            <div className="flex items-center gap-2 text-[#4e051a]">
              <span className="material-symbols-outlined text-[20px]">security</span>
              <span className="text-xs font-bold uppercase tracking-wider">Zero Public Search Indexing</span>
            </div>
            <p className="text-xs text-[#544244] leading-relaxed">
              Dossiers are locked within our closed, private network. Google, Bing, and third-party web crawlers cannot search, cache, or scrap your details.
            </p>
          </div>

        </div>

        {/* 24/7 Redressal & Emergency Hotline */}
        <div className="p-4 rounded-2xl bg-[#fed65b]/20 border border-[#735c00]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#4e051a] uppercase tracking-wider block">
              Grievance Officer & Priority Redressal
            </span>
            <p className="text-xs text-[#544244]">
              Immediate intervention for unsolicited solicitation, false claims, or boundary breaches.
            </p>
          </div>
          <button 
            onClick={() => alert("Grievance ticket initiated. The compliance desk will reach out within 30 minutes.")}
            className="px-4 py-2 rounded-xl bg-[#4e051a] text-white text-xs font-bold shrink-0 hover:bg-[#6b1d2f]"
          >
            File Confidential Report
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#efeeeb] text-[#1b1c1a] text-xs font-bold hover:bg-[#eae8e5]"
          >
            Close Safety Sanctuary
          </button>
        </div>

      </div>
    </div>
  );
};
