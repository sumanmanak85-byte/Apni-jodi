import React, { useState } from 'react';
import { ScreenType, InvoiceRecord } from '../types';
import { INVOICES } from '../data/mockData';

import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

interface MembershipScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenConcierge: () => void;
  onOpenCheckout?: (tier?: 'Basic' | 'Premium' | 'VIP') => void;
}

export const MembershipScreen: React.FC<MembershipScreenProps> = ({
  onNavigate,
  onOpenConcierge,
  onOpenCheckout
}) => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'ledger' | 'plans'>('ledger');
  const [activeState, setActiveState] = useState<'success' | 'failed'>('success');
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'memberships' | 'addons'>('all');
  const [billingCadence, setBillingCadence] = useState<'monthly' | 'quarterly' | 'yearly'>('yearly');
  const [membershipQrPaid, setMembershipQrPaid] = useState<boolean>(false);
  const [membershipPaymentNotice, setMembershipPaymentNotice] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccessText, setDownloadSuccessText] = useState('');
  const [pauseModalOpen, setPauseModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [kundaliAddonActive, setKundaliAddonActive] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const [invoicesList, setInvoicesList] = useState<InvoiceRecord[]>(() => paymentService.getInvoices());

  React.useEffect(() => {
    const unsub = paymentService.subscribe(() => {
      setInvoicesList(paymentService.getInvoices());
    });
    return unsub;
  }, []);

  const filteredInvoices = invoicesList.filter(inv => {
    if (invoiceFilter === 'all') return true;
    return inv.category === invoiceFilter;
  });

  const handleDownloadInvoice = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccessText('Invoice Downloaded (INV-2025-0819.pdf)');
      setTimeout(() => setDownloadSuccessText(''), 3000);
    }, 800);
  };

  const handleRowPDF = (id: string) => {
    alert(`Downloading official digitally signed Tax Invoice ${id} (PDF format)...`);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      
      {/* Top Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#735c00]/10 text-[#735c00] text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#735c00]"></span>
            <span>AJ Privilege Suite • Patron Accounts</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#4e051a] font-bold tracking-tight">
            Financial Sanctuary & Membership Ledger
          </h1>
          <p className="text-sm sm:text-base text-[#544244] max-w-xl">
            Review your subscription parameters, tax invoices, and real-time transaction authentications under strict discretion.
          </p>
        </div>

        {/* View switcher & State Simulator Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#efeeeb] p-1 rounded-xl shadow-xs">
            <button
              onClick={() => setViewMode('ledger')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'ledger' ? 'bg-white text-[#4e051a] shadow-xs' : 'text-[#544244]'
              }`}
            >
              Sanctuary Ledger
            </button>
            <button
              onClick={() => setViewMode('plans')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'plans' ? 'bg-white text-[#4e051a] shadow-xs' : 'text-[#544244]'
              }`}
            >
              Upgrade & Plans
            </button>
          </div>

          {viewMode === 'ledger' && (
            <div className="flex items-center bg-[#efeeeb] p-1 rounded-xl shadow-xs">
              <button
                onClick={() => setActiveState('success')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeState === 'success'
                    ? 'bg-white text-[#4e051a] shadow-xs'
                    : 'text-[#544244] hover:text-[#4e051a]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#735c00]">verified</span>
                <span>Success Receipt</span>
              </button>
              <button
                onClick={() => setActiveState('failed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeState === 'failed'
                    ? 'bg-white text-[#ba1a1a] shadow-xs'
                    : 'text-[#544244] hover:text-[#ba1a1a]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">error_outline</span>
                <span>Failed Retry Modal</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {viewMode === 'ledger' ? (
        <>
          {/* MAIN NOTIFICATION / CONFIRMATION CONTAINER */}
          <div className="relative">
            {activeState === 'success' ? (
              /* STATE A: PAYMENT SUCCESS CARD */
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#dac0c2]/40 transition-all">
                {/* Luxe Ribbon */}
                <div className="h-2.5 w-full bg-gradient-to-r from-[#4e051a] via-[#735c00] to-[#6b1d2f]"></div>
                
                <div className="p-6 md:p-10 lg:p-12 space-y-10">
                  
                  {/* Top Confirmation Details */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-4">
                    <div className="flex items-start sm:items-center gap-5">
                      <div className="relative shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ffe088]/40 text-[#735c00] shadow-sm">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-inner">
                          <span className="material-symbols-outlined text-[28px] sm:text-[34px] text-[#735c00]">
                            verified
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-[#4e051a] text-white rounded-full p-1 shadow-xs">
                          <span className="material-symbols-outlined text-[14px] block">diamond</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#fed65b]/25 text-[#735c00] text-xs uppercase tracking-wider font-extrabold">
                            Order #AJ-99482
                          </span>
                          <span className="text-xs text-[#877274]">
                            • Jan 12, 2025 at 14:38 IST
                          </span>
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4e051a]">
                          Membership Successfully Activated
                        </h2>
                        <p className="text-sm text-[#544244]">
                          Welcome to <strong className="text-[#1b1c1a]">VIP Royal Patron</strong>. Your verified credentials and elevated matchmaking benefits are unlocked globally.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                      <button
                        onClick={handleDownloadInvoice}
                        disabled={isDownloading}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#1b1c1a] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#4e051a]">download</span>
                        <span>{isDownloading ? 'Generating PDF...' : downloadSuccessText || 'Download Tax Invoice'}</span>
                      </button>

                      <button
                        onClick={() => window.print()}
                        className="p-3 rounded-xl bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#544244] transition-colors"
                        title="Print Dossier Receipt"
                      >
                        <span className="material-symbols-outlined text-[20px] block">print</span>
                      </button>
                    </div>
                  </div>

                  {/* Transaction Breakdown Bento */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Col 1: Financial Computation (2 Cols) */}
                    <div className="md:col-span-2 bg-[#f5f3f0] rounded-2xl p-6 sm:p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-base font-bold text-[#4e051a]">
                          Financial Ledger Detail
                        </span>
                        <span className="text-[10px] uppercase px-2.5 py-1 rounded bg-white text-[#735c00] font-bold">
                          Paid via UPI / HDFC AutoPay
                        </span>
                      </div>

                      <div className="space-y-3 text-xs text-[#544244]">
                        <div className="flex justify-between items-center">
                          <span>VIP Royal Patron • Yearly Tier (12 Months)</span>
                          <span className="font-semibold text-[#1b1c1a]">₹3,592.00</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="inline-flex items-center gap-1.5">
                            Privilege Voucher <code className="px-1.5 py-0.5 rounded bg-white text-[#4e051a] font-mono text-[11px] font-bold">APNIJODI25</code>
                          </span>
                          <span className="font-bold text-white bg-[#4e051a] px-2 py-0.5 rounded text-[11px]">
                            - ₹898.00
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Matchmaking Digital Facilitation GST (18%)</span>
                          <span className="font-semibold text-[#1b1c1a]">₹484.92</span>
                        </div>

                        <div className="pt-3 border-t border-[#dac0c2]/30 flex justify-between items-baseline bg-white p-4 rounded-xl shadow-xs">
                          <div>
                            <span className="font-serif text-lg font-bold text-[#4e051a]">
                              Total Amount Authorized
                            </span>
                            <p className="text-[11px] text-[#877274]">
                              Inclusive of all federal digital communication levies
                            </p>
                          </div>
                          <span className="font-serif text-2xl font-bold text-[#4e051a]">
                            ₹3,178.92
                          </span>
                        </div>
                      </div>

                      {/* Strict Discretionary Guarantee */}
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-white text-xs text-[#544244] shadow-xs border border-[#dac0c2]/30">
                        <span className="material-symbols-outlined text-[#735c00] text-[20px] shrink-0 mt-0.5">
                          lock
                        </span>
                        <div className="space-y-0.5">
                          <p className="font-bold text-[#1b1c1a]">Strict Discretionary Guarantee</p>
                          <p className="text-[11px] leading-relaxed">
                            Your banking record and credit statements will appear discreetly under the merchant descriptor:
                            <span className="font-mono text-[#4e051a] font-bold px-1.5 py-0.5 bg-[#efeeeb] rounded mx-1">
                              AJ DIGITAL CONNECT
                            </span>. "Apni Jodi" or matrimonial labels are never printed.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Col 2: Security & Identifier Credentials (1 Col) */}
                    <div className="bg-[#f5f3f0] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <span className="font-serif text-base font-bold text-[#4e051a]">Authentication Keys</span>
                        <div className="space-y-3 text-xs">
                          <div>
                            <span className="text-[10px] text-[#877274] uppercase tracking-wider block">Transaction Reference</span>
                            <span className="font-mono font-bold text-[#1b1c1a] select-all">TXN-AJ-2025-99482</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#877274] uppercase tracking-wider block">Tax Invoice Identifier</span>
                            <span className="font-mono font-bold text-[#1b1c1a] select-all">INV-2025-0819</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#877274] uppercase tracking-wider block">Sacred Seal Hash</span>
                            <span className="font-mono text-[11px] text-[#877274] truncate block">0x8f2d...c349a117</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 space-y-2 border-t border-[#dac0c2]/30 text-xs text-[#544244]">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#735c00]">verified_user</span>
                          <span>256-Bit Financial Encryption Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#735c00]">event_repeat</span>
                          <span>Next Cycle: Jan 12, 2026</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* CTAs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <button
                      onClick={() => onNavigate('discover')}
                      className="flex items-center justify-between p-4 rounded-2xl bg-[#4e051a] text-white hover:bg-[#6b1d2f] transition-all shadow-md group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[22px]">explore</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Go to Curated Discovery</span>
                      </div>
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </button>

                    <button
                      onClick={() => onNavigate('matches')}
                      className="flex items-center justify-between p-4 rounded-2xl bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#1b1c1a] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[22px] text-[#735c00]">favorite</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Explore Matches</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#735c00] text-white text-[10px] font-bold">
                        4 New
                      </span>
                    </button>

                    <button
                      onClick={onOpenConcierge}
                      className="flex items-center justify-between p-4 rounded-2xl bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#1b1c1a] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[22px] text-[#4e051a]">support_agent</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Meet Dedicated Concierge</span>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-[#544244]">chat</span>
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              /* STATE B: PAYMENT FAILED CARD (SIMULATOR) */
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#ba1a1a]/30 transition-all space-y-6">
                <div className="h-2.5 w-full bg-gradient-to-r from-[#ba1a1a] via-[#ffb2bc] to-[#ba1a1a]"></div>
                
                <div className="p-6 md:p-10 lg:p-12 space-y-8">
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    <div className="w-16 h-16 rounded-full bg-[#ffdad6] text-[#ba1a1a] shrink-0 flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[32px]">warning</span>
                    </div>
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold uppercase">
                          Authorization Error • Gateway Timeout
                        </span>
                        <span className="text-xs text-[#877274]">Ref: ERR-HDFC-9021</span>
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1b1c1a]">
                        Transaction Incomplete — No Funds Debited
                      </h2>
                      <p className="text-sm text-[#544244]">
                        Your issuing bank declined the OTP authentication handoff. Rest assured, your promotional voucher <span className="font-bold text-[#4e051a]">APNIJODI25</span> and preferred VIP Royal Patron slot are <strong className="text-[#1b1c1a]">preserved for the next 14 minutes</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Retry options - QR Code Payment Only */}
                  <div className="max-w-md mx-auto">
                    <div 
                      onClick={() => { setViewMode('plans'); }}
                      className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#DFCEBD] hover:border-[#4e051a] transition-all flex flex-col items-center text-center space-y-4 shadow-sm cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center text-[#735c00]">
                        <span className="material-symbols-outlined text-[32px]">qr_code_scanner</span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-serif text-lg font-bold text-[#4e051a]">Complete Payment via QR Code</h3>
                        <p className="text-xs text-[#544244]">Scan the official Apni Jodi payment QR code using your preferred QR payment app.</p>
                      </div>
                      <button className="w-full py-3 rounded-full bg-[#4e051a] text-white text-xs font-serif font-bold uppercase tracking-wider group-hover:bg-[#6b1d2f] shadow-sm">
                        View Payment QR Code
                      </button>
                    </div>
                  </div>

                  {/* Concierge Hotline */}
                  <div className="p-4 rounded-2xl bg-[#ffe088]/20 border border-[#735c00]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#4e051a] text-[24px]">call</span>
                      <div>
                        <span className="text-xs font-bold text-[#4e051a]">Need immediate human assistance?</span>
                        <p className="text-xs text-[#544244]">Our Payment Concierge desk is on standby for distinguished patrons.</p>
                      </div>
                    </div>
                    <a
                      href="tel:+918002764563"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white font-mono font-bold text-xs text-[#4e051a] hover:bg-[#f5f3f0] transition-colors shadow-xs"
                    >
                      <span>+91 800-APNI-JODI</span>
                      <span className="material-symbols-outlined text-[16px]">north_east</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACTIVE SUBSCRIPTION & PATRON RIGHTS */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#4e051a] font-bold">
                Active Subscription & Patron Rights
              </h2>
              <span className="text-xs text-[#877274] uppercase tracking-wider font-semibold">
                Managed Under Private Token #AJ-PK-0199
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Status & Privileges (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#dac0c2]/30 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#efeeeb]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#735c00] animate-pulse"></span>
                      <span className="text-xs text-[#735c00] font-bold uppercase tracking-wider">Active Status</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#1b1c1a]">VIP Royal Patron</h3>
                    <p className="text-xs text-[#544244]">Equivalent to ₹264.91 / month • Billed annually</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#877274] block uppercase">Next Automatic Renewal</span>
                    <span className="font-serif text-lg font-bold text-[#4e051a]">Jan 12, 2026</span>
                    <span className="text-xs text-[#735c00] block font-bold">364 Days Remaining</span>
                  </div>
                </div>

                {/* 4 Entitlements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#f5f3f0] flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-white text-[#4e051a] shadow-xs">
                      <span className="material-symbols-outlined text-[20px] block">visibility_off</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1b1c1a] block">Incognito Shield</span>
                      <span className="text-[11px] text-[#544244]">Browse candid dossiers without leaving digital footprints.</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#f5f3f0] flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-white text-[#4e051a] shadow-xs">
                      <span className="material-symbols-outlined text-[20px] block">rocket_launch</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1b1c1a] block">5x Profile Priority</span>
                      <span className="text-[11px] text-[#544244]">Presented first to culturally compatible families.</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#f5f3f0] flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-white text-[#4e051a] shadow-xs">
                      <span className="material-symbols-outlined text-[20px] block">lock_person</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1b1c1a] block">Direct Contact Letters</span>
                      <span className="text-[11px] text-[#544244]">Unlimited verified family & personal exchanges.</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#f5f3f0] flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-white text-[#4e051a] shadow-xs">
                      <span className="material-symbols-outlined text-[20px] block">psychology_alt</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1b1c1a] block">Dedicated Advisor</span>
                      <span className="text-[11px] text-[#544244]">Guided by Ananya Sharma (Lead Matchmaker).</span>
                    </div>
                  </div>
                </div>

                {/* Gateway Details */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-[#f5f3f0] gap-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#4e051a] text-[24px]">account_balance_wallet</span>
                    <div>
                      <span className="text-xs font-bold text-[#1b1c1a] block">HDFC UPI AutoPay • aadhavan@okhdfcbank</span>
                      <span className="text-[11px] text-[#544244]">Mandate authorized up to ₹5,000 / cycle</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert("Opening tokenized mandate update gateway...")}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-[#efeeeb] text-[#4e051a] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs shrink-0"
                  >
                    Update Gateway
                  </button>
                </div>
              </div>

              {/* Right: Tier Governance (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#dac0c2]/30 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#4e051a]">Tier Management</h3>
                    <p className="text-xs text-[#544244]">Adjust your commitment cadence or incorporate elite additions.</p>
                  </div>

                  {/* Cadence selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#877274] uppercase tracking-wider block">Billing Cadence</label>
                    <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#f5f3f0]">
                      <button
                        onClick={() => { setBillingCadence('monthly'); alert("Billing frequency switched to Monthly (₹499/mo). Takes effect next renewal."); }}
                        className={`py-2 text-center rounded-xl text-xs transition-all ${
                          billingCadence === 'monthly' ? 'bg-white text-[#4e051a] font-bold shadow-xs' : 'text-[#544244]'
                        }`}
                      >
                        Monthly
                        <span className="block text-[10px] opacity-75">₹499/mo</span>
                      </button>
                      <button
                        onClick={() => { setBillingCadence('quarterly'); alert("Billing frequency switched to Quarterly (₹399/mo). Takes effect next renewal."); }}
                        className={`py-2 text-center rounded-xl text-xs transition-all ${
                          billingCadence === 'quarterly' ? 'bg-white text-[#4e051a] font-bold shadow-xs' : 'text-[#544244]'
                        }`}
                      >
                        Quarterly
                        <span className="block text-[10px] opacity-75">₹399/mo</span>
                      </button>
                      <button
                        onClick={() => setBillingCadence('yearly')}
                        className={`py-2 text-center rounded-xl text-xs transition-all ${
                          billingCadence === 'yearly' ? 'bg-white text-[#4e051a] font-bold shadow-xs' : 'text-[#544244]'
                        }`}
                      >
                        Yearly
                        <span className="block text-[10px] text-[#735c00] font-bold">Save 40%</span>
                      </button>
                    </div>
                  </div>

                  {/* Bespoke Add-on */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#877274] uppercase tracking-wider block">Bespoke Add-Ons</span>
                    <div className="p-4 rounded-2xl bg-[#f5f3f0] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#735c00] shadow-xs">
                          <span className="material-symbols-outlined text-[20px]">stars</span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#1b1c1a] block">Vedic Kundali Synthesis</span>
                          <span className="text-[11px] text-[#544244]">Gun Milan & Dosha remedies report</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setKundaliAddonActive(!kundaliAddonActive);
                          alert(kundaliAddonActive ? "Add-on removed." : "Added Vedic Kundali Synthesis for ₹899!");
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                          kundaliAddonActive ? 'bg-[#4e051a] text-white' : 'bg-[#735c00] text-white'
                        }`}
                      >
                        {kundaliAddonActive ? 'Added' : '+ ₹899'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions & 7-day guarantee */}
                <div className="space-y-3 pt-4 border-t border-[#efeeeb]">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <button
                      onClick={() => setPauseModalOpen(true)}
                      className="text-[#544244] hover:text-[#4e051a] flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">pause_circle</span>
                      <span>Pause Membership</span>
                    </button>
                    <button
                      onClick={() => setCancelModalOpen(true)}
                      className="text-[#ba1a1a] hover:underline"
                    >
                      Cancel Auto-Renewal
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-[#f5f3f0] text-[11px] text-[#544244] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#735c00]">verified</span>
                    <span><strong>7-Day Honor Guarantee:</strong> Full discretionary refund if no curator introductions made within first week.</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* OFFICIAL INVOICES & BILLING HISTORY LEDGER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#dac0c2]/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#4e051a]">
                  Billing History & Official Receipts
                </h2>
                <p className="text-xs text-[#544244]">
                  Digitally signed tax invoices compliant with Central GST & Interstate IGST regulations.
                </p>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInvoiceFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    invoiceFilter === 'all' ? 'bg-[#4e051a] text-white' : 'bg-[#f5f3f0] text-[#544244]'
                  }`}
                >
                  All Statements
                </button>
                <button
                  onClick={() => setInvoiceFilter('memberships')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    invoiceFilter === 'memberships' ? 'bg-[#4e051a] text-white' : 'bg-[#f5f3f0] text-[#544244]'
                  }`}
                >
                  Memberships
                </button>
                <button
                  onClick={() => setInvoiceFilter('addons')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    invoiceFilter === 'addons' ? 'bg-[#4e051a] text-white' : 'bg-[#f5f3f0] text-[#544244]'
                  }`}
                >
                  Add-ons
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="bg-[#f5f3f0] text-[#877274] text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-6 rounded-l-xl">Invoice ID</th>
                    <th className="py-3 px-4">Tier / Entitlement</th>
                    <th className="py-3 px-4">Billing Date</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Tax Status</th>
                    <th className="py-3 px-6 text-right rounded-r-xl">Tax Receipt</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-[#1b1c1a] divide-y divide-[#efeeeb]">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#fbf9f6] transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-[#4e051a]">{inv.id}</td>
                      <td className="py-4 px-4">
                        <span className="font-bold block">{inv.tier}</span>
                        <span className="text-[11px] text-[#877274]">{inv.note}</span>
                      </td>
                      <td className="py-4 px-4 text-[#544244]">{inv.date}</td>
                      <td className="py-4 px-4 font-bold text-[#4e051a]">{inv.amount}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fed65b]/40 text-[#735c00] font-bold text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#735c00]"></span>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#efeeeb] hover:bg-[#eae8e5] text-[#4e051a] text-xs font-bold transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                          <span>Tax Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-[#877274] gap-2">
              <span>GSTIN: 27AABCA4821N1ZS • SAC Code: 998314 (Information Technology Support & Matrimonial Liaison)</span>
              <a href="#audit" onClick={(e) => { e.preventDefault(); alert("Consolidated yearly tax audit dossier requested."); }} className="text-[#4e051a] font-bold hover:underline">
                Request Consolidated Yearly Audit →
              </a>
            </div>
          </div>
        </>
      ) : (
        /* PLANS & CHECKOUT VIEW */
        <div className="space-y-12">
          
          {/* Cadence Switcher Header */}
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-widest">
              SACRED COMMITMENTS • CURATED DISCRETION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4e051a] font-bold">
              Invest in a Meaningful Future
            </h2>
            <p className="text-sm text-[#544244]">
              Thoughtfully crafted plans with full privacy controls, verified profiles, and priority recommendations designed for enduring companionship.
            </p>

            <div className="inline-flex p-1.5 rounded-2xl bg-[#efeeeb] shadow-inner mt-4">
              <button
                onClick={() => setBillingCadence('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingCadence === 'monthly' ? 'bg-white text-[#4e051a] shadow-xs' : 'text-[#544244]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCadence('quarterly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingCadence === 'quarterly' ? 'bg-white text-[#4e051a] shadow-xs' : 'text-[#544244]'
                }`}
              >
                Quarterly (Save 20%)
              </button>
              <button
                onClick={() => setBillingCadence('yearly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingCadence === 'yearly' ? 'bg-white text-[#4e051a] shadow-xs' : 'text-[#544244]'
                }`}
              >
                Yearly (Save 40% • Best Value)
              </button>
            </div>
          </div>

          {/* 3 Tier Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Basic */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dac0c2]/40 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-[#877274] uppercase tracking-widest">FOUNDATIONAL TIER</span>
                <h3 className="font-serif text-2xl font-bold text-[#1b1c1a]">Basic</h3>
                <p className="text-xs text-[#544244]">Curated discovery and essential verified communication for deliberate seekers.</p>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="font-serif text-4xl font-bold text-[#1b1c1a]">₹189</span>
                  <span className="text-xs text-[#544244]">/ month</span>
                </div>
                <div className="space-y-2 text-xs text-[#544244] pt-2">
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span><span>Profile creation & bio curation</span></div>
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span><span>Profile discovery feed</span></div>
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span><span>Daily interests allocation</span></div>
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span><span>View verified profile info</span></div>
                </div>
              </div>
              <button 
                onClick={() => onOpenCheckout ? onOpenCheckout('Basic') : alert("Opening Basic checkout...")}
                className="w-full py-3 rounded-xl bg-[#efeeeb] hover:bg-[#eae8e5] text-xs font-bold text-[#1b1c1a] uppercase tracking-wider cursor-pointer transition"
              >
                Choose Basic (₹189/mo)
              </button>
            </div>

            {/* Premium (Highlighted) */}
            <div className="bg-[#4e051a] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#ffe088]/40 shadow-2xl flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-[#ffe088] text-[#241a00] text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                MOST POPULAR
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-[#ffe088] uppercase tracking-widest">SELF-PACED ROMANCE</span>
                <h3 className="font-serif text-2xl font-bold text-white">Premium</h3>
                <p className="text-xs text-white/80">Full visibility into admirers and accelerated connections with unlimited outreach.</p>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="font-serif text-4xl font-bold text-white">₹289</span>
                  <span className="text-xs text-white/70">/ month</span>
                </div>
                <div className="space-y-2 text-xs text-white/90 pt-2">
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#ffe088]">check</span><span>Everything in Basic, plus:</span></div>
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#ffe088]">check</span><span>Unlimited Express Interests</span></div>
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#ffe088]">check</span><span>Unlimited messaging after matching</span></div>
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#ffe088]">check</span><span>See who liked & viewed your profile</span></div>
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#ffe088]">check</span><span>Monthly Profile Spotlight Boost</span></div>
                </div>
              </div>
              <button 
                onClick={() => onOpenCheckout ? onOpenCheckout('Premium') : alert("Opening Premium checkout...")}
                className="w-full py-3.5 rounded-xl bg-[#ffe088] text-[#241a00] hover:bg-[#fed65b] text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer transition"
              >
                Go Premium (₹289/mo)
              </button>
            </div>

            {/* VIP Concierge */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dac0c2]/40 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-[#735c00] uppercase tracking-widest">WHITE GLOVE CONCIERGE</span>
                <h3 className="font-serif text-2xl font-bold text-[#1b1c1a]">VIP Royal</h3>
                <p className="text-xs text-[#544244]">Direct personal advisor, incognito shields, and access to prestigious global circles.</p>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="font-serif text-4xl font-bold text-[#1b1c1a]">₹499</span>
                  <span className="text-xs text-[#544244]">/ month</span>
                </div>
                <div className="space-y-2 text-xs text-[#544244] pt-2">
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span><span>Priority placement in algorithmic discoveries</span></div>
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span><span>VIP exclusive global discovery network</span></div>
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span><span>Premium fast-track identity verification</span></div>
                  <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-[#735c00]">check</span><span>Exclusive incognito mode browsing</span></div>
                </div>
              </div>
              <button 
                onClick={() => onOpenCheckout ? onOpenCheckout('VIP') : alert("Opening VIP checkout...")}
                className="w-full py-3 rounded-xl bg-[#4e051a] hover:bg-[#6b1d2f] text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition"
              >
                Upgrade to VIP (₹499/mo)
              </button>
            </div>

          </div>

          {/* CHECKOUT CARD & GATEWAY SELECTOR */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#dac0c2]/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Order Summary (5 Cols) */}
            <div className="lg:col-span-5 bg-[#f5f3f0] rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#dac0c2]/30">
                <span className="text-xs font-bold text-[#877274] uppercase tracking-wider">CHECKOUT SUMMARY</span>
                <span className="text-xs font-bold text-[#735c00] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Encrypted
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#4e051a]">VIP Membership</h4>
                  <span className="text-[11px] text-[#544244]">Full Concierge • Global Access • 12 Mos</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#fed65b]/40 text-[#735c00] text-xs font-bold">Yearly</span>
              </div>

              <div className="space-y-2 text-xs text-[#544244]">
                <div className="flex justify-between">
                  <span>Base Membership (Yearly VIP)</span>
                  <span className="font-semibold text-[#1b1c1a]">₹3,592.00</span>
                </div>
                <div className="flex justify-between text-[#4e051a] font-semibold">
                  <span>Special Launch Voucher (25%)</span>
                  <span>- ₹898.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Matchmaking GST (18%)</span>
                  <span>₹484.92</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#dac0c2]/40 flex justify-between items-baseline">
                <div>
                  <span className="font-serif text-base font-bold text-[#4e051a]">Total Investment</span>
                  <span className="block text-[10px] text-[#877274]">All taxes included</span>
                </div>
                <span className="font-serif text-2xl font-bold text-[#4e051a]">₹3,178.92</span>
              </div>

              <div className="p-3 rounded-xl bg-white text-[11px] text-[#544244] flex items-center gap-2 border border-[#dac0c2]/30">
                <span className="material-symbols-outlined text-[16px] text-[#735c00]">verified</span>
                <span>100% Money-back guarantee honored within 7 days. Automatic tax invoice dispatched instantly.</span>
              </div>
            </div>

            {/* Right Dedicated QR Payment Section (7 Cols) */}
            <div className="lg:col-span-7 bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#DFCEBD] space-y-6 text-center">
              
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="font-serif text-2xl font-bold text-[#4e051a]">Complete Your Payment</h3>
                <p className="text-xs sm:text-sm text-[#544244]">Scan the QR code using your preferred QR payment app.</p>
              </div>

              {/* Payment Status Section */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-xs font-semibold text-[#735c00] shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Payment Status:</span>
                  <strong className="text-[#4e051a] uppercase tracking-wide">Pending</strong>
                </div>
              </div>

              {/* Prominent QR Code Box */}
              <div className="p-6 bg-white rounded-2xl border-2 border-[#DFCEBD] max-w-xs mx-auto shadow-sm space-y-3">
                <div className="relative mx-auto w-56 h-56 sm:w-60 sm:h-60 p-3 bg-white rounded-xl border border-[#4e051a]/20 shadow-xs flex items-center justify-center overflow-hidden">
                  <img
                    src="/payment-qr.png"
                    alt="Apni Jodi Payment QR Code"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/payment-qr.svg';
                    }}
                  />
                </div>

                <div className="space-y-1 pt-1">
                  <h4 className="font-serif text-base font-bold text-[#1b1c1a]">Scan QR to Pay</h4>
                  <p className="text-xs text-[#877274]">After completing the payment, click I Have Paid.</p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      setMembershipQrPaid(true);
                      setMembershipPaymentNotice('Payment submitted for verification.');
                    }}
                    className={`w-full py-3.5 rounded-full font-serif font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                      membershipQrPaid
                        ? 'bg-emerald-800 text-white'
                        : 'bg-[#4e051a] hover:bg-[#6b1d2f] text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {membershipQrPaid ? 'done_all' : 'check_circle'}
                    </span>
                    <span>I Have Paid</span>
                  </button>

                  <button
                    onClick={() => {
                      setMembershipQrPaid(false);
                      setMembershipPaymentNotice('Payment not completed. Please scan the QR code and complete payment in your preferred QR payment app.');
                    }}
                    className="w-full py-2.5 rounded-full bg-white border border-[#DFCEBD] hover:bg-stone-50 text-[#544244] text-xs font-semibold transition cursor-pointer"
                  >
                    Payment Not Completed
                  </button>
                </div>
              </div>

              {membershipPaymentNotice && (
                <div className={`p-4 rounded-2xl border max-w-sm mx-auto text-center space-y-1.5 animate-fade-in ${
                  membershipQrPaid
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-white border-stone-300 text-stone-800'
                }`}>
                  <div className="flex items-center justify-center gap-2 text-xs font-bold">
                    <span className="material-symbols-outlined text-base text-[#735c00]">
                      {membershipQrPaid ? 'hourglass_top' : 'info'}
                    </span>
                    <span>{membershipPaymentNotice}</span>
                  </div>
                  {membershipQrPaid && (
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Do not automatically mark the payment as successful. Keep payment status as <strong>Pending</strong> until verification is completed by our admin desk.
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-center text-[10px] text-[#877274] pt-2">
                <span>Directly governed by certified UPI directives • Discreet descriptor: "AJ DIGITAL CONNECT"</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* PAUSE MODAL */}
      {pauseModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#371e1f]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95">
            <h3 className="font-serif text-xl font-bold text-[#4e051a]">Pause Active Membership</h3>
            <p className="text-xs text-[#544244] leading-relaxed">
              You can put your profile and letters on hold for up to 90 days. Unused subscription days will freeze instantly and unfreeze whenever you return.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPauseModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#efeeeb] text-xs font-bold text-[#544244]"
              >
                Keep Active
              </button>
              <button
                onClick={() => {
                  alert("Membership frozen for 90 days. Your days remain protected.");
                  setPauseModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#4e051a] text-white text-xs font-bold"
              >
                Pause for 90 Days
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#371e1f]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95">
            <h3 className="font-serif text-xl font-bold text-[#4e051a]">Cancel Auto-Renewal</h3>
            <p className="text-xs text-[#544244] leading-relaxed">
              Your VIP Royal Patron privileges remain completely active through January 12, 2026. Your card or UPI mandate will not be charged again.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#efeeeb] text-xs font-bold text-[#544244]"
              >
                Keep Auto-Renew
              </button>
              <button
                onClick={() => {
                  alert("Auto-renewal turned off. Your privileges stay active until Jan 12, 2026.");
                  setCancelModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#ba1a1a] text-white text-xs font-bold"
              >
                Turn Off Auto-Renew
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL GST TAX INVOICE INSPECTOR MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-8 space-y-5 border border-[#DFCEBD] shadow-2xl relative">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-800 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="border-b border-[#EFEEEB] pb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#735C00]">
                  GOVERNMENT OF INDIA • FORM GST INV-1
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {selectedInvoice.status}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#4E051A] mt-1">
                Official Tax Invoice
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Invoice No: {selectedInvoice.id} • Order: {selectedInvoice.razorpayOrderId || 'order_rzp_demo'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-stone-700 block">Service Provider:</span>
                <p className="text-stone-600 font-serif font-bold text-sm text-[#4E051A]">Apni Jodi Matrimonial Pvt Ltd</p>
                <p className="text-stone-500">GSTIN: {selectedInvoice.gstin || '07AAACA9812K1Z5'}</p>
                <p className="text-stone-500">SAC Code: {selectedInvoice.hsnCode || '998319'}</p>
                <p className="text-stone-500">Barakhamba Road, Connaught Place, New Delhi - 110001</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-stone-700 block">Billed To (Patron):</span>
                <p className="text-stone-800 font-bold">{selectedInvoice.customerName || user?.fullName || 'Aadhavan Sharma'}</p>
                <p className="text-stone-500">{selectedInvoice.customerEmail || user?.email || 'aadhavan@apnijodi.com'}</p>
                <p className="text-stone-500">Billing Date: {selectedInvoice.date}</p>
                <p className="text-stone-500">Payment ID: {selectedInvoice.razorpayPaymentId || 'pay_rzp_settled'}</p>
              </div>
            </div>

            <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#DFCEBD] space-y-2 text-xs">
              <div className="flex justify-between font-bold text-stone-800 border-b border-[#DFCEBD]/60 pb-2">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>{selectedInvoice.tier}</span>
                <span>₹{(selectedInvoice.baseAmount || 289).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-[11px]">
                <span>Central GST (CGST @ 9%)</span>
                <span>₹{((selectedInvoice.taxAmount || 52.02) / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-[11px]">
                <span>State GST (SGST @ 9%)</span>
                <span>₹{((selectedInvoice.taxAmount || 52.02) / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#4E051A] pt-2 border-t border-[#DFCEBD]/60">
                <span>Total Settled (INR):</span>
                <span>{selectedInvoice.amount}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => {
                  alert(`Digitally verified tax invoice ${selectedInvoice.id} downloaded.`);
                  setSelectedInvoice(null);
                }}
                className="px-5 py-2.5 rounded-full bg-[#4E051A] text-white text-xs font-semibold hover:bg-[#680C25] cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download Certified PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
