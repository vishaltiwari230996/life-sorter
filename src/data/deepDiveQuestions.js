// Guided Deep Dive Questions by Domain

export const deepDiveQuestions = {
  // Q1: Source - Where do leads/tasks come from?
  source: {
    question: 'Where do your leads/customers come from?',
    options: {
      marketing: [
        { id: 'facebook-ads', text: 'Facebook/Instagram Ads', emoji: '📱' },
        { id: 'google-ads', text: 'Google Ads', emoji: '🔍' },
        { id: 'website', text: 'Website Forms', emoji: '🌐' },
        { id: 'whatsapp', text: 'WhatsApp/DMs', emoji: '💬' },
        { id: 'referrals', text: 'Referrals', emoji: '🤝' },
        { id: 'cold-outreach', text: 'Cold Outreach', emoji: '📧' },
        { id: 'events', text: 'Events/Webinars', emoji: '🎤' },
        { id: 'other', text: 'Other', emoji: '✨' }
      ],
      'sales-support': [
        { id: 'website-chat', text: 'Website Chat', emoji: '💬' },
        { id: 'phone', text: 'Phone Calls', emoji: '📞' },
        { id: 'email', text: 'Email', emoji: '📧' },
        { id: 'social', text: 'Social Media', emoji: '📱' },
        { id: 'tickets', text: 'Support Tickets', emoji: '🎫' },
        { id: 'whatsapp', text: 'WhatsApp', emoji: '💬' },
        { id: 'other', text: 'Other', emoji: '✨' }
      ],
      'hr-hiring': [
        { id: 'job-portals', text: 'Job Portals (Naukri, Indeed)', emoji: '💼' },
        { id: 'linkedin', text: 'LinkedIn', emoji: '🔗' },
        { id: 'referrals', text: 'Employee Referrals', emoji: '🤝' },
        { id: 'campus', text: 'Campus Hiring', emoji: '🎓' },
        { id: 'agencies', text: 'Recruitment Agencies', emoji: '🏢' },
        { id: 'careers-page', text: 'Careers Page', emoji: '🌐' },
        { id: 'other', text: 'Other', emoji: '✨' }
      ],
      finance: [
        { id: 'invoices', text: 'Client Invoices', emoji: '📄' },
        { id: 'expenses', text: 'Team Expenses', emoji: '🧾' },
        { id: 'bank', text: 'Bank Transactions', emoji: '🏦' },
        { id: 'vendors', text: 'Vendor Bills', emoji: '📦' },
        { id: 'payroll', text: 'Payroll', emoji: '💰' },
        { id: 'other', text: 'Other', emoji: '✨' }
      ],
      'social-media': [
        { id: 'instagram', text: 'Instagram', emoji: '📸' },
        { id: 'facebook', text: 'Facebook', emoji: '📘' },
        { id: 'linkedin', text: 'LinkedIn', emoji: '💼' },
        { id: 'twitter', text: 'Twitter/X', emoji: '🐦' },
        { id: 'youtube', text: 'YouTube', emoji: '📺' },
        { id: 'tiktok', text: 'TikTok', emoji: '🎵' },
        { id: 'other', text: 'Other', emoji: '✨' }
      ],
      legal: [
        { id: 'contracts', text: 'Contracts', emoji: '📜' },
        { id: 'cases', text: 'Legal Cases', emoji: '⚖️' },
        { id: 'compliance', text: 'Compliance Docs', emoji: '✅' },
        { id: 'clients', text: 'Client Requests', emoji: '👥' },
        { id: 'court', text: 'Court Filings', emoji: '🏛️' },
        { id: 'other', text: 'Other', emoji: '✨' }
      ],
      default: [
        { id: 'email', text: 'Email', emoji: '📧' },
        { id: 'forms', text: 'Forms', emoji: '📋' },
        { id: 'calls', text: 'Phone Calls', emoji: '📞' },
        { id: 'chat', text: 'Chat/Messages', emoji: '💬' },
        { id: 'manual', text: 'Manual Entry', emoji: '✍️' },
        { id: 'other', text: 'Other', emoji: '✨' }
      ]
    }
  },

  // Q2: Volume - How many per day/week?
  volume: {
    question: 'How many do you handle?',
    options: [
      { id: '1-10', text: '1-10 per day', emoji: '📊' },
      { id: '10-50', text: '10-50 per day', emoji: '📈' },
      { id: '50-100', text: '50-100 per day', emoji: '🚀' },
      { id: '100+', text: '100+ per day', emoji: '💥' },
      { id: 'weekly', text: 'Few per week', emoji: '📅' },
      { id: 'not-sure', text: 'Not sure', emoji: '🤔' }
    ]
  },

  // Q3: Pain - What's the biggest problem?
  pain: {
    question: "What's your biggest pain right now?",
    options: {
      marketing: [
        { id: 'slow-response', text: 'Slow follow-up - leads go cold', emoji: '⏰' },
        { id: 'leads-lost', text: 'Leads slip through - I forget', emoji: '😵' },
        { id: 'no-tracking', text: "No visibility - don't know what's working", emoji: '📊' },
        { id: 'manual-work', text: 'Too much manual copy-paste', emoji: '🔄' },
        { id: 'expensive', text: 'Current tools too expensive', emoji: '💸' },
        { id: 'competitors', text: 'Competitors respond faster', emoji: '🏃' }
      ],
      'sales-support': [
        { id: 'slow-response', text: 'Slow response time', emoji: '⏰' },
        { id: 'missed-tickets', text: 'Missed tickets/requests', emoji: '🎫' },
        { id: 'no-history', text: 'No customer history', emoji: '📋' },
        { id: 'repetitive', text: 'Same questions daily', emoji: '🔄' },
        { id: 'scaling', text: "Can't scale support", emoji: '📈' },
        { id: 'handoff', text: 'Bad team handoffs', emoji: '🤝' }
      ],
      'hr-hiring': [
        { id: 'resume-overload', text: 'Too many resumes to screen', emoji: '📚' },
        { id: 'slow-screening', text: 'Screening takes forever', emoji: '⏰' },
        { id: 'scheduling', text: 'Interview scheduling nightmare', emoji: '📅' },
        { id: 'tracking', text: 'Losing track of candidates', emoji: '😵' },
        { id: 'quality', text: 'Bad quality candidates', emoji: '👎' },
        { id: 'communication', text: 'Candidate communication gaps', emoji: '💬' }
      ],
      finance: [
        { id: 'manual-entry', text: 'Manual data entry', emoji: '✍️' },
        { id: 'errors', text: 'Errors in calculations', emoji: '❌' },
        { id: 'late-payments', text: 'Late payment follow-ups', emoji: '⏰' },
        { id: 'no-visibility', text: 'No real-time visibility', emoji: '📊' },
        { id: 'reconciliation', text: 'Bank reconciliation pain', emoji: '🏦' },
        { id: 'reporting', text: 'Reporting takes too long', emoji: '📈' }
      ],
      'social-media': [
        { id: 'content-creation', text: 'Content creation takes forever', emoji: '⏰' },
        { id: 'consistency', text: "Can't post consistently", emoji: '📅' },
        { id: 'engagement', text: 'Low engagement', emoji: '👎' },
        { id: 'analytics', text: "Don't know what works", emoji: '📊' },
        { id: 'multiple-platforms', text: 'Managing multiple platforms', emoji: '🔄' },
        { id: 'ideas', text: 'Running out of ideas', emoji: '💡' }
      ],
      legal: [
        { id: 'document-review', text: 'Document review takes forever', emoji: '📄' },
        { id: 'tracking', text: 'Tracking deadlines', emoji: '⏰' },
        { id: 'research', text: 'Legal research is slow', emoji: '🔍' },
        { id: 'templates', text: 'Creating documents from scratch', emoji: '📝' },
        { id: 'compliance', text: 'Keeping up with compliance', emoji: '✅' },
        { id: 'organization', text: 'Document organization mess', emoji: '📚' }
      ],
      default: [
        { id: 'too-slow', text: 'Too slow - manual work takes hours', emoji: '⏰' },
        { id: 'things-slip', text: 'Things slip through the cracks', emoji: '😵' },
        { id: 'no-visibility', text: "No visibility - don't know status", emoji: '📊' },
        { id: 'repetitive', text: 'Doing same thing repeatedly', emoji: '🔄' },
        { id: 'too-many-tools', text: 'Too many disconnected tools', emoji: '🤯' },
        { id: 'expensive', text: 'Current solution too expensive', emoji: '💸' }
      ]
    }
  },

  // Q4: Time spent
  timeSpent: {
    question: 'How much time do you spend on this weekly?',
    options: [
      { id: 'less-1', text: 'Less than 1 hour', emoji: '⚡' },
      { id: '1-5', text: '1-5 hours', emoji: '⏱️' },
      { id: '5-10', text: '5-10 hours', emoji: '⏰' },
      { id: '10-20', text: '10-20 hours', emoji: '😰' },
      { id: '20+', text: '20+ hours', emoji: '😵' }
    ]
  },

  // Q5: Previous attempts
  previousAttempts: {
    question: 'Have you tried any solution before?',
    options: [
      { id: 'no', text: 'No, first time looking', emoji: '🆕' },
      { id: 'too-complex', text: 'Yes, tried but too complex', emoji: '😕' },
      { id: 'too-expensive', text: 'Yes, tried but too expensive', emoji: '💸' },
      { id: 'didnt-work', text: "Yes, didn't solve my problem", emoji: '🤷' },
      { id: 'spreadsheets', text: 'Using spreadsheets/manual', emoji: '📋' },
      { id: 'currently-using', text: 'Currently using something', emoji: '🔄' }
    ]
  },

  // Q6: Success goal
  successGoal: {
    question: 'What would make you happy?',
    options: [
      { id: 'save-time', text: 'Save time - automate tasks', emoji: '⚡' },
      { id: 'save-money', text: 'Save money - reduce costs', emoji: '💰' },
      { id: 'more-customers', text: 'Get more customers', emoji: '📈' },
      { id: 'better-insights', text: 'Better insights & tracking', emoji: '🎯' },
      { id: 'peace-of-mind', text: 'Peace of mind - runs without me', emoji: '😌' },
      { id: 'scale', text: 'Scale without hiring', emoji: '🚀' }
    ]
  }
};

// Helper to get questions for a domain
export const getQuestionsForDomain = (domain) => {
  return {
    source: {
      question: deepDiveQuestions.source.question,
      options: deepDiveQuestions.source.options[domain] || deepDiveQuestions.source.options.default
    },
    volume: deepDiveQuestions.volume,
    pain: {
      question: deepDiveQuestions.pain.question,
      options: deepDiveQuestions.pain.options[domain] || deepDiveQuestions.pain.options.default
    },
    timeSpent: deepDiveQuestions.timeSpent,
    previousAttempts: deepDiveQuestions.previousAttempts,
    successGoal: deepDiveQuestions.successGoal
  };
};
