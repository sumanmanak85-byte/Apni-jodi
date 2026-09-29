import React, { useState } from 'react';
import { ScreenType, Profile, MutualConnection, InboundInterest } from '../types';
import { ACTIVE_MUTUAL_CONNECTIONS, INBOUND_INTERESTS, INITIAL_HANDSHAKES } from '../data/mockData';

import { matchmakingService } from '../services/matchmakingService';

interface MatchesScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectProfile: (profile: Profile) => void;
  onOpenConcierge?: () => void;
  onOpenSafety?: () => void;
  onOpenChat?: (profileId: string) => void;
}

export const MatchesScreen: React.FC<MatchesScreenProps> = ({
  onNavigate,
  onSelectProfile,
  onOpenConcierge,
  onOpenSafety,
  onOpenChat
}) => {
  const [activeTab, setActiveTab] = useState<'mutual' | 'received' | 'sent' | 'shortlisted'>('mutual');
  const [mutualMatches, setMutualMatches] = useState<MutualConnection[]>(() => matchmakingService.getMatches());
  const [interests, setInterests] = useState<InboundInterest[]>(() => matchmakingService.getInboundInterests());
  const [handshakes, setHandshakes] = useState(INITIAL_HANDSHAKES);
  const [callingState, setCallingState] = useState<string | null>(null);

  React.useEffect(() => {
    const unsub = matchmakingService.subscribe(() => {
      setMutualMatches(matchmakingService.getMatches());
      setInterests(matchmakingService.getInboundInterests());
    });
    return unsub;
  }, []);

  const handleAcceptInterest = (id: string) => {
    matchmakingService.acceptInterest(id);
    setInterests(matchmakingService.getInboundInterests());
    setMutualMatches(matchmakingService.getMatches());
    setActiveTab('mutual');
  };

  const handleDeclineInterest = (id: string) => {
    matchmakingService.rejectInterest(id);
    setInterests(matchmakingService.getInboundInterests());
  };

  const handleAuthorizeHandshake = (id: string) => {
    matchmakingService.toggleBilateralConsent(id);
    setHandshakes(prev => prev.map(hs => {
      if (hs.id === id) {
        return {
          ...hs,
          progress: 100,
          consentsGranted: 2,
          hasUserAuthorized: true,
          statusText: 'Mutual Consent Unlocked Just Now',
          revealedDetail: '+91 98334 19280'
        };
      }
      return hs;
    }));
  };

  const handleOpenConversation = (conn: MutualConnection) => {
    if (onOpenChat) onOpenChat(conn.id);
    else onNavigate('private-letters');
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      
      {/* EDITORIAL PAGE HEADING & PROCLAMATION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eae8e5] text-[#544244] text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[15px] text-[#735c00]">verified_user</span>
            <span>END-TO-END SANCTUARY • BILATERAL CONSENT PROTOCOL</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#4e051a] font-bold tracking-tight">
            Mutual Sparks & Bilateral Interests
          </h1>
          <p className="text-sm sm:text-base text-[#544244]">
            “Jodi Jo Dil Ko Pasand Aaye.” Deep mutual alignments curated with dignity, cultural harmony, and verified intent.
          </p>
        </div>

        <div className="flex items-center gap-3.5 bg-white p-3.5 rounded-2xl shadow-sm border border-[#dac0c2]/30 self-start lg:self-auto">
          <div className="w-10 h-10 rounded-xl bg-[#f5f3f0] flex items-center justify-center text-[#4e051a]">
            <span className="material-symbols-outlined text-[22px]">shield_person</span>
          </div>
          <div className="flex flex-col pr-2">
            <span className="text-xs font-bold text-[#1b1c1a] uppercase tracking-wider">Discreet Matrimony</span>
            <span className="text-[11px] text-[#544244]">Contacts stay veiled until mutual sign-off</span>
          </div>
        </div>
      </div>

      {/* BESPOKE TABBED JOURNEY BAR */}
      <div className="w-full bg-[#f5f3f0] rounded-2xl p-1.5 shadow-sm overflow-x-auto border border-[#dac0c2]/30">
        <div className="flex items-center gap-1.5 min-w-[700px]">
          <button
            onClick={() => setActiveTab('mutual')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'mutual'
                ? 'bg-[#4e051a] text-white shadow-md'
                : 'text-[#544244] hover:text-[#4e051a] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">favorite</span>
            <span>Mutual Sparks & Matches</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-[#735c00] text-white text-[11px] leading-none font-bold">
              4 Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'received'
                ? 'bg-[#4e051a] text-white shadow-md'
                : 'text-[#544244] hover:text-[#4e051a] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">mark_email_unread</span>
            <span>Interests Received</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-[#6b1d2f] text-white text-[11px] leading-none font-bold">
              5
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'sent'
                ? 'bg-[#4e051a] text-white shadow-md'
                : 'text-[#544244] hover:text-[#4e051a] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>Interests Sent</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-[#e4e2df] text-[#544244] text-[11px] leading-none font-bold">
              8
            </span>
          </button>

          <button
            onClick={() => setActiveTab('shortlisted')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'shortlisted'
                ? 'bg-[#4e051a] text-white shadow-md'
                : 'text-[#544244] hover:text-[#4e051a] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">bookmark_heart</span>
            <span>Shortlisted Dossiers</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-[#e4e2df] text-[#544244] text-[11px] leading-none font-bold">
              12
            </span>
          </button>
        </div>
      </div>

      {/* BILATERAL MUTUAL SPARK PROCLAMATION BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4e051a] via-[#6b1d2f] to-[#371e1f] text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 text-[#ffe088]">
              <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#ffe088] uppercase tracking-widest">Sanctuary Unlocked</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffe088]"></span>
                <span className="text-white/80">4 Bilateral Sparks Found</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                Both of you expressed sincere intent.
              </h2>
              <p className="text-xs sm:text-sm text-white/85 max-w-xl leading-relaxed">
                Encrypted correspondence, family introduction dialogues, and verified phone handshakes are now accessible. No unsolicited external access is permitted.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSafety}
            className="px-5 py-2.5 rounded-xl bg-[#ffe088] text-[#241a00] hover:bg-[#fed65b] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Review Privacy Protocol</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: CONFIRMED MUTUAL CONNECTIONS GRID */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-widest block mb-1">
              PRIORITY CHAMBER
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1b1c1a] font-bold">
              Active Mutual Connections
            </h2>
          </div>
          <span className="text-xs text-[#544244]">4 profiles awaiting your continued conversation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mutualMatches.map((conn) => (
            <div
              key={conn.id}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#dac0c2]/30 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                
                {/* Header row */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={conn.image}
                      alt={conn.name}
                      className="w-22 h-26 object-cover rounded-2xl shadow-sm"
                    />
                    <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-md bg-[#735c00] text-white text-[10px] font-bold shadow-sm">
                      {conn.matchScore}% MATCH
                    </span>
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1b1c1a] truncate">
                        {conn.name}, {conn.age}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[#735c00] text-xs font-bold">
                        <span className="material-symbols-outlined text-[15px]">stars</span>
                        <span>Horoscope {conn.horoscopeScore}</span>
                      </span>
                    </div>

                    <p className="text-xs text-[#544244] flex items-center gap-1 truncate">
                      <span className="material-symbols-outlined text-[15px] text-[#877274]">location_on</span>
                      {conn.city} • {conn.profession}
                    </p>

                    <p className="text-xs text-[#544244] flex items-center gap-1 truncate">
                      <span className="material-symbols-outlined text-[15px] text-[#877274]">school</span>
                      {conn.education} • {conn.community}
                    </p>

                    <div className="pt-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#fed65b]/30 text-[#735c00] text-[10px] font-bold">
                        {conn.tag}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Conversation snapshot */}
                <div className="p-3.5 rounded-2xl bg-[#f5f3f0] flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#4e051a] text-[20px] shrink-0 mt-0.5">
                    format_quote
                  </span>
                  <div className="flex-1">
                    {conn.latestMessageTime && (
                      <span className="text-[10px] text-[#877274] block mb-0.5">
                        Latest: {conn.latestMessageTime}
                      </span>
                    )}
                    <p className="text-xs text-[#544244] italic font-serif leading-relaxed">
                      {conn.quoteOrLatestMessage}
                    </p>
                  </div>
                </div>

              </div>

              {/* Action Toolbar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5 border-t border-[#efeeeb]">
                <button
                  onClick={() => handleOpenConversation(conn)}
                  className="flex-1 min-w-[130px] px-4 py-2.5 rounded-xl bg-[#4e051a] hover:bg-[#6b1d2f] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span>Open Private Letter</span>
                </button>

                <button
                  onClick={() => {
                    setCallingState(conn.id);
                    setTimeout(() => {
                      alert(`Initiating discreet encrypted audio handshake with ${conn.name}...`);
                      setCallingState(null);
                    }, 600);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-[#efeeeb] hover:bg-[#eae8e5] text-[#1b1c1a] text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>{callingState === conn.id ? 'Connecting...' : 'Audio Call'}</span>
                </button>

                <button
                  onClick={() => {
                    const hs = handshakes.find(h => h.name.toLowerCase().includes(conn.name.toLowerCase().split(' ')[0]));
                    if (hs) {
                      handleAuthorizeHandshake(hs.id);
                      alert(`Mutual Contact Handshake initiated with ${conn.name}! Review below.`);
                    } else {
                      alert(`Consent token sent to ${conn.name} for contact reveal.`);
                    }
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-[#efeeeb] hover:bg-[#eae8e5] text-[#1b1c1a] text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Initiate Contact Handshake"
                >
                  <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                  <span className="hidden sm:inline">Exchange Contact</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: INBOUND INQUIRIES (DISTINGUISHED INTERESTS RECEIVED) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#735c00] uppercase tracking-widest">
                INBOUND INQUIRIES
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#6b1d2f] text-white text-[11px] font-bold">
                {interests.filter(i => i.status === 'pending').length} Awaiting Decision
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1b1c1a] font-bold">
              Distinguished Interests Received
            </h2>
          </div>
          <p className="text-xs text-[#544244]">
            Declining is completely discreet; candidates are not notified of non-mutual choices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {interests.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`bg-white rounded-3xl p-6 shadow-sm border border-[#dac0c2]/30 flex flex-col justify-between space-y-4 transition-all ${
                inquiry.status === 'declined' ? 'opacity-40 grayscale pointer-events-none' : ''
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={inquiry.image}
                    alt={inquiry.name}
                    className="w-16 h-20 object-cover rounded-2xl shadow-sm shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#4e051a]">{inquiry.timeAgo}</span>
                      <span className="text-[11px] text-[#877274]">{inquiry.city}</span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#1b1c1a] truncate mt-0.5">
                      {inquiry.name}, {inquiry.age}
                    </h3>
                    <p className="text-xs text-[#544244] truncate">{inquiry.profession} • {inquiry.community}</p>
                  </div>
                </div>

                {/* Personalized note attached */}
                <div className="p-3.5 rounded-2xl bg-[#f5f3f0] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#4e051a]">
                    <span className="material-symbols-outlined text-[14px]">mail_outline</span>
                    <span>Personalized Note Attached</span>
                  </div>
                  <p className="text-xs text-[#1b1c1a] italic font-serif leading-relaxed">
                    {inquiry.personalizedNote}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#f5f3f0] text-[#544244]">
                    Family: {inquiry.familyValues}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#f5f3f0] text-[#544244]">
                    {inquiry.lifestyle}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-[#efeeeb] space-y-2">
                {inquiry.status === 'accepted' ? (
                  <div className="p-2.5 rounded-xl bg-[#ffe088]/40 border border-[#735c00] text-center text-xs font-bold text-[#735c00] flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Matched & Mutual Spark Initiated!</span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleAcceptInterest(inquiry.id)}
                      className="w-full py-2.5 rounded-xl bg-[#4e051a] hover:bg-[#6b1d2f] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">favorite</span>
                      <span>Accept & Create Match</span>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => alert(`Opening comprehensive bio dossier for ${inquiry.name}...`)}
                        className="flex-1 py-1.5 rounded-xl bg-[#efeeeb] hover:bg-[#eae8e5] text-xs font-semibold text-[#544244]"
                      >
                        View Bio
                      </button>
                      <button
                        onClick={() => handleDeclineInterest(inquiry.id)}
                        className="flex-1 py-1.5 rounded-xl text-xs font-semibold text-[#877274] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                      >
                        Decline with Grace
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: MUTUAL CONTACT SHARING STATUS WIDGET (ESCROW PROTOCOL) */}
      <section className="rounded-3xl bg-[#f5f3f0] p-6 sm:p-8 border border-[#dac0c2]/40 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-[#dac0c2]/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#735c00] text-[20px]">encrypted</span>
              <span className="text-xs font-bold text-[#735c00] uppercase tracking-widest">
                SECURE ESCROW PROTOCOL
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#1b1c1a] font-bold">
              Mutual Contact Handshake Status
            </h2>
            <p className="text-xs text-[#544244]">
              Phone numbers and guardian contacts are disclosed only when both individuals explicitly sign off.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-xs self-start lg:self-auto border border-[#dac0c2]/30">
            <div className="flex -space-x-2 overflow-hidden">
              <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#4e051a] text-white text-[11px] flex items-center justify-center font-bold">
                KM
              </span>
              <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#735c00] text-white text-[11px] flex items-center justify-center font-bold">
                MS
              </span>
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-[#1b1c1a]">
                {handshakes.filter(h => !h.hasUserAuthorized).length} Pending Release
              </span>
              <span className="block text-[10px] text-[#877274]">Awaiting your authorization</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {handshakes.map((hs) => (
            <div
              key={hs.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-[#dac0c2]/30 flex flex-col justify-between gap-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-serif font-bold text-base ${
                    hs.progress === 100 ? 'bg-[#ffe088] text-[#241a00]' : 'bg-[#ffd9dd] text-[#4e051a]'
                  }`}>
                    {hs.initials}
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#1b1c1a]">{hs.name}</h4>
                    <span className="text-xs text-[#544244]">{hs.contactType}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  hs.progress === 100
                    ? 'bg-[#ffe088] text-[#241a00]'
                    : 'bg-[#fed65b]/30 text-[#735c00]'
                }`}>
                  {hs.consentsGranted} of 2 Consents
                </span>
              </div>

              {/* Progress Meter */}
              <div className="space-y-1.5">
                <div className="w-full bg-[#efeeeb] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      hs.progress === 100 ? 'bg-[#735c00]' : 'bg-[#4e051a]'
                    }`}
                    style={{ width: `${hs.progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-[#544244]">
                  <span className="text-[#4e051a] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      {hs.progress === 100 ? 'done_all' : 'check_circle'}
                    </span>
                    {hs.statusText}
                  </span>
                  {hs.revealedDetail ? (
                    <span className="font-mono font-bold text-[#735c00]">{hs.revealedDetail}</span>
                  ) : (
                    <span className="font-semibold text-[#1b1c1a]">Your sign-off needed</span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center gap-3">
                {hs.hasUserAuthorized ? (
                  <a
                    href={`tel:${hs.revealedDetail?.replace(/\s/g, '') || '+919820144829'}`}
                    className="flex-1 py-2.5 rounded-xl bg-[#efeeeb] hover:bg-[#eae8e5] text-[#1b1c1a] text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span>Call {hs.name.split(' ')[0]}</span>
                  </a>
                ) : (
                  <button
                    onClick={() => handleAuthorizeHandshake(hs.id)}
                    className="flex-1 py-2.5 rounded-xl bg-[#4e051a] hover:bg-[#6b1d2f] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">key</span>
                    <span>Authorize Release</span>
                  </button>
                )}

                <button
                  onClick={() => alert(`Handshake preferences updated for ${hs.name}.`)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#877274] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                >
                  Revoke
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* CURATED CONCIERGE INSIGHT FOOTER RIBBON */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#dac0c2]/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#f5f3f0] flex items-center justify-center text-[#4e051a] shrink-0">
            <span className="material-symbols-outlined text-[24px]">support_agent</span>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1b1c1a]">
              Apni Jodi Dedicated Relationship Concierge
            </h3>
            <p className="text-xs text-[#544244]">
              Need an introduction mediated by our Senior Matrimonial Consultant? Available 7 days a week.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenConcierge}
          className="px-5 py-3 rounded-xl bg-[#4e051a] text-white hover:bg-[#6b1d2f] text-xs font-bold uppercase tracking-wider transition-all shadow-md shrink-0"
        >
          Request Mediated Call
        </button>
      </div>

    </div>
  );
};
