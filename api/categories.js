// Vercel Serverless Function - Categories taxonomy from CSV
import { readFileSync } from 'fs';
import { join } from 'path';
import Papa from 'papaparse';

// Cache parsed CSV data in memory (cold start only parses once)
let cachedData = null;

function loadCategoriesData() {
  if (cachedData) return cachedData;

  // Try local file first (works in both dev and Vercel)
  let csvText = '';
  try {
    csvText = readFileSync(join(process.cwd(), 'public', 'Cateogories by task type - Sheet1.csv'), 'utf-8');
  } catch (e) {
    // Fallback path for Vercel
    try {
      csvText = readFileSync(join(__dirname, '..', 'public', 'Cateogories by task type - Sheet1.csv'), 'utf-8');
    } catch (e2) {
      console.error('Could not read categories CSV:', e2.message);
      return [];
    }
  }

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });

  // Normalize the data
  cachedData = parsed.data.map(row => ({
    growthBucket: (row['Growth Bucket'] || '').trim(),
    subCategory: (row['Sub-Category'] || '').trim(),
    taskSolution: (row['Task / Solution'] || '').trim()
  })).filter(row => row.growthBucket && row.subCategory && row.taskSolution);

  return cachedData;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const data = loadCategoriesData();

    if (data.length === 0) {
      return res.status(500).json({ error: 'Failed to load categories data' });
    }

    // Get query params or body params
    const growthBucket = req.query?.growthBucket || req.body?.growthBucket || '';
    const subCategory = req.query?.subCategory || req.body?.subCategory || '';

    // If growthBucket provided, return subcategories for that bucket
    if (growthBucket && !subCategory) {
      const matchingRows = data.filter(row =>
        row.growthBucket.toLowerCase().includes(growthBucket.toLowerCase()) ||
        growthBucket.toLowerCase().includes(row.growthBucket.toLowerCase().split('(')[0].trim())
      );

      // Get unique subcategories
      const subCategories = [...new Set(matchingRows.map(r => r.subCategory))];

      return res.status(200).json({
        success: true,
        growthBucket: growthBucket,
        subCategories: subCategories,
        totalTasks: matchingRows.length
      });
    }

    // If both growthBucket and subCategory provided, return tasks
    if (growthBucket && subCategory) {
      const matchingRows = data.filter(row => {
        const bucketMatch = row.growthBucket.toLowerCase().includes(growthBucket.toLowerCase()) ||
          growthBucket.toLowerCase().includes(row.growthBucket.toLowerCase().split('(')[0].trim());
        const subMatch = row.subCategory.toLowerCase() === subCategory.toLowerCase();
        return bucketMatch && subMatch;
      });

      const tasks = matchingRows.map(r => r.taskSolution);

      return res.status(200).json({
        success: true,
        growthBucket: growthBucket,
        subCategory: subCategory,
        tasks: tasks
      });
    }

    // No filters - return all unique growth buckets
    const buckets = [...new Set(data.map(r => r.growthBucket))];

    return res.status(200).json({
      success: true,
      growthBuckets: buckets,
      totalRows: data.length
    });

  } catch (error) {
    console.error('Error in categories API:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
