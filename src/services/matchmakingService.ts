import { Profile, MutualConnection, InboundInterest, HandshakeStatus, ReportRecord } from '../types';
import { FEATURED_PROFILES, DISCOVER_HERO_PROFILE, NEARBY_PROFILES } from '../data/mockData';

// Initial Seed Data with real-world contact states
const INITIAL_PROFILES: Profile[] = [
  DISCOVER_HERO_PROFILE,
  ...FEATURED_PROFILES,
  ...NEARBY_PROFILES
];

const INITIAL_MUTUAL_MATCHES: MutualConnection[] = [
  {
    id: 'kabir-mehta-mumbai',
    name: 'Kabir Mehta',
    age: 32,
    city: 'Mumbai (South)',
    profession: 'Investment Banker (VP)',
    education: 'Wharton & St. Xavier’s',
    community: 'Gujarati Jain',
    matchScore: 96,
    horoscopeScore: '32/36 Gunas (Uttama)',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
    quoteOrLatestMessage: 'Would love to discuss our shared appreciation for classical Gujarati architecture over Sunday tea.',
    latestMessageTime: '10:42 AM',
    tag: 'Spiritual Alignment',
    hasBilateralSpark: true,
    consentGrantedByUser: true,
    consentGrantedByMatch: false,
    phone: '+91 98200 44556',
    email: 'k.mehta.capital@gmail.com'
  },
  {
    id: 'meera-sen-delhi',
    name: 'Meera Sen',
    age: 28,
    city: 'New Delhi (Jor Bagh)',
    profession: 'Heritage Art Restorer & Curator',
    education: 'Courtauld Institute & Oxford',
    community: 'Bengali Kayastha',
    matchScore: 94,
    horoscopeScore: '34/36 Gunas (Amrit)',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    quoteOrLatestMessage: 'The restoration of the 17th-century Mughal miniature was finally authenticated this morning!',
    latestMessageTime: 'Yesterday',
    tag: 'Values-First Match',
    hasBilateralSpark: true,
    consentGrantedByUser: true,
    consentGrantedByMatch: true, // Both granted -> phone unlocked!
    phone: '+91 98111 88990',
    email: 'meera.sen.arts@oxon.org'
  },
  {
    id: 'rohan-singhania-bengaluru',
    name: 'Rohan Singhania',
    age: 30,
    city: 'Bengaluru (Indiranagar)',
    profession: 'Deep Tech Co-founder (AI)',
    education: 'BITS Pilani & Stanford',
    community: 'Marwari Maheshwari',
    matchScore: 91,
    horoscopeScore: '29/36 Gunas',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
    quoteOrLatestMessage: 'It is so rare to find someone who balances deep tech ambition with daily meditation.',
    latestMessageTime: '2 days ago',
    tag: 'Intellect & Ambition',
    hasBilateralSpark: true,
    consentGrantedByUser: false,
    consentGrantedByMatch: true,
    phone: '+91 99800 12345',
    email: 'rohan@singhaniatech.ai'
  }
];

const INITIAL_INBOUND: InboundInterest[] = [
  {
    id: 'priyanka-kapoor',
    name: 'Priyanka Kapoor',
    age: 29,
    city: 'South Delhi (GK II)',
    profession: 'Corporate Lawyer (Partner Track)',
    community: 'Punjabi Khatri',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80',
    timeAgo: '2 hours ago',
    personalizedNote: 'Your reverence for family values while leading high-growth engineering resonated deeply with me.',
    familyValues: 'Traditional with global outlook',
    lifestyle: 'Vegetarian, Yoga, Classical Music',
    govtIdVerified: true,
    horoscopeCompatible: true,
    status: 'pending'
  },
  {
    id: 'dr-ritika-verma',
    name: 'Dr. Ritika Verma',
    age: 30,
    city: 'Mumbai / Pune',
    profession: 'Pediatric Neurologist (AIIMS)',
    community: 'Kayastha',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80',
    timeAgo: '1 day ago',
    personalizedNote: 'Would be delighted to connect if you value quiet weekend dinners and meaningful intellectual conversations.',
    familyValues: 'Close-knit scholarly family',
    lifestyle: 'Teetotaler, Avid Reader',
    govtIdVerified: true,
    horoscopeCompatible: true,
    status: 'pending'
  }
];

class MatchmakingStore {
  private profiles: Profile[] = INITIAL_PROFILES;
  private matches: MutualConnection[] = INITIAL_MUTUAL_MATCHES;
  private inboundInterests: InboundInterest[] = INITIAL_INBOUND;
  private sentInterests: string[] = [];
  private blockedUsers: Set<string> = new Set();
  private reports: ReportRecord[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem('apni_jodi_matches', JSON.stringify(this.matches));
      localStorage.setItem('apni_jodi_inbound', JSON.stringify(this.inboundInterests));
      localStorage.setItem('apni_jodi_sent', JSON.stringify(this.sentInterests));
      localStorage.setItem('apni_jodi_blocked', JSON.stringify(Array.from(this.blockedUsers)));
      localStorage.setItem('apni_jodi_reports', JSON.stringify(this.reports));
    } catch {}
    this.notify();
  }

  private loadFromStorage() {
    try {
      const storedMatches = localStorage.getItem('apni_jodi_matches');
      if (storedMatches) this.matches = JSON.parse(storedMatches);

      const storedInbound = localStorage.getItem('apni_jodi_inbound');
      if (storedInbound) this.inboundInterests = JSON.parse(storedInbound);

      const storedSent = localStorage.getItem('apni_jodi_sent');
      if (storedSent) this.sentInterests = JSON.parse(storedSent);

      const storedBlocked = localStorage.getItem('apni_jodi_blocked');
      if (storedBlocked) this.blockedUsers = new Set(JSON.parse(storedBlocked));

      const storedReports = localStorage.getItem('apni_jodi_reports');
      if (storedReports) this.reports = JSON.parse(storedReports);
    } catch {}
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getProfiles(filters?: {
    ageMin?: number;
    ageMax?: number;
    city?: string;
    diet?: string;
    verifiedOnly?: boolean;
    searchQuery?: string;
  }): Profile[] {
    return this.profiles.filter(p => {
      if (this.blockedUsers.has(p.id)) return false;
      if (filters?.ageMin && p.age < filters.ageMin) return false;
      if (filters?.ageMax && p.age > filters.ageMax) return false;
      if (filters?.city && filters.city !== 'All Metros' && !p.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters?.diet && filters.diet !== 'All' && p.diet && !p.diet.toLowerCase().includes(filters.diet.toLowerCase())) return false;
      if (filters?.verifiedOnly && !p.isVerified) return false;
      if (filters?.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCity = p.city.toLowerCase().includes(q);
        const matchProf = p.profession.toLowerCase().includes(q);
        const matchComm = p.community.toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchProf && !matchComm) return false;
      }
      return true;
    });
  }

  public getMatches(): MutualConnection[] {
    return this.matches.filter(m => !this.blockedUsers.has(m.id) && !m.isBlocked);
  }

  public getInboundInterests(): InboundInterest[] {
    return this.inboundInterests.filter(i => !this.blockedUsers.has(i.id));
  }

  public getSentInterests(): string[] {
    return [...this.sentInterests];
  }

  public sendInterest(profileId: string): boolean {
    if (!this.sentInterests.includes(profileId)) {
      this.sentInterests.push(profileId);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public acceptInterest(interestId: string): MutualConnection | null {
    const interest = this.inboundInterests.find(i => i.id === interestId);
    if (!interest) return null;

    interest.status = 'accepted';

    // Create a new mutual connection!
    const newMatch: MutualConnection = {
      id: interest.id,
      name: interest.name,
      age: interest.age,
      city: interest.city,
      profession: interest.profession,
      education: 'Post-Graduate',
      community: interest.community,
      matchScore: 95,
      horoscopeScore: '33/36 Gunas (Shubh)',
      image: interest.image,
      quoteOrLatestMessage: interest.personalizedNote,
      latestMessageTime: 'Just now',
      tag: 'Mutual Spark',
      hasBilateralSpark: true,
      consentGrantedByUser: false,
      consentGrantedByMatch: false,
      phone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
      email: `${interest.id}@sanctuarypatron.in`
    };

    // Add to matches if not exists
    if (!this.matches.find(m => m.id === newMatch.id)) {
      this.matches.unshift(newMatch);
    }

    this.saveToStorage();
    return newMatch;
  }

  public rejectInterest(interestId: string) {
    this.inboundInterests = this.inboundInterests.map(i => 
      i.id === interestId ? { ...i, status: 'declined' } : i
    );
    this.saveToStorage();
  }

  public unmatch(matchId: string) {
    this.matches = this.matches.filter(m => m.id !== matchId);
    this.saveToStorage();
  }

  public blockUser(userId: string) {
    this.blockedUsers.add(userId);
    this.matches = this.matches.filter(m => m.id !== userId);
    this.inboundInterests = this.inboundInterests.filter(i => i.id !== userId);
    this.saveToStorage();
  }

  public reportUser(targetUserId: string, targetUserName: string, reason: string, details: string) {
    const newReport: ReportRecord = {
      id: `rep_${Date.now()}`,
      reportedBy: 'current_user',
      targetUserId,
      targetUserName,
      reason,
      details,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    this.reports.unshift(newReport);
    this.saveToStorage();
  }

  public getReports(): ReportRecord[] {
    return [...this.reports];
  }

  public updateReportStatus(reportId: string, status: ReportRecord['status'], actionTaken?: string) {
    this.reports = this.reports.map(r => 
      r.id === reportId ? { ...r, status, actionTaken: actionTaken || r.actionTaken } : r
    );
    this.saveToStorage();
  }

  public toggleBilateralConsent(matchId: string): boolean {
    const match = this.matches.find(m => m.id === matchId);
    if (!match) return false;

    match.consentGrantedByUser = !match.consentGrantedByUser;
    this.saveToStorage();
    return match.consentGrantedByUser;
  }

  public getHandshakeStatuses(): HandshakeStatus[] {
    return this.matches.map(m => {
      const consents = (m.consentGrantedByUser ? 1 : 0) + (m.consentGrantedByMatch ? 1 : 0);
      const isComplete = consents === 2;
      return {
        id: m.id,
        initials: m.name.split(' ').map(n => n[0]).join('').slice(0, 2),
        name: m.name,
        contactType: 'Direct Mobile & WhatsApp',
        progress: consents * 50,
        consentsGranted: consents,
        statusText: isComplete ? 'Bilateral Escrow Unlocked' : consents === 1 ? '1 of 2 Consents Granted' : 'Awaiting Consents',
        revealedDetail: isComplete ? m.phone : '••••••• [Escrow Protected]',
        hasUserAuthorized: !!m.consentGrantedByUser
      };
    });
  }
}

export const matchmakingService = new MatchmakingStore();
