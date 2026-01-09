import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Mic, MicOff, Package, Box, Gift, ArrowLeft, Plus, MessageSquare, ShoppingCart, Scale, Users, Sparkles, Youtube, History, X, Menu, Edit3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ChatBotNew.css';
import { formatCompaniesForDisplay, analyzeMarketGaps } from '../utils/csvParser';

// Generate unique message IDs to prevent React key conflicts
const generateUniqueId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Categories data structure based on CSV - Maps Goal + Role to Categories
const CATEGORIES_DATA = {
  'grow-revenue': {
    'founder-owner': [
      'Social media content (posts, ads, videos, product visuals)',
      'Get more leads from Google & website (SEO)',
      'Run Google and Meta ads + improve ROI',
      'Google Business Profile visibility',
      'Understanding why customers don\'t convert',
      'Selling on WhatsApp/Instagram',
      'Lead Qualification, Follow Up & Conversion',
      'Ecommerce Listing SEO + upsell bundles'
    ],
    'sales-marketing': [
      'Run Google and Meta ads + improve ROI',
      'Social media content (posts, ads, videos, product visuals)',
      'Get more leads from Google & website (SEO)',
      'Qualify & route leads automatically (AI SDR)',
      'Selling on WhatsApp/Instagram',
      'Improve Google Business Profile leads',
      'Write SEO Keyword, blogs and landing pages',
      'Write product titles that rank SEO',
      'Create ad creatives that convert',
      'Create upsell/cross-sell messaging'
    ],
    'ops-admin': [
      'Reduce missed leads with faster replies',
      'Improve order experience to boost repeats',
      'Call, Chat & Ticket Intelligence',
      'Smart CCTV: revenue/footfall insights (advanced)'
    ],
    'finance-legal': [
      'Spot profit leaks and improve margins',
      'Prevent revenue leakage from contracts (renewals, pricing, penalties)',
      'Speed up deal closure with faster contract review',
      'Sales & revenue forecasting'
    ],
    'hr-recruiting': [
      'Hire faster to support growth',
      'Find candidates faster (multi-source)',
      'Resume screening + shortlisting'
    ],
    'support-success': [
      'Improve retention and reduce churn',
      'Upsell/cross-sell recommendations',
      'Improve reviews and response quality',
      'Find why customers don\'t convert',
      'Call, Chat & Ticket Intelligence'
    ],
    'individual-student': [
      'Personal brand to get opportunities',
      'Business Idea Generation',
      'Trending Products'
    ]
  },
  'save-time': {
    'founder-owner': [
      'Automate lead capture into Sheets/CRM',
      'Draft proposals, quotes, and emails faster',
      'Extract data from PDFs/images to Sheets',
      'Automate procurement requests/approvals',
      '24/7 support assistant + escalation',
      'Automate order updates and tracking',
      'Summarize meetings + action items',
      'Automate HR or Finance'
    ],
    'sales-marketing': [
      'Auto-capture leads from forms/ads',
      'Mail + DM + influencer outreach automation',
      'Repurpose long videos into shorts',
      'Schedule posts + reuse content ideas',
      'Bulk update product listings/catalog',
      'Generate A+ store content at scale',
      'Auto-create weekly content calendar',
      'Auto-reply + follow-up sequences'
    ],
    'ops-admin': [
      'Automate repetitive admin workflows',
      'Excel and App script Automation',
      'Extract invoice/order data from PDFs',
      'Classify docs (invoice/contract/report)',
      'Auto-tag and organize documents',
      'Summarize meetings + send action items',
      'Automate procurement approvals',
      'Track orders + customer notifications',
      'Support ticket routing automation',
      'Smart CCTV: critical event alerts (advanced)'
    ],
    'finance-legal': [
      'Bookkeeping assistance + auto categorization',
      'Expense tracking + spend control automation',
      'Extract invoices/receipts from PDFs into Sheets',
      'Auto-generate client/vendor payment reminders',
      'Draft finance emails, reports, and summaries faster',
      'Extract key terms from contracts (payment, renewal, notice period)',
      'Automate contract approvals, renewals, and deadline reminders'
    ],
    'hr-recruiting': [
      'Automate interview scheduling',
      'Automate candidate follow-ups',
      'High-volume hiring coordination',
      'Onboarding checklists + HR support',
      'Draft job descriptions and outreach'
    ],
    'support-success': [
      '24/7 support assistant + escalation',
      'Auto-tag, route, and prioritize tickets',
      'Draft replies in brand voice',
      'Summarize calls/chats into CRM notes',
      'Build a support knowledge base',
      'WhatsApp/Instagram instant replies'
    ],
    'individual-student': [
      'Draft emails, reports, and proposals',
      'Summarize PDFs and long documents',
      'Extract data from PDFs/images',
      'Organize notes automatically'
    ]
  },
  'better-decisions': {
    'founder-owner': [
      'Instant sales dashboard (daily/weekly)',
      'Marketing performance dashboard (ROI)',
      'Build a knowledge base from SOPs',
      'Track competitors, pricing, and offers',
      'Market & industry trend summaries',
      'Predict demand & business outcomes',
      'Review sentiment → improvement ideas',
      'Churn & retention insights',
      'Cashflow + spend control dashboard'
    ],
    'sales-marketing': [
      'Campaign performance tracking dashboard',
      'Track calls, clicks, and form fills',
      'Call/chat/ticket insights from conversations',
      'Review sentiment + competitor comparisons',
      'Competitor monitoring & price alerts',
      'Market & trend research summaries',
      'Chat with past campaigns and assets'
    ],
    'ops-admin': [
      'Ops dashboard (orders, backlog, SLA)',
      'AI research summaries for decisions',
      'Predict demand and stock needs',
      'Supplier risk monitoring',
      'Delivery/logistics performance reporting',
      'Internal Q&A bot from SOPs/policies',
      'Industry best practice',
      'Customer Churn & Retention Insights'
    ],
    'finance-legal': [
      'Instant finance dashboard (monthly/weekly)',
      'Budget vs actual insights with variance alerts',
      'Cashflow forecast (30/60/90 days)',
      'Predict demand & business outcomes from past data',
      'Spend control alerts and trend insights',
      'Contract risk snapshot (high-risk clauses, obligations, renewals)',
      'Supplier risk and exposure tracking'
    ],
    'hr-recruiting': [
      'Hiring funnel dashboard',
      'Improve hire quality insights',
      'Interview feedback summaries',
      'HR knowledge base from policies',
      'Internal Q&A bot for HR queries',
      'Organize resumes and candidate notes'
    ],
    'support-success': [
      'Support SLA dashboard',
      'Call/chat/ticket intelligence insights',
      'Review sentiment + issue detection',
      'Churn & retention insights',
      'Brand monitoring & crisis alerts',
      'Search/chat across help docs',
      'Internal Q&A bot from SOPs'
    ],
    'individual-student': [
      'Weekly goals + progress summary',
      'Chat with your personal documents',
      'Auto-tag and organize your files',
      'Market & industry trend summaries'
    ]
  },
  'personal-growth': {
    'founder-owner': [
      'Plan weekly priorities and tasks',
      'Prep for pitches and presentations',
      'Personal branding content plan',
      'Create a learning plan + summaries',
      'Contract drafting & review support',
      'Team Spirit Action plan'
    ],
    'sales-marketing': [
      'Plan weekly priorities and tasks',
      'Prep for pitches and presentations',
      'Personal branding content plan',
      'Create a learning plan + summaries',
      'Contract drafting & review support',
      'Team Spirit Action plan'
    ],
    'ops-admin': [
      'Plan weekly priorities and tasks',
      'Prep for pitches and presentations',
      'Personal branding content plan',
      'Create a learning plan + summaries',
      'Contract drafting & review support',
      'Team Spirit Action plan'
    ],
    'finance-legal': [
      'Plan weekly priorities and tasks',
      'Prep for pitches and presentations',
      'Personal branding content plan',
      'Create a learning plan + summaries',
      'Contract drafting & review support',
      'Team Spirit Action plan'
    ],
    'hr-recruiting': [
      'Plan weekly priorities and tasks',
      'Interview prep + question practice',
      'Personal branding content plan',
      'Create a learning plan + summaries',
      'Contract drafting & review support',
      'Team Spirit Action plan'
    ],
    'support-success': [
      'Plan weekly priorities and tasks',
      'Prep for pitches and presentations',
      'Personal branding content plan',
      'Create a learning plan + summaries',
      'Contract drafting & review support',
      'Team Spirit Action plan'
    ],
    'individual-student': [
      'Plan weekly priorities and tasks',
      'Prep for pitches and presentations',
      'Personal branding content plan',
      'Create a learning plan + summaries',
      'Contract drafting & review support'
    ]
  }
};

// LocalStorage keys
const STORAGE_KEYS = {
  CHAT_HISTORY: 'ikshan-chat-history',
  USER_NAME: 'ikshan-user-name',
  USER_EMAIL: 'ikshan-user-email'
};

// Helper to safely parse JSON from localStorage
const getFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper to safely save to localStorage
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Storage might be full or disabled - fail silently
  }
};

const IdentityForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    onSubmit(name, email);
  };

  return (
    <div className="chat-identity-form">
      <form onSubmit={handleSubmit}>
        <div className="chat-form-group">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            className="chat-identity-input"
          />
        </div>
        <div className="chat-form-group">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            className="chat-identity-input"
          />
        </div>
        {error && <div className="chat-form-error">{error}</div>}
        <button type="submit" className="chat-action-btn primary">
          Continue →
        </button>
      </form>
    </div>
  );
};

const ChatBotNew = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      text: "✨ Welcome to Ikshan! 😊\n\nLet's find the perfect AI solution for you.",
      sender: 'bot',
      timestamp: new Date(),
      showGoalOptions: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedSubDomain, setSelectedSubDomain] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [requirement, setRequirement] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [flowStage, setFlowStage] = useState('goal');

  const [businessContext, setBusinessContext] = useState({
    businessType: null,
    industry: null,
    targetAudience: null,
    marketSegment: null
  });

  const [professionalContext, setProfessionalContext] = useState({
    roleAndIndustry: null,
    solutionFor: null,
    salaryContext: null
  });

  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Load chat history from localStorage on mount
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = getFromStorage(STORAGE_KEYS.CHAT_HISTORY, []);
    // Convert timestamp strings back to Date objects
    return saved.map(chat => ({
      ...chat,
      timestamp: new Date(chat.timestamp),
      messages: chat.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  });
  
  // Persist chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      saveToStorage(STORAGE_KEYS.CHAT_HISTORY, chatHistory);
    }
  }, [chatHistory]);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const recognitionRef = useRef(null);

  const domains = [
    { id: 'marketing', name: 'Marketing', emoji: '📢' },
    { id: 'sales-support', name: 'Sales and Customer Support', emoji: '📈' },
    { id: 'social-media', name: 'Social Media', emoji: '📱' },
    { id: 'legal', name: 'Legal', emoji: '⚖️' },
    { id: 'hr-hiring', name: 'HR and talent Hiring', emoji: '👥' },
    { id: 'finance', name: 'Finance', emoji: '💰' },
    { id: 'supply-chain', name: 'Supply chain', emoji: '🚚' },
    { id: 'research', name: 'Research', emoji: '🔬' },
    { id: 'data-analysis', name: 'Data Analysis', emoji: '📊' },
    { id: 'other', name: 'Other', emoji: '✨' }
  ];

  const goalOptions = [
    { id: 'grow-revenue', text: 'Grow Revenue', emoji: '📈' },
    { id: 'save-time', text: 'Save Time', emoji: '⏱️' },
    { id: 'better-decisions', text: 'Make Better Decisions', emoji: '🎯' },
    { id: 'personal-growth', text: 'Personal Growth', emoji: '🚀' }
  ];

  const roleOptions = [
    { id: 'founder-owner', text: 'Founder / Owner', emoji: '👔' },
    { id: 'sales-marketing', text: 'Sales / Marketing', emoji: '📈' },
    { id: 'ops-admin', text: 'Ops / Admin', emoji: '⚙️' },
    { id: 'finance-legal', text: 'Finance / Legal', emoji: '💼' },
    { id: 'hr-recruiting', text: 'HR / Recruiting', emoji: '👥' },
    { id: 'support-success', text: 'Support / Success', emoji: '🎧' },
    { id: 'individual-student', text: 'Individual / Student', emoji: '📚' },
    { id: 'other-role', text: 'Other (Please type below)', emoji: '✏️' }
  ];

  // State for custom role input
  const [customRole, setCustomRole] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  // Get categories based on selected goal and role
  const getCategoriesForSelection = useCallback(() => {
    if (!selectedGoal || !userRole) return [];
    const roleKey = userRole === 'other-role' ? 'individual-student' : userRole;
    return CATEGORIES_DATA[selectedGoal]?.[roleKey] || [];
  }, [selectedGoal, userRole]);

  const subDomains = {
    marketing: [
      'Getting more leads',
      'Replying to customers fast',
      'Following up properly',
      'Selling on WhatsApp/Instagram',
      'Reducing sales/agency cost',
      'Understanding why customers don\'t convert',
      'others'
    ],
    'sales-support': [
      'AI Sales Agent / SDR',
      'Customer Support Automation',
      'Conversational Chat & Voice Bots',
      'Lead Qualification & Conversion',
      'Customer Success & Retention',
      'Call, Chat & Ticket Intelligence',
      'others'
    ],
    'social-media': [
      'Content Creation & Scheduling',
      'Personal Branding & LinkedIn Growth',
      'Video Repurposing (Long → Short)',
      'Ad Creative & Performance',
      'Brand Monitoring & Crisis Alerts',
      'DM, Leads & Influencer Automation',
      'others'
    ],
    legal: [
      'Contract Drafting & Review AI',
      'CLM & Workflow Automation',
      'Litigation & eDiscovery AI',
      'Legal Research Copilot',
      'Legal Ops & Matter Management',
      'Case Origination & Lead Gen',
      'others'
    ],
    'hr-hiring': [
      'Find candidates faster',
      'Automate interviews',
      'High-volume hiring',
      'Candidate follow-ups',
      'Onboarding & HR help',
      'Improve hire quality',
      'others'
    ],
    finance: [
      'Bookkeeping & Accounting',
      'Expenses & Spend Control',
      'Virtual CFO & Insights',
      'Budgeting & Forecasting',
      'Finance Ops & Close',
      'Invoices & Compliance',
      'others'
    ],
    'supply-chain': [
      'Inventory & Demand',
      'Procurement Automation',
      'Supplier Risk',
      'Shipping & Logistics',
      'Track My Orders',
      'Fully Automated Ops',
      'others'
    ],
    research: [
      'Track My Competitors',
      'Find Market & Industry Trends',
      'Understand Customer Reviews & Sentiment',
      'Monitor Websites, Prices & Online Changes',
      'Predict Demand & Business Outcomes',
      'Get AI Research Summary & Insights',
      'others'
    ],
    'data-analysis': [
      'Lead Follow-up & Auto Reply',
      'Sales & Revenue Forecasting',
      'Customer Churn & Retention Insights',
      'Instant Business Dashboards',
      'Marketing & Campaign Performance Tracking',
      '24/7 Customer Support Assistant',
      'others'
    ]
  };

  // Use unique ID generator instead of counter to prevent key conflicts
  const getNextMessageId = () => generateUniqueId();

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        setIsRecording(false);
        // Provide user-friendly error messages
        switch (event.error) {
          case 'no-speech':
            setSpeechError('No speech detected. Please try again.');
            break;
          case 'not-allowed':
            setSpeechError('Microphone access denied. Please enable microphone permissions.');
            break;
          case 'network':
            setSpeechError('Network error. Please check your connection.');
            break;
          default:
            setSpeechError('Voice recognition failed. Please try again.');
        }
        // Auto-clear error after 3 seconds
        setTimeout(() => setSpeechError(null), 3000);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      setVoiceSupported(true);
    }
  }, []);

  // Initialize Google Sign-In
  useEffect(() => {
    const checkGoogleLoaded = setInterval(() => {
      if (window.google?.accounts?.id) {
        setIsGoogleLoaded(true);
        clearInterval(checkGoogleLoaded);
      }
    }, 100);

    setTimeout(() => clearInterval(checkGoogleLoaded), 5000);

    return () => clearInterval(checkGoogleLoaded);
  }, []);

  const handleGoogleSignIn = () => {
    if (!isGoogleLoaded || !window.google?.accounts?.id) {
      // Show error message instead of causing infinite reload loop
      const errorMessage = {
        id: generateUniqueId(),
        text: '⚠️ Google Sign-In is not available right now. You can continue without signing in.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setShowAuthModal(false);
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      // Show configuration error instead of reloading
      const errorMessage = {
        id: generateUniqueId(),
        text: '⚠️ Sign-in is not configured. Please continue without signing in.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setShowAuthModal(false);
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleCallback,
    });

    window.google.accounts.id.prompt();
  };

  const handleGoogleCallback = (response) => {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    setUserName(payload.name);
    setUserEmail(payload.email);
    setShowAuthModal(false);

    setSelectedDomain(null);
    setSelectedSubDomain(null);
    setUserRole(null);
    setRequirement(null);
    setBusinessContext({
      businessType: null,
      industry: null,
      targetAudience: null,
      marketSegment: null
    });
    setProfessionalContext({
      roleAndIndustry: null,
      solutionFor: null,
      salaryContext: null
    });
    setFlowStage('domain');

    const botMessage = {
      id: messageIdCounter.current++,
      text: `Welcome back, ${payload.name}! 🚀\n\nLet's explore another idea. Pick a domain to get started:`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleStartNewIdea = () => {
    // Save current chat to history if there are messages beyond the initial welcome
    if (messages.length > 1) {
      const userMessages = messages.filter(m => m.sender === 'user');
      const goalLabel = goalOptions.find(g => g.id === selectedGoal)?.text || '';
      const chatTitle = goalLabel || userMessages[0]?.text?.slice(0, 30) || 'New Chat';
      const lastUserMessage = userMessages[userMessages.length - 1]?.text || '';
      
      const newHistoryItem = {
        id: `chat-${Date.now()}`,
        title: chatTitle,
        preview: lastUserMessage.slice(0, 80) + (lastUserMessage.length > 80 ? '...' : ''),
        timestamp: new Date(),
        domain: selectedCategory || 'General',
        messages: [...messages]
      };
      
      setChatHistory(prev => [newHistoryItem, ...prev]);
    }

    // Reset all state for new chat
    setSelectedGoal(null);
    setSelectedDomain(null);
    setSelectedSubDomain(null);
    setUserRole(null);
    setRequirement(null);
    setUserName(null);
    setUserEmail(null);
    setCustomRole('');
    setSelectedCategory(null);
    setCustomCategoryInput('');
    setBusinessContext({
      businessType: null,
      industry: null,
      targetAudience: null,
      marketSegment: null
    });
    setProfessionalContext({
      roleAndIndustry: null,
      solutionFor: null,
      salaryContext: null
    });
    setFlowStage('goal');

    // Start fresh with welcome message
    const welcomeMessage = {
      id: getNextMessageId(),
      text: "✨ Welcome to Ikshan! 😊\n\nLet's find the perfect AI solution for you.",
      sender: 'bot',
      timestamp: new Date(),
      showGoalOptions: true
    };
    setMessages([welcomeMessage]);
  };

  // Handle goal selection (Question 1)
  const handleGoalClick = (goal) => {
    setSelectedGoal(goal.id);

    const userMessage = {
      id: getNextMessageId(),
      text: `${goal.emoji} ${goal.text}`,
      sender: 'user',
      timestamp: new Date()
    };

    const botMessage = {
      id: getNextMessageId(),
      text: `Great choice! You want to **${goal.text.toLowerCase()}**. 🎯\n\nNow, which best describes you?`,
      sender: 'bot',
      timestamp: new Date(),
      showRoleOptions: true
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setFlowStage('role');

    saveToSheet(`Selected Goal: ${goal.text}`, '', '', '');
  };

  // Handle role selection (Question 2)
  const handleRoleClick = (role) => {
    setUserRole(role.id);

    const userMessage = {
      id: getNextMessageId(),
      text: `${role.emoji} ${role.text}`,
      sender: 'user',
      timestamp: new Date()
    };

    if (role.id === 'other-role') {
      // Show input for custom role
      setFlowStage('custom-role');
      const botMessage = {
        id: getNextMessageId(),
        text: `No problem! Please tell us your role:\n\n**Type your role below:**`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage, botMessage]);
    } else {
      // Show categories based on goal + role
      setFlowStage('category');
      const categories = CATEGORIES_DATA[selectedGoal]?.[role.id] || [];
      const botMessage = {
        id: getNextMessageId(),
        text: `Perfect! 🎯\n\nBased on your selection, here are the categories where your problems might fall:\n\n**Select one that best matches your need:**`,
        sender: 'bot',
        timestamp: new Date(),
        showCategoryOptions: true,
        categories: categories
      };
      setMessages(prev => [...prev, userMessage, botMessage]);
    }

    saveToSheet(`User Role: ${role.text}`, '', '', '');
  };

  // Handle custom role submission
  const handleCustomRoleSubmit = (customRoleText) => {
    setCustomRole(customRoleText);

    const userMessage = {
      id: getNextMessageId(),
      text: customRoleText,
      sender: 'user',
      timestamp: new Date()
    };

    // Use individual-student categories as fallback for custom roles
    setFlowStage('category');
    const categories = CATEGORIES_DATA[selectedGoal]?.['individual-student'] || [];
    const botMessage = {
      id: getNextMessageId(),
      text: `Thanks! As a **${customRoleText}**, here are some categories that might help:\n\n**Select one that best matches your need:**`,
      sender: 'bot',
      timestamp: new Date(),
      showCategoryOptions: true,
      categories: categories
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    saveToSheet(`Custom Role: ${customRoleText}`, '', '', '');
  };

  // Handle category selection (Question 3)
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    const userMessage = {
      id: getNextMessageId(),
      text: `📌 ${category}`,
      sender: 'user',
      timestamp: new Date()
    };

    // Move to requirement/identity stage
    setFlowStage('requirement');
    const botMessage = {
      id: getNextMessageId(),
      text: `Excellent choice! 🚀\n\nYou're looking to work on: **${category}**\n\n**Please share more details about your specific problem or what you want to achieve:**\n\n_(Tell me in 2-3 lines so I can find the best solutions for you)_`,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    saveToSheet(`Selected Category: ${category}`, '', '', '');
  };

  // Handle "Type here" button click - skip category selection
  const handleTypeCustomProblem = () => {
    const userMessage = {
      id: getNextMessageId(),
      text: `✏️ I'll describe my problem`,
      sender: 'user',
      timestamp: new Date()
    };

    setFlowStage('requirement');
    const botMessage = {
      id: getNextMessageId(),
      text: `No problem! 🚀\n\n**Please describe what you're trying to achieve or the problem you want to solve:**\n\n_(Tell me in 2-3 lines so I can find the best solutions for you)_`,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    saveToSheet(`User chose to type custom problem`, '', '', '');
  };

  // Handle custom category input
  const handleCustomCategorySubmit = (customText) => {
    setSelectedCategory(customText);
    setCustomCategoryInput('');

    const userMessage = {
      id: getNextMessageId(),
      text: `📝 ${customText}`,
      sender: 'user',
      timestamp: new Date()
    };

    setFlowStage('requirement');
    const botMessage = {
      id: getNextMessageId(),
      text: `Got it! 🚀\n\nYou're looking to work on: **${customText}**\n\n**Please share more details about your specific problem:**\n\n_(Tell me in 2-3 lines so I can find the best solutions for you)_`,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    saveToSheet(`Custom Category: ${customText}`, '', '', '');
  };

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  // Legacy domain/subdomain handlers - kept for backward compatibility but not used in new flow
  const handleDomainClick = (domain) => {
    setSelectedDomain(domain);
    // Domain selection is no longer part of main flow, but kept for potential future use
    saveToSheet(`Selected Domain: ${domain.name}`, '', domain.name, '');
  };

  const handleSubDomainClick = (subDomain) => {
    setSelectedSubDomain(subDomain);
    saveToSheet(`Selected Sub-domain: ${subDomain}`, '', selectedDomain?.name, subDomain);
  };

  const handleRoleQuestion = (answer) => {
    const userMessage = {
      id: getNextMessageId(),
      text: answer,
      sender: 'user',
      timestamp: new Date()
    };

    // Simplified role question handling for new flow
    setFlowStage('requirement');
    const botMessage = {
      id: getNextMessageId(),
      text: `Got it! 👍\n\n**What specific problem are you trying to solve right now?**\n\n_(Tell me in 2-3 lines what challenge you're facing and what success would look like for you)_`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage, botMessage]);
    saveToSheet(`Role Question Answer: ${answer}`, '', '', '');
  };

  const saveToSheet = async (userMessage, botResponse, domain = '', subdomain = '') => {
    try {
      await fetch('/api/save-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage,
          botResponse,
          timestamp: new Date().toISOString(),
          userName: userName || 'Pending',
          userEmail: userEmail || 'Pending',
          domain: domain || selectedDomain?.name || '',
          subdomain: subdomain || selectedSubDomain || '',
          requirement: requirement || ''
        })
      });
    } catch (error) {
      console.error('Error saving to sheet:', error);
    }
  };

  const handleLearnImplementation = async (companies, userRequirement) => {
    setIsTyping(true);

    const loadingMessage = {
      id: getNextMessageId(),
      text: "Let me put together a comprehensive implementation guide with practical steps you can start using right away...",
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, loadingMessage]);

    const userType = userRole?.text || 'General user';
    const businessType = businessContext.businessType || '[YOUR BUSINESS TYPE]';
    const industry = businessContext.industry || '[YOUR INDUSTRY]';
    const targetAudience = businessContext.targetAudience || '[YOUR TARGET AUDIENCE]';
    const marketSegment = businessContext.marketSegment || '[YOUR MARKET SEGMENT]';
    const roleAndIndustry = professionalContext.roleAndIndustry || '[YOUR ROLE & INDUSTRY]';
    const solutionFor = professionalContext.solutionFor || '[YOURSELF/TEAM/COMPANY]';
    const domainName = selectedDomain?.name || '[YOUR DOMAIN]';
    const subDomainName = selectedSubDomain || '[YOUR FOCUS AREA]';
    const topTool = companies[0];

    const contextForPrompts = userRole?.id === 'business-owner'
      ? `I run a ${businessType} in the ${industry} industry. My target audience is ${targetAudience} and I serve ${marketSegment}.`
      : userRole?.id === 'professional'
      ? `I'm a ${roleAndIndustry}. I'm looking for a solution ${solutionFor}.`
      : userRole?.id === 'freelancer'
      ? `I'm a freelancer doing ${businessType}. My main challenge is ${targetAudience}.`
      : `I'm exploring solutions in ${domainName}.`;

    const starterPrompts = `
---

## 🎯 START RIGHT NOW - Copy-Paste These Prompts into ChatGPT/Claude

**These prompts are pre-filled with YOUR context. Copy, paste, and get instant results!**

---

### 📋 Prompt 1: Clarify Your Problem (Decision-Ready Spec)

\`\`\`
You are my senior operations analyst. Convert my situation into a decision-ready one-page spec with zero fluff.

CONTEXT (messy notes): ${contextForPrompts} My problem: ${userRequirement}
GOAL (desired outcome): [DESCRIBE WHAT SUCCESS LOOKS LIKE]
WHO IT AFFECTS (users/teams): ${userRole?.id === 'business-owner' ? targetAudience : userRole?.id === 'professional' ? solutionFor : '[WHO USES THIS]'}
CONSTRAINTS (time/budget/tools/policy): [LIST YOUR CONSTRAINTS]
WHAT I'VE TRIED (if any): [PAST ATTEMPTS OR "None yet"]
DEADLINE/URGENCY: [WHEN DO YOU NEED THIS SOLVED?]

Deliver exactly these sections:

1) One-sentence problem statement (include impact)
2) 3 user stories (Primary / Secondary / Admin)
3) Success metrics (3–5) with how to measure each
4) Scope:
   - In-scope (5 bullets)
   - Out-of-scope (5 bullets)
5) Requirements:
   - Must-have (top 5, testable)
   - Nice-to-have (top 5)
6) Constraints & assumptions (bulleted)
7) Top risks + mitigations (5)
8) "First 48 hours" plan (3 concrete actions)

Ask ONLY 3 clarifying questions if required. If not required, proceed with reasonable assumptions and list them.
\`\`\`

---

💡 **Pro tip:** Run Prompt 1 first to clarify your problem. You'll have real, usable outputs within 30 minutes!
`;

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

      const guideHeader = `## 🚀 Your Implementation Guide for ${topTool?.name || 'Your Solution'}

### 1️⃣ Where This Fits in Your Workflow

This solution helps at the **${subDomainName}** stage of your ${domainName} operations.

### 2️⃣ What to Prepare Before You Start (Checklist)

- ☐ **3-5 example documents/data** you currently work with
- ☐ **Current workflow steps** written out
- ☐ **Edge cases list** - situations that don't fit the norm
- ☐ **Success metric** - What does "solved" look like?
- ☐ **Constraints** - Budget, timeline, compliance requirements
`;

      if (!apiKey) {
        const fallbackGuide = {
          id: getNextMessageId(),
          text: guideHeader + starterPrompts,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fallbackGuide]);
        setIsTyping(false);
        return;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `Create a brief implementation guide for ${topTool?.name || 'the solution'}` },
            { role: 'user', content: `Create an implementation guide for: "${userRequirement}"` }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (response.ok) {
        const data = await response.json();
        const personalizedHeader = data.choices[0]?.message?.content || guideHeader;

        const guideMessage = {
          id: getNextMessageId(),
          text: personalizedHeader + starterPrompts,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, guideMessage]);
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Error generating implementation guide:', error);
      const errorMessage = {
        id: getNextMessageId(),
        text: guideHeader + starterPrompts,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  const handleIdentitySubmit = async (name, email) => {
    setUserName(name);
    setUserEmail(email);
    setFlowStage('complete');

    const botMessage = {
      id: getNextMessageId(),
      text: `Thank you, ${name}! Let me analyze existing solutions and suggest next steps...`,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(true);

    await saveToSheet(`User Identity: ${name} (${email})`, '', selectedDomain?.name, selectedSubDomain);

    setTimeout(async () => {
      try {
        const userContext = {
          role: userRole?.id,
          roleText: userRole?.text,
          ...(userRole?.id === 'business-owner' && {
            businessType: businessContext.businessType,
            industry: businessContext.industry,
            targetAudience: businessContext.targetAudience,
            marketSegment: businessContext.marketSegment
          }),
          ...(userRole?.id === 'professional' && {
            roleAndIndustry: professionalContext.roleAndIndustry,
            solutionFor: professionalContext.solutionFor,
            salaryContext: professionalContext.salaryContext
          }),
          ...(userRole?.id === 'freelancer' && {
            freelanceType: businessContext.businessType,
            challenge: businessContext.targetAudience
          })
        };

        const searchResponse = await fetch('/api/search-companies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            domain: selectedDomain?.id,
            subdomain: selectedSubDomain,
            requirement: requirement,
            userContext: userContext
          })
        });

        const searchData = await searchResponse.json();
        const relevantCompanies = searchData.companies || [];
        const helpfulResponse = searchData.helpfulResponse || '';

        let marketAnalysis = '';

        if (helpfulResponse) {
          marketAnalysis = `## Here's what I found for you\n\n${helpfulResponse}\n\n`;
        } else if (relevantCompanies.length > 0) {
          marketAnalysis = `## Here are some tools that could help\n\n`;
          relevantCompanies.forEach((company, i) => {
            marketAnalysis += `**${company.name}** - ${company.problem || company.description || 'An AI-powered solution that could help with your needs'}\n\n`;
          });
        } else {
          marketAnalysis = `## Let me help you\n\nI'm looking into the best tools for your needs in ${selectedDomain?.name || 'this area'}.\n\n`;
        }

        marketAnalysis += `---\n\nWhat would you like to do next?`;

        const finalOutput = {
          id: getNextMessageId(),
          text: marketAnalysis,
          sender: 'bot',
          timestamp: new Date(),
          showFinalActions: true,
          companies: relevantCompanies,
          userRequirement: requirement
        };

        setMessages(prev => [...prev, finalOutput]);
        setIsTyping(false);
        setFlowStage('complete'); // Mark journey as complete

        saveToSheet('Final Analysis Generated', finalOutput.text, selectedDomain?.name, selectedSubDomain);
      } catch (error) {
        console.error('Error generating market analysis:', error);

        const fallbackOutput = {
          id: getNextMessageId(),
          text: `## Market Analysis\n\nThank you for sharing your idea in the ${selectedDomain?.name} space!\n\n**We're excited to help bring your vision to life!** 💙`,
          sender: 'bot',
          timestamp: new Date(),
          showFinalActions: true
        };

        setMessages(prev => [...prev, fallbackOutput]);
        setIsTyping(false);
        setFlowStage('complete'); // Mark journey as complete
      }
    }, 2000);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: getNextMessageId(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    if (flowStage === 'domain') {
      const inputLower = currentInput.toLowerCase().trim();
      const matchedDomain = domains.find(d =>
        d.name.toLowerCase() === inputLower ||
        d.id.toLowerCase() === inputLower ||
        d.name.toLowerCase().includes(inputLower) ||
        inputLower.includes(d.name.toLowerCase())
      );

      if (matchedDomain) {
        handleDomainClick(matchedDomain);
        return;
      }

      setIsTyping(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentInput,
            persona: 'assistant',
            context: { isRedirecting: true }
          })
        });

        const data = await response.json();
        const aiAnswer = data.message || "I'm here to help!";

        const botMessage = {
          id: getNextMessageId(),
          text: `${aiAnswer}\n\nNow, to help you find the right business solution, please select a domain from the options below:`,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error calling AI:', error);

        const botMessage = {
          id: getNextMessageId(),
          text: `I'd love to help! To get started, please select a domain from the options below:`,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      } finally {
        setIsTyping(false);
      }

      return;
    }

    if (flowStage === 'subdomain') {
      const inputLower = currentInput.toLowerCase().trim();
      const availableSubDomains = subDomains[selectedDomain?.id] || [];
      const matchedSubDomain = availableSubDomains.find(sd =>
        sd.toLowerCase() === inputLower ||
        sd.toLowerCase().includes(inputLower) ||
        inputLower.includes(sd.toLowerCase())
      );

      if (matchedSubDomain) {
        handleSubDomainClick(matchedSubDomain);
        return;
      }

      setIsTyping(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentInput,
            persona: 'assistant',
            context: { isRedirecting: true, domain: selectedDomain?.name }
          })
        });

        const data = await response.json();
        const aiAnswer = data.message || "Great question!";

        const botMessage = {
          id: getNextMessageId(),
          text: `${aiAnswer}\n\nNow, please choose a specific area from the options below:`,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error calling AI:', error);

        const botMessage = {
          id: getNextMessageId(),
          text: `Great! Now please choose a specific area from the options below:`,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      } finally {
        setIsTyping(false);
      }

      return;
    }

    if (flowStage === 'other-domain') {
      setSelectedDomain({ id: 'other', name: currentInput, emoji: '✨' });
      setSelectedSubDomain(currentInput);
      setFlowStage('role');

      const botMessage = {
        id: getNextMessageId(),
        text: `Got it! **${currentInput}** - that's interesting! 🎯\n\nNow tell me a bit about yourself:`,
        sender: 'bot',
        timestamp: new Date(),
        showRoleOptions: true
      };

      setMessages(prev => [...prev, botMessage]);
      saveToSheet(`Custom Domain: ${currentInput}`, '', currentInput, currentInput);
      return;
    }

    if (flowStage.startsWith('role-q')) {
      setMessages(prev => prev.slice(0, -1));
      handleRoleQuestion(currentInput);
      return;
    }

    if (flowStage === 'requirement') {
      setRequirement(currentInput);
      setFlowStage('identity');

      const botMessage = {
        id: getNextMessageId(),
        text: `Please share your name and email address.`,
        sender: 'bot',
        timestamp: new Date(),
        showIdentityForm: true
      };

      setMessages(prev => [...prev, botMessage]);
      saveToSheet(`Requirement: ${currentInput}`, '', selectedDomain?.name, selectedSubDomain);
      return;
    }

    if (flowStage === 'identity') {
      const botMessage = {
        id: getNextMessageId(),
        text: `Please use the form above to enter your name and email.`,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      return;
    }

    if (flowStage === 'complete') {
      const botMessage = {
        id: getNextMessageId(),
        text: `Great! Feel free to explore more AI tools for different needs. Just click the button below to check another idea! 🚀`,
        sender: 'bot',
        timestamp: new Date(),
        showFinalActions: true
      };

      setMessages(prev => [...prev, botMessage]);
      return;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatHistoryTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleLoadChat = (chat) => {
    setMessages(chat.messages);
    setShowChatHistory(false);
    setFlowStage('complete');
  };

  return (
    <div className="chatbot-new-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="mobile-header-logo">
          <img src="/logo iskan 5.svg" alt="Ikshan Logo" className="mobile-logo-icon" />
          <span className="mobile-logo-title">Ikshan</span>
        </div>
        <button 
          className="mobile-history-btn" 
          onClick={() => setShowChatHistory(!showChatHistory)}
          aria-label="Chat history"
        >
          <History size={22} />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Desktop Header */}
      <header className="chatbot-new-header">
        <div className="header-logo-container">
          <img src="/logo iskan 5.svg" alt="Ikshan Logo" className="header-logo-icon" />
          <span className="header-logo-title">Ikshan</span>
        </div>
        <div className="header-nav-container">
          <h1 className="header-nav-title">Products Of Ikshan</h1>
          <div className="header-nav-marquee">
            <div className="header-nav-icons">
              <button className="nav-product-btn" aria-label="Ecom Listing Optimizer">
                <ShoppingCart size={20} />
                <span>Ecom Listing Optimizer</span>
              </button>
              <button className="nav-product-btn" aria-label="Legal Doc Classifier">
                <Scale size={20} />
                <span>Legal Doc Classifier</span>
              </button>
              <button className="nav-product-btn" aria-label="Sales & Support Bot">
                <Users size={20} />
                <span>Sales & Support Bot</span>
              </button>
              <button className="nav-product-btn" aria-label="AnyOCR">
                <Sparkles size={20} />
                <span>AnyOCR</span>
              </button>
              <button className="nav-product-btn" aria-label="Tube Helper">
                <Youtube size={20} />
                <span>Tube Helper</span>
              </button>
              {/* Duplicate for seamless loop */}
              <button className="nav-product-btn" aria-label="Ecom Listing Optimizer">
                <ShoppingCart size={20} />
                <span>Ecom Listing Optimizer</span>
              </button>
              <button className="nav-product-btn" aria-label="Legal Doc Classifier">
                <Scale size={20} />
                <span>Legal Doc Classifier</span>
              </button>
              <button className="nav-product-btn" aria-label="Sales & Support Bot">
                <Users size={20} />
                <span>Sales & Support Bot</span>
              </button>
              <button className="nav-product-btn" aria-label="AnyOCR">
                <Sparkles size={20} />
                <span>AnyOCR</span>
              </button>
              <button className="nav-product-btn" aria-label="Tube Helper">
                <Youtube size={20} />
                <span>Tube Helper</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="chatbot-new-main">
        {/* Sidebar */}
        <aside className={`chatbot-new-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-top-buttons">
            <button className="sidebar-new-chat-btn" onClick={() => { handleStartNewIdea(); setMobileMenuOpen(false); }}>
              <Plus size={18} />
              New Chat
            </button>
            <button className="sidebar-history-btn" onClick={() => { setShowChatHistory(true); setMobileMenuOpen(false); }}>
              <History size={18} />
              Chat History
            </button>
          </div>
          
          <div className="sidebar-user-profile">
            <span className="sidebar-user-name">{userName || 'user name'}</span>
            <div className="sidebar-user-avatar">
              <User size={40} />
            </div>
          </div>
        </aside>

        {/* Chat History Panel */}
        {showChatHistory && (
          <div className="chat-history-overlay" onClick={() => setShowChatHistory(false)}>
            <div className="chat-history-panel" onClick={(e) => e.stopPropagation()}>
              <div className="chat-history-header">
                <h2>Chat History</h2>
                <button className="chat-history-close" onClick={() => setShowChatHistory(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="chat-history-list">
                {chatHistory.map((chat) => (
                  <div 
                    key={chat.id} 
                    className="chat-history-item"
                    onClick={() => handleLoadChat(chat)}
                  >
                    <div className="chat-history-item-icon">
                      <MessageSquare size={20} />
                    </div>
                    <div className="chat-history-item-content">
                      <div className="chat-history-item-title">{chat.title}</div>
                      <div className="chat-history-item-preview">{chat.preview}</div>
                      <div className="chat-history-item-time">{formatHistoryTime(chat.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <main className="chatbot-new-chat-area">
          <div className="chat-main-content">
            {/* Typeform-style Full Screen Selection View */}
            {['goal', 'role', 'category', 'custom-role'].includes(flowStage) ? (
              <div className="typeform-view">
                {/* Question 1: What do you want to improve right now? */}
                {flowStage === 'goal' && (
                  <div className="typeform-question-container">
                    <div className="typeform-greeting">✨ Welcome to Ikshan! 😊</div>
                    <h1 className="typeform-question">What do you want to improve right now?</h1>
                    <p className="typeform-subtitle">Select what matters most to you:</p>
                    <div className="typeform-options">
                      {goalOptions.map((goal, index) => (
                        <button
                          key={goal.id}
                          className="typeform-option-btn"
                          onClick={() => handleGoalClick(goal)}
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <span className="option-emoji">{goal.emoji}</span>
                          {goal.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question 2: Which best describes you? */}
                {flowStage === 'role' && (
                  <div className="typeform-question-container">
                    <button className="typeform-back-btn" onClick={() => {
                      setSelectedGoal(null);
                      setFlowStage('goal');
                    }}>
                      <ArrowLeft size={20} />
                      Back
                    </button>
                    <h1 className="typeform-question">Which best describes you?</h1>
                    <p className="typeform-subtitle">This helps us find the most relevant solutions:</p>
                    <div className="typeform-options">
                      {roleOptions.map((role, index) => (
                        <button
                          key={role.id}
                          className="typeform-option-btn"
                          onClick={() => handleRoleClick(role)}
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <span className="option-emoji">{role.emoji}</span>
                          {role.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Role Input (when user selects "Other") */}
                {flowStage === 'custom-role' && (
                  <div className="typeform-question-container">
                    <button className="typeform-back-btn" onClick={() => {
                      setUserRole(null);
                      setFlowStage('role');
                    }}>
                      <ArrowLeft size={20} />
                      Back
                    </button>
                    <h1 className="typeform-question">Tell us about your role</h1>
                    <p className="typeform-subtitle">Please describe what you do:</p>
                    <div className="typeform-input-container">
                      <input
                        type="text"
                        className="typeform-text-input"
                        placeholder="e.g., Content Creator, Consultant, Teacher..."
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && customRole.trim()) {
                            handleCustomRoleSubmit(customRole.trim());
                          }
                        }}
                        autoFocus
                      />
                      <button 
                        className="typeform-submit-btn"
                        onClick={() => customRole.trim() && handleCustomRoleSubmit(customRole.trim())}
                        disabled={!customRole.trim()}
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* Question 3: In which category does your problem fall? */}
                {flowStage === 'category' && (
                  <div className="typeform-question-container">
                    <button className="typeform-back-btn" onClick={() => {
                      setUserRole(null);
                      setCustomRole('');
                      setFlowStage('role');
                    }}>
                      <ArrowLeft size={20} />
                      Back
                    </button>
                    <h1 className="typeform-question">In which category does your problem fall?</h1>
                    <p className="typeform-subtitle">Select the area where you need help:</p>
                    <div className="typeform-options category-grid">
                      {getCategoriesForSelection().map((category, index) => (
                        <button
                          key={index}
                          className="typeform-option-btn category-btn"
                          onClick={() => handleCategoryClick(category)}
                          style={{ animationDelay: `${index * 0.02}s` }}
                        >
                          <span className="option-emoji">📌</span>
                          {category}
                        </button>
                      ))}
                      {/* Type here button */}
                      <button
                        className="typeform-option-btn category-btn type-custom"
                        onClick={handleTypeCustomProblem}
                      >
                        <span className="option-emoji">✏️</span>
                        Type here (describe your problem)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Regular Chat View for typing stages */
              <div className="chat-messages-container" ref={messagesContainerRef}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-message ${message.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
                  >
                    <div className="chat-message-avatar">
                      {message.sender === 'user' ? (
                        <User size={20} />
                      ) : (
                        <Bot size={20} />
                      )}
                    </div>
                    <div className="chat-message-content">
                      <div className="chat-message-text">
                        {message.sender === 'bot' ? (
                          <ReactMarkdown>{message.text}</ReactMarkdown>
                        ) : (
                          message.text
                        )}
                      </div>
                      
                      {/* Identity Form */}
                      {message.showIdentityForm && (
                        <IdentityForm onSubmit={handleIdentitySubmit} />
                      )}
                      
                      {/* Final Actions */}
                      {message.showFinalActions && (
                        <div className="chat-action-buttons">
                          <button className="chat-action-btn primary" onClick={handleStartNewIdea}>
                            🚀 Check Another Idea
                          </button>
                          {message.companies && message.companies.length > 0 && (
                            <button
                                className="chat-action-btn secondary"
                                onClick={() => handleLearnImplementation(message.companies, message.userRequirement)}
                              >
                                📚 Learn How to Implement
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                {isTyping && (
                  <div className="chat-message bot-msg">
                    <div className="chat-message-avatar">
                      <Bot size={20} />
                    </div>
                    <div className="chat-message-content">
                      <div className="typing-indicator-new">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input - Only show when user needs to type (not during selection-based questions) */}
          {!['goal', 'role', 'category', 'custom-role'].includes(flowStage) && (
            <div className="chat-input-area">
              {/* Speech Error Toast */}
              {speechError && (
                <div className="speech-error-toast">
                  {speechError}
                </div>
              )}
              <div className="chat-input-wrapper">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isRecording ? "Listening..." : "Type your message here..."}
                  className="chat-text-input"
                  rows="1"
                />
                <button
                  onClick={voiceSupported ? toggleVoiceRecording : handleSend}
                  className={`chat-mic-btn ${isRecording ? 'recording' : ''}`}
                  aria-label={isRecording ? "Stop recording" : "Start voice input"}
                  title={isRecording ? "Stop recording" : "Click to speak"}
                >
                  {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Google Auth Modal */}
      {showAuthModal && (
        <div className="chat-auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="chat-auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="chat-auth-modal-close" onClick={() => setShowAuthModal(false)}>
              ✕
            </button>
            <div className="chat-auth-modal-content">
              <h2>Start Fresh</h2>
              <p>Sign in to save your progress and preferences</p>

              <button className="chat-google-signin-btn" onClick={handleGoogleSignIn}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="chat-auth-divider">
                <span>or</span>
              </div>

              <button className="chat-skip-auth-btn" onClick={() => window.location.reload()}>
                Continue without signing in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotNew;
