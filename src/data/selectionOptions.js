// Selection options for new wizard steps

export const budgetOptions = [
  { id: 'free', text: 'Free only', emoji: '🆓', description: 'No budget, free tools only' },
  { id: 'low', text: 'Under ₹2,000/mo', emoji: '💵', description: 'Small budget' },
  { id: 'medium', text: '₹2,000 - ₹10,000/mo', emoji: '💰', description: 'Moderate budget' },
  { id: 'high', text: '₹10,000+/mo', emoji: '💎', description: 'Flexible budget' }
];

export const teamSizeOptions = [
  { id: 'solo', text: 'Just me', emoji: '👤', description: '1 person' },
  { id: 'small', text: '2-5 people', emoji: '👥', description: 'Small team' },
  { id: 'medium', text: '6-20 people', emoji: '🏢', description: 'Growing team' },
  { id: 'large', text: '20+ people', emoji: '🏭', description: 'Large team' }
];

export const currentToolsOptions = {
  common: [
    { id: 'gmail', name: 'Gmail', emoji: '📧' },
    { id: 'google-sheets', name: 'Google Sheets', emoji: '📊' },
    { id: 'google-docs', name: 'Google Docs', emoji: '📄' },
    { id: 'whatsapp', name: 'WhatsApp', emoji: '💬' },
    { id: 'slack', name: 'Slack', emoji: '💼' },
    { id: 'notion', name: 'Notion', emoji: '📝' },
    { id: 'excel', name: 'Excel', emoji: '📗' },
    { id: 'outlook', name: 'Outlook', emoji: '📬' }
  ],
  marketing: [
    { id: 'facebook-ads', name: 'Facebook Ads', emoji: '📱' },
    { id: 'google-ads', name: 'Google Ads', emoji: '🔍' },
    { id: 'mailchimp', name: 'Mailchimp', emoji: '🐵' },
    { id: 'hubspot', name: 'HubSpot', emoji: '🟠' },
    { id: 'canva', name: 'Canva', emoji: '🎨' }
  ],
  'sales-support': [
    { id: 'salesforce', name: 'Salesforce', emoji: '☁️' },
    { id: 'zoho', name: 'Zoho CRM', emoji: '📋' },
    { id: 'freshdesk', name: 'Freshdesk', emoji: '🎫' },
    { id: 'intercom', name: 'Intercom', emoji: '💬' },
    { id: 'pipedrive', name: 'Pipedrive', emoji: '📈' }
  ],
  'hr-hiring': [
    { id: 'linkedin', name: 'LinkedIn', emoji: '💼' },
    { id: 'naukri', name: 'Naukri', emoji: '👔' },
    { id: 'indeed', name: 'Indeed', emoji: '🔎' },
    { id: 'bamboohr', name: 'BambooHR', emoji: '🎋' }
  ],
  finance: [
    { id: 'tally', name: 'Tally', emoji: '📒' },
    { id: 'quickbooks', name: 'QuickBooks', emoji: '📚' },
    { id: 'razorpay', name: 'Razorpay', emoji: '💳' },
    { id: 'zoho-books', name: 'Zoho Books', emoji: '📖' }
  ],
  default: []
};

// Get tools for a specific domain (common + domain-specific)
export const getToolsForDomain = (domain) => {
  const domainTools = currentToolsOptions[domain] || currentToolsOptions.default;
  return [...currentToolsOptions.common, ...domainTools];
};
