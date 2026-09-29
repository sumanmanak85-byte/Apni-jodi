import { Profile, MutualConnection, InboundInterest, HandshakeStatus, InvoiceRecord, ChatMessage } from '../types';

export const LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1UkEEbvTsC5k-SLxNQDeNtMoTBUlukjMC5N3p4VDYRv92JWLUBtk4XcuzkfMOOnRrwAPLxxWsFiVruKroowtMBbWr8O0yATAH2iBTWz1hT034no9LmeTWqJRGM9deNKbQc0Dotw1KGBl5NHJDtiF2oxyR2b76KBunUzI3SBWEICHkebjKJzAE_aSKHnZ4Z0G3LFDGUUYccfw-qxfvQYQCaLHWOkX1S4i7Sz2cgwujQY0S2DuZR295KNkUPK';
export const USER_AVATAR = 'https://lh3.googleusercontent.com/aida/AEtjO1XPCAAc6Khc_bbxGwcAwf9P6sM7tv1uDokv9Wwgsp4yWLbwyoSPIKp9oWOvCOs0Xyi9xHa-sG_OzF29f26dmOCxkK-FYxupkxBhtl_2fFdaSRPen8GhEYw6gjXqx52tw_bKh-9-sBNgiN5BkjAFQFRz9F7nGslzwnotE3q1BWIYG_K7368SSAJIJ6VV3LR4CCXyhhnddYOsYOYjQg2H0eNM3b2sH57zvtesa0X4R9UcU7_d44KWYmtY-BSA';
export const CONCIERGE_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuACKAjHzlWi_qAvIPtwuLHac_oIA2KV4z-AjPHnNjJkmYDhvruTmYqMERZ2fnlR7noJs5icvH7fDpBj_3adJ041FXurx9xSWcqiPh2SPc-ILVj5w5Qvz5PqQFbh4yyrEKPedOsQvNsGIO_IWMvAGrYYzjKxWNYgEQFTEVQ4CxTzZBHtL_ewMwC6mXQMESsYqJSz0BVRs2Bp9iv1PnY9gLTwwyuif8cYt1QGzrbvizM1eOatKqQ6Mua6Eg';
export const HERO_COUPLE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVdTEbAPbvoGODk15mV8iGUmv6acgN5Da6DdpiER2PfSpJsUyJFsWJ32_WPd1ShvoXCa2kB6yfrC6S1ubst8MHvkNTP6MqFm1VmZC-sc_YGLLo5xHE0YZmTrWPkxogD1vIH5k52l_YMjACw93uzqocHJZIhe7vVtc1eM86O7NVWdT0vhci9bNwbkqjO4VNfqKQWrgGRP-KKkDF_-Em6xDftGYnpILmIPYAySPVYOFY30G2jFuVQqw3Fw';

export const FEATURED_PROFILES: Profile[] = [
  {
    id: 'kabir-sharma',
    name: 'Kabir Sharma',
    age: 29,
    city: 'Mumbai',
    profession: 'Lead Product Architect',
    education: 'CEPT Ahmedabad',
    community: 'Gujarati Hindu',
    matchScore: 94,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmCUQBJw3HAJVg4utZWrtbXYmrcQOkX5wvhFhjYQYWzmpDPTYgRCsgzky86zpbc5RUAgRca_a7JUq5b7yZpl38KmBAzWabSbUw625a3XXX7-fa78M4itgJCbpvgFJSGOeiDsn93PApMqOlDlzyxrnT03sPOp9E4AhE9Wg4mkF2QipSHdTliyv-uqvXnoVW8Pit7pesH6iO7V8MU0EHuohdkEhm7z4022RnRsGNYzIGIcWoScFl1apJsg',
    isVerified: true,
    bioQuote: 'Designing spaces that breathe and reflect timeless ancestral craftsmanship with sustainable urban minimalism.',
    passions: ['Indian Classical', 'Sahyadri Treks', 'Culinary Arts'],
    height: "5'11\"",
    diet: 'Vegetarian',
    smoking: 'Non-Smoker',
    statusTag: 'Respectful Consent'
  },
  {
    id: 'meera-sen',
    name: 'Meera Sen',
    age: 27,
    city: 'New Delhi',
    profession: 'Brand Strategist',
    education: 'Lady Shri Ram College',
    community: 'Bengali Brahmo',
    matchScore: 91,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv-r_7WiRKZW_tGUDTz4lBgk12i0yz2LRpmtpgzZGkPSXEWSdhSRYl7UMkDzAvRcqsIvpO4COSG0lQYclW6b8VI3nLurb4hHM_aPzdYRz9mk0hQyh82atBeCsmQCwxR9Wb4glot5Zj6bDz4cz07yzJpGR6G5tbhsqTkHjcJYt2_hcQDDAVlHl7APp1Q8Mo0bBeoreWGmEXsvca5mRjIOsPVZorRVQ5LkjV_veNgt8L5fAsD_P5XR082g',
    isVerified: true,
    bioQuote: 'Curating brand narratives by day and exploring vintage art galleries and classical Sufi poetry on quiet weekends.',
    passions: ['Literature', 'Heritage Travel', 'Vinyasa Yoga'],
    height: "5'6\"",
    diet: 'Mindful Vegetarian',
    smoking: 'Non-Smoker',
    statusTag: 'Photo Guarded'
  },
  {
    id: 'rohan-varma',
    name: 'Rohan Varma',
    age: 31,
    city: 'Bengaluru',
    profession: 'Fintech Founder',
    education: 'IIT Bombay • Stanford',
    community: 'Kayastha',
    matchScore: 89,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_5EsFZG4ltuoqR_RyNcDCBcUMDcbfprmj3CY3LHSUJhEBTq4jIKEoVVSsj-AKDbswN2OFJXmfhcTkswu-uuJNWMAkTQeS5Ni7MVR_28NbSr7dCXDT492mwMG09T9lFv0dcKfpiEzmJD7KS7SWczXpe74BoFLKAtwEuNSkhAfFxKK4hSBGcoJnhLIU0BIxlGXky02qmvaQNLoGD1D6RsBVxKyi9rQv0kzYUkn_E8IjJjcLTYZOHSe9pQ',
    isVerified: true,
    bioQuote: 'Building technology that empowers micro-entrepreneurs while grounding personal life in mountain trails and soulful filter coffee.',
    passions: ['Angel Investing', 'Tennis', 'Specialty Coffee'],
    height: "6'0\"",
    diet: 'Eggetarian',
    smoking: 'Non-Smoker',
    statusTag: 'Mutual Wave'
  },
  {
    id: 'tara-iyengar',
    name: 'Dr. Tara Iyengar',
    age: 28,
    city: 'Pune',
    profession: 'Neurologist',
    education: 'AIIMS New Delhi',
    community: 'Tamil Brahmin',
    matchScore: 96,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHQJYQS9t43DuZFZniBQXyARKWKag0m-1hstMrT40a1-athbw8Ov7GRAsECc4zC33diKbA7wG5NZRrh0AUn13WNJCou8kFiiv8RJ0fpZMqRyiA7sovrRHyyX61JKzgdyWNnd0J2nM6QWpRBeHTnoqg1TKwNjBY6zKhcaEx0UqPIRsyppAjbvnYqvda-Jbkqq_17dEWFIPnpAqQJt69wZPAg-urDFLP_WU1LTcyHIv6xcfbKX5rpMybjw',
    isVerified: true,
    bioQuote: 'Practicing regenerative medicine with deep devotion to Carnatic music rhythms and agro-forestry conservation.',
    passions: ['Piano', 'Neuroscience', 'Eco-Retreats'],
    height: "5'5\"",
    diet: 'Vegetarian',
    smoking: 'Teetotaler',
    statusTag: 'Respectful Consent'
  }
];

export const DISCOVER_HERO_PROFILE: Profile = {
  id: 'meera-sengupta',
  name: 'Meera Sengupta',
  age: 27,
  city: 'Greater Kailash II, South Delhi',
  profession: 'Brand Director, D2C Studio',
  education: 'M.Des, NID Ahmedabad',
  community: 'Bengali Brahmo',
  matchScore: 91,
  horoscopeScore: '31/36',
  image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop',
  secondaryImages: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop'
  ],
  isVerified: true,
  bioQuote: '“Creative strategist passionate about art galleries, quiet Sunday brunches, and soulful conversations.”',
  passions: ['Heritage Appreciation', 'Mindful Living', 'Hindustani Classical Vocalist', 'Art Direction'],
  height: "5'6\" (168 cm)",
  diet: 'Mindful Vegetarian',
  smoking: 'Non-Smoker',
  activeStatus: 'Active 2 hrs ago',
  relationshipIntent: 'Committed Marriage (1-2 yrs)'
};

export const NEARBY_PROFILES: Profile[] = [
  {
    id: 'kabir-29',
    name: 'Kabir',
    age: 29,
    city: 'Bandra West, Mumbai',
    profession: 'Principal Architect & Urban Designer',
    education: 'CEPT Alum',
    community: 'Gujarati Hindu',
    matchScore: 94,
    height: "5'11\"",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmCUQBJw3HAJVg4utZWrtbXYmrcQOkX5wvhFhjYQYWzmpDPTYgRCsgzky86zpbc5RUAgRca_a7JUq5b7yZpl38KmBAzWabSbUw625a3XXX7-fa78M4itgJCbpvgFJSGOeiDsn93PApMqOlDlzyxrnT03sPOp9E4AhE9Wg4mkF2QipSHdTliyv-uqvXnoVW8Pit7pesH6iO7V8MU0EHuohdkEhm7z4022RnRsGNYzIGIcWoScFl1apJsg',
    isVerified: true,
    bioQuote: 'Passionate about traditional courtyards and contemporary climate-resilient architecture.',
    passions: ['Aesthetic Eye', 'Non-Smoker', 'Heritage Architecture']
  },
  {
    id: 'ananya-28',
    name: 'Ananya',
    age: 28,
    city: 'Indiranagar, Bengaluru',
    profession: 'Fintech Product Lead & Writer',
    education: 'IIM Bangalore',
    community: 'Kayastha',
    matchScore: 89,
    height: "5'5\"",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv-r_7WiRKZW_tGUDTz4lBgk12i0yz2LRpmtpgzZGkPSXEWSdhSRYl7UMkDzAvRcqsIvpO4COSG0lQYclW6b8VI3nLurb4hHM_aPzdYRz9mk0hQyh82atBeCsmQCwxR9Wb4glot5Zj6bDz4cz07yzJpGR6G5tbhsqTkHjcJYt2_hcQDDAVlHl7APp1Q8Mo0bBeoreWGmEXsvca5mRjIOsPVZorRVQ5LkjV_veNgt8L5fAsD_P5XR082g',
    isVerified: true,
    bioQuote: 'Balancing fast-paced technology strategy with long-distance marathon endurance and Indian classical dance.',
    passions: ['Marathon Runner', 'Classical Dance', 'Literary Arts']
  },
  {
    id: 'siddharth-31',
    name: 'Siddharth',
    age: 31,
    city: 'Koregaon Park, Pune',
    profession: 'Biotech Founder & Pianist',
    education: 'IIT Delhi',
    community: 'Punjabi Khatri',
    matchScore: 92,
    height: "6'0\"",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_5EsFZG4ltuoqR_RyNcDCBcUMDcbfprmj3CY3LHSUJhEBTq4jIKEoVVSsj-AKDbswN2OFJXmfhcTkswu-uuJNWMAkTQeS5Ni7MVR_28NbSr7dCXDT492mwMG09T9lFv0dcKfpiEzmJD7KS7SWczXpe74BoFLKAtwEuNSkhAfFxKK4hSBGcoJnhLIU0BIxlGXky02qmvaQNLoGD1D6RsBVxKyi9rQv0kzYUkn_E8IjJjcLTYZOHSe9pQ',
    isVerified: true,
    bioQuote: 'Researching life sciences and spending evenings improvising ragas on the grand piano.',
    passions: ['Art Collector', 'Vegetarian', 'Classical Music']
  }
];

export const ACTIVE_MUTUAL_CONNECTIONS: MutualConnection[] = [
  {
    id: 'kabir-mehta',
    name: 'Kabir Mehta',
    age: 29,
    city: 'Mumbai',
    profession: 'Principal Architect (Self-Employed)',
    education: 'M.Arch, CEPT',
    community: 'Gujarati Hindu',
    matchScore: 96,
    horoscopeScore: '32/36',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmCUQBJw3HAJVg4utZWrtbXYmrcQOkX5wvhFhjYQYWzmpDPTYgRCsgzky86zpbc5RUAgRca_a7JUq5b7yZpl38KmBAzWabSbUw625a3XXX7-fa78M4itgJCbpvgFJSGOeiDsn93PApMqOlDlzyxrnT03sPOp9E4AhE9Wg4mkF2QipSHdTliyv-uqvXnoVW8Pit7pesH6iO7V8MU0EHuohdkEhm7z4022RnRsGNYzIGIcWoScFl1apJsg',
    quoteOrLatestMessage: '“I loved your family’s architectural philosophy in the dossier. Would love to send across my book on Chettinad courtyards.”',
    tag: 'Mutual Like 2d ago',
    hasBilateralSpark: true
  },
  {
    id: 'meera-sen-conn',
    name: 'Meera Sen',
    age: 27,
    city: 'New Delhi',
    profession: 'Global Brand Strategist',
    education: 'Lady Shri Ram',
    community: 'Bengali Brahmo',
    matchScore: 91,
    horoscopeScore: '29/36',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv-r_7WiRKZW_tGUDTz4lBgk12i0yz2LRpmtpgzZGkPSXEWSdhSRYl7UMkDzAvRcqsIvpO4COSG0lQYclW6b8VI3nLurb4hHM_aPzdYRz9mk0hQyh82atBeCsmQCwxR9Wb4glot5Zj6bDz4cz07yzJpGR6G5tbhsqTkHjcJYt2_hcQDDAVlHl7APp1Q8Mo0bBeoreWGmEXsvca5mRjIOsPVZorRVQ5LkjV_veNgt8L5fAsD_P5XR082g',
    quoteOrLatestMessage: '“My mother was genuinely touched reading your grandmother’s story in the ancestral section!”',
    latestMessageTime: 'Yesterday, 9:40 PM',
    tag: 'Active Conversation',
    hasBilateralSpark: true
  },
  {
    id: 'rohan-varma-conn',
    name: 'Rohan Varma',
    age: 31,
    city: 'Bengaluru',
    profession: 'Fintech Founder (Series B)',
    education: 'IIT Bombay, Stanford',
    community: 'Kayastha',
    matchScore: 89,
    horoscopeScore: '30/36',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_5EsFZG4ltuoqR_RyNcDCBcUMDcbfprmj3CY3LHSUJhEBTq4jIKEoVVSsj-AKDbswN2OFJXmfhcTkswu-uuJNWMAkTQeS5Ni7MVR_28NbSr7dCXDT492mwMG09T9lFv0dcKfpiEzmJD7KS7SWczXpe74BoFLKAtwEuNSkhAfFxKK4hSBGcoJnhLIU0BIxlGXky02qmvaQNLoGD1D6RsBVxKyi9rQv0kzYUkn_E8IjJjcLTYZOHSe9pQ',
    quoteOrLatestMessage: 'Match completed! Rohan initiated the connection this morning. Take the first step with an introductory formal letter.',
    tag: 'Matched Today',
    hasBilateralSpark: true
  },
  {
    id: 'tara-iyengar-conn',
    name: 'Dr. Tara Iyengar',
    age: 28,
    city: 'Pune',
    profession: 'Consultant Neurologist',
    education: 'MD, AIIMS',
    community: 'Tamil Brahmin',
    matchScore: 94,
    horoscopeScore: '34/36',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHQJYQS9t43DuZFZniBQXyARKWKag0m-1hstMrT40a1-athbw8Ov7GRAsECc4zC33diKbA7wG5NZRrh0AUn13WNJCou8kFiiv8RJ0fpZMqRyiA7sovrRHyyX61JKzgdyWNnd0J2nM6QWpRBeHTnoqg1TKwNjBY6zKhcaEx0UqPIRsyppAjbvnYqvda-Jbkqq_17dEWFIPnpAqQJt69wZPAg-urDFLP_WU1LTcyHIv6xcfbKX5rpMybjw',
    quoteOrLatestMessage: 'Mutual sparks ignited via shared passion for classical aesthetics and sustainable community medicine.',
    tag: 'Bilateral Spark Verified',
    hasBilateralSpark: true
  }
];

export const INBOUND_INTERESTS: InboundInterest[] = [
  {
    id: 'priyanka-desai',
    name: 'Priyanka Desai',
    age: 28,
    city: 'Delhi NCR',
    profession: 'Literary Agent',
    community: 'Hindu Vaishnav',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsYybXAZFq8wlyNEigyYNh5jzZX_1vfNLuJdvLuiO2haA0nUVWj7MyOvi0KrnLmK7T-utFzLnEXq4i6qmjt1cfTVtlyhthGgTDpaYlWdOShVJ8dsR3fXyJVV05YxZ7Q7xtNAVAVGPONpg2qKY3A4gQAn_wslodRAh9n_fH2U9X9IFF_r3jpS4za3mIRA-yv5-RSC1wPZ6XH-DCiXa_FjZclyBKLGrBC0ZinqCChCYxBRELmrsejCplBg',
    timeAgo: 'Sent 4 hrs ago',
    personalizedNote: '“Your reflections on classical literature and quiet weekend rituals resonated deeply with my own aspirations.”',
    familyValues: 'Moderate',
    lifestyle: 'Non-Smoker',
    govtIdVerified: true,
    status: 'pending'
  },
  {
    id: 'vikramaditya-rao',
    name: 'Vikramaditya Rao',
    age: 30,
    city: 'Hyderabad',
    profession: 'Staff Tech Lead',
    community: 'Telugu Kamma',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDegxMvbrU7v02HyeeGGZk_rn6p7LLAxKxD7sSvBbSl0ZbEtz2DuHOEp0gIGhF6pn2wtX85Lt67s28p-mNj_zrHRr_kkw-bz57OpfWDTGDkY2YNuFaxZ3XVgNDrit_Nc7RPfscaLGw8C1mOnRroVtgxCLMf6qQgv2rXj6CdSs_0nyW9i8fcvCb0Z1O_6tjJN22ayuo0AKnh_UfjdA6uD-YKXRiAundZd1FsFUnZz0cKHK4Cvb95ArQPzg',
    timeAgo: 'Sent 12 hrs ago',
    personalizedNote: '“Father is Retd. IAS Officer; mother is an educationist. Family values rooted in cultural arts and philanthropy.”',
    familyValues: 'Traditional & Cultured',
    lifestyle: 'Vegetarian • Govt ID: Aadhaar Verified',
    govtIdVerified: true,
    status: 'pending'
  },
  {
    id: 'avantika-joshi',
    name: 'Avantika Joshi',
    age: 29,
    city: 'London, UK',
    profession: 'Corporate Counsel',
    community: 'NRI Punjabi',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgy6E8OpOoQejyeIE85FgjgXf8XS0Eg4wajVhqeDxCLAmiT0n7w5CaqAkjgmNHBiFJrQdTofSahDkpVdS4LAN-hEANfjETyLg_NPdDTXzIqZaDgJ4k7Sd6JC8L3sU_Y40ffYQSKNEM_73Y028Leqjjpobn23VvgZ01v55djeh7nydfZlzUG2TZt4WHto6ewOLSdP6So_rR2JhGcoZk-6olwvZXolFP7INlsQl-aGp4enQT3qf0gB6AFA',
    timeAgo: 'Sent 1 day ago',
    personalizedNote: '“Open to relocation between London and Mumbai. LLM from Cambridge. Seeks thoughtful partner with global perspective.”',
    familyValues: 'Liberal Cosmopolitan',
    lifestyle: 'Passport Verified • Horoscope Compatible',
    govtIdVerified: true,
    horoscopeCompatible: true,
    status: 'pending'
  }
];

export const INITIAL_HANDSHAKES: HandshakeStatus[] = [
  {
    id: 'kabir-mehta-hs',
    initials: 'KM',
    name: 'Kabir Mehta',
    contactType: 'Primary Cell & Father’s Contact',
    progress: 50,
    consentsGranted: 1,
    statusText: 'Kabir authorized release • Your authorization needed',
    hasUserAuthorized: false
  },
  {
    id: 'meera-sen-hs',
    initials: 'MS',
    name: 'Meera Sen',
    contactType: 'Direct WhatsApp & Family Email',
    progress: 100,
    consentsGranted: 2,
    statusText: 'Released on 14 Oct, 2025',
    revealedDetail: '+91 98201 44829',
    hasUserAuthorized: true
  }
];

export const CHAT_HISTORY: ChatMessage[] = [
  {
    id: '1',
    sender: 'match',
    text: 'Namaste! It was wonderful to read through your reflection on family traditions and modern careers. Finding someone who values Sunday family brunches as much as personal ambition is rare.',
    time: '5:42 PM'
  },
  {
    id: '2',
    sender: 'user',
    text: 'Thank you, Kabir! That balance has always been central to how I grew up. I also noticed your keen interest in modern urban restoration and travel—especially your trips around Rajasthan.',
    time: '5:48 PM',
    isRead: true
  },
  {
    id: '3',
    sender: 'match',
    text: 'Rajasthan holds a deep place in my heart! The heritage courtyards inspire my architectural work everyday. If our conversations continue to feel so aligned, I’d be honored to arrange a comfortable call with you this weekend.',
    time: '6:15 PM'
  },
  {
    id: '4',
    sender: 'user',
    text: 'A weekend call sounds wonderful. I appreciate the deliberate pace we’ve maintained here. Let’s initiate the verified contact exchange protocol so we have direct numbers.',
    time: '11:15 AM',
    isRead: true
  },
  {
    id: '5',
    sender: 'match',
    text: 'I agree completely. I have approved sharing permissions on my end. Looking forward to taking our next thoughtful step together.',
    time: '11:22 AM'
  }
];

export const INVOICES: InvoiceRecord[] = [
  {
    id: 'INV-2025-0819',
    tier: 'VIP Royal Patron (Yearly)',
    note: 'Voucher code APNIJODI25 applied',
    date: 'Jan 12, 2025',
    amount: '₹3,178.92',
    status: 'Settled',
    category: 'memberships'
  },
  {
    id: 'INV-2024-4190',
    tier: 'Spotlight Boost Add-on',
    note: '7-Day High Intent Discovery',
    date: 'Oct 04, 2024',
    amount: '₹499.00',
    status: 'Settled',
    category: 'addons'
  },
  {
    id: 'INV-2024-1102',
    tier: 'Astrological Deep-Dive',
    note: 'Dual Horoscope Matching Matrix',
    date: 'Jul 28, 2024',
    amount: '₹899.00',
    status: 'Settled',
    category: 'addons'
  }
];

export const FAQS = [
  {
    q: 'How does Apni Jodi verify identity and prevent fake accounts?',
    a: 'We employ a strict two-tier verification process. First, users complete a confidential Government ID scan (such as Aadhaar, Passport, or Voter ID) via bank-grade encrypted verification APIs. Second, a mandatory live selfie verification is cross-referenced with profile photos. Unverified profiles cannot initiate conversations or view unblurred dossiers.'
  },
  {
    q: 'Will my colleagues or family members see my profile?',
    a: 'You possess granular sovereign control. Our Incognito Mode completely hides your profile from general browsing and search engines; only members you explicitly send interest to or match with can view your dossier. Additionally, our Photo Blur option shields your portrait until mutual interest is bilaterally established.'
  },
  {
    q: 'How is Apni Jodi different from casual dating apps or traditional matrimonial portals?',
    a: 'We eliminated mindless swipe fatigue and public biodata broadcasts. There is zero cold calling, zero data reselling, and no spammy parent bidding. Every profile is manually vetted, intentional adult singles connect directly with dignity, and family introductions occur with bilateral respect.'
  },
  {
    q: 'What is the age requirement to join?',
    a: 'Apni Jodi is strictly limited to consenting adults aged 18 and older. Our verification protocol requires official date of birth verification via government-issued identity documents prior to profile activation.'
  },
  {
    q: 'Can my parents manage my profile on my behalf?',
    a: 'Yes! During profile creation, you or your family can designate who is preparing the sacred dossier (Myself, Son, Daughter, Sibling, or Relative). Transparent stewardship tags indicate who stewards the account, while ensuring the prospective individual retains authentic choice.'
  }
];

export const TESTIMONIALS = [
  {
    stars: 5,
    quote: 'We both were exhausted by intrusive family agents on traditional sites. Apni Jodi allowed us to talk directly first, align on our career and spiritual values, and then introduce our families happily.',
    author: 'Shreya & Arpit',
    location: 'Gurugram • Matched July 2023',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop'
  },
  {
    stars: 5,
    quote: 'The mutual photo blur feature gave me the professional confidence to participate. Kabir understood my boundary immediately. Six months later, we found our forever in each other.',
    author: 'Divya & Siddharth',
    location: 'Bengaluru • Married Jan 2024',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  },
  {
    stars: 5,
    quote: 'The question bank on Apni Jodi isn’t just about biodata; it asks about how you handle conflicts and financial planning. That made all the difference for us.',
    author: 'Pooja & Tushar',
    location: 'Mumbai & London (NRI)',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  }
];
