// Vercel Serverless Function - AI-matched Custom GPT recommendations from curated CSV
import { readFileSync } from 'fs';
import { join } from 'path';
import Papa from 'papaparse';

// OpenRouter config (same keys as search-tools)
const OPENROUTER_KEYS = [
  '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',
  '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'
];
const OPENROUTER_MODEL = 'anthropic/claude-opus-4.6';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

let cachedGPTs = null;

function getRandomKey() {
  return OPENROUTER_KEYS[Math.floor(Math.random() * OPENROUTER_KEYS.length)];
}

function loadGPTData() {
  if (cachedGPTs) return cachedGPTs;

  let csvText = '';
  try {
    csvText = readFileSync(join(process.cwd(), 'public', 'custom gpt list - Sheet1.csv'), 'utf-8');
  } catch (e) {
    try {
      csvText = readFileSync(join(__dirname, '..', 'public', 'custom gpt list - Sheet1.csv'), 'utf-8');
    } catch (e2) {
      console.error('Could not read custom GPT CSV:', e2.message);
      return [];
    }
  }

  // CSV has no headers - columns are:
  // 0: name, 1: description, 2: creator, 3: rating, 4: reviews, 5: installs, 6: category, 7: features, 8: url
  const parsed = Papa.parse(csvText, {
    header: false,
    skipEmptyLines: true
  });

  cachedGPTs = parsed.data.map(row => ({
    name: (row[0] || '').trim(),
    description: (row[1] || '').trim(),
    creator: (row[2] || '').trim(),
    rating: (row[3] || '').trim(),
    reviews: (row[4] || '').trim(),
    installs: (row[5] || '').trim(),
    category: (row[6] || '').trim(),
    features: (row[7] || '').trim(),
    url: (row[8] || '').trim(),
    // Pre-compute searchable text
    searchText: [row[0], row[1], row[6], row[7]].filter(Boolean).join(' ').toLowerCase()
  })).filter(gpt => gpt.name && gpt.description);

  return cachedGPTs;
}

// Pre-filter GPTs by keyword relevance
function preFilterGPTs(gpts, intent) {
  const intentLower = intent.toLowerCase();
  const keywords = intentLower.split(/\s+/).filter(w => w.length > 2);

  const scored = gpts.map(gpt => {
    let score = 0;
    const catLower = gpt.category.toLowerCase();

    keywords.forEach(kw => {
      if (gpt.searchText.includes(kw)) score += 2;
      if (gpt.name.toLowerCase().includes(kw)) score += 3;
      if (catLower.includes(kw)) score += 2;
    });

    // Boost by rating
    const rating = parseFloat(gpt.rating) || 0;
    if (rating >= 4.5) score += 2;
    else if (rating >= 4.0) score += 1;

    return { ...gpt, preScore: score };
  });

  scored.sort((a, b) => b.preScore - a.preScore);
  return scored.filter(g => g.preScore > 0).slice(0, 50);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { outcome, domain, task, rcaAnswer, userContext } = req.body;

    const intentParts = [
      outcome && `Outcome: ${outcome}`,
      domain && `Domain: ${domain}`,
      task && `Task: ${task}`,
      rcaAnswer && `User situation: ${rcaAnswer}`
    ].filter(Boolean);

    const userIntent = intentParts.join(' | ');

    if (!userIntent) {
      return res.status(400).json({ error: 'At least one search parameter required' });
    }

    const allGPTs = loadGPTData();

    if (allGPTs.length === 0) {
      return res.status(500).json({ error: 'Failed to load Custom GPT database' });
    }

    // Pre-filter candidates
    const candidates = preFilterGPTs(allGPTs, `${domain || ''} ${task || ''} ${rcaAnswer || ''}`);

    // If we don't have enough keyword matches, also include by category
    if (candidates.length < 10) {
      const categoryGuesses = guessCategoryFromDomain(domain || task || '');
      const catMatches = allGPTs.filter(g =>
        categoryGuesses.some(c => g.category.toLowerCase().includes(c))
      );
      const existingNames = new Set(candidates.map(g => g.name));
      catMatches.forEach(g => {
        if (!existingNames.has(g.name)) candidates.push({ ...g, preScore: 1 });
      });
    }

    // Build summaries for Claude
    const gptSummaries = candidates.slice(0, 50).map((g, i) =>
      `[${i}] ${g.name} | Category: ${g.category} | Rating: ${g.rating} | Reviews: ${g.reviews}\n   ${g.description.slice(0, 150)}\n   Features: ${g.features}`
    ).join('\n\n');

    const searchPrompt = `You are a Custom GPT recommendation engine. Match the user's business need to the most relevant Custom GPTs.

USER CONTEXT:
${userIntent}

MATCHING RULES:
1. The user's TASK and RCA ANSWER are the strongest signals
2. Match GPTs whose description directly addresses the user's specific need
3. Prefer GPTs with higher ratings (4.0+) and more reviews
4. Consider the category alignment
5. Return TOP 5 most relevant GPTs

AVAILABLE CUSTOM GPTs (${candidates.length} candidates):

${gptSummaries}

Return EXACTLY this JSON (no extra text):
{
  "topMatches": [
    {"index": 0, "score": 9, "matchReason": "Brief reason this GPT helps"},
    {"index": 3, "score": 8, "matchReason": "Brief reason"},
    {"index": 7, "score": 7, "matchReason": "Brief reason"},
    {"index": 12, "score": 7, "matchReason": "Brief reason"},
    {"index": 15, "score": 6, "matchReason": "Brief reason"}
  ]
}`;

    const apiKey = getRandomKey();
    const searchResponse = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://ikshan.ai',
        'X-Title': 'Ikshan Custom GPT Search'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: searchPrompt },
          { role: 'user', content: `Find the best Custom GPTs for: "${task || domain}"` }
        ],
        temperature: 0.1,
        max_tokens: 600
      })
    });

    if (!searchResponse.ok) {
      // Fallback to keyword matches
      return res.status(200).json({
        success: true,
        gpts: candidates.slice(0, 5).map(g => ({
          name: g.name,
          description: g.description,
          creator: g.creator,
          rating: g.rating,
          reviews: g.reviews,
          category: g.category,
          features: g.features,
          url: g.url,
          matchReason: 'Keyword-based match'
        })),
        totalSearched: allGPTs.length,
        searchMethod: 'keyword-fallback'
      });
    }

    const searchData = await searchResponse.json();
    const responseText = searchData.choices?.[0]?.message?.content || '';

    let matchedResults = { topMatches: [] };
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        matchedResults = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse GPT AI response:', e);
    }

    const topMatches = (matchedResults.topMatches || [])
      .filter(m => m.index >= 0 && m.index < candidates.length)
      .slice(0, 5)
      .map(m => {
        const g = candidates[m.index];
        return {
          name: g.name,
          description: g.description,
          creator: g.creator,
          rating: g.rating,
          reviews: g.reviews,
          category: g.category,
          features: g.features,
          url: g.url,
          matchScore: m.score,
          matchReason: m.matchReason
        };
      });

    // Fallback if no AI matches
    if (topMatches.length === 0) {
      candidates.slice(0, 5).forEach(g => {
        topMatches.push({
          name: g.name,
          description: g.description,
          creator: g.creator,
          rating: g.rating,
          reviews: g.reviews,
          category: g.category,
          features: g.features,
          url: g.url,
          matchReason: 'Best available match'
        });
      });
    }

    return res.status(200).json({
      success: true,
      gpts: topMatches,
      totalSearched: allGPTs.length,
      candidatesEvaluated: candidates.length,
      searchMethod: 'ai-claude-opus'
    });

  } catch (error) {
    console.error('Error in search-custom-gpts:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

function guessCategoryFromDomain(domain) {
  const domainLower = domain.toLowerCase();
  const mapping = {
    'content': ['productivity', 'writing', 'marketing'],
    'social media': ['marketing', 'productivity', 'writing'],
    'seo': ['marketing', 'research'],
    'lead': ['marketing', 'sales', 'productivity'],
    'sales': ['sales', 'productivity', 'marketing'],
    'customer': ['customer service', 'productivity'],
    'finance': ['finance', 'education'],
    'hr': ['productivity', 'education'],
    'recruit': ['productivity', 'education'],
    'analytics': ['research', 'productivity', 'data analysis'],
    'automat': ['productivity', 'programming'],
    'market': ['marketing', 'research'],
    'personal': ['lifestyle', 'productivity', 'education'],
    'support': ['customer service', 'productivity']
  };

  const results = new Set();
  Object.entries(mapping).forEach(([key, cats]) => {
    if (domainLower.includes(key)) cats.forEach(c => results.add(c));
  });
  return [...results];
}
