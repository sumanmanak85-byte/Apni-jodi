import React, { useState } from 'react';
import { CONCIERGE_AVATAR } from '../data/mockData';

interface ConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConciergeModal: React.FC<ConciergeModalProps> = ({ isOpen, onClose }) => {
  const [scheduled, setScheduled] = useState(false);
  const [noteSent, setNoteSent] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#371e1f]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 border border-[#dac0c2]/40">
        
        {/* Header with Concierge Avatar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-full bg-[#efeeeb] overflow-hidden ring-2 ring-[#735c00]/30 shrink-0">
              <img
                src={CONCIERGE_AVATAR}
                alt="Ananya Sharma"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[#4e051a]">Ananya Sharma</h4>
              <span className="text-[10px] text-[#735c00] font-bold uppercase tracking-wider block">
                Senior Matchmaking Patron Concierge
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#544244] hover:bg-[#efeeeb] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Message */}
        <div className="p-4 rounded-xl bg-[#f5f3f0] border-l-2 border-[#735c00]">
          <p className="text-xs text-[#544244] italic leading-relaxed">
            “Pranam Aadhavan ji. As your assigned VIP advisor, I personally oversee your family background presentation and ensure direct introductions meet your cultural standards. How may I serve your search today?”
          </p>
        </div>

        {scheduled ? (
          <div className="p-4 rounded-xl bg-[#ffe088]/30 border border-[#735c00]/30 text-center space-y-2">
            <span className="material-symbols-outlined text-[28px] text-[#735c00]">event_available</span>
            <p className="text-xs font-bold text-[#4e051a]">Bespoke Telephone Briefing Confirmed</p>
            <p className="text-[11px] text-[#544244]">
              Ananya Sharma will call you on your verified primary cell on Wednesday at 4:30 PM IST.
            </p>
            <button
              onClick={() => { setScheduled(false); onClose(); }}
              className="mt-2 px-4 py-1.5 rounded-lg bg-[#4e051a] text-white text-xs font-semibold"
            >
              Done
            </button>
          </div>
        ) : noteSent ? (
          <div className="p-4 rounded-xl bg-[#ffe088]/30 border border-[#735c00]/30 text-center space-y-2">
            <span className="material-symbols-outlined text-[28px] text-[#735c00]">mark_email_read</span>
            <p className="text-xs font-bold text-[#4e051a]">Private Note Dispatched to Advisor</p>
            <p className="text-[11px] text-[#544244]">
              Ananya will review your query regarding prospective family introductions within 4 hours.
            </p>
            <button
              onClick={() => { setNoteSent(false); setShowNoteForm(false); onClose(); }}
              className="mt-2 px-4 py-1.5 rounded-lg bg-[#4e051a] text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        ) : showNoteForm ? (
          <div className="space-y-3">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Specify cultural nuances, family preferences, or requested intros..."
              rows={3}
              className="w-full p-3 rounded-xl bg-[#f5f3f0] border border-[#dac0c2] text-xs text-[#1b1c1a] focus:outline-none focus:border-[#4e051a]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowNoteForm(false)}
                className="flex-1 py-2 rounded-lg bg-[#efeeeb] text-xs font-semibold text-[#544244]"
              >
                Back
              </button>
              <button
                onClick={() => setNoteSent(true)}
                className="flex-1 py-2 rounded-lg bg-[#4e051a] text-white text-xs font-semibold hover:bg-[#6b1d2f]"
              >
                Submit Note
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setScheduled(true)}
              className="w-full py-3 rounded-xl bg-[#4e051a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#6b1d2f] transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>Schedule Private Consultation Call</span>
            </button>
            <button
              onClick={() => setShowNoteForm(true)}
              className="w-full py-3 rounded-xl bg-[#efeeeb] text-[#1b1c1a] text-xs font-semibold hover:bg-[#eae8e5] transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">draw</span>
              <span>Leave Private Note for Matchmaker</span>
            </button>
          </div>
        )}

        <div className="text-center pt-1">
          <span className="text-[10px] text-[#877274] tracking-wide uppercase">
            Available 7 Days a week • Strictly Confidential Concierge
          </span>
        </div>

      </div>
    </div>
  );
};
