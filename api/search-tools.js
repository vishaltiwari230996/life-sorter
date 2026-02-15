// Vercel Serverless Function - AI-powered tool matching from unified tools list
// Uses OpenRouter with Claude Opus 4.6 for intelligent matching against 4,000+ tools
import { readFileSync } from 'fs';
import { join } from 'path';
import Papa from 'papaparse';

// OpenRouter API keys (rotated for load distribution)
const OPENROUTER_KEYS = [
  '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',
  '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'
];
const OPENROUTER_MODEL = 'anthropic/claude-opus-4.6';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Well-known app name overrides (tool_id -> display name)
const APP_NAME_OVERRIDES = {
  'play::com.ubercab': 'Uber',
  'play::com.whatsapp': 'WhatsApp',
  'play::com.instagram.android': 'Instagram',
  'play::com.facebook.katana': 'Facebook',
  'play::com.twitter.android': 'Twitter / X',
  'play::com.linkedin.android': 'LinkedIn',
  'play::com.google.android.youtube': 'YouTube',
  'play::com.spotify.music': 'Spotify',
  'play::com.slack': 'Slack',
  'play::com.Slack': 'Slack',
  'play::com.microsoft.teams': 'Microsoft Teams',
  'play::com.google.android.apps.docs': 'Google Docs',
  'play::com.google.android.apps.sheets': 'Google Sheets',
  'play::com.google.android.gm': 'Gmail',
  'play::com.canva.editor': 'Canva',
  'play::com.shopify.mobile': 'Shopify',
  'play::com.notion.id': 'Notion',
  'play::com.trello': 'Trello',
  'play::com.asana.app': 'Asana',
  'play::com.hubspot.android': 'HubSpot',
  'play::com.mailchimp.mailchimp': 'Mailchimp',
  'play::com.stripe.android.dashboard': 'Stripe',
  'play::com.salesforce.chatter': 'Salesforce',
  'play::com.zapier.android': 'Zapier',
  'play::com.calendly.app': 'Calendly',
  'play::com.grammarly.android.keyboard': 'Grammarly',
  'play::com.freshdesk.helpdesk': 'Freshdesk',
  'play::com.zendesk.android': 'Zendesk',
  'play::com.intercom.intercomsdk': 'Intercom',
  'play::com.hootsuite.droid.full': 'Hootsuite',
  'play::com.buffer.android': 'Buffer',
  'play::com.semrush.app': 'Semrush',
  'play::com.ahrefs.com': 'Ahrefs',
  'play::com.figma.mirror': 'Figma',
  'play::com.adobe.creativeapps.gather': 'Adobe Creative Cloud',
  'play::com.zoom.videomeetings': 'Zoom',
  'play::com.loom.android': 'Loom',
  'play::com.monday.monday': 'Monday.com',
  'play::com.clickup.app': 'ClickUp',
  'play::com.todoist': 'Todoist',
  'play::com.evernote': 'Evernote',
  'play::com.xero.touch': 'Xero',
  'play::com.intuit.quickbooks': 'QuickBooks',
  'play::com.freshbooks.andromeda': 'FreshBooks',
  'play::com.wave.personal': 'Wave Accounting'
};

// Extract clean app name from tool_id
function extractAppName(toolId) {
  // Check overrides first
  if (APP_NAME_OVERRIDES[toolId]) return APP_NAME_OVERRIDES[toolId];

  // Strip "play::com." prefix
  let name = toolId.replace(/^play::com\./, '');

  // Take the meaningful parts (skip generic android/app suffixes)
  const skipParts = new Set(['android', 'app', 'mobile', 'id', 'full', 'lite', 'free', 'pro', 'sdk', 'touch']);
  const parts = name.split('.').filter(p => !skipParts.has(p.toLowerCase()) && p.length > 1);

  // Capitalize each part
  const capitalized = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

  return capitalized || toolId;
}

// Cache parsed CSV data
let cachedTools = null;

function getRandomKey() {
  return OPENROUTER_KEYS[Math.floor(Math.random() * OPENROUTER_KEYS.length)];
}

function loadToolsData() {
  if (cachedTools) return cachedTools;

  let csvText = '';
  try {
    csvText = readFileSync(join(process.cwd(), 'public', 'unified tools list  - Sheet1.csv'), 'utf-8');
  } catch (e) {
    try {
      csvText = readFileSync(join(__dirname, '..', 'public', 'unified tools list  - Sheet1.csv'), 'utf-8');
    } catch (e2) {
      console.error('Could not read unified tools CSV:', e2.message);
      return [];
    }
  }

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });

  cachedTools = parsed.data.map(row => {
    // Parse the top_5_tasks field (it's a JSON-like string)
    let tasks = [];
    const rawTasks = row['top_5_tasks'] || '';
    try {
      tasks = JSON.parse(rawTasks.replace(/'/g, '"'));
    } catch {
      // Fallback: split by comma if JSON parse fails
      tasks = rawTasks.replace(/[\[\]']/g, '').split(',').map(t => t.trim()).filter(Boolean);
    }

    const rawId = (row['tool_id'] || '').trim();
    // Extract clean app name from tool_id like "play::com.ubercab" -> "Ubercab"
    // or "play::com.microsoft.office.word" -> "Microsoft Office Word"
    const appName = extractAppName(rawId);

    return {
      toolId: rawId,
      appName: appName,
      primaryDomain: (row['primary_domain'] || '').trim(),
      subdomain: (row['subdomain'] || '').trim(),
      topTasks: tasks,
      tasksText: tasks.join(' | ')
    };
  }).filter(row => row.toolId && row.primaryDomain);

  return cachedTools;
}

// Pre-filter tools by domain/subdomain relevance using keyword matching
function preFilterTools(tools, userIntent) {
  const intentLower = userIntent.toLowerCase();
  const keywords = intentLower.split(/\s+/).filter(w => w.length > 2);

  // Score each tool for relevance
  const scored = tools.map(tool => {
    let score = 0;
    const domainLower = tool.primaryDomain.toLowerCase();
    const subdomainLower = tool.subdomain.toLowerCase();
    const tasksLower = tool.tasksText.toLowerCase();

    // Domain match
    keywords.forEach(kw => {
      if (domainLower.includes(kw)) score += 3;
      if (subdomainLower.includes(kw)) score += 4;
      if (tasksLower.includes(kw)) score += 2;
    });

    // Boost for exact domain/subdomain words
    if (intentLower.includes(domainLower) || domainLower.includes(intentLower.split(' ')[0])) score += 5;

    return { ...tool, preScore: score };
  });

  // Sort by score and take top candidates
  scored.sort((a, b) => b.preScore - a.preScore);

  // Get unique domains from top matches to ensure diversity
  const topCandidates = scored.filter(t => t.preScore > 0).slice(0, 150);

  // If not enough keyword matches, also include tools from likely relevant domains
  if (topCandidates.length < 30) {
    const domainGuesses = guessDomains(intentLower);
    const domainMatches = tools.filter(t =>
      domainGuesses.some(d => t.primaryDomain.toLowerCase().includes(d) || t.subdomain.toLowerCase().includes(d))
    ).slice(0, 100);

    const existingIds = new Set(topCandidates.map(t => t.toolId));
    domainMatches.forEach(t => {
      if (!existingIds.has(t.toolId)) topCandidates.push({ ...t, preScore: 1 });
    });
  }

  return topCandidates.slice(0, 150);
}

// Guess relevant domains from user intent text
function guessDomains(intent) {
  const domainMap = {
    'marketing': ['marketing', 'social media', 'advertising'],
    'social': ['social media', 'communication'],
    'seo': ['marketing', 'seo'],
    'content': ['content', 'design', 'media'],
    'lead': ['sales', 'marketing', 'crm'],
    'sales': ['sales', 'crm', 'commerce'],
    'automat': ['productivity', 'automation', 'workflow'],
    'email': ['communication', 'marketing', 'email'],
    'crm': ['crm', 'sales'],
    'hr': ['human resources', 'recruiting'],
    'recruit': ['recruiting', 'human resources'],
    'hire': ['recruiting', 'human resources'],
    'finance': ['finance', 'accounting'],
    'invoice': ['finance', 'accounting', 'billing'],
    'account': ['finance', 'accounting'],
    'support': ['customer support', 'helpdesk'],
    'ticket': ['customer support', 'helpdesk'],
    'chat': ['communication', 'customer support'],
    'design': ['design', 'creative'],
    'video': ['media', 'video', 'entertainment'],
    'photo': ['design', 'photo', 'media'],
    'document': ['productivity', 'document'],
    'project': ['project management', 'productivity'],
    'analytics': ['analytics', 'business intelligence'],
    'data': ['analytics', 'data', 'business intelligence'],
    'ecommerce': ['e-commerce', 'commerce', 'shopping'],
    'shop': ['e-commerce', 'commerce', 'shopping'],
    'shipping': ['logistics', 'shipping'],
    'legal': ['legal', 'compliance'],
    'contract': ['legal', 'document'],
    'meeting': ['collaboration', 'video conferencing'],
    'schedule': ['productivity', 'schedule'],
    'calendar': ['productivity', 'schedule'],
    'whatsapp': ['communication', 'messaging'],
    'instagram': ['social media', 'marketing'],
    'linkedin': ['social media', 'professional networking'],
    'google': ['productivity', 'advertising'],
    'pdf': ['document', 'productivity'],
    'excel': ['productivity', 'spreadsheet'],
    'dashboard': ['analytics', 'business intelligence']
  };

  const matches = new Set();
  Object.entries(domainMap).forEach(([keyword, domains]) => {
    if (intent.includes(keyword)) {
      domains.forEach(d => matches.add(d));
    }
  });

  return [...matches];
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      goal,
      role,
      category,
      subCategory,
      task,
      userContext
    } = req.body;

    // Build the composite user intent from all 5 questions
    const intentParts = [
      goal && `Goal: ${goal}`,
      role && `Role: ${role}`,
      category && `Category: ${category}`,
      subCategory && `Sub-category: ${subCategory}`,
      task && `Task: ${task}`
    ].filter(Boolean);

    const userIntent = intentParts.join(' | ');

    if (!userIntent) {
      return res.status(400).json({ error: 'At least one search parameter is required' });
    }

    // Load all tools
    const allTools = loadToolsData();

    if (allTools.length === 0) {
      return res.status(500).json({ error: 'Failed to load tools database' });
    }

    // Pre-filter to narrow down candidates
    const candidates = preFilterTools(allTools, `${category || ''} ${subCategory || ''} ${task || ''}`);

    // Build tool summaries for Claude
    const toolSummaries = candidates.map((t, i) =>
      `[${i}] ${t.appName} (${t.toolId}) | Domain: ${t.primaryDomain} | Subdomain: ${t.subdomain}\n   Tasks: ${t.topTasks.slice(0, 5).join('; ')}`
    ).join('\n\n');

    // Build the AI matching prompt
    const searchPrompt = `You are an expert AI tool recommendation engine. Your job is to match a user's specific business need to the most relevant software tools from a curated database.

USER CONTEXT:
${userIntent}

MATCHING RULES:
1. Focus primarily on the TASK (Q5) - this is the most specific signal
2. Use Sub-category (Q4) to narrow the domain
3. Use Category (Q3) for broader context
4. Match against each tool's subdomain AND top tasks for relevance
5. Prioritize tools whose top_5_tasks directly address the user's specific task
6. Consider the user's role to prefer tools suited for that persona

SCORING:
- 9-10: Tool's top tasks directly solve the user's exact task
- 7-8: Tool is highly relevant to the sub-category and partially addresses the task
- 5-6: Tool is in the right domain but tasks only loosely match
- Below 5: Do not include

AVAILABLE TOOLS (${candidates.length} pre-filtered candidates):

${toolSummaries}

Return EXACTLY this JSON format (no extra text):
{
  "topMatches": [
    {"index": 0, "score": 9, "matchReason": "Brief explanation of why this tool matches"},
    {"index": 5, "score": 8, "matchReason": "Brief explanation"},
    {"index": 12, "score": 7, "matchReason": "Brief explanation"}
  ],
  "alternatives": [
    {"index": 20, "score": 6},
    {"index": 25, "score": 5}
  ],
  "recommendedCategory": "The primary domain these tools fall under"
}

Find the TOP 5 most relevant tools. Always return at least 3 top matches.`;

    // Call OpenRouter with Claude Opus
    const apiKey = getRandomKey();
    const searchResponse = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://ikshan.ai',
        'X-Title': 'Ikshan Tool Search'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: searchPrompt },
          { role: 'user', content: `Find the best tools for this specific need: "${task || subCategory || category}"` }
        ],
        temperature: 0.1,
        max_tokens: 800
      })
    });

    if (!searchResponse.ok) {
      const errText = await searchResponse.text();
      console.error('OpenRouter API error:', searchResponse.status, errText);

      // Fallback to keyword-based matching
      return res.status(200).json({
        success: true,
        tools: candidates.slice(0, 5).map(t => ({
          toolId: t.toolId,
          appName: t.appName,
          primaryDomain: t.primaryDomain,
          subdomain: t.subdomain,
          topTasks: t.topTasks,
          matchScore: t.preScore,
          matchReason: 'Keyword-based match'
        })),
        totalSearched: allTools.length,
        searchMethod: 'keyword-fallback'
      });
    }

    const searchData = await searchResponse.json();
    const responseText = searchData.choices?.[0]?.message?.content || '';

    // Parse AI response
    let matchedResults = { topMatches: [], alternatives: [] };
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        matchedResults = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      // Fallback
      return res.status(200).json({
        success: true,
        tools: candidates.slice(0, 5).map(t => ({
          toolId: t.toolId,
          appName: t.appName,
          primaryDomain: t.primaryDomain,
          subdomain: t.subdomain,
          topTasks: t.topTasks,
          matchScore: t.preScore,
          matchReason: 'Pre-filtered match'
        })),
        totalSearched: allTools.length,
        searchMethod: 'parse-fallback'
      });
    }

    // Build top matches
    const topMatches = (matchedResults.topMatches || [])
      .filter(m => m.index >= 0 && m.index < candidates.length)
      .slice(0, 5)
      .map(m => ({
        toolId: candidates[m.index].toolId,
        appName: candidates[m.index].appName,
        primaryDomain: candidates[m.index].primaryDomain,
        subdomain: candidates[m.index].subdomain,
        topTasks: candidates[m.index].topTasks,
        matchScore: m.score,
        matchReason: m.matchReason
      }));

    const alternatives = (matchedResults.alternatives || [])
      .filter(m => m.index >= 0 && m.index < candidates.length)
      .slice(0, 3)
      .map(m => ({
        toolId: candidates[m.index].toolId,
        appName: candidates[m.index].appName,
        primaryDomain: candidates[m.index].primaryDomain,
        subdomain: candidates[m.index].subdomain,
        topTasks: candidates[m.index].topTasks,
        matchScore: m.score
      }));

    // If AI returned no matches, use pre-filtered ones
    if (topMatches.length === 0) {
      candidates.slice(0, 5).forEach(t => {
        topMatches.push({
          toolId: t.toolId,
          appName: t.appName,
          primaryDomain: t.primaryDomain,
          subdomain: t.subdomain,
          topTasks: t.topTasks,
          matchScore: t.preScore > 0 ? 6 : 4,
          matchReason: 'Best available match from keyword filtering'
        });
      });
    }

    // Now generate a helpful explanation using Claude
    const explanationPrompt = `You are a friendly AI advisor helping someone find the right tools.

User needs: ${userIntent}

TOP MATCHED TOOLS:
${topMatches.map((t, i) => `${i + 1}. ${t.appName} (${t.primaryDomain} > ${t.subdomain})
   Score: ${t.matchScore}/10 — ${t.matchReason}
   What it does: ${t.topTasks.slice(0, 3).join('; ')}`).join('\n\n')}

Write a helpful, concise recommendation (150-200 words):
1. Start with "Based on your need to ${task || subCategory || 'solve this'}..."
2. For each tool, explain in 1-2 sentences how it specifically helps
3. End with a practical next step suggestion

RULES:
- Be positive and practical
- Use simple, everyday language
- Never say "no matches" or "not ideal"
- Keep it under 200 words`;

    let helpfulExplanation = '';
    try {
      const explainResponse = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getRandomKey()}`,
          'HTTP-Referer': 'https://ikshan.ai',
          'X-Title': 'Ikshan Tool Explanation'
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            { role: 'system', content: explanationPrompt },
            { role: 'user', content: 'Explain these tool recommendations.' }
          ],
          temperature: 0.7,
          max_tokens: 400
        })
      });

      if (explainResponse.ok) {
        const explainData = await explainResponse.json();
        helpfulExplanation = explainData.choices?.[0]?.message?.content || '';
      }
    } catch (e) {
      console.error('Explanation generation failed:', e);
    }

    return res.status(200).json({
      success: true,
      tools: topMatches,
      alternatives: alternatives,
      totalSearched: allTools.length,
      candidatesEvaluated: candidates.length,
      searchMethod: 'ai-claude-opus',
      helpfulResponse: helpfulExplanation,
      recommendedCategory: matchedResults.recommendedCategory || '',
      userContext: {
        goal, role, category, subCategory, task
      }
    });

  } catch (error) {
    console.error('Error in search-tools:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      tools: []
    });
  }
}
