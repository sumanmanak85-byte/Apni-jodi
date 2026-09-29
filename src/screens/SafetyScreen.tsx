import React, { useState } from 'react';
import { ScreenType } from '../types';

interface SafetyScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenConcierge: () => void;
}

export const SafetyScreen: React.FC<SafetyScreenProps> = ({ onNavigate, onOpenConcierge }) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate Solicitation');
  const [reportDetails, setReportDetails] = useState('');

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSubmitted(false);
      setReportDetails('');
    }, 2500);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4E051A]/10 border border-[#4E051A]/20 text-[#4E051A] text-xs font-serif uppercase tracking-wider font-semibold">
            <span className="material-symbols-outlined text-sm">shield</span>
            The Sacred Safety & Integrity Trust
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-[#1E1919]">
            Sanctuary Without Compromise
          </h1>
          <p className="text-[#5B4F48] text-base md:text-lg leading-relaxed">
            Apni Jodi is architected from the bedrock up to protect high-intent individuals and distinguished families from harassment, catfishing, unsolicited contact, and commercial brokers.
          </p>
        </div>

        {/* 4 Pillars of Protection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-[#DFCEBD] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-[#4E051A] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1E1919]">
              1. 100% Government ID Authentication
            </h3>
            <p className="text-sm text-[#5B4F48] leading-relaxed">
              Every profile requires passport, Aadhaar, or national credential verification with cryptographic facial liveness. We discard unencrypted copies immediately upon algorithmic confirmation.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <span className="material-symbols-outlined text-base">check_circle</span>
              Zero bots, duplicate profiles, or commercial agents permitted
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#DFCEBD] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-[#4E051A] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1E1919]">
              2. Bilateral Contact Escrow Protocol
            </h3>
            <p className="text-sm text-[#5B4F48] leading-relaxed">
              Phone numbers, email addresses, and ancestral family dossiers are never public. Direct telephone or WhatsApp disclosure occurs exclusively when both patrons explicitly click "Grant Authorization".
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <span className="material-symbols-outlined text-base">check_circle</span>
              Instant unilateral revocation available at any moment
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#DFCEBD] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-[#4E051A] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">visibility_off</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1E1919]">
              3. Photo Privacy Shield
            </h3>
            <p className="text-sm text-[#5B4F48] leading-relaxed">
              Concerned about corporate or social discretion? Enable our Photo Privacy Shield to keep portrait photos tastefully blurred and dynamically watermarked until you accept an incoming interest.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <span className="material-symbols-outlined text-base">check_circle</span>
              Dynamic anti-screenshot forensic watermarking
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#DFCEBD] shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-[#4E051A] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">support_agent</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1E1919]">
              4. Human Concierge Oversight
            </h3>
            <p className="text-sm text-[#5B4F48] leading-relaxed">
              Every reported anomaly or suspicious interaction is reviewed within 2 hours by dedicated senior matchmaking patrons. Bad actors face permanent biometric bans across our entire network.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <span className="material-symbols-outlined text-base">check_circle</span>
              24/7 Red-Chamber emergency moderation desk
            </div>
          </div>
        </div>

        {/* Verification Check Tool */}
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#DFCEBD] shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="font-serif text-2xl text-[#1E1919]">
                Verify a Match's Authenticity Seal
              </h3>
              <p className="text-sm text-[#5B4F48]">
                Every member has a unique Sanctuary Escrow Code. Enter their ID or phone to confirm they are an active, vetted patron in good standing.
              </p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="e.g. APNI-DL-9481" 
                className="px-4 py-2.5 rounded-full border border-[#DFCEBD] text-sm bg-[#FAF7F2] text-[#1E1919] focus:outline-none focus:ring-2 focus:ring-[#4E051A]"
              />
              <button 
                onClick={() => alert('Member verified: Dr. Ananya Sen (Sanctuary Patron #DL-9481). Passport & Alma Mater verified.')}
                className="px-6 py-2.5 rounded-full bg-[#4E051A] hover:bg-[#680C25] text-white text-sm font-medium transition cursor-pointer"
              >
                Verify Patron Seal
              </button>
            </div>
          </div>
        </div>

        {/* Reporting & Action CTAs */}
        <div className="bg-[#4E051A] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl relative z-10">
            <span className="text-xs uppercase font-serif tracking-widest text-amber-300 font-semibold">
              Zero Tolerance Guarantee
            </span>
            <h2 className="font-serif text-2xl md:text-3xl">
              Encountered Suspicious Conduct or Disrespect?
            </h2>
            <p className="text-sm text-stone-200 leading-relaxed">
              We hold the sanctity of mutual respect paramount. File a confidential priority inquiry directly to our senior patron desk.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full sm:w-auto">
            <button
              onClick={() => setReportModalOpen(true)}
              className="px-6 py-3.5 rounded-full bg-white text-[#4E051A] hover:bg-stone-100 font-semibold text-sm transition shadow-lg cursor-pointer text-center"
            >
              Report a Concern
            </button>
            <button
              onClick={onOpenConcierge}
              className="px-6 py-3.5 rounded-full bg-transparent border border-amber-300 text-amber-200 hover:bg-white/10 font-semibold text-sm transition cursor-pointer text-center"
            >
              Speak to Concierge
            </button>
          </div>
        </div>

        {/* Report Modal */}
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-[#DFCEBD] shadow-2xl relative">
              <button 
                onClick={() => setReportModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              {reportSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-3xl">check</span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#1E1919]">Confidential Report Dispatched</h3>
                  <p className="text-sm text-[#5B4F48]">
                    Your transmission has been forwarded directly to the Chief Matchmaking Warden. The referenced account has been temporarily quarantined.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 text-[#4E051A]">
                    <span className="material-symbols-outlined">security</span>
                    <h3 className="font-serif text-xl font-bold">Confidential Trust & Safety Filing</h3>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#5B4F48] mb-1">
                      Reason for Report
                    </label>
                    <select 
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-[#FAF7F2]"
                    >
                      <option value="Inappropriate Solicitation">Inappropriate Commercial or Financial Solicitation</option>
                      <option value="Misrepresentation">Misrepresentation of Identity, Age, or Credentials</option>
                      <option value="Harassment">Disrespectful Language or Harassment</option>
                      <option value="Broker">Suspected Unauthorized Broker / Third Party</option>
                      <option value="Other">Other Privacy Concern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#5B4F48] mb-1">
                      Incident Details & Profile ID
                    </label>
                    <textarea 
                      rows={4}
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      required
                      placeholder="Please cite the candidate's name or Sanctuary ID and describe the violation..."
                      className="w-full px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-[#FAF7F2]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setReportModalOpen(false)}
                      className="px-4 py-2 rounded-full border border-stone-300 text-xs font-medium text-stone-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-full bg-[#4E051A] text-white text-xs font-medium hover:bg-[#680C25]"
                    >
                      Submit Sealed Report
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
