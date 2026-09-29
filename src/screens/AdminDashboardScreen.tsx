import React, { useState } from 'react';
import { ScreenType, ReportRecord, SupportTicket, CouponRecord, InvoiceRecord } from '../types';
import { matchmakingService } from '../services/matchmakingService';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

type AdminTab = 
  | 'overview' 
  | 'users' 
  | 'profiles' 
  | 'verification' 
  | 'reports' 
  | 'memberships' 
  | 'payments' 
  | 'coupons' 
  | 'refunds' 
  | 'support';

interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  profession: string;
  tier: 'Basic' | 'Premium' | 'VIP';
  isVerified: boolean;
  status: 'Active' | 'Suspended' | 'Pending KYC';
  joinedDate: string;
}

const INITIAL_ADMIN_USERS: AdminUserRecord[] = [
  {
    id: 'u1',
    name: 'Aadhavan Sharma',
    email: 'aadhavan.sharma@apnijodi.com',
    phone: '+91 98101 23456',
    age: 31,
    city: 'New Delhi / Gurugram',
    profession: 'Principal Product Architect',
    tier: 'Premium',
    isVerified: true,
    status: 'Active',
    joinedDate: '15 Jan 2026'
  },
  {
    id: 'u2',
    name: 'Meera Sen',
    email: 'meera.sen@oxon.org',
    phone: '+91 98111 88990',
    age: 28,
    city: 'New Delhi (Jor Bagh)',
    profession: 'Heritage Art Restorer',
    tier: 'VIP',
    isVerified: true,
    status: 'Active',
    joinedDate: '02 Feb 2026'
  },
  {
    id: 'u3',
    name: 'Kabir Mehta',
    email: 'k.mehta@capital.in',
    phone: '+91 98200 44556',
    age: 32,
    city: 'Mumbai (South)',
    profession: 'VP Investment Banking',
    tier: 'Premium',
    isVerified: true,
    status: 'Active',
    joinedDate: '18 Feb 2026'
  },
  {
    id: 'u4',
    name: 'Devraj Chauhan',
    email: 'devraj.c@outlook.com',
    phone: '+91 97112 00112',
    age: 34,
    city: 'Jaipur',
    profession: 'Civil Services / IAS',
    tier: 'Basic',
    isVerified: false,
    status: 'Pending KYC',
    joinedDate: '24 Sep 2026'
  }
];

const INITIAL_KYC_QUEUE = [
  {
    id: 'kyc_1',
    userName: 'Devraj Chauhan',
    docType: 'Passport (India)',
    docNumber: 'Z8912401',
    age: 34,
    uploadedAt: 'Today, 08:30 AM',
    status: 'Pending'
  },
  {
    id: 'kyc_2',
    userName: 'Tanvi Singhal',
    docType: 'Aadhaar (DigiLocker API)',
    docNumber: 'XXXX-XXXX-4912',
    age: 27,
    uploadedAt: 'Yesterday, 04:15 PM',
    status: 'Pending'
  }
];

const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-101',
    userName: 'Ananya Sen',
    userEmail: 'ananya.sen@med.in',
    subject: 'Requesting Astro Kundli Harmony re-calculation with birth time rectification',
    priority: 'High',
    status: 'Open',
    date: '28 Sep 2026',
    message: 'Namaste Patron Desk, our family astrologer noted our birth time was 04:22 AM instead of 04:30 AM. Kindly sync Gunas report.'
  },
  {
    id: 'TCK-102',
    userName: 'Rohan Singhania',
    userEmail: 'rohan@singhaniatech.ai',
    subject: 'Photo Privacy Shield watermarking clarity inquiry',
    priority: 'Medium',
    status: 'In Progress',
    date: '27 Sep 2026',
    message: 'Confirmed that the watermarking works seamlessly across mobile Safari.'
  }
];

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // State collections
  const [userList, setUserList] = useState<AdminUserRecord[]>(INITIAL_ADMIN_USERS);
  const [kycQueue, setKycQueue] = useState(INITIAL_KYC_QUEUE);
  const [reports, setReports] = useState<ReportRecord[]>(() => matchmakingService.getReports());
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => paymentService.getInvoices());
  const [coupons, setCoupons] = useState<CouponRecord[]>(() => paymentService.getCoupons());
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);

  // New Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponVal, setNewCouponVal] = useState<number>(20);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Search in users
  const [userSearch, setUserSearch] = useState('');

  // Notification Banner
  const [adminBanner, setAdminBanner] = useState<string | null>(null);

  const showBanner = (msg: string) => {
    setAdminBanner(msg);
    setTimeout(() => setAdminBanner(null), 3500);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        showBanner(`User ${u.name} status updated to: ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleApproveKyc = (kycId: string, userName: string) => {
    setKycQueue(prev => prev.filter(k => k.id !== kycId));
    setUserList(prev => prev.map(u => u.name === userName ? { ...u, isVerified: true, status: 'Active' } : u));
    showBanner(`KYC Approved for ${userName}. Blue Seal Affixed.`);
  };

  const handleRejectKyc = (kycId: string, userName: string) => {
    setKycQueue(prev => prev.filter(k => k.id !== kycId));
    showBanner(`KYC Rejected for ${userName}. Notification sent.`);
  };

  const handleResolveReport = (reportId: string) => {
    matchmakingService.updateReportStatus(reportId, 'resolved', 'Offending member issued formal warning and quarantined.');
    setReports(matchmakingService.getReports());
    showBanner('Trust & Safety ticket resolved.');
  };

  const handleProcessRefund = (invoiceId: string) => {
    const success = paymentService.processRefund(invoiceId, 'Patron request processed within 7-day sanctity window.');
    if (success) {
      setInvoices(paymentService.getInvoices());
      showBanner(`Refund of ${invoiceId} processed successfully.`);
    }
  };

  const handleToggleCoupon = (code: string) => {
    paymentService.toggleCoupon(code);
    setCoupons(paymentService.getCoupons());
    showBanner(`Coupon ${code} status toggled.`);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const newCoupon: CouponRecord = {
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      value: newCouponVal,
      description: newCouponDesc || `${newCouponVal}${newCouponType === 'percentage' ? '%' : ' INR'} Off`,
      active: true
    };
    paymentService.addCoupon(newCoupon);
    setCoupons(paymentService.getCoupons());
    setNewCouponCode('');
    setNewCouponDesc('');
    showBanner(`New Coupon ${newCoupon.code} created & activated.`);
  };

  const filteredUsers = userList.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.city.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Admin Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#1E1919] text-white p-6 rounded-3xl border border-amber-300/30 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-serif uppercase tracking-widest font-semibold mb-1">
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              Apni Jodi Command Sanctum
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold">
              Central Administration & Patron Moderation
            </h1>
            <p className="text-xs text-stone-300 mt-0.5">
              Logged in as Chief Patron: <strong>{user?.fullName || 'Suman Manak'}</strong> ({user?.email})
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('discover')}
              className="px-4 py-2 rounded-full border border-stone-600 text-xs text-stone-200 hover:bg-white/10 transition cursor-pointer"
            >
              Exit to App
            </button>
            <button
              onClick={() => showBanner('Database integrity check: 100% synchronized with Firestore.')}
              className="px-4 py-2 rounded-full bg-amber-400 text-[#1E1919] text-xs font-semibold hover:bg-amber-300 transition cursor-pointer"
            >
              Sync DB Health
            </button>
          </div>
        </div>

        {/* Global Banner Notification */}
        {adminBanner && (
          <div className="p-3 rounded-2xl bg-emerald-900 text-emerald-100 text-xs font-medium flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>{adminBanner}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 border-b border-[#DFCEBD]">
          {[
            { id: 'overview', label: 'Overview & Analytics', icon: 'analytics' },
            { id: 'users', label: `Users (${userList.length})`, icon: 'group' },
            { id: 'verification', label: `Verification Queue (${kycQueue.length})`, icon: 'verified_user' },
            { id: 'reports', label: `Trust Reports (${reports.length})`, icon: 'security' },
            { id: 'memberships', label: 'Memberships & Subscriptions', icon: 'workspace_premium' },
            { id: 'payments', label: `Payments & Orders (${invoices.length})`, icon: 'receipt_long' },
            { id: 'coupons', label: `Coupons (${coupons.length})`, icon: 'local_offer' },
            { id: 'refunds', label: 'Refunds Desk', icon: 'currency_rupee' },
            { id: 'support', label: `Support Tickets (${supportTickets.length})`, icon: 'support_agent' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-serif font-medium whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#4E051A] text-white shadow-md font-bold'
                  : 'bg-white border border-[#DFCEBD] text-[#5B4F48] hover:bg-[#F3ECE4]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#DFCEBD] shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">Monthly Run Rate (MRR)</span>
                <div className="font-serif text-2xl font-bold text-[#4E051A] mt-1">₹1,84,620</div>
                <div className="text-[11px] text-emerald-700 font-medium mt-1">↑ 24.8% vs last month</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#DFCEBD] shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">Verified Patrons</span>
                <div className="font-serif text-2xl font-bold text-[#1E1919] mt-1">1,248</div>
                <div className="text-[11px] text-stone-500 mt-1">100% Aadhaar / Passport verified</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#DFCEBD] shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">Bilateral Mutual Sparks</span>
                <div className="font-serif text-2xl font-bold text-[#1E1919] mt-1">428 Pairs</div>
                <div className="text-[11px] text-emerald-700 font-medium mt-1">72.4% consent unlock rate</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#DFCEBD] shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">Platform Conversion</span>
                <div className="font-serif text-2xl font-bold text-[#1E1919] mt-1">18.6%</div>
                <div className="text-[11px] text-stone-500 mt-1">Free to Paid Tier Conversion</div>
              </div>
            </div>

            {/* Quick Actions & Recent Incidents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-[#DFCEBD] shadow-sm space-y-3">
                <h3 className="font-serif text-base font-bold text-[#1E1919] flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-700">shield</span>
                  Sanctuary Trust & Safety Status
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Zero unauthorized bots or commercial brokers detected in the last 48 hours. 100% of newly registered accounts passed through the strict 18+ birthdate verification gate.
                </p>
                <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                  <span>Photo Privacy Shield Adoption:</span>
                  <span className="font-bold text-[#4E051A]">84% of active members</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#DFCEBD] shadow-sm space-y-3">
                <h3 className="font-serif text-base font-bold text-[#1E1919] flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-700">account_balance_wallet</span>
                  Active Tier Distribution
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Sadhana Tier (Basic — ₹189/mo):</span>
                    <span className="font-bold font-mono">512 patrons (41%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kalyan Tier (Premium — ₹289/mo):</span>
                    <span className="font-bold font-mono">584 patrons (47%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Imperial Concierge (VIP — ₹499/mo):</span>
                    <span className="font-bold font-mono">152 patrons (12%)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: USERS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 border border-[#DFCEBD] shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="font-serif text-xl font-bold text-[#1E1919]">
                Registered Patrons & Candidates
              </h3>
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, city, email..."
                className="w-full sm:w-64 px-3 py-1.5 rounded-xl border border-[#DFCEBD] text-xs bg-[#FAF7F2]"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DFCEBD] text-stone-500 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Patron Name</th>
                    <th className="pb-3">City & Profession</th>
                    <th className="pb-3">Age</th>
                    <th className="pb-3">Membership Tier</th>
                    <th className="pb-3">KYC Seal</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFCEBD]/40">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAF7F2]">
                      <td className="py-3 font-medium text-[#1E1919]">
                        <div>{u.name}</div>
                        <div className="text-[10px] text-stone-400">{u.email}</div>
                      </td>
                      <td className="py-3 text-stone-600">
                        <div>{u.city}</div>
                        <div className="text-[10px] text-stone-500">{u.profession}</div>
                      </td>
                      <td className="py-3 font-mono">{u.age} yrs</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.tier === 'VIP' ? 'bg-amber-100 text-amber-900' :
                          u.tier === 'Premium' ? 'bg-purple-100 text-purple-900' :
                          'bg-stone-100 text-stone-800'
                        }`}>
                          {u.tier} (₹{u.tier === 'VIP' ? 499 : u.tier === 'Premium' ? 289 : 189}/mo)
                        </span>
                      </td>
                      <td className="py-3">
                        {u.isVerified ? (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">verified</span> Verified
                          </span>
                        ) : (
                          <span className="text-amber-700">Pending Review</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.status === 'Active' ? 'bg-emerald-50 text-emerald-800' :
                          u.status === 'Suspended' ? 'bg-rose-50 text-rose-800' :
                          'bg-amber-50 text-amber-800'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-semibold transition cursor-pointer ${
                            u.status === 'Active'
                              ? 'border border-rose-300 text-rose-700 hover:bg-rose-50'
                              : 'border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {u.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: VERIFICATION QUEUE */}
        {activeTab === 'verification' && (
          <div className="bg-white rounded-3xl p-6 border border-[#DFCEBD] shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1E1919]">
              Government ID Verification Queue
            </h3>
            <p className="text-xs text-stone-500">
              Every patron is vetted against government credentials before entering the mutual handshake chamber.
            </p>

            {kycQueue.length === 0 ? (
              <div className="text-center py-10 text-stone-400 text-xs">
                No pending KYC submissions in the queue.
              </div>
            ) : (
              <div className="space-y-3">
                {kycQueue.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DFCEBD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-serif font-bold text-sm text-[#1E1919]">{item.userName}</div>
                      <div className="text-xs text-stone-600 flex items-center gap-3">
                        <span>Document: <strong>{item.docType}</strong></span>
                        <span>Hash: <code className="font-mono text-[10px]">{item.docNumber}</code></span>
                        <span>Age: <strong>{item.age} yrs</strong></span>
                      </div>
                      <div className="text-[11px] text-stone-400">Uploaded {item.uploadedAt}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveKyc(item.id, item.userName)}
                        className="px-4 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
                      >
                        Approve & Affix Seal
                      </button>
                      <button
                        onClick={() => handleRejectKyc(item.id, item.userName)}
                        className="px-4 py-1.5 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TRUST & SAFETY REPORTS */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl p-6 border border-[#DFCEBD] shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1E1919]">
              Trust & Safety Reports
            </h3>

            {reports.length === 0 ? (
              <div className="text-center py-10 text-stone-400 text-xs">
                No active Trust & Safety violation reports filed. Sanctuary is peaceful.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DFCEBD] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-[#1E1919]">
                        Target Candidate: {rep.targetUserName || rep.targetUserId}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {rep.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-[#5B4F48]">
                      <strong>Violation Reason:</strong> {rep.reason}
                    </div>
                    <p className="text-xs text-stone-600 italic bg-white p-2.5 rounded-xl border border-stone-200">
                      "{rep.details}"
                    </p>

                    {rep.actionTaken && (
                      <div className="text-[11px] text-emerald-800 font-medium">
                        Resolution: {rep.actionTaken}
                      </div>
                    )}

                    {rep.status !== 'resolved' && (
                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          onClick={() => handleResolveReport(rep.id)}
                          className="px-4 py-1.5 rounded-full bg-[#4E051A] text-white text-xs font-semibold hover:bg-[#680C25] cursor-pointer"
                        >
                          Resolve & Issue Warning
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: MEMBERSHIPS */}
        {activeTab === 'memberships' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#DFCEBD] shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#1E1919]">
                Active Membership Plan Specifications
              </h3>
              <p className="text-xs text-stone-500">
                All Free memberships have been completely decommissioned. Only verified, paying matrimonial patrons are permitted.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#DFCEBD] space-y-2">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Basic Tier</div>
                  <div className="font-serif text-2xl font-bold text-[#4E051A]">₹189<span className="text-xs font-normal text-stone-500">/month</span></div>
                  <div className="text-xs text-stone-600">Active Patrons: <strong>512</strong></div>
                  <div className="text-xs text-stone-600">Monthly Yield: <strong>₹96,768</strong></div>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">Premium Tier</div>
                  <div className="font-serif text-2xl font-bold text-[#4E051A]">₹289<span className="text-xs font-normal text-stone-500">/month</span></div>
                  <div className="text-xs text-stone-600">Active Patrons: <strong>584</strong></div>
                  <div className="text-xs text-stone-600">Monthly Yield: <strong>₹1,68,776</strong></div>
                </div>

                <div className="p-5 rounded-2xl bg-[#4E051A]/5 border border-[#4E051A]/20 space-y-2">
                  <div className="text-xs font-bold text-[#4E051A] uppercase tracking-wider">VIP Imperial Tier</div>
                  <div className="font-serif text-2xl font-bold text-[#4E051A]">₹499<span className="text-xs font-normal text-stone-500">/month</span></div>
                  <div className="text-xs text-stone-600">Active Patrons: <strong>152</strong></div>
                  <div className="text-xs text-stone-600">Monthly Yield: <strong>₹75,848</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PAYMENTS & ORDERS */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl p-6 border border-[#DFCEBD] shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1E1919]">
              Razorpay Order Ledger & Invoices
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DFCEBD] text-stone-500 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Invoice / Order ID</th>
                    <th className="pb-3">Patron Name</th>
                    <th className="pb-3">Plan / Description</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Settled Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFCEBD]/40">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#FAF7F2]">
                      <td className="py-3 font-mono font-medium text-stone-800">
                        <div>{inv.id}</div>
                        <div className="text-[10px] text-stone-400">{inv.razorpayOrderId}</div>
                      </td>
                      <td className="py-3 text-stone-700 font-medium">{inv.customerName || 'Aadhavan Sharma'}</td>
                      <td className="py-3 text-stone-600">{inv.tier}</td>
                      <td className="py-3 text-stone-500">{inv.date}</td>
                      <td className="py-3 font-bold font-mono text-[#4E051A]">{inv.amount}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'Settled' ? 'bg-emerald-50 text-emerald-800' :
                          inv.status === 'Refunded' ? 'bg-stone-200 text-stone-700' :
                          'bg-amber-50 text-amber-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {inv.status === 'Settled' && (
                          <button
                            onClick={() => handleProcessRefund(inv.id)}
                            className="text-[10px] text-rose-700 hover:underline font-semibold cursor-pointer"
                          >
                            Process Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            
            {/* Create Coupon Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#DFCEBD] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1E1919]">
                Create Auspicious Concession Coupon
              </h3>

              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. DIWALI30"
                    className="w-full px-3 py-1.5 rounded-xl border border-[#DFCEBD] text-xs font-mono uppercase bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Concession Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#DFCEBD] text-xs bg-[#FAF7F2]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Rupee (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Discount Value</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#DFCEBD] text-xs bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#4E051A] hover:bg-[#680C25] text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Coupons Table */}
            <div className="bg-white rounded-3xl p-6 border border-[#DFCEBD] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1E1919]">
                Active Promotional Vouchers
              </h3>

              <div className="space-y-2">
                {coupons.map((c) => (
                  <div key={c.code} className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#DFCEBD] flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#4E051A]">{c.code}</span>
                      <span className="ml-3 text-xs text-stone-600">{c.description}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-semibold ${c.active ? 'text-emerald-700' : 'text-stone-400'}`}>
                        {c.active ? 'Active' : 'Disabled'}
                      </span>
                      <button
                        onClick={() => handleToggleCoupon(c.code)}
                        className="px-3 py-1 rounded-full border border-stone-300 text-xs text-stone-700 hover:bg-white cursor-pointer"
                      >
                        {c.active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 8: REFUNDS DESK */}
        {activeTab === 'refunds' && (
          <div className="bg-white rounded-3xl p-6 border border-[#DFCEBD] shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1E1919]">
              Sanctuary Refunds & Disputes Desk
            </h3>
            <p className="text-xs text-stone-500">
              Complies with Razorpay API automated reversal protocol within 5–7 business days to customer source VPA or card.
            </p>

            <div className="space-y-3">
              {invoices.filter(i => i.status === 'Refunded').length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No refunded transactions recorded.
                </div>
              ) : (
                invoices.filter(i => i.status === 'Refunded').map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-mono font-bold text-stone-800">{r.id}</div>
                      <div className="text-stone-500">{r.tier} • {r.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-rose-700">Refunded {r.amount}</div>
                      <div className="text-[10px] text-stone-400">Reversal Settled</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 9: SUPPORT TICKETS */}
        {activeTab === 'support' && (
          <div className="bg-white rounded-3xl p-6 border border-[#DFCEBD] shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1E1919]">
              Patron Concierge Inquiries & Support Tickets
            </h3>

            <div className="space-y-3">
              {supportTickets.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DFCEBD] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-serif font-bold text-sm text-[#1E1919]">
                      [{t.id}] {t.subject}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {t.priority} Priority
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200">
                    "{t.message}"
                  </p>

                  <div className="flex justify-between items-center text-xs pt-1 text-stone-500">
                    <span>Filed by: <strong>{t.userName}</strong> ({t.userEmail}) • {t.date}</span>
                    <button
                      onClick={() => showBanner(`Ticket ${t.id} replied & resolved.`)}
                      className="px-4 py-1 rounded-full bg-[#4E051A] text-white text-xs font-medium hover:bg-[#680C25] cursor-pointer"
                    >
                      Reply & Mark Resolved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
