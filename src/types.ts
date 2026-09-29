export type ScreenType = 
  | 'home' 
  | 'discover' 
  | 'matches' 
  | 'interests' 
  | 'private-letters' 
  | 'membership' 
  | 'create-profile' 
  | 'safety'
  | 'admin'
  | 'profile-edit';

export type MembershipTier = 'Basic' | 'Premium' | 'VIP';

export interface DatingPreferences {
  ageMin: number;
  ageMax: number;
  preferredCities: string[];
  dietaryPreferences: string[];
  marriageTimeline: string;
  kundliMatchRequired: boolean;
}

export interface PrivacySettings {
  photoPrivacyShield: boolean;
  blurPhotosUntilMatch: boolean;
  contactDisclosureConsent: boolean;
  showOnlineStatus: boolean;
  profileVisibility: 'public_members' | 'verified_only' | 'hidden';
}

export interface AppUser {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  city: string;
  profession: string;
  education: string;
  community: string;
  diet: string;
  bio: string;
  interests: string[];
  photoUrl: string;
  secondaryPhotos?: string[];
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isAgeVerified: boolean;
  role: 'user' | 'admin';
  membershipTier: MembershipTier;
  membershipExpiry: string;
  membershipAutoRenew: boolean;
  datingPreferences: DatingPreferences;
  privacySettings: PrivacySettings;
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  city: string;
  profession: string;
  education: string;
  community: string;
  matchScore: number;
  horoscopeScore?: string;
  image: string;
  secondaryImages?: string[];
  isVerified: boolean;
  statusTag?: string;
  bioQuote: string;
  passions: string[];
  height?: string;
  diet?: string;
  smoking?: string;
  relationshipIntent?: string;
  activeStatus?: string;
  noteFromCandidate?: string;
  familyBackground?: string;
  casteTranscendence?: boolean;
  phone?: string;
  email?: string;
  privacyShieldActive?: boolean;
}

export interface MutualConnection {
  id: string;
  name: string;
  age: number;
  city: string;
  profession: string;
  education: string;
  community: string;
  matchScore: number;
  horoscopeScore: string;
  image: string;
  quoteOrLatestMessage: string;
  latestMessageTime?: string;
  tag: string;
  hasBilateralSpark: boolean;
  isBlocked?: boolean;
  consentGrantedByUser?: boolean;
  consentGrantedByMatch?: boolean;
  phone?: string;
  email?: string;
}

export interface InboundInterest {
  id: string;
  name: string;
  age: number;
  city: string;
  profession: string;
  community: string;
  image: string;
  timeAgo: string;
  personalizedNote: string;
  familyValues: string;
  lifestyle: string;
  govtIdVerified: boolean;
  horoscopeCompatible?: boolean;
  status: 'pending' | 'accepted' | 'declined';
}

export interface HandshakeStatus {
  id: string;
  initials: string;
  name: string;
  contactType: string;
  progress: number; // 50 or 100
  consentsGranted: number; // 1 or 2
  statusText: string;
  revealedDetail?: string;
  hasUserAuthorized: boolean;
}

export interface ChatMessage {
  id: string;
  matchId?: string;
  sender: 'user' | 'match';
  senderId?: string;
  text: string;
  time: string;
  isRead?: boolean;
  delivered?: boolean;
}

export interface InvoiceRecord {
  id: string;
  tier: string;
  note: string;
  date: string;
  amount: string;
  baseAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
  status: 'Settled' | 'Pending' | 'Refunded';
  category: 'memberships' | 'addons';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  hsnCode?: string;
  gstin?: string;
  customerName?: string;
  customerEmail?: string;
}

export interface CouponRecord {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number; // e.g. 20% or ₹50
  description: string;
  active: boolean;
  minOrder?: number;
}

export interface ReportRecord {
  id: string;
  reportedBy: string;
  targetUserId: string;
  targetUserName?: string;
  reason: string;
  details: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  actionTaken?: string;
}

export interface SupportTicket {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
  message: string;
}
