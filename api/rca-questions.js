// Vercel Serverless Function - Extract RCA Bridge questions from domain .docx files
import mammoth from 'mammoth';
import { readFileSync } from 'fs';
import { join } from 'path';

// Map CSV subcategory names to .docx filenames (for mismatched names)
const DOMAIN_TO_DOCX = {
  'Content & Social Media': 'Content & Social Media.docx',
  'SEO & Organic Visibility': 'SEO & Organic Visibility.docx',
  'Paid Media & Ads': 'Paid Media & Ads.docx',
  'B2B Lead Generation': 'B2B Lead Generation.docx',
  'Sales Execution & Enablement': 'Sales Execution & Enablement.docx',
  'Lead Management & Conversion': 'Lead Management & Conversion.docx',
  'Customer Success & Reputation': 'Customer Success & Reputation.docx',
  'Repeate Sales': 'Same User More Sale_.docx',
  'Business Intelligence & Analytics': 'Business Intelligence & Analytics.docx',
  'Market Strategy & Innovation': 'Market Strategy & Innovation.docx',
  'Financial Health & Risk': 'Financial Health & Risk.docx',
  'Org Efficiency & Hiring': 'Org Efficiency & Hiring.docx',
  'Improve yourself': 'Owner_ Founder Improvements.docx',
  'Sales & Content Automation': 'Marketing  & Sales Automation.docx',
  'Finance Legal & Admin': 'Finance Legal & Admin.docx',
  'Customer Support Ops': 'Customer Support Ops.docx',
  'Recruiting & HR Ops': 'Recruiting & HR Ops.docx',
  'Personal & Team Productivity': 'Personal & Team Productivity.docx'
};

// Cache parsed docx data per domain
const docxCache = {};

async function parseDocx(domain) {
  if (docxCache[domain]) return docxCache[domain];

  const filename = DOMAIN_TO_DOCX[domain];
  if (!filename) return null;

  let buffer;
  try {
    buffer = readFileSync(join(process.cwd(), filename));
  } catch (e) {
    try {
      buffer = readFileSync(join(__dirname, '..', filename));
    } catch (e2) {
      console.error(`Could not read docx for domain "${domain}":`, e2.message);
      return null;
    }
  }

  const result = await mammoth.extractRawText({ buffer });
  const lines = result.value.split('\n').filter(l => l.trim());

  // Parse into task-based structure
  const tasks = [];
  let currentTask = null;
  let currentSection = null;

  for (const line of lines) {
    const text = line.trim();
    if (!text) continue;

    // New task starts
    if (text.startsWith('TASK:')) {
      if (currentTask) tasks.push(currentTask);
      currentTask = {
        task: text.replace('TASK:', '').trim(),
        problems: [],
        opportunities: [],
        strategies: [],
        rcaBridge: []
      };
      currentSection = null;
      continue;
    }

    if (!currentTask) continue;

    // Detect section headers
    if (text.includes('SECTION 1') && text.includes('Problems')) {
      currentSection = 'problems';
      continue;
    }
    if (text.includes('SECTION 2') && text.includes('Opportunities')) {
      currentSection = 'opportunities';
      continue;
    }
    if (text.includes('SECTION 3') && text.includes('Strategies')) {
      currentSection = 'strategies';
      continue;
    }
    if (text.includes('SECTION 4') && text.includes('RCA Bridge')) {
      currentSection = 'rca';
      // Sometimes RCA entries are on the same line after the header
      const afterHeader = text.split('total)')[1] || '';
      if (afterHeader.trim() && afterHeader.includes('→')) {
        parseRcaEntries(afterHeader.trim(), currentTask.rcaBridge);
      }
      continue;
    }

    // Skip non-content lines
    if (text.startsWith('5 Variants:') || text.startsWith('5 Adjacent Terms:')) {
      currentSection = 'skip';
      continue;
    }

    // Add content to current section
    if (currentSection === 'problems') {
      currentTask.problems.push(text);
    } else if (currentSection === 'opportunities') {
      currentTask.opportunities.push(text);
    } else if (currentSection === 'strategies') {
      currentTask.strategies.push(text);
    } else if (currentSection === 'rca') {
      parseRcaEntries(text, currentTask.rcaBridge);
    }
  }

  // Don't forget the last task
  if (currentTask) tasks.push(currentTask);

  docxCache[domain] = tasks;
  return tasks;
}

// Parse RCA Bridge entries from a text line
// Format: "complaint" → metric → category
function parseRcaEntries(text, rcaArray) {
  // Split by common patterns where entries might be concatenated
  // Each entry starts with a quote or has the → pattern
  const parts = text.split(/(?="[A-Z])|(?="[a-z])/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed || !trimmed.includes('→')) continue;

    const segments = trimmed.split('→').map(s => s.trim());
    if (segments.length >= 2) {
      const complaint = segments[0].replace(/^"|"$/g, '').trim();
      const metric = segments[1] ? segments[1].trim() : '';
      const category = segments[2] ? segments[2].trim() : '';

      if (complaint && complaint.length > 5) {
        rcaArray.push({
          complaint,
          metric,
          category
        });
      }
    }
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { domain, task } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'domain is required' });
    }

    const tasks = await parseDocx(domain);

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        success: false,
        message: `No RCA data found for domain "${domain}"`,
        rcaQuestions: []
      });
    }

    // If task is provided, find RCA for that specific task
    if (task) {
      // Fuzzy match: find the best matching task
      const taskLower = task.toLowerCase();
      let bestMatch = null;
      let bestScore = 0;

      for (const t of tasks) {
        const tLower = t.task.toLowerCase();
        // Exact match
        if (tLower === taskLower) {
          bestMatch = t;
          bestScore = 100;
          break;
        }
        // Partial match: count overlapping words
        const taskWords = taskLower.split(/\s+/).filter(w => w.length > 3);
        const matchWords = taskWords.filter(w => tLower.includes(w));
        const score = matchWords.length / Math.max(taskWords.length, 1) * 100;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = t;
        }
      }

      if (bestMatch && bestScore > 20) {
        return res.status(200).json({
          success: true,
          domain,
          task: bestMatch.task,
          matchScore: bestScore,
          rcaQuestions: bestMatch.rcaBridge.map(r => ({
            complaint: r.complaint,
            metric: r.metric,
            category: r.category,
            displayText: r.complaint
          })),
          problems: bestMatch.problems,
          opportunities: bestMatch.opportunities.slice(0, 5),
          strategies: bestMatch.strategies.slice(0, 3)
        });
      }
    }

    // No specific task match — return all tasks with their RCA questions
    return res.status(200).json({
      success: true,
      domain,
      tasksAvailable: tasks.map(t => ({
        task: t.task,
        rcaCount: t.rcaBridge.length,
        rcaQuestions: t.rcaBridge.map(r => ({
          complaint: r.complaint,
          metric: r.metric,
          category: r.category,
          displayText: r.complaint
        }))
      }))
    });

  } catch (error) {
    console.error('Error in rca-questions:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
