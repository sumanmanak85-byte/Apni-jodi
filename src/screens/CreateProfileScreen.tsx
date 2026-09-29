import React, { useState } from 'react';
import { ScreenType, MembershipTier } from '../types';
import { useAuth } from '../context/AuthContext';
import { paymentService, PaymentCalculation } from '../services/paymentService';

interface CreateProfileScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onProfileCreated?: (profileData: any) => void;
}

export const CreateProfileScreen: React.FC<CreateProfileScreenProps> = ({ onNavigate, onProfileCreated }) => {
  const { user, updateProfile, upgradeMembership } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [ageError, setAgeError] = useState<string | null>(null);

  // STEP 1: ABOUT YOU
  const [fullName, setFullName] = useState(user?.fullName || 'Aadhavan Sharma');
  const [birthDate, setBirthDate] = useState('1995-06-18');
  const [calculatedAge, setCalculatedAge] = useState<number>(31);
  const [gender, setGender] = useState<'Woman' | 'Man' | 'Non-binary' | 'Prefer not to say'>('Man');
  const [city, setCity] = useState(user?.city || 'New Delhi');
  const [profilePhoto, setProfilePhoto] = useState<string>(
    user?.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80'
  );
  const [datingIntention, setDatingIntention] = useState<
    'Serious Relationship' | 'Long-term Dating' | 'Meaningful Connection' | 'Marriage'
  >('Serious Relationship');
  const [interestedIn, setInterestedIn] = useState<'Men' | 'Women' | 'Everyone'>('Women');

  // STEP 2: YOUR INTERESTS & LIFESTYLE
  const [bio, setBio] = useState(
    user?.bio || 'Product architect with a love for architectural heritage, slow weekend coffee, indie cinema, and Himalayan treks. Looking for thoughtful conversations and genuine connection.'
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Architecture',
    'Himalayan Treks',
    'Coffee & Cafes',
    'Indie Cinema',
    'Classical Music'
  ]);
  const [customInterestInput, setCustomInterestInput] = useState('');
  const [favoriteActivities, setFavoriteActivities] = useState<string[]>([
    'Weekend gallery walks',
    'Trying artisan bakeries',
    'Live acoustic gigs',
    'Sunset cycling'
  ]);
  const [customActivityInput, setCustomActivityInput] = useState('');
  const [lifestyle, setLifestyle] = useState<'Active & Fitness' | 'Balanced & Mindful' | 'Social Butterfly' | 'Quiet & Homebody' | 'Creative Explorer'>('Balanced & Mindful');
  const [foodPreference, setFoodPreference] = useState<'Vegetarian' | 'Vegan' | 'Non-Vegetarian' | 'Eggetarian' | 'Jain' | 'Pescatarian' | 'Flexible Foodie'>('Vegetarian');
  const [education, setEducation] = useState(user?.education || 'Postgraduate (IIT Delhi & IIM Ahmedabad)');
  const [profession, setProfession] = useState(user?.profession || 'Principal Product Architect');

  // STEP 3: CHOOSE YOUR MEMBERSHIP & QR CODE PAYMENT FLOW
  const [selectedPlan, setSelectedPlan] = useState<MembershipTier>('Premium');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // QR Payment specific states
  const [qrImageSrc, setQrImageSrc] = useState<string>('/payment-qr.png');
  const [hasPaidClicked, setHasPaidClicked] = useState<boolean>(false);
  const [paymentNoticeMessage, setPaymentNoticeMessage] = useState<string | null>(null);

  // Handle Birth Date change with strict 18+ validation
  const handleBirthDateChange = (val: string) => {
    setBirthDate(val);
    if (!val) return;
    const birth = new Date(val);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    setCalculatedAge(age);
    if (age < 18) {
      setAgeError('Apni Jodi is strictly an 18+ adult platform. You must be at least 18 years old to join.');
    } else {
      setAgeError(null);
    }
  };

  // Photo upload simulation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfilePhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const samplePhotos = [
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80', label: 'Classic Portrait' },
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80', label: 'Elegance & Studio' },
    { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80', label: 'Casual Outdoor' },
    { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80', label: 'Professional' }
  ];

  const popularInterests = [
    'Travel & Roadtrips',
    'Architecture',
    'Coffee & Cafes',
    'Hiking & Outdoors',
    'Indie Cinema',
    'Reading & Books',
    'Cooking & Baking',
    'Fitness & Running',
    'Yoga & Mindfulness',
    'Photography',
    'Art & Design',
    'Tech & Startups',
    'Wine & Dining',
    'Live Music & Gigs'
  ];

  const popularActivities = [
    'Weekend brunch',
    'Gallery & museum visits',
    'Sunset walks',
    'Book club chats',
    'Cooking dinners together',
    'Road trips',
    'Board game nights',
    'Attending plays & concerts'
  ];

  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter(i => i !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };

  const addCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInterestInput.trim() && !selectedInterests.includes(customInterestInput.trim())) {
      setSelectedInterests([...selectedInterests, customInterestInput.trim()]);
      setCustomInterestInput('');
    }
  };

  const toggleActivity = (act: string) => {
    if (favoriteActivities.includes(act)) {
      setFavoriteActivities(favoriteActivities.filter(a => a !== act));
    } else {
      setFavoriteActivities([...favoriteActivities, act]);
    }
  };

  const addCustomActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (customActivityInput.trim() && !favoriteActivities.includes(customActivityInput.trim())) {
      setFavoriteActivities([...favoriteActivities, customActivityInput.trim()]);
      setCustomActivityInput('');
    }
  };

  // Membership plans data (3 Paid Plans - Basic, Premium, VIP)
  const membershipPlansConfig = [
    {
      id: 'Basic' as MembershipTier,
      name: 'BASIC',
      pricePerMonth: 189,
      badge: null,
      description: 'Essential matchmaking and discovery tools for authentic dating.',
      features: [
        'Profile discovery',
        'Send interests',
        'Match notifications',
        'Messaging after matching',
        'Basic filters',
        'Enhanced profile visibility'
      ]
    },
    {
      id: 'Premium' as MembershipTier,
      name: 'PREMIUM',
      pricePerMonth: 289,
      badge: 'Most Popular',
      description: 'Unlimited interests, read receipts, and boost for serious dating.',
      features: [
        'Everything in Basic',
        'Unlimited interests',
        'Unlimited messaging after matching',
        'Advanced filters',
        'See who liked you',
        'Profile boost',
        'Read receipts',
        'Premium support'
      ]
    },
    {
      id: 'VIP' as MembershipTier,
      name: 'VIP',
      pricePerMonth: 499,
      badge: 'VIP Privilege',
      description: 'Priority placement, VIP discovery, and deepest compatibility insights.',
      features: [
        'Everything in Premium',
        'Priority profile placement',
        'VIP discovery',
        'Advanced compatibility insights',
        'Premium verification features',
        'Higher profile visibility',
        'Priority support',
        'VIP badge'
      ]
    }
  ];

  // Pricing Calculation based on billing period and coupon
  const getMonths = () => (billingPeriod === 'yearly' ? 12 : billingPeriod === 'quarterly' ? 3 : 1);

  const calculatePricing = (): PaymentCalculation => {
    const months = getMonths();
    const plan = membershipPlansConfig.find(p => p.id === selectedPlan) || membershipPlansConfig[1];
    const rawBase = plan.pricePerMonth * months;
    
    // Period discount: quarterly gets 10% base off, yearly gets 20% base off
    let periodDiscount = 0;
    if (billingPeriod === 'quarterly') {
      periodDiscount = Math.round(rawBase * 0.10);
    } else if (billingPeriod === 'yearly') {
      periodDiscount = Math.round(rawBase * 0.20);
    }

    const baseAmount = rawBase - periodDiscount;

    let couponDiscount = 0;
    let couponRecord = undefined;

    if (appliedCoupon) {
      if (appliedCoupon.toUpperCase() === 'JODI20') {
        couponDiscount = Math.round(baseAmount * 0.20);
        couponRecord = { code: 'JODI20', discountType: 'percentage' as const, value: 20, description: '20% Welcome Concession', active: true };
      } else if (appliedCoupon.toUpperCase() === 'MATCH50') {
        couponDiscount = Math.min(baseAmount, 50);
        couponRecord = { code: 'MATCH50', discountType: 'flat' as const, value: 50, description: 'Flat ₹50 Instant Concession', active: true };
      } else if (appliedCoupon.toUpperCase() === 'VIP50' && selectedPlan === 'VIP') {
        couponDiscount = Math.round(baseAmount * 0.50);
        couponRecord = { code: 'VIP50', discountType: 'percentage' as const, value: 50, description: '50% VIP Exclusive Discount', active: true };
      }
    }

    const totalDiscount = periodDiscount + couponDiscount;
    const taxableAmount = Math.max(0, rawBase - totalDiscount);
    const gstAmount = Math.round(taxableAmount * 0.18 * 100) / 100;
    const cgstAmount = Math.round((gstAmount / 2) * 100) / 100;
    const sgstAmount = Math.round((gstAmount / 2) * 100) / 100;
    const finalAmount = Math.round((taxableAmount + gstAmount) * 100) / 100;

    return {
      tier: selectedPlan,
      months,
      baseAmount: rawBase,
      discountAmount: totalDiscount,
      couponApplied: couponRecord,
      taxableAmount,
      gstAmount,
      cgstAmount,
      sgstAmount,
      finalAmount
    };
  };

  const pricing = calculatePricing();

  const handleApplyCoupon = (codeToApply?: string) => {
    const targetCode = (codeToApply || couponCode).trim().toUpperCase();
    if (!targetCode) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (targetCode === 'JODI20' || targetCode === 'MATCH50' || (targetCode === 'VIP50' && selectedPlan === 'VIP')) {
      setAppliedCoupon(targetCode);
      setCouponCode(targetCode);
      setCouponError(null);
    } else if (targetCode === 'VIP50' && selectedPlan !== 'VIP') {
      setCouponError('VIP50 coupon is valid exclusively on VIP membership.');
    } else {
      setCouponError('Invalid coupon code. Try JODI20 or MATCH50.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  // QR Payment Flow Handlers
  const handleIHavePaid = () => {
    setHasPaidClicked(true);
    setPaymentNoticeMessage('Payment submitted for verification.');
    
    // Also record a pending order in the payment service store
    paymentService.createRazorpayOrder(pricing, {
      name: fullName,
      email: user?.email || 'patron@apnijodi.com',
      phone: user?.phone || '+91 99999 88888'
    });
  };

  const handlePaymentNotCompleted = () => {
    setHasPaidClicked(false);
    setPaymentNoticeMessage('Payment not completed. Please scan the QR code using your preferred QR payment app, then click "I Have Paid".');
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!fullName.trim()) {
        alert('Please provide your full name.');
        return;
      }
      if (calculatedAge < 18) {
        setAgeError('You must be at least 18 years old to join Apni Jodi.');
        return;
      }
    }

    if (currentStep === 3) {
      if (!hasPaidClicked) {
        alert('Please scan the QR code and click "I Have Paid" to submit your payment for verification before continuing.');
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = async () => {
    const profilePayload = {
      fullName,
      age: calculatedAge,
      birthDate,
      gender,
      city,
      photoUrl: profilePhoto,
      bio,
      interests: selectedInterests,
      favoriteActivities,
      lifestyle,
      foodPreference,
      education,
      profession,
      datingIntention,
      interestedIn,
      membershipTier: selectedPlan,
      paymentStatus: 'Pending'
    };

    if (updateProfile) {
      await updateProfile({
        fullName,
        age: calculatedAge,
        city,
        photoUrl: profilePhoto,
        bio,
        interests: selectedInterests,
        education,
        profession,
        diet: foodPreference,
        membershipTier: selectedPlan
      });
    }

    if (upgradeMembership) {
      await upgradeMembership(selectedPlan);
    }

    if (onProfileCreated) {
      onProfileCreated(profilePayload);
    }

    setIsSuccess(true);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Header & Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('discover')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#4E051A] hover:text-[#9B1D36] transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Discover
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DFCEBD] shadow-xs text-[11px] font-bold text-[#735C00]">
            <span className="material-symbols-outlined text-xs text-[#735C00]">shield</span>
            <span>18+ Adult Matchmaking & Dating</span>
          </div>
        </div>

        {/* Success Confirmation Screen (After Step 4 Final Submission) */}
        {isSuccess ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#DFCEBD] shadow-xl text-center max-w-xl mx-auto animate-fade-in space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-50 border border-amber-300 text-[#4E051A] text-xs rounded-full font-serif font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-xs text-amber-600">hourglass_top</span>
                <span>{selectedPlan} Plan • Verification In Progress</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#1E1919]">
                Welcome to Apni Jodi, {fullName.split(' ')[0]}!
              </h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Your profile has been created. Your <strong>{selectedPlan} Membership</strong> payment of <strong>₹{pricing.finalAmount.toFixed(2)}</strong> has been submitted for verification. We are curating like-minded adults who match your dating intention in <strong>{city}</strong>.
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DFCEBD] text-left text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Status:</span>
                <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Pending Verification
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Selected Plan:</span>
                <span className="font-bold text-[#4E051A]">{selectedPlan} ({billingPeriod.toUpperCase()})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Age & Verification:</span>
                <span className="font-bold text-[#1E1919]">{calculatedAge} years (18+ Verified)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Dating Intention:</span>
                <span className="font-bold text-[#4E051A]">{datingIntention}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => onNavigate('discover')}
                className="px-8 py-3 bg-[#4E051A] hover:bg-[#680C25] text-white rounded-full font-semibold text-xs uppercase tracking-wider shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>View Compatible Matches</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setCurrentStep(4);
                }}
                className="px-6 py-3 bg-white border border-[#DFCEBD] text-stone-700 hover:bg-[#FAF7F2] rounded-full font-semibold text-xs transition cursor-pointer"
              >
                Review Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#DFCEBD] shadow-sm overflow-hidden">
            
            {/* Stepper Progress Bar */}
            <div className="border-b border-[#DFCEBD]/60 bg-[#FAF7F2] p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#4E051A]">
                  Step {currentStep} of 4 — {
                    currentStep === 1 ? 'About You' :
                    currentStep === 2 ? 'Your Interests' :
                    currentStep === 3 ? 'Choose Your Membership' :
                    'Profile Preview & Creation'
                  }
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {Math.round((currentStep / 4) * 100)}% Complete
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-[#DFCEBD]/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#4E051A] h-full rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>

              {/* Steps Labels */}
              <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`text-[11px] font-semibold transition cursor-pointer ${
                    currentStep >= 1 ? 'text-[#4E051A]' : 'text-stone-400'
                  }`}
                >
                  1. About You
                </button>
                <button
                  type="button"
                  onClick={() => currentStep > 2 && setCurrentStep(2)}
                  className={`text-[11px] font-semibold transition cursor-pointer ${
                    currentStep >= 2 ? 'text-[#4E051A]' : 'text-stone-400'
                  }`}
                >
                  2. Interests
                </button>
                <button
                  type="button"
                  onClick={() => currentStep > 3 && setCurrentStep(3)}
                  className={`text-[11px] font-semibold transition cursor-pointer ${
                    currentStep >= 3 ? 'text-[#4E051A]' : 'text-stone-400'
                  }`}
                >
                  3. Membership
                </button>
                <button
                  type="button"
                  onClick={() => hasPaidClicked && setCurrentStep(4)}
                  className={`text-[11px] font-semibold transition cursor-pointer ${
                    currentStep >= 4 ? 'text-[#4E051A]' : 'text-stone-400'
                  }`}
                >
                  4. Preview
                </button>
              </div>
            </div>

            {/* Stepper Content */}
            <div className="p-6 sm:p-10">

              {/* ========================================================= */}
              {/* STEP 1 OF 4 — ABOUT YOU */}
              {/* ========================================================= */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="space-y-1">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1919]">
                      Tell Us About Yourself
                    </h2>
                    <p className="text-sm text-stone-600">
                      Help us create a profile that represents you.
                    </p>
                  </div>

                  {/* Profile Photo Upload / Selector */}
                  <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#DFCEBD] space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#4E051A] shadow-md shrink-0 bg-stone-200">
                        <img
                          src={profilePhoto}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition" />
                      </div>

                      <div className="space-y-2 text-center sm:text-left flex-1">
                        <span className="text-xs uppercase font-bold text-stone-700 tracking-wider block">
                          Profile Photo
                        </span>
                        <p className="text-xs text-stone-500">
                          Upload a clear, welcoming photo of yourself. Authentic photos receive 4x more mutual sparks.
                        </p>
                        
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          <label className="px-4 py-2 bg-[#4E051A] hover:bg-[#680C25] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition inline-flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">cloud_upload</span>
                            <span>Upload Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Quick Sample Avatars */}
                    <div className="pt-3 border-t border-[#DFCEBD]/60">
                      <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                        Or pick a starter portrait:
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {samplePhotos.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setProfilePhoto(s.url)}
                            className={`relative rounded-xl overflow-hidden aspect-square border-2 transition cursor-pointer ${
                              profilePhoto === s.url ? 'border-[#4E051A] ring-2 ring-[#4E051A]/30' : 'border-transparent opacity-75 hover:opacity-100'
                            }`}
                          >
                            <img src={s.url} alt={s.label} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Full Name & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Aadhavan Sharma"
                        className="w-full px-4 py-3 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919] focus:outline-none focus:ring-2 focus:ring-[#4E051A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. New Delhi, Mumbai, Bengaluru"
                        className="w-full px-4 py-3 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919] focus:outline-none focus:ring-2 focus:ring-[#4E051A]"
                      />
                    </div>
                  </div>

                  {/* Date of Birth & Age (18+ Verification) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider mb-1.5">
                        Date of Birth (18+ only) *
                      </label>
                      <input
                        type="date"
                        max="2008-01-01"
                        value={birthDate}
                        onChange={(e) => handleBirthDateChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919] focus:outline-none focus:ring-2 focus:ring-[#4E051A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider mb-1.5">
                        Calculated Age
                      </label>
                      <div className="w-full px-4 py-3 rounded-xl border border-[#DFCEBD] text-sm bg-[#FAF7F2] text-[#1E1919] font-mono flex items-center justify-between">
                        <span>{calculatedAge} years old</span>
                        {calculatedAge >= 18 ? (
                          <span className="text-xs font-sans text-emerald-700 font-bold inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            18+ Verified
                          </span>
                        ) : (
                          <span className="text-xs font-sans text-red-600 font-bold">Under 18</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {ageError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm shrink-0">error</span>
                      <span>{ageError}</span>
                    </div>
                  )}

                  {/* Gender Options */}
                  <div>
                    <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider mb-2">
                      Gender *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {(['Woman', 'Man', 'Non-binary', 'Prefer not to say'] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`py-3 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                            gender === g
                              ? 'border-[#4E051A] bg-[#4E051A] text-white shadow-xs'
                              : 'border-[#DFCEBD] bg-white text-stone-700 hover:border-stone-400'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interested In */}
                  <div>
                    <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider mb-2">
                      Interested In *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['Women', 'Men', 'Everyone'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setInterestedIn(opt)}
                          className={`py-3 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                            interestedIn === opt
                              ? 'border-[#735C00] bg-[#735C00] text-white shadow-xs'
                              : 'border-[#DFCEBD] bg-white text-stone-700 hover:border-stone-400'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dating Intention */}
                  <div>
                    <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider mb-2">
                      Dating Intention *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {([
                        { id: 'Serious Relationship', desc: 'Looking for a committed partner with shared life values' },
                        { id: 'Long-term Dating', desc: 'Dating with depth, exploring genuine long-term chemistry' },
                        { id: 'Meaningful Connection', desc: 'Intentionally getting to know high-alignment people' },
                        { id: 'Marriage', desc: 'Ready for lifelong commitment and shared life partnership' }
                      ] as const).map((intent) => (
                        <button
                          key={intent.id}
                          type="button"
                          onClick={() => setDatingIntention(intent.id)}
                          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                            datingIntention === intent.id
                              ? 'border-[#4E051A] bg-[#4E051A]/5 ring-1 ring-[#4E051A]'
                              : 'border-[#DFCEBD] bg-white hover:border-stone-400'
                          }`}
                        >
                          <div className="flex items-center justify-between font-serif font-bold text-sm text-[#1E1919]">
                            <span>{intent.id}</span>
                            {datingIntention === intent.id && (
                              <span className="material-symbols-outlined text-sm text-[#4E051A]">check_circle</span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-1 leading-snug">{intent.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 2 OF 4 — YOUR INTERESTS */}
              {/* ========================================================= */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="space-y-1">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1919]">
                      Your Interests & Lifestyle
                    </h2>
                    <p className="text-sm text-stone-600">
                      Share what you love doing and how you spend your days.
                    </p>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider mb-1.5">
                      Bio / About Me
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Share a short glimpse into your life, passions, and what brings you joy..."
                      className="w-full px-4 py-3 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919] focus:outline-none focus:ring-2 focus:ring-[#4E051A]"
                    />
                  </div>

                  {/* Hobbies & Interests Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs uppercase font-bold text-stone-700 tracking-wider">
                        Hobbies & Interests ({selectedInterests.length} selected)
                      </label>
                      <span className="text-[11px] text-stone-500">Pick 3 or more</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {popularInterests.map((interest) => {
                        const isSelected = selectedInterests.includes(interest);
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#4E051A] text-white border border-[#4E051A] shadow-xs'
                                : 'bg-white border border-[#DFCEBD] text-stone-700 hover:border-[#4E051A]'
                            }`}
                          >
                            {isSelected && <span className="mr-1">✓</span>}
                            {interest}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Interest Input */}
                    <form onSubmit={addCustomInterest} className="flex gap-2">
                      <input
                        type="text"
                        value={customInterestInput}
                        onChange={(e) => setCustomInterestInput(e.target.value)}
                        placeholder="Add a unique hobby (e.g. Scuba diving, Pottery)..."
                        className="flex-1 px-3 py-1.5 rounded-xl border border-[#DFCEBD] text-xs bg-white text-[#1E1919]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#DFCEBD] text-xs font-bold text-[#4E051A] hover:bg-[#F3ECE4] cursor-pointer"
                      >
                        + Add
                      </button>
                    </form>
                  </div>

                  {/* Favorite Activities */}
                  <div>
                    <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider mb-2">
                      Favorite Activities
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {popularActivities.map((act) => {
                        const isSelected = favoriteActivities.includes(act);
                        return (
                          <button
                            key={act}
                            type="button"
                            onClick={() => toggleActivity(act)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#735C00] text-white border border-[#735C00]'
                                : 'bg-white border border-[#DFCEBD] text-stone-700 hover:border-stone-400'
                            }`}
                          >
                            {isSelected && <span className="mr-1">✓</span>}
                            {act}
                          </button>
                        );
                      })}
                    </div>

                    <form onSubmit={addCustomActivity} className="flex gap-2">
                      <input
                        type="text"
                        value={customActivityInput}
                        onChange={(e) => setCustomActivityInput(e.target.value)}
                        placeholder="Add an activity you love..."
                        className="flex-1 px-3 py-1.5 rounded-xl border border-[#DFCEBD] text-xs bg-white text-[#1E1919]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#DFCEBD] text-xs font-bold text-[#4E051A] hover:bg-[#F3ECE4] cursor-pointer"
                      >
                        + Add
                      </button>
                    </form>
                  </div>

                  {/* Lifestyle & Food Preference */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider mb-1.5">
                        Lifestyle Rhythm
                      </label>
                      <select
                        value={lifestyle}
                        onChange={(e) => setLifestyle(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFCEBD] text-xs bg-white text-[#1E1919]"
                      >
                        <option value="Active & Fitness">Active & Fitness</option>
                        <option value="Balanced & Mindful">Balanced & Mindful</option>
                        <option value="Social Butterfly">Social Butterfly</option>
                        <option value="Quiet & Homebody">Quiet & Homebody</option>
                        <option value="Creative Explorer">Creative Explorer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider mb-1.5">
                        Food Preference
                      </label>
                      <select
                        value={foodPreference}
                        onChange={(e) => setFoodPreference(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFCEBD] text-xs bg-white text-[#1E1919]"
                      >
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Eggetarian">Eggetarian</option>
                        <option value="Jain">Jain</option>
                        <option value="Pescatarian">Pescatarian</option>
                        <option value="Flexible Foodie">Flexible Foodie</option>
                      </select>
                    </div>
                  </div>

                  {/* Education & Profession */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider mb-1.5">
                        Education
                      </label>
                      <input
                        type="text"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="e.g. Master's in Design, MBA, B.Tech"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DFCEBD] text-xs bg-white text-[#1E1919]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider mb-1.5">
                        Profession
                      </label>
                      <input
                        type="text"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        placeholder="e.g. Product Architect, Architect, Doctor"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DFCEBD] text-xs bg-white text-[#1E1919]"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 3 OF 4 — CHOOSE YOUR MEMBERSHIP & QR CODE PAYMENT */}
              {/* ========================================================= */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Step Header */}
                  <div className="space-y-1 text-center max-w-xl mx-auto">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1919]">
                      Choose Your Apni Jodi Plan
                    </h2>
                    <p className="text-sm text-stone-600">
                      Select a membership to unlock your Apni Jodi experience.
                    </p>
                  </div>

                  {/* Billing Options Toggle */}
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Choose Billing Option
                    </span>
                    <div className="inline-flex p-1.5 bg-[#FAF7F2] border border-[#DFCEBD] rounded-full shadow-inner">
                      <button
                        type="button"
                        onClick={() => setBillingPeriod('monthly')}
                        className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                          billingPeriod === 'monthly'
                            ? 'bg-[#4E051A] text-white shadow-xs'
                            : 'text-stone-600 hover:text-black'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingPeriod('quarterly')}
                        className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          billingPeriod === 'quarterly'
                            ? 'bg-[#4E051A] text-white shadow-xs'
                            : 'text-stone-600 hover:text-black'
                        }`}
                      >
                        <span>Quarterly</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-900 font-extrabold">Save 10%</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingPeriod('yearly')}
                        className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          billingPeriod === 'yearly'
                            ? 'bg-[#4E051A] text-white shadow-xs'
                            : 'text-stone-600 hover:text-black'
                        }`}
                      >
                        <span>Yearly</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-extrabold">Save 20%</span>
                      </button>
                    </div>
                  </div>

                  {/* Exactly 3 Paid Plans: Basic, Premium, VIP (No Free Plan) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {membershipPlansConfig.map((plan) => {
                      const isSelected = selectedPlan === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`relative rounded-3xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'border-[#4E051A] bg-white ring-2 ring-[#4E051A]/20 shadow-xl'
                              : 'border-[#DFCEBD] bg-white/70 hover:border-stone-400 hover:shadow-md'
                          }`}
                        >
                          {/* Top Badge */}
                          {plan.badge && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#4E051A] text-amber-200 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                              {plan.badge}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-serif text-xl font-bold text-[#1E1919] tracking-wide">
                                {plan.name}
                              </h3>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? 'border-[#4E051A] bg-[#4E051A]' : 'border-[#DFCEBD]'
                              }`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                            </div>

                            <div className="mb-4">
                              <div className="flex items-baseline gap-1">
                                <span className="font-serif text-3xl font-extrabold text-[#4E051A]">
                                  ₹{plan.pricePerMonth}
                                </span>
                                <span className="text-xs text-stone-500 font-medium">/month</span>
                              </div>
                              <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                                {plan.description}
                              </p>
                            </div>

                            {/* Features List */}
                            <div className="border-t border-[#DFCEBD]/60 pt-4 space-y-2 mb-6">
                              {plan.features.map((feature, fIdx) => (
                                <div key={fIdx} className="flex items-start gap-2 text-xs text-stone-700">
                                  <span className="material-symbols-outlined text-sm text-emerald-700 shrink-0 mt-0.5">
                                    check_circle
                                  </span>
                                  <span className="leading-snug">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPlan(plan.id);
                            }}
                            className={`w-full py-2.5 rounded-full font-serif font-bold text-xs uppercase tracking-wider transition ${
                              isSelected
                                ? 'bg-[#4E051A] text-white shadow-sm'
                                : 'bg-[#FAF7F2] border border-[#DFCEBD] text-stone-700 hover:bg-[#F3ECE4]'
                            }`}
                          >
                            {isSelected ? 'Selected Plan' : 'Select Plan'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Checkout Summary & Coupon */}
                  <div className="rounded-3xl border border-[#DFCEBD] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                    
                    <div className="flex items-center justify-between border-b border-[#DFCEBD]/60 pb-4">
                      <div>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E1919]">
                          Checkout Summary
                        </h3>
                        <p className="text-xs text-stone-500">
                          Selected Plan: <strong className="text-[#4E051A]">{selectedPlan}</strong> ({billingPeriod.toUpperCase()})
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-stone-400 uppercase font-bold block">Payable Total</span>
                        <span className="font-serif text-2xl font-bold text-[#4E051A]">
                          ₹{pricing.finalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Coupon Code Input */}
                    <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DFCEBD] space-y-3">
                      <label className="block text-xs uppercase font-bold text-stone-700 tracking-wider">
                        Apply Promo / Coupon Code
                      </label>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponError(null);
                          }}
                          placeholder="Enter coupon code (e.g. JODI20)"
                          className="flex-1 px-3 py-2 rounded-xl border border-[#DFCEBD] text-xs bg-white uppercase font-mono tracking-wider text-[#1E1919]"
                        />
                        {appliedCoupon ? (
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleApplyCoupon()}
                            className="px-5 py-2 bg-[#4E051A] text-white hover:bg-[#680C25] rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            Apply
                          </button>
                        )}
                      </div>

                      {couponError && (
                        <p className="text-xs text-red-600">{couponError}</p>
                      )}

                      {appliedCoupon && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          <span>Coupon <strong>{appliedCoupon}</strong> applied successfully!</span>
                        </div>
                      )}

                      {/* Quick clickable coupon suggestions */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-stone-500">
                        <span>Available coupons:</span>
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon('JODI20')}
                          className="px-2.5 py-0.5 rounded-full bg-white border border-[#DFCEBD] text-xs font-mono font-bold text-[#4E051A] hover:border-[#4E051A] cursor-pointer"
                        >
                          JODI20 (20% OFF)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon('MATCH50')}
                          className="px-2.5 py-0.5 rounded-full bg-white border border-[#DFCEBD] text-xs font-mono font-bold text-[#4E051A] hover:border-[#4E051A] cursor-pointer"
                        >
                          MATCH50 (₹50 OFF)
                        </button>
                        {selectedPlan === 'VIP' && (
                          <button
                            type="button"
                            onClick={() => handleApplyCoupon('VIP50')}
                            className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-xs font-mono font-bold text-amber-900 hover:border-amber-500 cursor-pointer"
                          >
                            VIP50 (50% OFF VIP)
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Price Breakdown Calculation */}
                    <div className="space-y-2 text-xs text-stone-600 border-b border-[#DFCEBD]/60 pb-4">
                      <div className="flex justify-between">
                        <span>Base Membership Fee ({pricing.months} Month{pricing.months > 1 ? 's' : ''}):</span>
                        <span className="font-mono text-stone-900 font-medium">₹{pricing.baseAmount.toFixed(2)}</span>
                      </div>

                      {pricing.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Discount Applied (Period + Coupon):</span>
                          <span className="font-mono">-₹{pricing.discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Taxable Subtotal:</span>
                        <span className="font-mono text-stone-900">₹{pricing.taxableAmount.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-[11px] text-stone-500">
                        <span>Applicable Taxes (18% GST: 9% CGST + 9% SGST):</span>
                        <span className="font-mono">₹{pricing.gstAmount.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-sm font-bold text-[#1E1919] pt-2 border-t border-dashed border-[#DFCEBD]">
                        <span>Final Payable Amount:</span>
                        <span className="font-serif text-lg text-[#4E051A]">₹{pricing.finalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* ===================================================== */}
                    {/* DEDICATED QR CODE PAYMENT SECTION (ONLY PAYMENT METHOD) */}
                    {/* ===================================================== */}
                    <div className="mt-8 pt-6 border-t border-[#DFCEBD] space-y-6">
                      
                      {/* Section Heading & Subheading */}
                      <div className="text-center space-y-1.5 max-w-md mx-auto">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#735C00] text-[11px] font-bold uppercase tracking-wider mb-1">
                          <span className="material-symbols-outlined text-xs">qr_code_scanner</span>
                          <span>Official Payment Rail</span>
                        </div>
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4E051A]">
                          Complete Your Payment
                        </h3>
                        <p className="text-xs sm:text-sm text-stone-600">
                          Scan the QR code using your preferred QR payment app.
                        </p>
                      </div>

                      {/* Payment Status Box */}
                      <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-xs font-semibold text-[#735C00] shadow-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>Payment Status:</span>
                          <strong className="text-[#4E051A] uppercase tracking-wide">Pending</strong>
                        </div>
                      </div>

                      {/* Prominent Centered QR Code Container */}
                      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border-2 border-[#DFCEBD] max-w-sm mx-auto shadow-sm text-center space-y-4">
                        
                        {/* Final Amount Tag */}
                        <div className="inline-block px-3 py-1 rounded-full bg-white border border-[#DFCEBD] text-xs font-bold text-[#4E051A]">
                          Amount to Pay: ₹{pricing.finalAmount.toFixed(2)}
                        </div>

                        {/* Large, High-Contrast QR Image */}
                        <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 p-4 bg-white rounded-2xl border-2 border-[#4E051A]/20 shadow-md flex items-center justify-center overflow-hidden">
                          <img
                            src={qrImageSrc}
                            alt="Apni Jodi Payment QR Code"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // If image fails to load, gracefully fallback to svg
                              (e.currentTarget as HTMLImageElement).src = '/payment-qr.svg';
                            }}
                          />
                        </div>

                        {/* Instructions Below QR Image */}
                        <div className="space-y-1 pt-1">
                          <h4 className="font-serif text-base sm:text-lg font-bold text-[#1E1919]">
                            Scan QR to Pay
                          </h4>
                          <p className="text-xs text-stone-500">
                            After completing the payment, click I Have Paid.
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2.5 pt-2">
                          <button
                            type="button"
                            onClick={handleIHavePaid}
                            className={`w-full py-3.5 rounded-full font-serif font-bold text-xs sm:text-sm uppercase tracking-wider transition shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                              hasPaidClicked
                                ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                                : 'bg-[#4E051A] hover:bg-[#680C25] text-white'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base">
                              {hasPaidClicked ? 'done_all' : 'check_circle'}
                            </span>
                            <span>I Have Paid</span>
                          </button>

                          <button
                            type="button"
                            onClick={handlePaymentNotCompleted}
                            className="w-full py-2.5 rounded-full bg-white border border-[#DFCEBD] hover:bg-stone-50 text-stone-600 hover:text-stone-900 text-xs font-semibold transition cursor-pointer"
                          >
                            Payment Not Completed
                          </button>
                        </div>

                      </div>

                      {/* Status Feedback Notice After User Clicks Button */}
                      {paymentNoticeMessage && (
                        <div className={`p-4 rounded-2xl border max-w-md mx-auto text-center space-y-2 animate-fade-in ${
                          hasPaidClicked
                            ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                            : 'bg-stone-100 border-stone-300 text-stone-800'
                        }`}>
                          <div className="flex items-center justify-center gap-2 text-xs font-bold">
                            <span className="material-symbols-outlined text-base text-[#735C00]">
                              {hasPaidClicked ? 'hourglass_top' : 'info'}
                            </span>
                            <span>{paymentNoticeMessage}</span>
                          </div>
                          {hasPaidClicked && (
                            <p className="text-xs text-stone-600 leading-relaxed">
                              Do not automatically mark the payment as successful. Your payment status will remain <strong>Pending</strong> until verification is completed by our admin desk. You may now continue to preview your profile.
                            </p>
                          )}
                        </div>
                      )}

                      {/* Continue to Preview button once submitted */}
                      {hasPaidClicked && (
                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentStep(4);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-8 py-3.5 bg-[#4E051A] hover:bg-[#680C25] text-white rounded-full font-serif font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer inline-flex items-center gap-2"
                          >
                            <span>Continue to Step 4 — Profile Preview & Creation</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </button>
                        </div>
                      )}

                      {/* Security & Support Note */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[11px] text-stone-500 pt-3">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#735C00]">lock</span>
                          <span>NPCI UPI 256-Bit Encrypted QR Rail</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-emerald-700">verified</span>
                          <span>Verified Matrimonial Desk</span>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 4 OF 4 — PROFILE PREVIEW & CREATION */}
              {/* ========================================================= */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="space-y-1">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1919]">
                      Profile Preview & Creation
                    </h2>
                    <p className="text-sm text-stone-600">
                      Review your completed profile before publishing to the Apni Jodi community.
                    </p>
                  </div>

                  {/* Modern Preview Card */}
                  <div className="rounded-3xl border border-[#DFCEBD] bg-white shadow-lg overflow-hidden max-w-2xl mx-auto">
                    
                    {/* Photo Header */}
                    <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-stone-900">
                      <img
                        src={profilePhoto}
                        alt={fullName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#4E051A] text-xs font-bold shadow-sm">
                        <span className="material-symbols-outlined text-xs text-emerald-600">verified</span>
                        <span>18+ Verified Member</span>
                      </div>

                      {/* Active Membership Badge with Pending Verification Note */}
                      <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#4E051A] text-amber-200 text-xs font-bold shadow-sm">
                        <span className="material-symbols-outlined text-xs text-amber-300">workspace_premium</span>
                        <span>{selectedPlan} Plan (Pending Verification)</span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                        <div className="flex items-baseline gap-2">
                          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                            {fullName}
                          </h3>
                          <span className="text-lg text-amber-200 font-medium font-mono">
                            {calculatedAge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-200 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          <span>{city}</span>
                          <span>•</span>
                          <span>{profession}</span>
                          <span>•</span>
                          <span>{gender} seeking {interestedIn}</span>
                        </p>
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-6 space-y-5">
                      
                      {/* Payment Verification Status Notice */}
                      <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-950 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-[#735C00]">hourglass_top</span>
                            Payment Status: Pending
                          </span>
                          <span className="font-bold text-[#4E051A] font-mono">₹{pricing.finalAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-amber-900 leading-relaxed">
                          Your QR code payment of ₹{pricing.finalAmount.toFixed(2)} has been submitted for verification. Your membership tier will remain Pending until administrative verification is complete.
                        </p>
                      </div>

                      {/* Dating Intention Pill */}
                      <div className="flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4E051A]/10 border border-[#4E051A]/20 text-[#4E051A] text-xs font-bold">
                          <span className="material-symbols-outlined text-xs">favorite</span>
                          <span>Intention: {datingIntention}</span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                          <span>Seeking: {interestedIn}</span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#DFCEBD] text-stone-700 text-xs font-medium">
                          <span>{lifestyle}</span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#DFCEBD] text-stone-700 text-xs font-medium">
                          <span>{foodPreference}</span>
                        </div>
                      </div>

                      {/* Bio */}
                      {bio && (
                        <div className="space-y-1">
                          <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">About Me</span>
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#DFCEBD]/60">
                            "{bio}"
                          </p>
                        </div>
                      )}

                      {/* Interests */}
                      {selectedInterests.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">Interests & Passions</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedInterests.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 rounded-full bg-white border border-[#DFCEBD] text-xs font-medium text-[#4E051A]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education & Profession */}
                      <div className="pt-3 border-t border-[#DFCEBD]/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase font-bold">Education</span>
                          <span className="font-semibold text-stone-800">{education}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase font-bold">Profession</span>
                          <span className="font-semibold text-stone-800">{profession}</span>
                        </div>
                      </div>

                      {/* Privacy & Mutual Consent Notice */}
                      <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-base text-amber-700 shrink-0 mt-0.5">verified_user</span>
                        <div>
                          <strong className="block text-amber-950 font-semibold mb-0.5">Privacy Guaranteed</strong>
                          <span>Your phone number and email address remain 100% private. Contact details can only ever be exchanged after mutual, explicit consent.</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Create My Profile CTA Button */}
                  <div className="pt-4 text-center space-y-3">
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      className="w-full sm:w-auto px-10 py-4 bg-[#4E051A] hover:bg-[#680C25] text-white rounded-full font-serif font-bold text-sm tracking-wider uppercase transition shadow-xl cursor-pointer flex items-center justify-center gap-2 mx-auto"
                    >
                      <span className="material-symbols-outlined text-base">check</span>
                      <span>Create My Profile</span>
                    </button>
                    <p className="text-xs text-stone-500">
                      By tapping "Create My Profile", you confirm you are 18+ and agree to Apni Jodi community guidelines.
                    </p>
                  </div>

                </div>
              )}

            </div>

            {/* Stepper Footer Navigation */}
            <div className="border-t border-[#DFCEBD]/60 bg-[#FAF7F2] p-5 sm:p-6 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-full border border-[#DFCEBD] text-xs font-semibold text-stone-700 hover:bg-white transition cursor-pointer"
                >
                  Previous Step
                </button>
              ) : <div />}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-7 py-2.5 rounded-full bg-[#4E051A] hover:bg-[#680C25] text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              ) : null}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
