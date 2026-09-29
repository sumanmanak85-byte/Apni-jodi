import React, { useState } from 'react';
import { MembershipTier } from '../types';
import { useAuth } from '../context/AuthContext';
import { paymentService, MEMBERSHIP_PLANS, PaymentCalculation } from '../services/paymentService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier: MembershipTier;
  onSuccess: (tier: MembershipTier) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedTier,
  onSuccess
}) => {
  const { user } = useAuth();

  const [tier, setTier] = useState<MembershipTier>(selectedTier);
  const [months, setMonths] = useState<number>(1);
  const [couponInput, setCouponInput] = useState('');
  const [couponAppliedCode, setCouponAppliedCode] = useState<string | undefined>('JODI20');
  const [couponMessage, setCouponMessage] = useState<string | null>('20% Welcome Concession Applied (JODI20)');
  const [couponError, setCouponError] = useState<string | null>(null);

  // Modal navigation & QR payment states
  const [paymentStep, setPaymentStep] = useState<'review' | 'qr_payment'>('review');
  const [hasPaidClicked, setHasPaidClicked] = useState<boolean>(false);
  const [paymentNoticeMessage, setPaymentNoticeMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const calculation: PaymentCalculation = paymentService.calculateCheckout(tier, months, couponAppliedCode);
  const currentPlan = MEMBERSHIP_PLANS.find(p => p.id === tier) || MEMBERSHIP_PLANS[0];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;

    const calc = paymentService.calculateCheckout(tier, months, couponInput.trim());
    if (calc.couponApplied) {
      setCouponAppliedCode(calc.couponApplied.code);
      setCouponMessage(`${calc.couponApplied.description} Applied!`);
      setCouponInput('');
    } else {
      setCouponError('Invalid or expired coupon code. Try JODI20 or MATCH50');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponAppliedCode(undefined);
    setCouponMessage(null);
    setCouponError(null);
  };

  const handleProceedToQR = () => {
    setHasPaidClicked(false);
    setPaymentNoticeMessage(null);
    setPaymentStep('qr_payment');
  };

  const handleIHavePaid = () => {
    setHasPaidClicked(true);
    setPaymentNoticeMessage('Payment submitted for verification.');
    // Notify parent without marking full instantaneous settlement
    onSuccess(tier);
  };

  const handlePaymentNotCompleted = () => {
    setHasPaidClicked(false);
    setPaymentNoticeMessage('Payment not completed. Please scan the QR code using your preferred QR payment app, then click "I Have Paid".');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF7F2] rounded-3xl p-6 md:p-8 max-w-xl w-full border border-[#DFCEBD] shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-800 transition cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* STEP 1: REVIEW & PLAN SELECTION */}
        {paymentStep === 'review' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-serif uppercase tracking-widest font-bold mb-2">
                <span className="material-symbols-outlined text-xs">verified</span>
                Apni Jodi Official Membership
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1E1919]">
                Membership Checkout
              </h2>
              <p className="text-xs text-[#736A63]">
                Empower your intentional dating and matchmaking journey with premium privileges.
              </p>
            </div>

            {/* Plan Selector */}
            <div className="grid grid-cols-3 gap-2">
              {MEMBERSHIP_PLANS.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setTier(plan.id)}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    tier === plan.id
                      ? 'border-[#4E051A] bg-white ring-2 ring-[#4E051A]/20 shadow-sm'
                      : 'border-[#DFCEBD] bg-[#FAF7F2] opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="text-[11px] font-bold text-[#9B1D36] uppercase">{plan.id}</div>
                  <div className="font-serif font-bold text-base text-[#1E1919]">₹{plan.pricePerMonth}</div>
                  <div className="text-[10px] text-stone-500">per month</div>
                </button>
              ))}
            </div>

            {/* Cadence Duration Picker */}
            <div className="flex gap-2 p-1.5 bg-[#F3ECE4] rounded-2xl border border-[#DFCEBD]">
              <button
                type="button"
                onClick={() => setMonths(1)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                  months === 1 ? 'bg-white text-[#4E051A] shadow-sm' : 'text-stone-600'
                }`}
              >
                1 Month
              </button>
              <button
                type="button"
                onClick={() => setMonths(3)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                  months === 3 ? 'bg-white text-[#4E051A] shadow-sm' : 'text-stone-600'
                }`}
              >
                3 Months (Save 10%)
              </button>
              <button
                type="button"
                onClick={() => setMonths(12)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                  months === 12 ? 'bg-white text-[#4E051A] shadow-sm' : 'text-stone-600'
                }`}
              >
                12 Months (Save 20%)
              </button>
            </div>

            {/* Coupon Code Section */}
            <div className="p-4 rounded-2xl bg-white border border-[#DFCEBD] space-y-2">
              <label className="block text-xs uppercase font-semibold text-[#5B4F48] tracking-wider">
                Apply Promo / Coupon Code
              </label>

              {couponAppliedCode ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-700 text-sm">local_offer</span>
                    <div>
                      <div className="text-xs font-bold text-emerald-900 font-mono">{couponAppliedCode}</div>
                      <div className="text-[11px] text-emerald-700">{couponMessage}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs text-rose-700 hover:underline font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (e.g. JODI20)"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-[#DFCEBD] text-xs uppercase tracking-wider font-mono bg-[#FAF7F2]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#4E051A] text-white text-xs font-medium cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
            </div>

            {/* Price Itemization Breakdown with GST */}
            <div className="p-4 rounded-2xl bg-white border border-[#DFCEBD] space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>{currentPlan.name} ({months} mo):</span>
                <span className="font-mono">₹{calculation.baseAmount.toFixed(2)}</span>
              </div>

              {calculation.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Concession Discount ({calculation.couponApplied?.code}):</span>
                  <span className="font-mono">-₹{calculation.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Taxable Value:</span>
                <span className="font-mono">₹{calculation.taxableAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-stone-500 text-[11px]">
                <span>GST (18%: 9% CGST + 9% SGST):</span>
                <span className="font-mono">+₹{calculation.gstAmount.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-[#DFCEBD] flex justify-between items-center text-sm font-bold text-[#1E1919]">
                <span>Total Amount Payable:</span>
                <span className="font-serif text-lg text-[#4E051A]">₹{calculation.finalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to QR Payment Screen */}
            <button
              type="button"
              onClick={handleProceedToQR}
              className="w-full py-3.5 bg-[#4E051A] hover:bg-[#680C25] text-white rounded-full font-serif font-bold text-xs sm:text-sm uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
              <span>Proceed to QR Payment (₹{calculation.finalAmount.toFixed(2)})</span>
            </button>

            <p className="text-[11px] text-center text-[#736A63]">
              Apni Jodi supports direct, encrypted QR payment with all certified payment apps.
            </p>

          </div>
        )}

        {/* STEP 2: DEDICATED QR CODE PAYMENT SCREEN */}
        {paymentStep === 'qr_payment' && (
          <div className="space-y-6 text-center animate-fade-in">
            
            {/* Top Back Navigation & Amount */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#DFCEBD]">
              <button
                type="button"
                onClick={() => setPaymentStep('review')}
                className="inline-flex items-center gap-1 font-semibold text-[#4E051A] hover:text-[#9B1D36] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Review</span>
              </button>
              <span className="font-bold text-stone-700">
                Plan: <strong className="text-[#4E051A]">{tier}</strong> (₹{calculation.finalAmount.toFixed(2)})
              </span>
            </div>

            {/* Heading & Subheading */}
            <div className="space-y-1.5">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#4E051A]">
                Complete Your Payment
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                Scan the QR code using your preferred QR payment app.
              </p>
            </div>

            {/* Payment Status Section */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-xs font-semibold text-[#735C00] shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Payment Status:</span>
                <strong className="text-[#4E051A] uppercase tracking-wide">Pending</strong>
              </div>
            </div>

            {/* Prominent Centered QR Code Image */}
            <div className="p-6 bg-white rounded-3xl border-2 border-[#DFCEBD] max-w-sm mx-auto shadow-sm space-y-4">
              
              <div className="inline-block px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#DFCEBD] text-xs font-bold text-[#4E051A]">
                Payable: ₹{calculation.finalAmount.toFixed(2)}
              </div>

              {/* Large, Clear QR Code */}
              <div className="relative mx-auto w-60 h-60 sm:w-64 sm:h-64 p-3 bg-white rounded-2xl border-2 border-[#4E051A]/20 shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src="/payment-qr.png"
                  alt="Apni Jodi Payment QR Code"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/payment-qr.svg';
                  }}
                />
              </div>

              {/* Below the QR code */}
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

            {/* Notification / Verification Notice */}
            {paymentNoticeMessage && (
              <div className={`p-4 rounded-2xl border max-w-sm mx-auto text-center space-y-1.5 animate-fade-in ${
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
                    Do not automatically mark the payment as successful. Your payment status will remain <strong>Pending</strong> until verification is completed by our admin desk.
                  </p>
                )}
              </div>
            )}

            {hasPaidClicked && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#4E051A] hover:bg-[#680C25] text-white rounded-full font-semibold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  Close & Return
                </button>
              </div>
            )}

            <div className="text-[11px] text-stone-500 pt-1">
              Scan using your preferred QR payment app.
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
