import React, { useState } from 'react';
import { ScreenType, Profile } from '../types';
import { FEATURED_PROFILES, HERO_COUPLE, FAQS, TESTIMONIALS } from '../data/mockData';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectProfile: (profile: Profile) => void;
  onOpenConcierge?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onSelectProfile, onOpenConcierge }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [lookingFor, setLookingFor] = useState('A Gentle Groom (25 - 34)');
  const [primaryCity, setPrimaryCity] = useState('Mumbai & MMR');
  const [lifestyleHarmony, setLifestyleHarmony] = useState('Progressive Traditional');

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleSearch = () => {
    onNavigate('discover');
  };

  return (
    <div className="w-full flex flex-col">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fed65b]/25 border border-[#735c00]/30 text-[#735c00] text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#735c00] animate-pulse"></span>
                <span>INDIA'S PREMIER DIGNIFIED MATCHMAKING</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#4e051a] tracking-tight leading-[1.12]">
                Jodi Jo Dil Ko <br />
                <span className="italic font-normal">Pasand Aaye.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#544244] max-w-xl leading-relaxed">
                Discover genuine connections, meaningful conversations, and people who share your foundational values, interests, and aspirations. Intentionally curated for consenting adults (18+).
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('create-profile')}
                  className="px-7 py-3.5 rounded-xl bg-[#4e051a] hover:bg-[#6b1d2f] text-white text-sm font-bold uppercase tracking-wider transition-all shadow-[0_6px_24px_rgba(78,5,26,0.2)] flex items-center gap-2"
                >
                  <span>Create Your Profile</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <button
                  onClick={() => onNavigate('discover')}
                  className="px-6 py-3.5 rounded-xl bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#4e051a] border border-[#dac0c2] text-sm font-bold transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#735c00]">explore</span>
                  <span>Discover Jodis</span>
                </button>
              </div>

              {/* Key Trust Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#dac0c2]/50 max-w-lg">
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#4e051a] block">100%</span>
                  <span className="text-xs text-[#544244] uppercase tracking-wider font-semibold">Govt ID Verified</span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#4e051a] block">Zero</span>
                  <span className="text-xs text-[#544244] uppercase tracking-wider font-semibold">Cold Spam Calls</span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#4e051a] block">94.8%</span>
                  <span className="text-xs text-[#544244] uppercase tracking-wider font-semibold">Mutual Harmony Rate</span>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] max-w-md mx-auto">
                <img
                  src={HERO_COUPLE}
                  alt="Ananya & Vikram"
                  className="w-full h-full object-cover"
                />
                
                {/* 18+ Dignified Platform Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffe088]"></span>
                  <span>18+ DIGNIFIED PLATFORM</span>
                </div>

                {/* Bottom Story Floating Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/65 backdrop-blur-md text-white border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#ffe088] font-bold uppercase tracking-wider">
                    <span>ANANYA & VIKRAM</span>
                    <span>UNITED 2024</span>
                  </div>
                  <p className="text-sm font-serif italic leading-snug">
                    “We connected through values, stayed for the companionship.”
                  </p>
                  <div className="flex items-center gap-2 pt-1 border-t border-white/15 text-[11px] text-white/80">
                    <span className="material-symbols-outlined text-[15px] text-[#ffe088]">shield</span>
                    <span>Mutual Privacy Safeguard • Phone & Photo visible only on consent</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* GUIDED SEARCH BAR */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-16 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_-6px_rgba(74,14,23,0.08)] border border-[#dac0c2]/40">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-5 border-b border-[#efeeeb] mb-6">
            <div className="flex items-center gap-2.5 text-[#4e051a]">
              <span className="material-symbols-outlined text-[24px]">filter_vintage</span>
              <h3 className="font-serif text-lg font-bold">Begin Your Guided Search</h3>
            </div>
            <span className="text-xs text-[#735c00] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">lock</span>
              Private & Algorithmic
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            {/* Looking For */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-bold text-[#877274]">Looking For</label>
              <div className="relative">
                <select
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  className="w-full h-12 px-3.5 pr-8 rounded-xl bg-[#f5f3f0] text-sm text-[#1b1c1a] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#4e051a]/20"
                >
                  <option>A Gentle Groom (25 - 34)</option>
                  <option>A Cultured Bride (23 - 32)</option>
                  <option>Intentional Partner (28 - 38)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3.5 text-[18px] text-[#544244] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Metro / City */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-bold text-[#877274]">Primary Metro / City</label>
              <div className="relative">
                <select
                  value={primaryCity}
                  onChange={(e) => setPrimaryCity(e.target.value)}
                  className="w-full h-12 px-3.5 pr-8 rounded-xl bg-[#f5f3f0] text-sm text-[#1b1c1a] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#4e051a]/20"
                >
                  <option>Mumbai & MMR</option>
                  <option>Delhi NCR</option>
                  <option>Bengaluru</option>
                  <option>Pune</option>
                  <option>Hyderabad</option>
                  <option>NRI (USA / UK / UAE)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3.5 text-[18px] text-[#544244] pointer-events-none">
                  location_on
                </span>
              </div>
            </div>

            {/* Lifestyle Harmony */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-bold text-[#877274]">Lifestyle Harmony</label>
              <div className="relative">
                <select
                  value={lifestyleHarmony}
                  onChange={(e) => setLifestyleHarmony(e.target.value)}
                  className="w-full h-12 px-3.5 pr-8 rounded-xl bg-[#f5f3f0] text-sm text-[#1b1c1a] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#4e051a]/20"
                >
                  <option>Progressive Traditional</option>
                  <option>Modern Cosmopolitan</option>
                  <option>Cultured Spiritual</option>
                  <option>Artistic & Mindful</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3.5 text-[18px] text-[#544244] pointer-events-none">
                  spa
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                onClick={handleSearch}
                className="w-full h-12 rounded-xl bg-[#4e051a] hover:bg-[#6b1d2f] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span>Find Compatible Jodis</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* CURATED PROFILES SEEKING MEANINGFUL BONDS */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#735c00] tracking-widest uppercase block mb-1">
              VETTED COMMUNITY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4e051a] font-bold">
              Curated Profiles Seeking Meaningful Bonds
            </h2>
            <p className="text-sm text-[#544244] mt-1">
              Each individual undergoes manual verification before their profile is shared in curated discovery circles.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('discover')}
              className="p-2.5 rounded-full border border-[#dac0c2] hover:bg-[#efeeeb] text-[#4e051a] transition-colors"
              title="Previous"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <button 
              onClick={() => onNavigate('discover')}
              className="p-2.5 rounded-full bg-[#4e051a] text-white hover:bg-[#6b1d2f] transition-colors"
              title="Next"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PROFILES.map((profile) => (
            <div
              key={profile.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[#dac0c2]/30 flex flex-col justify-between"
            >
              <div>
                {/* Photo with Overlay Pills */}
                <div 
                  onClick={() => onSelectProfile(profile)}
                  className="relative aspect-[4/5] overflow-hidden cursor-pointer bg-[#f5f3f0]"
                >
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

                  {/* Top badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#241a00] text-[10px] font-bold shadow-sm">
                      <span className="material-symbols-outlined text-[13px] text-[#735c00]">verified</span>
                      ID Verified
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ffe088] text-[#241a00] text-[10px] font-bold shadow-sm">
                      {profile.matchScore}% Match
                    </span>
                  </div>

                  {/* Bottom name and profession over image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif text-lg font-bold">
                      {profile.name}, {profile.age}
                    </h3>
                    <p className="text-xs text-white/90 truncate">
                      {profile.profession} • {profile.city}
                    </p>
                  </div>
                </div>

                {/* Passions */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#877274] tracking-wider block">
                      PASSIONS & INTERESTS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.passions.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full bg-[#f5f3f0] text-[11px] font-medium text-[#544244]"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-[#efeeeb] mt-2">
                <span className="text-[11px] text-[#735c00] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  {profile.statusTag || 'Respectful Consent'}
                </span>
                <button
                  onClick={() => onSelectProfile(profile)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#efeeeb] hover:bg-[#4e051a] hover:text-white text-xs font-bold text-[#4e051a] transition-all"
                >
                  Connect
                </button>
              </div>

            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('discover')}
            className="text-xs font-bold text-[#4e051a] hover:underline inline-flex items-center gap-1.5"
          >
            <span>Browse All 4,200+ Verified Curated Profiles</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

      </section>

      {/* HOW APNI JODI RESTORES GRACE TO MATCHMAKING (4 MILESTONES) */}
      <section className="bg-white py-16 sm:py-20 border-y border-[#dac0c2]/30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-[#735c00] tracking-widest uppercase">
              THE INTENTIONAL JOURNEY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4e051a] font-bold">
              How Apni Jodi Restores Grace to Matchmaking
            </h2>
            <p className="text-sm text-[#544244]">
              We eliminated mindless swipe fatigue and public biodata broadcasts. Experience intentional connection built on four respectful milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#fbf9f6] border border-[#dac0c2]/40 space-y-4 hover:shadow-md transition-shadow">
              <span className="w-8 h-8 rounded-full bg-[#fed65b]/40 text-[#735c00] flex items-center justify-center font-bold text-xs">
                01
              </span>
              <h3 className="font-serif text-lg font-bold text-[#4e051a]">
                Create Your Dignified Profile
              </h3>
              <p className="text-xs text-[#544244] leading-relaxed">
                Complete our private 10-point authenticity check with confidential Government ID verification. Your contacts and career coordinates stay strictly shielded.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-[#735c00] uppercase">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>Manual Vetting</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#fbf9f6] border border-[#dac0c2]/40 space-y-4 hover:shadow-md transition-shadow">
              <span className="w-8 h-8 rounded-full bg-[#fed65b]/40 text-[#735c00] flex items-center justify-center font-bold text-xs">
                02
              </span>
              <h3 className="font-serif text-lg font-bold text-[#4e051a]">
                Discover Harmonious People
              </h3>
              <p className="text-xs text-[#544244] leading-relaxed">
                Our multi-dimensional algorithm factors cultural values, dietary philosophy, life goals, and intellectual pursuits, delivering 3 to 5 curated matches daily.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-[#735c00] uppercase">
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                <span>Deep Compatibility</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#fbf9f6] border border-[#dac0c2]/40 space-y-4 hover:shadow-md transition-shadow">
              <span className="w-8 h-8 rounded-full bg-[#fed65b]/40 text-[#735c00] flex items-center justify-center font-bold text-xs">
                03
              </span>
              <h3 className="font-serif text-lg font-bold text-[#4e051a]">
                Express Mutual Interest
              </h3>
              <p className="text-xs text-[#544244] leading-relaxed">
                No unsolicited cold inboxes. Send an invitation to connect. A conversation channel opens only when both individuals acknowledge interest.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-[#735c00] uppercase">
                <span className="material-symbols-outlined text-[16px]">handshake</span>
                <span>Zero Creep Guarantee</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-[#fbf9f6] border border-[#dac0c2]/40 space-y-4 hover:shadow-md transition-shadow">
              <span className="w-8 h-8 rounded-full bg-[#fed65b]/40 text-[#735c00] flex items-center justify-center font-bold text-xs">
                04
              </span>
              <h3 className="font-serif text-lg font-bold text-[#4e051a]">
                Connect & Blossom
              </h3>
              <p className="text-xs text-[#544244] leading-relaxed">
                Converse via end-to-end encrypted messaging or in-app voice calls. Exchange phone numbers only when both individuals explicitly consent.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-[#735c00] uppercase">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Controlled Sharing</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* DESIGNED LIKE A PRIVATE CONCIERGE CLUB */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-[#735c00] tracking-widest uppercase">
              SACRED TRUST & DISCRETION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4e051a] font-bold leading-tight">
              Designed Like a Private Concierge Club
            </h2>
            <p className="text-sm text-[#544244] leading-relaxed">
              Traditional Indian matrimony sites often blast confidential personal contact details into the open web. At Apni Jodi, your privacy is treated with ancestral reverence and cutting-edge security architecture.
            </p>
            <div className="p-4 rounded-2xl bg-white border border-[#dac0c2]/40 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffe088]/40 flex items-center justify-center text-[#735c00]">
                <span className="material-symbols-outlined text-[22px]">stars</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#4e051a]">Sanctified Privacy Pledge</h4>
                <p className="text-[11px] text-[#544244]">Zero unauthorized data harvesting. No parent spam. No public indices.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-2xl bg-white border border-[#dac0c2]/40 space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#f5f3f0] flex items-center justify-center text-[#4e051a]">
                <span className="material-symbols-outlined text-[20px]">badge</span>
              </div>
              <h4 className="font-serif text-sm font-bold text-[#1b1c1a]">100% ID Verified</h4>
              <p className="text-xs text-[#544244]">Every profile is audited against authentic identity credentials (Aadhaar/Passport) to ensure real, accountable individuals.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#dac0c2]/40 space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#f5f3f0] flex items-center justify-center text-[#735c00]">
                <span className="material-symbols-outlined text-[20px]">phonelink_erase</span>
              </div>
              <h4 className="font-serif text-sm font-bold text-[#1b1c1a]">No Cold Calling or Leakage</h4>
              <p className="text-xs text-[#544244]">Your mobile number is never sold to matrimonial broker rings or displayable to non-approved members.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#dac0c2]/40 space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#f5f3f0] flex items-center justify-center text-[#4e051a]">
                <span className="material-symbols-outlined text-[20px]">blur_on</span>
              </div>
              <h4 className="font-serif text-sm font-bold text-[#1b1c1a]">Photo Blur Option</h4>
              <p className="text-xs text-[#544244]">Maintain total discretion in your workplace and social circle. Reveal your photos only to members you explicitly approve.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#dac0c2]/40 space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#f5f3f0] flex items-center justify-center text-[#735c00]">
                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
              </div>
              <h4 className="font-serif text-sm font-bold text-[#1b1c1a]">Anti-Scam AI Shield</h4>
              <p className="text-xs text-[#544244]">Continuous behavioral pattern surveillance flags financial solicitations, catfishing, and impersonation attempts instantly.</p>
            </div>

          </div>

        </div>
      </section>

      {/* STORIES OF JOY, RESPECT & UNION (TESTIMONIALS) */}
      <section className="bg-[#f5f3f0] py-16 sm:py-20 border-y border-[#dac0c2]/30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold text-[#735c00] tracking-widest uppercase">
              REAL COMPANIONSHIP
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4e051a] font-bold">
              Stories of Joy, Respect & Union
            </h2>
            <p className="text-sm text-[#544244]">
              Real experiences from members who stepped away from chaotic matchmaking to find peaceful compatibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#dac0c2]/30 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center text-[#735c00] gap-0.5">
                    {[...Array(t.stars)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[18px]">star</span>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#1b1c1a] italic leading-relaxed font-serif">
                    “{t.quote}”
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#efeeeb]">
                  <img
                    src={t.image}
                    alt={t.author}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#dac0c2]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#4e051a]">{t.author}</h4>
                    <span className="text-[11px] text-[#544244]">{t.location}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PRIVILEGE TIERS TAILORED TO YOUR PACE */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full space-y-12">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#735c00] tracking-widest uppercase">
            TRANSPARENT PRIVILEGE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#4e051a] font-bold">
            Privilege Tiers Tailored to Your Pace
          </h2>
          <p className="text-sm text-[#544244]">
            No auto-renewing traps. No paywalls on basic safety. Choose unhurried discovery or bespoke concierge guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Tier 1: Complimentary */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dac0c2]/40 shadow-sm flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#877274] uppercase tracking-wider block">DISCOVERY TIER</span>
                <h3 className="font-serif text-xl font-bold text-[#1b1c1a] mt-1">Complimentary</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-4xl font-bold text-[#1b1c1a]">₹0</span>
                <span className="text-xs text-[#544244]">/ Always free</span>
              </div>
              <div className="space-y-2.5 text-xs text-[#544244]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span>
                  <span>Full ID Verification & Badge</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span>
                  <span>5 Curated Matches per day</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span>
                  <span>Receive & Accept Inbound Waves</span>
                </div>
                <div className="flex items-center gap-2 text-[#877274]">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                  <span>Direct Encrypted Voice Calls</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('create-profile')}
              className="w-full py-3 rounded-xl bg-[#efeeeb] hover:bg-[#eae8e5] text-xs font-bold text-[#1b1c1a] uppercase tracking-wider transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* Tier 2: Apni Jodi Premium (Highlighted) */}
          <div className="bg-[#4e051a] text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between space-y-8 relative border-2 border-[#ffe088]/40">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-[#ffe088] text-[#241a00] text-[10px] font-extrabold uppercase tracking-widest shadow-md">
              MOST PREFERRED
            </div>
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#ffe088] uppercase tracking-wider block">SIGNATURE MEMBERSHIP</span>
                <h3 className="font-serif text-xl font-bold text-white mt-1">Apni Jodi Premium</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-4xl font-bold text-white">₹2,499</span>
                <span className="text-xs text-white/70">/ 3 Months</span>
              </div>
              <div className="space-y-2.5 text-xs text-white/90">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#ffe088]">check</span>
                  <span>Unlimited Direct Connect Requests</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#ffe088]">check</span>
                  <span>Encrypted In-App Audio & Video Calling</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#ffe088]">check</span>
                  <span>See Who Expressed Mutual Interest</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#ffe088]">check</span>
                  <span>Priority Cultural & Horoscope Matching</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('membership')}
              className="w-full py-3.5 rounded-xl bg-[#ffe088] hover:bg-[#fed65b] text-[#241a00] text-xs font-extrabold uppercase tracking-wider transition-colors shadow-lg"
            >
              Elevate to Premium
            </button>
          </div>

          {/* Tier 3: VIP Concierge */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dac0c2]/40 shadow-sm flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider block">ULTRA-DISCREET</span>
                <h3 className="font-serif text-xl font-bold text-[#1b1c1a] mt-1">Apni Jodi VIP Concierge</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-4xl font-bold text-[#1b1c1a]">₹14,999</span>
                <span className="text-xs text-[#544244]">/ 6 Months</span>
              </div>
              <div className="space-y-2.5 text-xs text-[#544244]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span>
                  <span>Dedicated Personal Matchmaker (Human)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span>
                  <span>100% Invisible Profile (Invitation-only visibility)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span>
                  <span>Background & Financial Verification Audits</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span>
                  <span>Curated Family Introductions Arranged</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('membership')}
              className="w-full py-3 rounded-xl bg-[#efeeeb] hover:bg-[#eae8e5] text-xs font-bold text-[#1b1c1a] uppercase tracking-wider transition-colors"
            >
              Apply for VIP
            </button>
          </div>

        </div>

      </section>

      {/* FREQUENTLY ADDRESSED INQUIRIES (FAQ ACCORDION) */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#dac0c2]/30">
        <div className="max-w-[840px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#735c00] tracking-widest uppercase">
              CLARITY & REASSURANCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4e051a] font-bold">
              Frequently Addressed Inquiries
            </h2>
            <p className="text-sm text-[#544244]">
              Everything you need to know about our values, security, and matchmaking integrity.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#dac0c2]/40 overflow-hidden transition-all bg-[#fbf9f6]"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-sm sm:text-base font-semibold text-[#1b1c1a] hover:text-[#4e051a] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined text-[20px] text-[#735c00] shrink-0">
                    {openFaq === idx ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#544244] leading-relaxed border-t border-[#dac0c2]/20 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA BANNER: YOUR MEANINGFUL CHAPTER AWAITS */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="rounded-3xl bg-[#4e051a] text-white p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold text-[#ffe088] uppercase tracking-widest">
              BEGIN TODAY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Your Meaningful Chapter Awaits
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Join thousands of thoughtful Indian singles who choose intentional compatibility, dignified pacing, and absolute privacy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('create-profile')}
              className="px-6 py-3.5 rounded-xl bg-[#ffe088] hover:bg-[#fed65b] text-[#241a00] text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              Create Free Profile
            </button>
            <button
              onClick={() => onNavigate('discover')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Explore Matches
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
