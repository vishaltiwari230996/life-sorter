import Papa from 'papaparse';

/**
 * Fetches and parses the AI SaaS companies CSV file
 * @returns {Promise<Array>} Array of company objects
 */
export async function fetchCompaniesCSV() {
  try {
    const response = await fetch('/AI SaaS Biz - Research .csv');

    if (!response.ok) {
      console.warn('CSV file not found, using fallback data');
      return [];
    }

    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching CSV:', error);
    return [];
  }
}

/**
 * Filters companies by domain and subdomain
 * @param {Array} companies - Array of all companies
 * @param {string} domain - Selected domain (e.g., 'marketing', 'sales-support')
 * @param {string} subdomain - Selected subdomain (optional)
 * @returns {Array} Filtered companies
 */
export function filterCompaniesByDomain(companies, domain, subdomain) {
  if (!companies || companies.length === 0) {
    return [];
  }

  // Normalize domain for matching (remove hyphens, lowercase)
  const normalizedDomain = domain?.toLowerCase().replace(/-/g, ' ').trim();
  const normalizedSubdomain = subdomain?.toLowerCase().trim();

  return companies.filter(company => {
    // Check various column names that might contain domain info
    const companyDomain = (
      company.Domain ||
      company.domain ||
      company.Category ||
      company.category ||
      company.Industry ||
      company.industry ||
      ''
    ).toLowerCase().trim();

    const companySubdomain = (
      company.Subdomain ||
      company.subdomain ||
      company.Subcategory ||
      company.subcategory ||
      company['Sub-domain'] ||
      ''
    ).toLowerCase().trim();

    // Match domain
    const domainMatch = companyDomain.includes(normalizedDomain) ||
                       normalizedDomain.includes(companyDomain);

    // If subdomain provided, match it too
    if (subdomain && companySubdomain) {
      return domainMatch && (
        companySubdomain.includes(normalizedSubdomain) ||
        normalizedSubdomain.includes(companySubdomain)
      );
    }

    return domainMatch;
  });
}

/**
 * Formats company data for display in market analysis
 * @param {Array} companies - Filtered companies
 * @param {number} limit - Maximum number of companies to display
 * @returns {string} Formatted markdown string
 */
export function formatCompaniesForDisplay(companies, limit = 5) {
  if (!companies || companies.length === 0) {
    return '- No specific tools identified in our database yet';
  }

  const limitedCompanies = companies.slice(0, limit);

  return limitedCompanies.map(company => {
    const name = company.Name || company.name || company.Company || company.company || 'Unknown';
    const description = company.Description || company.description || company.Product || company.product || '';
    const url = company.URL || company.url || company.Website || company.website || '';

    let formatted = `- **${name}**`;

    if (description) {
      formatted += `: ${description}`;
    }

    if (url) {
      formatted += ` ([Visit](${url}))`;
    }

    return formatted;
  }).join('\n');
}

/**
 * Analyzes market gaps based on user requirement and existing companies
 * @param {string} requirement - User's stated requirement
 * @param {Array} companies - Existing companies in the space
 * @returns {string} Gap analysis text
 */
export function analyzeMarketGaps(requirement, companies) {
  const hasCompetition = companies && companies.length > 0;

  if (!hasCompetition) {
    return `- This appears to be an underserved market segment
- First-mover advantage opportunity
- High potential for innovation`;
  }

  if (companies.length <= 2) {
    return `- Limited competition (${companies.length} solution${companies.length > 1 ? 's' : ''} found)
- Room for differentiation and improvement
- Opportunity to address unmet needs`;
  }

  return `- Competitive market with ${companies.length}+ existing solutions
- Focus on unique value proposition
- Consider niche specialization or innovative features
- Better user experience and pricing could be differentiators`;
}
