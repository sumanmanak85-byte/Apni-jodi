import { InvoiceRecord, CouponRecord, MembershipTier } from '../types';

export interface MembershipPlan {
  id: MembershipTier;
  name: string;
  pricePerMonth: number;
  badge: string;
  tagline: string;
  features: string[];
  recommended?: boolean;
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'Basic',
    name: 'Basic',
    pricePerMonth: 189,
    badge: 'Essential',
    tagline: 'Connect and explore verified profiles with essential matchmaking tools.',
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
    id: 'Premium',
    name: 'Premium',
    pricePerMonth: 289,
    badge: 'Most Popular',
    tagline: 'Our most loved plan for genuine connections with unlimited messaging and boost.',
    features: [
      'Everything in Basic',
      'Unlimited interests',
      'Unlimited messaging after matching',
      'Advanced filters',
      'See who liked you',
      'Profile boost',
      'Read receipts',
      'Premium support'
    ],
    recommended: true
  },
  {
    id: 'VIP',
    name: 'VIP',
    pricePerMonth: 499,
    badge: 'VIP Privilege',
    tagline: 'Exclusive priority discovery, highest profile visibility, and dedicated VIP support.',
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

export const AVAILABLE_COUPONS: CouponRecord[] = [
  {
    code: 'JODI20',
    discountType: 'percentage',
    value: 20,
    description: '20% Welcome Concession',
    active: true
  },
  {
    code: 'MATCH50',
    discountType: 'flat',
    value: 50,
    description: 'Flat ₹50 Instant Concession',
    active: true
  },
  {
    code: 'VIP50',
    discountType: 'percentage',
    value: 50,
    description: '50% VIP Exclusive Discount',
    active: true
  }
];

export interface PaymentCalculation {
  tier: MembershipTier;
  months: number;
  baseAmount: number;
  discountAmount: number;
  couponApplied?: CouponRecord;
  taxableAmount: number;
  gstAmount: number; // 18%
  cgstAmount: number; // 9%
  sgstAmount: number; // 9%
  finalAmount: number;
}

const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: 'INV-2026-9041',
    tier: 'Kalyan Tier (Premium)',
    note: 'Monthly Sacred Matrimonial Membership',
    date: '28 Sep 2026',
    amount: '₹341.02',
    baseAmount: 289,
    discountAmount: 0,
    taxAmount: 52.02,
    status: 'Settled',
    category: 'memberships',
    razorpayOrderId: 'order_rzp_9041kx92',
    razorpayPaymentId: 'pay_rzp_9041kx92_succ',
    hsnCode: '998319',
    gstin: '07AAACA9812K1Z5',
    customerName: 'Aadhavan Sharma',
    customerEmail: 'aadhavan.sharma@apnijodi.com'
  },
  {
    id: 'INV-2026-8219',
    tier: 'Sadhana Tier (Basic)',
    note: 'Initial Registration & Sanctum Entry',
    date: '28 Aug 2026',
    amount: '₹223.02',
    baseAmount: 189,
    discountAmount: 0,
    taxAmount: 34.02,
    status: 'Settled',
    category: 'memberships',
    razorpayOrderId: 'order_rzp_8219qa34',
    razorpayPaymentId: 'pay_rzp_8219qa34_succ',
    hsnCode: '998319',
    gstin: '07AAACA9812K1Z5',
    customerName: 'Aadhavan Sharma',
    customerEmail: 'aadhavan.sharma@apnijodi.com'
  }
];

class PaymentServiceStore {
  private invoices: InvoiceRecord[] = INITIAL_INVOICES;
  private coupons: CouponRecord[] = AVAILABLE_COUPONS;
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem('apni_jodi_invoices', JSON.stringify(this.invoices));
      localStorage.setItem('apni_jodi_coupons', JSON.stringify(this.coupons));
    } catch {}
    this.notify();
  }

  private loadFromStorage() {
    try {
      const storedInvoices = localStorage.getItem('apni_jodi_invoices');
      if (storedInvoices) this.invoices = JSON.parse(storedInvoices);

      const storedCoupons = localStorage.getItem('apni_jodi_coupons');
      if (storedCoupons) this.coupons = JSON.parse(storedCoupons);
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

  public calculateCheckout(tier: MembershipTier, months: number = 1, couponCode?: string): PaymentCalculation {
    const plan = MEMBERSHIP_PLANS.find(p => p.id === tier) || MEMBERSHIP_PLANS[0];
    const baseAmount = plan.pricePerMonth * months;
    
    let discountAmount = 0;
    let couponApplied: CouponRecord | undefined;

    if (couponCode) {
      const found = this.coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);
      if (found) {
        couponApplied = found;
        if (found.discountType === 'percentage') {
          discountAmount = Math.round((baseAmount * found.value) / 100);
        } else {
          discountAmount = Math.min(baseAmount, found.value);
        }
      }
    }

    const taxableAmount = Math.max(0, baseAmount - discountAmount);
    const gstAmount = Math.round(taxableAmount * 0.18 * 100) / 100;
    const cgstAmount = Math.round((gstAmount / 2) * 100) / 100;
    const sgstAmount = Math.round((gstAmount / 2) * 100) / 100;
    const finalAmount = Math.round((taxableAmount + gstAmount) * 100) / 100;

    return {
      tier,
      months,
      baseAmount,
      discountAmount,
      couponApplied,
      taxableAmount,
      gstAmount,
      cgstAmount,
      sgstAmount,
      finalAmount
    };
  }

  // Secure Razorpay architecture: creates order representation with zero secret exposure
  public createRazorpayOrder(calculation: PaymentCalculation, customerInfo: { name: string; email: string; phone: string }) {
    const orderId = `order_rzp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    return {
      orderId,
      amountInPaise: Math.round(calculation.finalAmount * 100),
      currency: 'INR',
      notes: {
        tier: calculation.tier,
        months: calculation.months,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email
      }
    };
  }

  public recordSuccessfulPayment(params: {
    orderId: string;
    paymentId: string;
    calculation: PaymentCalculation;
    customerName: string;
    customerEmail: string;
  }): InvoiceRecord {
    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: InvoiceRecord = {
      id: invoiceNumber,
      tier: `${params.calculation.tier} Tier (${params.calculation.months} Month${params.calculation.months > 1 ? 's' : ''})`,
      note: 'Apni Jodi Sacred Matrimonial Membership Subscription',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: `₹${params.calculation.finalAmount.toFixed(2)}`,
      baseAmount: params.calculation.baseAmount,
      discountAmount: params.calculation.discountAmount,
      taxAmount: params.calculation.gstAmount,
      status: 'Settled',
      category: 'memberships',
      razorpayOrderId: params.orderId,
      razorpayPaymentId: params.paymentId,
      hsnCode: '998319',
      gstin: '07AAACA9812K1Z5',
      customerName: params.customerName,
      customerEmail: params.customerEmail
    };

    this.invoices.unshift(newInvoice);
    this.saveToStorage();
    return newInvoice;
  }

  public processRefund(invoiceId: string, _reason: string): boolean {
    const invoice = this.invoices.find(i => i.id === invoiceId);
    if (!invoice || invoice.status === 'Refunded') return false;

    invoice.status = 'Refunded';
    this.saveToStorage();
    return true;
  }

  public getInvoices(): InvoiceRecord[] {
    return [...this.invoices];
  }

  public getCoupons(): CouponRecord[] {
    return [...this.coupons];
  }

  public toggleCoupon(code: string): boolean {
    const coupon = this.coupons.find(c => c.code === code);
    if (!coupon) return false;
    coupon.active = !coupon.active;
    this.saveToStorage();
    return coupon.active;
  }

  public addCoupon(newCoupon: CouponRecord) {
    this.coupons.push(newCoupon);
    this.saveToStorage();
  }
}

export const paymentService = new PaymentServiceStore();
