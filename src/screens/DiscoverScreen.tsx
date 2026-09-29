import React, { useState } from 'react';
import { ScreenType, Profile } from '../types';
import { DISCOVER_HERO_PROFILE, NEARBY_PROFILES } from '../data/mockData';

interface DiscoverScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectProfile: (profile: Profile) => void;
  onOpenSafety?: () => void;
  onSendInterest?: (profileId: string) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onNavigate,
  onSelectProfile,
  onOpenSafety,
  onSendInterest
}) => {
  const [activeTab, setActiveTab] = useState('recommended');
  const [ageRange, setAgeRange] = useState(35);
  const [location, setLocation] = useState('Delhi NCR (within 40km)');
  const [relationshipIntent, setRelationshipIntent] = useState('Committed Marriage (1-2 yrs)');
  const [selectedDiet, setSelectedDiet] = useState<string[]>(['Veg']);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [heroInterestSent, setHeroInterestSent] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [awaitingResponses, setAwaitingResponses] = useState({
    priyanka: 'pending',
    vikram: 'pending'
  });

  const heroPhotos = DISCOVER_HERO_PROFILE.secondaryImages && DISCOVER_HERO_PROFILE.secondaryImages.length > 0
    ? [DISCOVER_HERO_PROFILE.image, ...DISCOVER_HERO_PROFILE.secondaryImages]
    : [DISCOVER_HERO_PROFILE.image];

  const toggleDiet = (diet: string) => {
    setSelectedDiet(prev => 
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    );
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      
      {/* HEADER & FILTER BAR */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#dac0c2]/30 space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#efeeeb]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-[#fed65b]/30 text-[#735c00] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">stars</span>
                CURATED DISCOVERY
              </span>
              <span className="text-xs text-[#877274]">• 1,428 Verified Members Matching Your Criteria</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#4e051a] font-bold">
              Discover Soulful Matches
            </h1>
          </div>

          {/* Quick Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeTab === 'recommended' 
                  ? 'bg-[#4e051a] text-white shadow-sm' 
                  : 'bg-[#efeeeb] text-[#544244] hover:bg-[#eae8e5]'
              }`}
            >
              Recommended for You
            </button>
            <button
              onClick={() => setActiveTab('most-compatible')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeTab === 'most-compatible' 
                  ? 'bg-[#4e051a] text-white shadow-sm' 
                  : 'bg-[#efeeeb] text-[#544244] hover:bg-[#eae8e5]'
              }`}
            >
              Most Compatible (90%+)
            </button>
            <button
              onClick={() => setActiveTab('nearby')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeTab === 'nearby' 
                  ? 'bg-[#4e051a] text-white shadow-sm' 
                  : 'bg-[#efeeeb] text-[#544244] hover:bg-[#eae8e5]'
              }`}
            >
              Nearby Members
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeTab === 'recent' 
                  ? 'bg-[#4e051a] text-white shadow-sm' 
                  : 'bg-[#efeeeb] text-[#544244] hover:bg-[#eae8e5]'
              }`}
            >
              Recently Active
            </button>
          </div>
        </div>

        {/* Filters Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
          
          {/* Age range */}
          <div className="lg:col-span-3 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#877274] uppercase tracking-wider">Age Range</span>
              <span className="text-[#4e051a]">23 - {ageRange} yrs</span>
            </div>
            <input
              type="range"
              min={24}
              max={45}
              value={ageRange}
              onChange={(e) => setAgeRange(Number(e.target.value))}
              className="w-full accent-[#4e051a] cursor-pointer"
            />
          </div>

          {/* Location */}
          <div className="lg:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-[#877274] uppercase tracking-wider block">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#f5f3f0] text-xs font-medium text-[#1b1c1a] focus:outline-none"
            >
              <option>Delhi NCR (within 40km)</option>
              <option>Mumbai & Pune</option>
              <option>Bengaluru & Hyderabad</option>
              <option>London & Europe (NRI)</option>
              <option>USA & Canada (NRI)</option>
            </select>
          </div>

          {/* Relationship Intent */}
          <div className="lg:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-[#877274] uppercase tracking-wider block">Relationship Intent</label>
            <select
              value={relationshipIntent}
              onChange={(e) => setRelationshipIntent(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#f5f3f0] text-xs font-medium text-[#1b1c1a] focus:outline-none"
            >
              <option>Committed Marriage (1-2 yrs)</option>
              <option>Intentional Courtship (Dating with Intent)</option>
              <option>Values-First Exploration</option>
            </select>
          </div>

          {/* Chips & Filter Submit */}
          <div className="lg:col-span-3 flex items-center justify-between gap-2 pt-4 lg:pt-0">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => toggleDiet('Veg')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedDiet.includes('Veg') 
                    ? 'bg-[#735c00] text-white' 
                    : 'bg-[#f5f3f0] text-[#544244]'
                }`}
              >
                Veg
              </button>
              <button
                onClick={() => toggleDiet('Non-Smoker')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedDiet.includes('Non-Smoker') 
                    ? 'bg-[#735c00] text-white' 
                    : 'bg-[#f5f3f0] text-[#544244]'
                }`}
              >
                Non-Smoker
              </button>
            </div>

            <button
              onClick={() => alert("Applying refined sanctuary filters...")}
              className="px-4 py-2 rounded-xl bg-[#4e051a] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-[#6b1d2f]"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Filter</span>
            </button>
          </div>

        </div>

      </div>

      {/* DISCOVER MAIN BODY: HERO PROFILE SPOTLIGHT + RIGHT SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Hero Spotlight (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#dac0c2]/30 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Gallery Column (5 Cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#f5f3f0] shadow-md group">
                <img
                  src={heroPhotos[activePhotoIdx]}
                  alt="Meera Sengupta"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay Pills */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#4e051a] font-bold text-xs shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4e051a]"></span>
                  <span>91% Compatible</span>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#ffe088] text-[#241a00] font-bold text-xs shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  <span>GOVT VERIFIED</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl">
                  <span>South Delhi • Active 2 hrs ago</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">photo_library</span>
                    4 Photos
                  </span>
                </div>
              </div>

              {/* Thumbnails row */}
              <div className="grid grid-cols-4 gap-2">
                {heroPhotos.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIdx(i)}
                    className={`aspect-square rounded-xl overflow-hidden ring-2 transition-all ${
                      activePhotoIdx === i ? 'ring-[#4e051a] scale-95' : 'ring-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Meera view" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Info Column (7 Cols) */}
            <div className="md:col-span-7 space-y-5">
              
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4e051a]">
                    Meera Sengupta, 27
                  </h2>
                  <p className="text-xs text-[#544244] mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#735c00]">location_on</span>
                    Greater Kailash II, South Delhi • 5'6" (168 cm)
                  </p>
                </div>
                <button 
                  onClick={() => onSelectProfile(DISCOVER_HERO_PROFILE)}
                  className="p-1 rounded-full text-[#544244] hover:bg-[#efeeeb]" 
                  title="More actions"
                >
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
              </div>

              {/* Bio Quote */}
              <div className="p-4 rounded-2xl bg-[#f5f3f0] border-l-4 border-[#4e051a]">
                <p className="font-serif text-sm text-[#1b1c1a] italic leading-relaxed">
                  “Creative strategist passionate about art galleries, quiet Sunday brunches, and soulful conversations.”
                </p>
              </div>

              {/* Compatibility Breakdown */}
              <div className="p-4 rounded-2xl bg-[#fbf9f6] border border-[#dac0c2]/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#4e051a] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#735c00]">tune</span>
                    Compatibility Breakdown
                  </span>
                  <span className="text-[#735c00]">91% Platform Index</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#544244]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#735c00]">check</span>
                    Heritage Appreciation
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#735c00]">check</span>
                    Non-Smoker
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#735c00]">check</span>
                    Career Driven
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#735c00]">check</span>
                    Mindful Living
                  </span>
                </div>
                <p className="text-[10px] text-[#877274] pt-1">
                  *Platform recommendation indicator based on mutually stated values and cultural milestones.
                </p>
              </div>

              {/* Background & Ethos */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-[#877274] uppercase tracking-wider block">
                  BACKGROUND & ETHOS
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-xl bg-[#f5f3f0] text-[#544244] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">school</span>
                    M.Des, NID Ahmedabad
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-[#f5f3f0] text-[#544244] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">work</span>
                    Brand Director, D2C Studio
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-[#f5f3f0] text-[#544244] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">restaurant</span>
                    Mindful Vegetarian
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-[#f5f3f0] text-[#544244] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">music_note</span>
                    Hindustani Classical Vocalist
                  </span>
                </div>
              </div>

              {/* Strict Discretion note */}
              <div className="flex items-start gap-2 text-[11px] text-[#877274] p-3 rounded-xl bg-[#f5f3f0]">
                <span className="material-symbols-outlined text-[16px] text-[#735c00] shrink-0 mt-0.5">lock</span>
                <span>Contact details, family phone, and private album access are strictly confidential until mutual intent is confirmed.</span>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center gap-3">
                {heroInterestSent ? (
                  <button
                    disabled
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#ffe088] text-[#241a00] font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Interest Sent • Saved in Sanctuary</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setHeroInterestSent(true);
                      if (onSendInterest) onSendInterest(DISCOVER_HERO_PROFILE.id);
                    }}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#4e051a] hover:bg-[#6b1d2f] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                    <span>Send Sacred Interest</span>
                  </button>
                )}

                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`p-3.5 rounded-xl border border-[#dac0c2] transition-colors ${
                    bookmarked ? 'bg-[#ffe088] text-[#241a00]' : 'hover:bg-[#f5f3f0] text-[#544244]'
                  }`}
                  title="Bookmark profile"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {bookmarked ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>

                <button
                  onClick={() => alert("Showing next curated recommendation...")}
                  className="p-3.5 rounded-xl border border-[#dac0c2] hover:bg-[#f5f3f0] text-[#544244] transition-colors"
                  title="Pass"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Right Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Daily Jodi Picks */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#dac0c2]/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#735c00] text-[20px]">auto_awesome</span>
                <h3 className="font-serif text-base font-bold text-[#4e051a]">Your Daily Jodi Picks</h3>
              </div>
              <span className="text-[10px] text-[#877274] font-semibold">Resets 9 AM</span>
            </div>
            <p className="text-xs text-[#544244]">
              Three high-resonance singles handpicked for your lifestyle values today.
            </p>

            <div className="space-y-3">
              {/* Pick 1 */}
              <div 
                onClick={() => onSelectProfile(NEARBY_PROFILES[1])}
                className="p-3 rounded-2xl bg-[#f5f3f0] hover:bg-[#eae8e5] cursor-pointer transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHQJYQS9t43DuZFZniBQXyARKWKag0m-1hstMrT40a1-athbw8Ov7GRAsECc4zC33diKbA7wG5NZRrh0AUn13WNJCou8kFiiv8RJ0fpZMqRyiA7sovrRHyyX61JKzgdyWNnd0J2nM6QWpRBeHTnoqg1TKwNjBY6zKhcaEx0UqPIRsyppAjbvnYqvda-Jbkqq_17dEWFIPnpAqQJt69wZPAg-urDFLP_WU1LTcyHIv6xcfbKX5rpMybjw"
                    alt="Dr. Tanvi"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#735c00]/30"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#1b1c1a]">Dr. Tanvi, 26</h4>
                    <span className="text-[11px] text-[#544244]">Cardiologist • Delhi</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#735c00]">96%</span>
              </div>

              {/* Pick 2 */}
              <div 
                onClick={() => onSelectProfile(NEARBY_PROFILES[0])}
                className="p-3 rounded-2xl bg-[#f5f3f0] hover:bg-[#eae8e5] cursor-pointer transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_5EsFZG4ltuoqR_RyNcDCBcUMDcbfprmj3CY3LHSUJhEBTq4jIKEoVVSsj-AKDbswN2OFJXmfhcTkswu-uuJNWMAkTQeS5Ni7MVR_28NbSr7dCXDT492mwMG09T9lFv0dcKfpiEzmJD7KS7SWczXpe74BoFLKAtwEuNSkhAfFxKK4hSBGcoJnhLIU0BIxlGXky02qmvaQNLoGD1D6RsBVxKyi9rQv0kzYUkn_E8IjJjcLTYZOHSe9pQ"
                    alt="Rohan"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#735c00]/30"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#1b1c1a]">Rohan, 30</h4>
                    <span className="text-[11px] text-[#544244]">Partner, Climate VC • Mumbai</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#735c00]">92%</span>
              </div>

              {/* Pick 3 */}
              <div 
                onClick={() => onSelectProfile(NEARBY_PROFILES[1])}
                className="p-3 rounded-2xl bg-[#f5f3f0] hover:bg-[#eae8e5] cursor-pointer transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgy6E8OpOoQejyeIE85FgjgXf8XS0Eg4wajVhqeDxCLAmiT0n7w5CaqAkjgmNHBiFJrQdTofSahDkpVdS4LAN-hEANfjETyLg_NPdDTXzIqZaDgJ4k7Sd6JC8L3sU_Y40ffYQSKNEM_73Y028Leqjjpobn23VvgZ01v55djeh7nydfZlzUG2TZt4WHto6ewOLSdP6So_rR2JhGcoZk-6olwvZXolFP7INlsQl-aGp4enQT3qf0gB6AFA"
                    alt="Avantika"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#735c00]/30"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#1b1c1a]">Avantika, 29</h4>
                    <span className="text-[11px] text-[#544244]">Corporate Counsel • London NRI</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#735c00]">88%</span>
              </div>
            </div>

          </div>

          {/* Awaiting Your Response */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#dac0c2]/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4e051a] text-[20px]">diversity_1</span>
                <h3 className="font-serif text-base font-bold text-[#4e051a]">Awaiting Your Response</h3>
              </div>
              <span className="w-5 h-5 rounded-full bg-[#4e051a] text-white text-[11px] flex items-center justify-center font-bold">
                2
              </span>
            </div>

            {/* Inbound 1: Priyanka */}
            <div className="p-3.5 rounded-2xl bg-[#f5f3f0] space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsYybXAZFq8wlyNEigyYNh5jzZX_1vfNLuJdvLuiO2haA0nUVWj7MyOvi0KrnLmK7T-utFzLnEXq4i6qmjt1cfTVtlyhthGgTDpaYlWdOShVJ8dsR3fXyJVV05YxZ7Q7xtNAVAVGPONpg2qKY3A4gQAn_wslodRAh9n_fH2U9X9IFF_r3jpS4za3mIRA-yv5-RSC1wPZ6XH-DCiXa_FjZclyBKLGrBC0ZinqCChCYxBRELmrsejCplBg"
                  alt="Priyanka"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#4e051a]/30"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#1b1c1a]">Priyanka, 28</h4>
                  <span className="text-[10px] text-[#544244]">Sent Interest 4 hrs ago • Delhi</span>
                </div>
              </div>

              {awaitingResponses.priyanka === 'accepted' ? (
                <div className="text-center p-2 rounded-lg bg-[#ffe088]/40 text-xs font-bold text-[#735c00]">
                  Accepted! Mutual channel opened.
                </div>
              ) : awaitingResponses.priyanka === 'declined' ? (
                <div className="text-center p-2 rounded-lg bg-[#efeeeb] text-xs text-[#877274]">
                  Declined with discretion.
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setAwaitingResponses(prev => ({ ...prev, priyanka: 'accepted' }))}
                    className="flex-1 py-1.5 rounded-lg bg-[#4e051a] text-white text-xs font-bold hover:bg-[#6b1d2f]"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setAwaitingResponses(prev => ({ ...prev, priyanka: 'declined' }))}
                    className="flex-1 py-1.5 rounded-lg bg-white text-[#544244] border border-[#dac0c2] text-xs font-semibold hover:bg-[#efeeeb]"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>

            {/* Inbound 2: Vikramaditya */}
            <div className="p-3.5 rounded-2xl bg-[#f5f3f0] space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDegxMvbrU7v02HyeeGGZk_rn6p7LLAxKxD7sSvBbSl0ZbEtz2DuHOEp0gIGhF6pn2wtX85Lt67s28p-mNj_zrHRr_kkw-bz57OpfWDTGDkY2YNuFaxZ3XVgNDrit_Nc7RPfscaLGw8C1mOnRroVtgxCLMf6qQgv2rXj6CdSs_0nyW9i8fcvCb0Z1O_6tjJN22ayuo0AKnh_UfjdA6uD-YKXRiAundZd1FsFUnZz0cKHK4Cvb95ArQPzg"
                  alt="Vikramaditya"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#4e051a]/30"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#1b1c1a]">Vikramaditya, 30</h4>
                  <span className="text-[10px] text-[#544244]">Sent Interest Yesterday • Hyderabad</span>
                </div>
              </div>

              {awaitingResponses.vikram === 'accepted' ? (
                <div className="text-center p-2 rounded-lg bg-[#ffe088]/40 text-xs font-bold text-[#735c00]">
                  Accepted! Mutual channel opened.
                </div>
              ) : awaitingResponses.vikram === 'declined' ? (
                <div className="text-center p-2 rounded-lg bg-[#efeeeb] text-xs text-[#877274]">
                  Declined with discretion.
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setAwaitingResponses(prev => ({ ...prev, vikram: 'accepted' }))}
                    className="flex-1 py-1.5 rounded-lg bg-[#4e051a] text-white text-xs font-bold hover:bg-[#6b1d2f]"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setAwaitingResponses(prev => ({ ...prev, vikram: 'declined' }))}
                    className="flex-1 py-1.5 rounded-lg bg-white text-[#544244] border border-[#dac0c2] text-xs font-semibold hover:bg-[#efeeeb]"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Elevate with Verified ID Card */}
          <div className="rounded-3xl bg-[#4e051a] text-white p-6 shadow-md space-y-4 border border-[#ffe088]/30">
            <div className="flex items-center gap-2 text-[#ffe088] text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>PRIORITY SANCTITY</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-white leading-tight">
              Elevate with Verified ID
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Verified members receive <strong className="text-[#ffe088]">3.4x more mutual connections</strong> and unlock private photo viewing requests automatically.
            </p>
            <button
              onClick={onOpenSafety}
              className="w-full py-3 rounded-xl bg-[#ffe088] hover:bg-[#fed65b] text-[#241a00] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
              <span>Verify Now (1 min)</span>
            </button>
            <span className="text-[10px] text-white/60 block text-center uppercase tracking-wide">
              Bank-Grade 256-Bit Verification
            </span>
          </div>

        </div>

      </div>

      {/* HIGHLY COMPATIBLE PROFILES NEARBY (BOTTOM GRID) */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#4e051a]">
              Highly Compatible Profiles Nearby
            </h2>
            <p className="text-xs text-[#544244]">
              Carefully matched on lifestyle parity, family alignment, and intentional timing.
            </p>
          </div>
          <button 
            onClick={() => alert("Loading more profiles...")}
            className="text-xs font-bold text-[#4e051a] hover:underline"
          >
            View All 1,428 →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEARBY_PROFILES.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-[#dac0c2]/30 flex flex-col justify-between"
            >
              <div>
                <div 
                  onClick={() => onSelectProfile(profile)}
                  className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-[#f5f3f0]"
                >
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 text-[#4e051a] font-bold text-xs shadow-sm">
                    {profile.matchScore}% Match
                  </div>
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#ffe088] text-[#241a00] flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                  </div>
                  <div className="absolute bottom-2 left-3 text-white text-xs font-semibold bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    {profile.city}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-bold text-[#1b1c1a]">
                      {profile.name}, {profile.age}
                    </h3>
                    <span className="text-xs text-[#877274]">{profile.height}</span>
                  </div>
                  <p className="text-xs text-[#544244] truncate">{profile.profession}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {profile.passions.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#f5f3f0] text-[10px] text-[#544244] font-medium"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center gap-2">
                <button
                  onClick={() => onSelectProfile(profile)}
                  className="flex-1 py-2.5 rounded-xl bg-[#4e051a] hover:bg-[#6b1d2f] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                  <span>Connect</span>
                </button>
                <button
                  onClick={() => alert(`Saved ${profile.name} to private shortlist.`)}
                  className="p-2.5 rounded-xl border border-[#dac0c2] hover:bg-[#f5f3f0] text-[#544244]"
                  title="Bookmark"
                >
                  <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </section>

    </div>
  );
};
