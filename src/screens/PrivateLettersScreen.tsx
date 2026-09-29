import React, { useState, useEffect, useRef } from 'react';
import { ScreenType, Profile, MutualConnection } from '../types';
import { chatService } from '../services/chatService';
import { matchmakingService } from '../services/matchmakingService';

interface PrivateLettersScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectProfile: (profile: Profile) => void;
}

export const PrivateLettersScreen: React.FC<PrivateLettersScreenProps> = ({
  onNavigate,
  onSelectProfile
}) => {
  const [matches, setMatches] = useState<MutualConnection[]>(() => matchmakingService.getMatches());
  const [activeMatchId, setActiveMatchId] = useState<string>(() => {
    const list = matchmakingService.getMatches();
    return list.length > 0 ? list[0].id : 'meera-sen-delhi';
  });

  const [messages, setMessages] = useState(() => chatService.getMessages(activeMatchId));
  const [inputText, setInputText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Modals for Report and Block
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate Solicitation');
  const [reportDetails, setReportDetails] = useState('');
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMatch = matches.find(m => m.id === activeMatchId) || matches[0];

  useEffect(() => {
    const unsubMatches = matchmakingService.subscribe(() => {
      const updated = matchmakingService.getMatches();
      setMatches(updated);
      if (!updated.find(m => m.id === activeMatchId) && updated.length > 0) {
        setActiveMatchId(updated[0].id);
      }
    });

    const unsubChat = chatService.subscribe(() => {
      setMessages(chatService.getMessages(activeMatchId));
    });

    return () => {
      unsubMatches();
      unsubChat();
    };
  }, [activeMatchId]);

  useEffect(() => {
    setMessages(chatService.getMessages(activeMatchId));
    chatService.markAsRead(activeMatchId);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMatchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const showAlert = (msg: string) => {
    setActionAlert(msg);
    setTimeout(() => setActionAlert(null), 3500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeMatch) return;
    chatService.sendMessage(activeMatch.id, inputText);
    setInputText('');
  };

  const handleToggleConsent = () => {
    if (!activeMatch) return;
    const isGranted = matchmakingService.toggleBilateralConsent(activeMatch.id);
    showAlert(isGranted 
      ? '✓ Contact Escrow Authorization granted on your behalf. Contact will unseal when both grant consent.'
      : 'Consent revoked. Contact information remains sealed.'
    );
  };

  const handleUnmatch = () => {
    if (!activeMatch) return;
    if (window.confirm(`Are you sure you wish to unmatch with ${activeMatch.name}? This will archive the conversation.`)) {
      matchmakingService.unmatch(activeMatch.id);
      showAlert(`Unmatched with ${activeMatch.name}.`);
      setMenuOpen(false);
    }
  };

  const handleBlock = () => {
    if (!activeMatch) return;
    if (window.confirm(`Block ${activeMatch.name}? They will be completely restricted from viewing your dossier or transmitting letters.`)) {
      matchmakingService.blockUser(activeMatch.id);
      showAlert(`Patron ${activeMatch.name} blocked and removed from chamber.`);
      setMenuOpen(false);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMatch) return;
    matchmakingService.reportUser(activeMatch.id, activeMatch.name, reportReason, reportDetails);
    setReportModalOpen(false);
    setReportDetails('');
    showAlert('Confidential Trust & Safety report submitted to Chief Warden.');
  };

  const quickPrompts = [
    'What cultural or classical music traditions are closest to your heart?',
    'How do you envision balancing career ambition with quiet family life?',
    'Would you be comfortable reviewing each other\'s contact details via escrow?'
  ];

  const consentsCount = (activeMatch?.consentGrantedByUser ? 1 : 0) + (activeMatch?.consentGrantedByMatch ? 1 : 0);
  const isContactUnlocked = consentsCount === 2;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Alert Banner */}
      {actionAlert && (
        <div className="p-3 bg-[#1E1919] text-white rounded-2xl text-xs font-medium flex items-center justify-between shadow-lg border border-amber-300/40 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-sm">verified</span>
            <span>{actionAlert}</span>
          </div>
          <button onClick={() => setActionAlert(null)} className="text-stone-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <span className="text-xs font-bold text-[#735C00] tracking-widest uppercase block mb-1">
            SANCTUARY MESSAGING • 256-BIT DISCRETION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#4E051A] font-bold">
            Private Letters & Conversations
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FED65B]/25 border border-[#735C00]/30 text-[#735C00] text-xs font-bold">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span>Bilateral Escrow Protocol Active</span>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#DFCEBD] space-y-4">
          <div className="w-16 h-16 bg-[#4E051A]/10 text-[#4E051A] rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">mail</span>
          </div>
          <h3 className="font-serif text-2xl text-[#1E1919]">No Active Private Letters</h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            Once you and a fellow member exchange mutual sparks, an encrypted conversation chamber will be consecrated here.
          </p>
          <button
            onClick={() => onNavigate('discover')}
            className="px-6 py-2.5 bg-[#4E051A] text-white rounded-full text-xs font-semibold hover:bg-[#680C25] cursor-pointer"
          >
            Discover Soulful Matches
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Matches & Conversations List */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-5 border border-[#DAC0C2]/40 shadow-sm space-y-3">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-[#EFEEEB]">
              <span className="font-serif font-bold text-sm text-[#4E051A]">
                Vetted Connections ({matches.length})
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold uppercase">
                Active Vault
              </span>
            </div>

            <div className="space-y-1.5 max-h-[550px] overflow-y-auto">
              {matches.map((m) => {
                const isSelected = m.id === activeMatchId;
                return (
                  <div
                    key={m.id}
                    onClick={() => setActiveMatchId(m.id)}
                    className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#4E051A]/10 border border-[#4E051A]/30 shadow-sm'
                        : 'hover:bg-[#FAF7F2] border border-transparent'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={m.image}
                        alt={m.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#DAC0C2]"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-sm text-[#1E1919] truncate">{m.name}</h4>
                        <span className="text-[10px] text-stone-400 font-mono">{m.latestMessageTime}</span>
                      </div>
                      <p className="text-xs text-stone-500 truncate">{m.quoteOrLatestMessage}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-amber-800 font-semibold">{m.matchScore}% Match</span>
                        {m.consentGrantedByUser && m.consentGrantedByMatch && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 rounded font-bold">Phone Unlocked</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Chat Window & Bilateral Escrow */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Conversation Window */}
            <div className="bg-white rounded-3xl border border-[#DAC0C2]/40 shadow-sm overflow-hidden flex flex-col h-[650px]">
              
              {/* Chat Header with Dropdown Actions */}
              <div className="p-4 border-b border-[#EFEEEB] bg-[#FAF7F2] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activeMatch?.image}
                      alt={activeMatch?.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#DAC0C2]"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#1E1919] flex items-center gap-1.5">
                      <span>{activeMatch?.name}</span>
                      <span className="material-symbols-outlined text-xs text-emerald-600" title="Vetted Patron">verified</span>
                    </h3>
                    <p className="text-xs text-stone-500">
                      {activeMatch?.city} • {activeMatch?.profession}
                    </p>
                  </div>
                </div>

                {/* Dropdown Menu (Block, Report, Unmatch) */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-full hover:bg-stone-200 text-stone-600 transition cursor-pointer"
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-[#DFCEBD] py-1.5 z-40 text-xs">
                      <button
                        onClick={() => {
                          if (activeMatch) onSelectProfile(activeMatch as any);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-700 flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Inspect Dossier
                      </button>

                      <button
                        onClick={() => {
                          setReportModalOpen(true);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-stone-50 text-amber-800 flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">report</span>
                        Report to Admin
                      </button>

                      <button
                        onClick={handleUnmatch}
                        className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-700 flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">person_remove</span>
                        Unmatch
                      </button>

                      <div className="h-px bg-stone-100 my-1"></div>

                      <button
                        onClick={handleBlock}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-700 flex items-center gap-2 cursor-pointer font-semibold"
                      >
                        <span className="material-symbols-outlined text-sm">block</span>
                        Block Patron
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bilateral Contact Escrow Widget */}
              <div className="p-3.5 bg-amber-50/60 border-b border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-serif font-bold text-amber-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">shield_person</span>
                    <span>Mutual Contact Escrow: {consentsCount} of 2 Consents Granted</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    {isContactUnlocked ? (
                      <span className="text-emerald-800 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">lock_open</span>
                        Reciprocal consent satisfied! Verified Mobile: {activeMatch?.phone}
                      </span>
                    ) : (
                      'Phone & private email remain cryptographically sealed until both patrons explicitly authorize.'
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isContactUnlocked && activeMatch?.phone && (
                    <a
                      href={`https://wa.me/${activeMatch.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">chat</span>
                      WhatsApp
                    </a>
                  )}

                  <button
                    onClick={handleToggleConsent}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                      activeMatch?.consentGrantedByUser
                        ? 'bg-[#4E051A] text-white'
                        : 'border border-[#4E051A] text-[#4E051A] bg-white hover:bg-amber-100'
                    }`}
                  >
                    {activeMatch?.consentGrantedByUser ? '✓ Consent Granted' : 'Authorize My Contact'}
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FAF7F2]">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                          isUser
                            ? 'bg-[#4E051A] text-white rounded-br-xs'
                            : 'bg-white text-[#1E1919] border border-[#DFCEBD] rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Timestamp & Read Status */}
                      <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1 px-1">
                        <span>{msg.time}</span>
                        {isUser && (
                          <span
                            className={`material-symbols-outlined text-[13px] ${
                              msg.isRead ? 'text-blue-500' : 'text-stone-400'
                            }`}
                            title={msg.isRead ? 'Read' : 'Delivered'}
                          >
                            done_all
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Icebreaker Prompts */}
              <div className="px-4 py-2 bg-white border-t border-[#EFEEEB] overflow-x-auto flex gap-2">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(p)}
                    className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#DFCEBD] text-[11px] text-stone-700 hover:text-[#4E051A] hover:border-[#4E051A] whitespace-nowrap cursor-pointer transition"
                  >
                    "{p}"
                  </button>
                ))}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#EFEEEB] flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Write a thoughtful private letter to ${activeMatch?.name}...`}
                  className="flex-1 px-4 py-2.5 rounded-full border border-[#DFCEBD] text-xs bg-[#FAF7F2] text-[#1E1919] focus:outline-none focus:ring-2 focus:ring-[#4E051A]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-10 h-10 rounded-full bg-[#4E051A] hover:bg-[#680C25] text-white flex items-center justify-center transition shadow disabled:opacity-40 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </form>

            </div>

          </div>

        </div>
      )}

      {/* Trust & Safety Violation Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-[#DFCEBD] shadow-2xl relative">
            <button
              onClick={() => setReportModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-800"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div className="flex items-center gap-2 text-[#4E051A]">
                <span className="material-symbols-outlined">security</span>
                <h3 className="font-serif text-xl font-bold">Confidential Safety Report</h3>
              </div>

              <p className="text-xs text-stone-500">
                Reporting candidate: <strong>{activeMatch?.name}</strong>. Your report is encrypted and sent directly to the Admin Desk.
              </p>

              <div>
                <label className="block text-xs uppercase font-semibold text-stone-600 mb-1">Violation Category</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-[#FAF7F2]"
                >
                  <option value="Inappropriate Solicitation">Inappropriate Commercial or Financial Solicitation</option>
                  <option value="Misrepresentation">Misrepresentation of Identity, Age, or Credentials</option>
                  <option value="Disrespect">Disrespectful Language or Harassment</option>
                  <option value="Broker">Suspected Unauthorized Broker / Third Party</option>
                  <option value="Other">Other Privacy Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-stone-600 mb-1">Incident Specifics</label>
                <textarea
                  rows={4}
                  required
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Please describe what transpired..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-[#FAF7F2]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-stone-300 text-xs text-stone-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#4E051A] text-white text-xs font-semibold hover:bg-[#680C25] cursor-pointer"
                >
                  File Sealed Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
