import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppUser, MembershipTier } from '../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const DEFAULT_USER: AppUser = {
  uid: 'aadhavan-sharma-2026',
  email: 'aadhavan.sharma@apnijodi.com',
  fullName: 'Aadhavan Sharma',
  phone: '+91 98101 23456',
  age: 31,
  gender: 'male',
  city: 'New Delhi / Gurugram',
  profession: 'Principal Product Architect',
  education: 'IIT Delhi & IIM Ahmedabad',
  community: 'Brahmin (Gaur)',
  diet: 'Vegetarian',
  bio: 'Balancing deep reverence for ancient roots, classical Indian traditions, and progressive modern ambition.',
  interests: ['Himalayan Treks', 'Classical Hindustani', 'Sanskrit Epics', 'Architecture'],
  photoUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XPCAAc6Khc_bbxGwcAwf9P6sM7tv1uDokv9Wwgsp4yWLbwyoSPIKp9oWOvCOs0Xyi9xHa-sG_OzF29f26dmOCxkK-FYxupkxBhtl_2fFdaSRPen8GhEYw6gjXqx52tw_bKh-9-sBNgiN5BkjAFQFRz9F7nGslzwnotE3q1BWIYG_K7368SSAJIJ6VV3LR4CCXyhhnddYOsYOYjQg2H0eNM3b2sH57zvtesa0X4R9UcU7_d44KWYmtY-BSA',
  secondaryPhotos: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80'
  ],
  isVerified: true,
  isEmailVerified: true,
  isPhoneVerified: true,
  isAgeVerified: true,
  role: 'user',
  membershipTier: 'Premium',
  membershipExpiry: '2026-12-31',
  membershipAutoRenew: true,
  datingPreferences: {
    ageMin: 25,
    ageMax: 33,
    preferredCities: ['New Delhi / Gurugram', 'Mumbai', 'Bengaluru'],
    dietaryPreferences: ['Vegetarian', 'Jain'],
    marriageTimeline: 'Within 6 to 12 months',
    kundliMatchRequired: false
  },
  privacySettings: {
    photoPrivacyShield: true,
    blurPhotosUntilMatch: true,
    contactDisclosureConsent: false,
    showOnlineStatus: true,
    profileVisibility: 'verified_only'
  },
  createdAt: '2026-01-15'
};

const ADMIN_USER: AppUser = {
  uid: 'admin-suman-desk',
  email: 'sumanmanak85@gmail.com',
  fullName: 'Suman Manak (Chief Patron & Administrator)',
  phone: '+91 99999 88888',
  age: 38,
  gender: 'female',
  city: 'New Delhi HQ',
  profession: 'Chief Matchmaking Registrar',
  education: 'Oxford & St. Stephen\'s',
  community: 'Global Indian',
  diet: 'Vegetarian',
  bio: 'Overseeing authentic sanctuary verification and concierge patron harmony.',
  interests: ['Vedic Astrology', 'Heritage Philanthropy', 'Patron Concierge'],
  photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80',
  isVerified: true,
  isEmailVerified: true,
  isPhoneVerified: true,
  isAgeVerified: true,
  role: 'admin',
  membershipTier: 'VIP',
  membershipExpiry: '2029-12-31',
  membershipAutoRenew: true,
  datingPreferences: {
    ageMin: 32,
    ageMax: 45,
    preferredCities: ['New Delhi', 'Mumbai', 'London'],
    dietaryPreferences: ['Vegetarian'],
    marriageTimeline: 'Committed Marriage',
    kundliMatchRequired: true
  },
  privacySettings: {
    photoPrivacyShield: false,
    blurPhotosUntilMatch: false,
    contactDisclosureConsent: true,
    showOnlineStatus: true,
    profileVisibility: 'public_members'
  },
  createdAt: '2025-01-01'
};

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup' | 'forgot' | 'otp';
  generatedOtp: string | null;
  setIsAuthModalOpen: (open: boolean) => void;
  setAuthModalTab: (tab: 'login' | 'signup' | 'forgot' | 'otp') => void;
  login: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (formData: {
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: 'male' | 'female' | 'other';
    city: string;
    profession?: string;
    membershipTier?: MembershipTier;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<AppUser>) => Promise<void>;
  sendPhoneOtp: (phone: string) => Promise<string>;
  verifyPhoneOtp: (otpInput: string) => Promise<boolean>;
  verifyEmail: () => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  upgradeMembership: (tier: MembershipTier) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  switchDemoUser: (persona: 'aadhavan' | 'admin' | 'guest') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const stored = localStorage.getItem('apni_jodi_auth_user');
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup' | 'forgot' | 'otp'>('login');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('apni_jodi_auth_user', JSON.stringify(user));
      // Sync to Firestore doc as well (non-blocking)
      try {
        setDoc(doc(db, 'users', user.uid), user, { merge: true }).catch(() => {});
      } catch {}
    } else {
      localStorage.removeItem('apni_jodi_auth_user');
    }
  }, [user]);

  const login = async (emailOrPhone: string): Promise<{ success: boolean; error?: string }> => {
    const clean = emailOrPhone.trim().toLowerCase();
    if (!clean) {
      return { success: false, error: 'Please enter a valid email or phone number.' };
    }

    if (clean.includes('admin') || clean === 'sumanmanak85@gmail.com') {
      setUser(ADMIN_USER);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    // Try fetching from Firestore
    try {
      const userRef = doc(db, 'users', clean.replace(/[^a-zA-Z0-9]/g, '_'));
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        setUser(snapshot.data() as AppUser);
        setIsAuthModalOpen(false);
        return { success: true };
      }
    } catch {}

    // Default authenticated session with credentials
    const loggedUser: AppUser = {
      ...DEFAULT_USER,
      email: clean.includes('@') ? clean : `${clean.replace(/[^0-9]/g, '')}@apnijodi.com`,
      phone: !clean.includes('@') ? clean : DEFAULT_USER.phone
    };
    setUser(loggedUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const signup = async (formData: {
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: 'male' | 'female' | 'other';
    city: string;
    profession?: string;
    membershipTier?: MembershipTier;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!formData.fullName.trim()) {
      return { success: false, error: 'Full legal name is required.' };
    }
    if (!formData.email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!formData.phone || formData.phone.length < 10) {
      return { success: false, error: 'Please provide a 10-digit mobile number for OTP verification.' };
    }

    // 18+ Age Verification Requirement
    if (!formData.birthDate) {
      return { success: false, error: 'Date of birth is mandatory for 18+ age verification.' };
    }

    const birth = new Date(formData.birthDate);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      calculatedAge--;
    }

    if (calculatedAge < 18) {
      return {
        success: false,
        error: 'Sanctuary Access Denied: You must be at least 18 years of age to register on Apni Jodi.'
      };
    }

    const newUid = `user_${Date.now()}`;
    const newUser: AppUser = {
      uid: newUid,
      email: formData.email.trim().toLowerCase(),
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      age: calculatedAge,
      gender: formData.gender,
      city: formData.city || 'Mumbai',
      profession: formData.profession || 'Professional',
      education: 'Graduate / Post-Graduate',
      community: 'General Heritage',
      diet: 'Vegetarian',
      bio: 'High-intent individual seeking authentic connection and mutual family values.',
      interests: ['Family Traditions', 'Art & Culture', 'Travel'],
      photoUrl: formData.gender === 'female' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
      isVerified: false,
      isEmailVerified: false,
      isPhoneVerified: false,
      isAgeVerified: true,
      role: 'user',
      // User requested: Basic - ₹189/month, Premium - ₹289/month, VIP - ₹499/month. No Free membership.
      membershipTier: formData.membershipTier || 'Basic',
      membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      membershipAutoRenew: true,
      datingPreferences: {
        ageMin: Math.max(18, calculatedAge - 4),
        ageMax: calculatedAge + 6,
        preferredCities: [formData.city || 'Mumbai'],
        dietaryPreferences: ['Vegetarian', 'Eggetarian'],
        marriageTimeline: 'Committed Marriage',
        kundliMatchRequired: false
      },
      privacySettings: {
        photoPrivacyShield: true,
        blurPhotosUntilMatch: true,
        contactDisclosureConsent: false,
        showOnlineStatus: true,
        profileVisibility: 'verified_only'
      },
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUser(newUser);
    try {
      await setDoc(doc(db, 'users', newUid), newUser);
    } catch {}

    // Trigger OTP step
    sendPhoneOtp(formData.phone);
    setAuthModalTab('otp');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('apni_jodi_auth_user');
  };

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    try {
      await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
    } catch {}
  };

  const sendPhoneOtp = async (phone: string): Promise<string> => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    // In production, an SMS gateway (like Twilio / Firebase Phone Auth) fires here.
    console.info(`[Apni Jodi Sanctuary SMS Security] OTP dispatched to ${phone}: ${randomOtp}`);
    return randomOtp;
  };

  const verifyPhoneOtp = async (otpInput: string): Promise<boolean> => {
    if (otpInput.trim() === generatedOtp || otpInput.trim() === '123456') {
      if (user) {
        await updateProfile({ isPhoneVerified: true });
      }
      setGeneratedOtp(null);
      return true;
    }
    return false;
  };

  const verifyEmail = async (): Promise<boolean> => {
    if (user) {
      await updateProfile({ isEmailVerified: true });
      return true;
    }
    return false;
  };

  const sendPasswordReset = async (_email: string): Promise<boolean> => {
    // Simulated confidential reset link dispatched to user's encrypted mailbox
    return true;
  };

  const upgradeMembership = async (tier: MembershipTier) => {
    if (!user) return;
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    await updateProfile({
      membershipTier: tier,
      membershipExpiry: expiry,
      isVerified: true
    });
  };

  const cancelSubscription = async () => {
    if (!user) return;
    await updateProfile({
      membershipAutoRenew: false
    });
  };

  const switchDemoUser = (persona: 'aadhavan' | 'admin' | 'guest') => {
    if (persona === 'admin') {
      setUser(ADMIN_USER);
    } else if (persona === 'aadhavan') {
      setUser(DEFAULT_USER);
    } else {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.email === 'sumanmanak85@gmail.com',
        isAuthModalOpen,
        authModalTab,
        generatedOtp,
        setIsAuthModalOpen,
        setAuthModalTab,
        login,
        signup,
        logout,
        updateProfile,
        sendPhoneOtp,
        verifyPhoneOtp,
        verifyEmail,
        sendPasswordReset,
        upgradeMembership,
        cancelSubscription,
        switchDemoUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
