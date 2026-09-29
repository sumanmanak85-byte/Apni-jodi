import { ChatMessage } from '../types';

export interface ConversationThread {
  matchId: string;
  messages: ChatMessage[];
  unreadCount: number;
}

const INITIAL_THREADS: Record<string, ChatMessage[]> = {
  'meera-sen-delhi': [
    {
      id: 'm1',
      matchId: 'meera-sen-delhi',
      sender: 'match',
      text: 'Namaste Aadhavan! It is a pleasure to connect with someone who shares an appreciation for timeless art and classical heritage.',
      time: '10:30 AM',
      isRead: true,
      delivered: true
    },
    {
      id: 'm2',
      matchId: 'meera-sen-delhi',
      sender: 'user',
      text: 'Namaste Meera! Delighted as well. I noticed your work restoring 17th-century miniature manuscripts in Delhi. That level of dedication requires immense patience.',
      time: '10:38 AM',
      isRead: true,
      delivered: true
    },
    {
      id: 'm3',
      matchId: 'meera-sen-delhi',
      sender: 'match',
      text: 'Indeed, it takes weeks of painstaking pigment analysis. My family in Jor Bagh has always revered traditional roots while encouraging progressive scholarship.',
      time: '10:41 AM',
      isRead: true,
      delivered: true
    },
    {
      id: 'm4',
      matchId: 'meera-sen-delhi',
      sender: 'match',
      text: 'The restoration of the 17th-century Mughal miniature was finally authenticated this morning! Would love to hear about your product architecture projects too.',
      time: 'Yesterday',
      isRead: false,
      delivered: true
    }
  ],
  'kabir-mehta-mumbai': [
    {
      id: 'km1',
      matchId: 'kabir-mehta-mumbai',
      sender: 'match',
      text: 'Greetings! Your focus on technology with ethical roots stood out immediately.',
      time: '10:15 AM',
      isRead: true,
      delivered: true
    },
    {
      id: 'km2',
      matchId: 'kabir-mehta-mumbai',
      sender: 'user',
      text: 'Thank you Kabir. We build systems that preserve integrity above all else. Are you currently based in South Mumbai?',
      time: '10:20 AM',
      isRead: true,
      delivered: true
    },
    {
      id: 'km3',
      matchId: 'kabir-mehta-mumbai',
      sender: 'match',
      text: 'Would love to discuss our shared appreciation for classical Gujarati architecture over Sunday tea.',
      time: '10:42 AM',
      isRead: false,
      delivered: true
    }
  ]
};

class ChatStore {
  private threads: Record<string, ChatMessage[]> = INITIAL_THREADS;
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem('apni_jodi_chat_threads', JSON.stringify(this.threads));
    } catch {}
    this.notify();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('apni_jodi_chat_threads');
      if (stored) {
        this.threads = JSON.parse(stored);
      }
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

  public getMessages(matchId: string): ChatMessage[] {
    return this.threads[matchId] || [];
  }

  public sendMessage(matchId: string, text: string, sender: 'user' | 'match' = 'user'): ChatMessage {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      matchId,
      sender,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      delivered: true
    };

    if (!this.threads[matchId]) {
      this.threads[matchId] = [];
    }

    this.threads[matchId].push(newMessage);
    this.saveToStorage();

    // Auto simulated reply from match candidate for interactive feel
    if (sender === 'user') {
      setTimeout(() => {
        this.autoReply(matchId);
      }, 2500);
    }

    return newMessage;
  }

  private autoReply(matchId: string) {
    const replies: Record<string, string[]> = {
      'meera-sen-delhi': [
        'That is deeply insightful. My parents and I were just speaking of how important shared cultural rhythms are in marriage.',
        'I appreciate your thoughtful response. Would you be open to exchanging numbers through our mutual consent escrow?',
        'Very well said. In our home, open intellectual dialogue and respect for elders go hand in hand.'
      ],
      'kabir-mehta-mumbai': [
        'Agreed. Aligning long-term visions early prevents any dissonance later.',
        'I have authorized phone disclosure on my end whenever you feel the timing is right.',
        'Sundays at the National Centre for the Performing Arts (NCPA) is my favorite sanctuary in Mumbai.'
      ]
    };

    const matchReplies = replies[matchId] || [
      'Thank you for sharing that so openly. It gives me great peace of mind.',
      'I completely resonate with your approach towards life and family values.'
    ];

    const randomReply = matchReplies[Math.floor(Math.random() * matchReplies.length)];

    const replyMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      matchId,
      sender: 'match',
      text: randomReply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      delivered: true
    };

    if (!this.threads[matchId]) {
      this.threads[matchId] = [];
    }
    this.threads[matchId].push(replyMsg);
    this.saveToStorage();
  }

  public markAsRead(matchId: string) {
    if (!this.threads[matchId]) return;
    this.threads[matchId] = this.threads[matchId].map(m => ({ ...m, isRead: true }));
    this.saveToStorage();
  }

  public deleteThread(matchId: string) {
    delete this.threads[matchId];
    this.saveToStorage();
  }
}

export const chatService = new ChatStore();
