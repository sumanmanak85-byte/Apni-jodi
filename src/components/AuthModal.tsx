import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MembershipTier } from '../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    signup,
    verifyPhoneOtp,
    generatedOtp,
    sendPasswordReset,
    switchDemoUser
  } = useAuth();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('aadhavan.sharma@apnijodi.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [birthDate, setBirthDate] = useState('1995-05-15');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [city, setCity] = useState('Mumbai');
  const [tier, setTier] = useState<MembershipTier>('Basic');
  const [ageWarning, setAgeWarning] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  // OTP state
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  if (!isAuthModalOpen) return null;

  // Real-time Age Check
  const handleBirthDateChange = (val: string) => {
    setBirthDate(val);
    if (!val) return;
    const b = new Date(val);
    const now = new Date();
    let calculatedAge = now.getFullYear() - b.getFullYear();
    const m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) {
      calculatedAge--;
    }
    if (calculatedAge < 18) {
      setAgeWarning(`Age: ${calculatedAge} years. Apni Jodi is strictly 18+ only. Registrations under 18 cannot proceed.`);
    } else {
      setAgeWarning(null);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);
    const res = await login(loginIdentifier, loginPassword);
    setIsSubmitting(false);
    if (!res.success) {
      setLoginError(res.error || 'Failed to authenticate patron.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    if (ageWarning) {
      setSignupError('Registration blocked: Candidate is under 18 years of age.');
      return;
    }
    setIsSubmitting(true);
    const res = await signup({
      fullName,
      email: signupEmail,
      phone: signupPhone,
      birthDate,
      gender,
      city,
      membershipTier: tier
    });
    setIsSubmitting(false);
    if (!res.success) {
      setSignupError(res.error || 'Registration failed.');
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setIsSubmitting(true);
    const ok = await verifyPhoneOtp(otpInput);
    setIsSubmitting(false);
    if (ok) {
      setOtpSuccess(true);
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setOtpSuccess(false);
      }, 1500);
    } else {
      setOtpError('Invalid OTP code. Please enter the 6-digit cryptographic verification code.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    await sendPasswordReset(forgotEmail);
    setForgotSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF7F2] rounded-3xl p-6 md:p-8 max-w-lg w-full border border-[#DFCEBD] shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-800 transition cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4E051A]/10 text-[#4E051A] text-[11px] font-serif uppercase tracking-widest font-semibold mb-2">
            <span className="material-symbols-outlined text-xs">lock</span>
            Sanctuary Identity Gateway
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-[#1E1919]">
            Apni Jodi
          </h2>
          <p className="text-xs text-[#736A63] mt-0.5">
            Dignified & Vetted Matrimonial Portal
          </p>
        </div>

        {/* Tab Switcher */}
        {authModalTab !== 'otp' && authModalTab !== 'forgot' && (
          <div className="flex border-b border-[#DFCEBD] mb-6">
            <button
              onClick={() => { setAuthModalTab('login'); setLoginError(null); }}
              className={`flex-1 pb-3 text-sm font-serif font-medium transition cursor-pointer text-center ${
                authModalTab === 'login'
                  ? 'border-b-2 border-[#4E051A] text-[#4E051A] font-bold'
                  : 'text-[#736A63] hover:text-[#1E1919]'
              }`}
            >
              Patron Sign In
            </button>
            <button
              onClick={() => { setAuthModalTab('signup'); setSignupError(null); }}
              className={`flex-1 pb-3 text-sm font-serif font-medium transition cursor-pointer text-center ${
                authModalTab === 'signup'
                  ? 'border-b-2 border-[#4E051A] text-[#4E051A] font-bold'
                  : 'text-[#736A63] hover:text-[#1E1919]'
              }`}
            >
              Enroll & Register (18+)
            </button>
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {authModalTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase font-semibold text-[#5B4F48] tracking-wider mb-1">
                Email Address or Verified Mobile
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. aadhavan@apnijodi.com or 9810123456"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919] focus:outline-none focus:ring-2 focus:ring-[#4E051A]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs uppercase font-semibold text-[#5B4F48] tracking-wider">
                  Sanctuary Password / PIN
                </label>
                <button
                  type="button"
                  onClick={() => setAuthModalTab('forgot')}
                  className="text-xs text-[#9B1D36] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919] focus:outline-none focus:ring-2 focus:ring-[#4E051A]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#4E051A] hover:bg-[#680C25] text-white rounded-full font-medium text-sm transition shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Matchmaking Sanctum'}
            </button>

            {/* Quick Demo Switcher */}
            <div className="pt-4 border-t border-[#DFCEBD] text-center">
              <span className="text-[11px] text-[#736A63] uppercase tracking-wider block mb-2">
                Instant Evaluation Personas
              </span>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    switchDemoUser('aadhavan');
                    setIsAuthModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#DFCEBD] text-xs text-[#4E051A] font-medium hover:bg-stone-50 cursor-pointer"
                >
                  Aadhavan (Vetted Patron)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchDemoUser('admin');
                    setIsAuthModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium hover:bg-amber-100 cursor-pointer"
                >
                  Suman Manak (Admin Desk)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: SIGN UP WITH 18+ CHECK */}
        {authModalTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            {signupError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span>{signupError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase font-semibold text-[#5B4F48] tracking-wider mb-1">
                Legal Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Vikramaditya Rathore"
                className="w-full px-4 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919] focus:outline-none focus:ring-2 focus:ring-[#4E051A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-semibold text-[#5B4F48] tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919] focus:outline-none focus:ring-2 focus:ring-[#4E051A]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#5B4F48] tracking-wider mb-1">
                  Phone (OTP Required)
                </label>
                <input
                  type="tel"
                  required
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919] focus:outline-none focus:ring-2 focus:ring-[#4E051A]"
                />
              </div>
            </div>

            {/* Mandatory 18+ Age Check Field */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs uppercase font-semibold text-amber-900 tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">cake</span>
                  Date of Birth (Mandatory 18+ Verification)
                </label>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 font-bold text-amber-900">
                  Strict 18+
                </span>
              </div>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => handleBirthDateChange(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-sm bg-white text-[#1E1919] focus:outline-none focus:ring-2 focus:ring-[#4E051A]"
              />
              {ageWarning ? (
                <p className="text-xs text-rose-700 font-semibold mt-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">block</span>
                  {ageWarning}
                </p>
              ) : (
                <p className="text-[11px] text-stone-600 mt-1">
                  Verified adult status ensures zero minors and high-intent matrimonial dignity.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-semibold text-[#5B4F48] tracking-wider mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919]"
                >
                  <option value="male">Groom / Male</option>
                  <option value="female">Bride / Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#5B4F48] tracking-wider mb-1">
                  Primary Metro City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai, Delhi, Bengaluru"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919]"
                />
              </div>
            </div>

            {/* Membership Tier Picker (Basic 189, Premium 289, VIP 499 - NO FREE) */}
            <div>
              <label className="block text-xs uppercase font-semibold text-[#5B4F48] tracking-wider mb-1">
                Select Patron Membership Plan
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTier('Basic')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition ${
                    tier === 'Basic'
                      ? 'border-[#4E051A] bg-[#4E051A]/10 text-[#4E051A] font-bold'
                      : 'border-[#DFCEBD] bg-white text-[#1E1919]'
                  }`}
                >
                  <div className="text-xs font-serif font-semibold">Basic</div>
                  <div className="text-sm font-bold mt-0.5">₹189<span className="text-[10px] font-normal text-stone-500">/mo</span></div>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('Premium')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition relative ${
                    tier === 'Premium'
                      ? 'border-[#4E051A] bg-[#4E051A]/10 text-[#4E051A] font-bold'
                      : 'border-[#DFCEBD] bg-white text-[#1E1919]'
                  }`}
                >
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#4E051A] text-white text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                    Popular
                  </span>
                  <div className="text-xs font-serif font-semibold">Premium</div>
                  <div className="text-sm font-bold mt-0.5">₹289<span className="text-[10px] font-normal text-stone-500">/mo</span></div>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('VIP')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition ${
                    tier === 'VIP'
                      ? 'border-[#4E051A] bg-[#4E051A]/10 text-[#4E051A] font-bold'
                      : 'border-[#DFCEBD] bg-white text-[#1E1919]'
                  }`}
                >
                  <div className="text-xs font-serif font-semibold">VIP</div>
                  <div className="text-sm font-bold mt-0.5">₹499<span className="text-[10px] font-normal text-stone-500">/mo</span></div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !!ageWarning}
              className="w-full py-3 bg-[#4E051A] hover:bg-[#680C25] text-white rounded-full font-medium text-sm transition shadow-md cursor-pointer disabled:opacity-40"
            >
              {isSubmitting ? 'Dispatching OTP & Verifying...' : 'Enroll & Proceed to Mobile OTP'}
            </button>
          </form>
        )}

        {/* TAB 3: OTP VERIFICATION */}
        {authModalTab === 'otp' && (
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 bg-amber-100 text-[#4E051A] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">sms</span>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-[#1E1919]">
                Phone OTP Verification
              </h3>
              <p className="text-xs text-[#5B4F48] mt-1 max-w-sm mx-auto">
                We sent a 6-digit cryptographic security code to your mobile device to verify high-intent patron authenticity.
              </p>
              {generatedOtp && (
                <div className="mt-2 inline-block px-3 py-1 bg-amber-50 border border-amber-300 rounded-lg text-xs font-mono font-bold text-amber-900">
                  Demo SMS Token: {generatedOtp}
                </div>
              )}
            </div>

            {otpSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
                ✓ Mobile Authenticated. Sanctuary Seal Activated!
              </div>
            ) : (
              <form onSubmit={handleOtpVerify} className="space-y-4">
                {otpError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    {otpError}
                  </div>
                )}

                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-48 text-center text-xl font-mono tracking-widest px-4 py-2.5 rounded-xl border border-[#DFCEBD] bg-white text-[#1E1919] focus:outline-none focus:ring-2 focus:ring-[#4E051A]"
                  />
                </div>

                <div className="flex gap-3 justify-center">
                  {generatedOtp && (
                    <button
                      type="button"
                      onClick={() => setOtpInput(generatedOtp)}
                      className="px-4 py-2 rounded-full border border-amber-300 bg-amber-50 text-amber-900 text-xs font-medium cursor-pointer"
                    >
                      Autofill Code ({generatedOtp})
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-full bg-[#4E051A] hover:bg-[#680C25] text-white text-xs font-medium cursor-pointer"
                  >
                    Confirm & Complete
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 4: FORGOT PASSWORD */}
        {authModalTab === 'forgot' && (
          <div className="space-y-4">
            <button
              onClick={() => setAuthModalTab('login')}
              className="text-xs text-[#4E051A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Sign In
            </button>

            <h3 className="font-serif text-xl font-bold text-[#1E1919]">
              Reset Sanctuary Password
            </h3>
            <p className="text-xs text-[#5B4F48]">
              Enter your registered patron email to receive a secure biometric recovery link.
            </p>

            {forgotSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                ✓ Confidential password recovery instructions transmitted. Please verify your inbox.
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter registered email address"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DFCEBD] text-sm bg-white text-[#1E1919] focus:outline-none focus:ring-2 focus:ring-[#4E051A]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#4E051A] text-white rounded-full text-xs font-semibold hover:bg-[#680C25] cursor-pointer"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
