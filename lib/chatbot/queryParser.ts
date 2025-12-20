/**
 * Natural Language Query Parser for Pathway Chatbot
 * 
 * Parses queries like:
 * - "where do consultants from bain exit to"
 * - "what paths lead to product manager at google"
 * - "where does blackstone hire from"
 * - "is bain or mckinsey better for PE exit"
 */

export type QueryType = 
  | 'EXITS_FROM'      // Where do people FROM company/role go?
  | 'EXITS_TO'        // Where do people AT company/role come from?
  | 'COMPARE'         // Compare two companies for a specific exit type
  | 'GENERIC'         // Generic query about a company
  | 'CLARIFICATION';  // Need more info from user

export interface ParsedQuery {
  type: QueryType;
  companies: string[];           // Company names mentioned
  roles: string[];               // Roles/positions mentioned
  industries: string[];          // Industries mentioned (PE, VC, Tech, etc.)
  locations: string[];           // Locations mentioned
  isGeneric: boolean;            // If true, show top 10 and ask for specifics
  originalQuery: string;
  confidence: number;            // 0-1 confidence in parsing
  suggestedFollowUp?: string;    // Follow-up question if query is ambiguous
}

// Common role patterns
const ROLE_PATTERNS = [
  'consultant', 'associate', 'analyst', 'manager', 'director', 'vp', 'vice president',
  'partner', 'principal', 'senior', 'junior', 'intern', 'ceo', 'cto', 'cfo', 'coo',
  'product manager', 'pm', 'software engineer', 'swe', 'engineer', 'developer',
  'investment banker', 'banker', 'trader', 'quant', 'data scientist', 'designer',
  'founder', 'co-founder', 'entrepreneur', 'mba', 'student'
];

// Industry patterns
const INDUSTRY_PATTERNS = [
  { pattern: /\b(private equity|pe)\b/i, industry: 'Private Equity' },
  { pattern: /\b(venture capital|vc|venture)\b/i, industry: 'Venture Capital' },
  { pattern: /\b(consulting|strategy)\b/i, industry: 'Consulting' },
  { pattern: /\b(banking|investment bank|ib)\b/i, industry: 'Banking' },
  { pattern: /\b(tech|technology|faang|big tech)\b/i, industry: 'Tech' },
  { pattern: /\b(startup|startups)\b/i, industry: 'Startup' },
  { pattern: /\b(hedge fund|hf)\b/i, industry: 'Hedge Fund' },
  { pattern: /\b(corporate|f500|fortune 500)\b/i, industry: 'Corporate' },
  { pattern: /\b(mba|business school|grad school)\b/i, industry: 'Education' },
];

// Company name variations and mappings
const COMPANY_ALIASES: Record<string, string> = {
  'mck': 'McKinsey & Company',
  'mckinsey': 'McKinsey & Company',
  'bain': 'Bain & Company',
  'bcg': 'Boston Consulting Group',
  'boston consulting': 'Boston Consulting Group',
  'deloitte': 'Deloitte',
  'ey': 'EY',
  'ernst young': 'EY',
  'pwc': 'PwC',
  'kpmg': 'KPMG',
  'accenture': 'Accenture',
  'oliver wyman': 'Oliver Wyman',
  'ow': 'Oliver Wyman',
  'atk': 'A.T. Kearney',
  'kearney': 'A.T. Kearney',
  'lek': 'L.E.K. Consulting',
  
  'goldman': 'Goldman Sachs',
  'gs': 'Goldman Sachs',
  'goldman sachs': 'Goldman Sachs',
  'jpmorgan': 'JPMorgan Chase',
  'jpm': 'JPMorgan Chase',
  'jp morgan': 'JPMorgan Chase',
  'morgan stanley': 'Morgan Stanley',
  'ms': 'Morgan Stanley',
  'bofa': 'Bank of America',
  'bank of america': 'Bank of America',
  'citi': 'Citigroup',
  'citigroup': 'Citigroup',
  
  'blackstone': 'Blackstone',
  'bx': 'Blackstone',
  'kkr': 'KKR',
  'carlyle': 'Carlyle Group',
  'apollo': 'Apollo Global Management',
  'tpg': 'TPG',
  'bain capital': 'Bain Capital',
  
  'google': 'Google',
  'alphabet': 'Google',
  'meta': 'Meta',
  'facebook': 'Meta',
  'fb': 'Meta',
  'amazon': 'Amazon',
  'amzn': 'Amazon',
  'aws': 'Amazon',
  'apple': 'Apple',
  'aapl': 'Apple',
  'microsoft': 'Microsoft',
  'msft': 'Microsoft',
  'netflix': 'Netflix',
  'nflx': 'Netflix',
  'uber': 'Uber',
  'airbnb': 'Airbnb',
  'stripe': 'Stripe',
  'salesforce': 'Salesforce',
  'adobe': 'Adobe',
  'linkedin': 'LinkedIn',
  'tesla': 'Tesla',
  'spotify': 'Spotify',
  
  'sequoia': 'Sequoia Capital',
  'a16z': 'Andreessen Horowitz',
  'andreessen': 'Andreessen Horowitz',
  'andreessen horowitz': 'Andreessen Horowitz',
  'general catalyst': 'General Catalyst',
  'gc': 'General Catalyst',
  'accel': 'Accel',
  'greylock': 'Greylock Partners',
  'benchmark': 'Benchmark',
};

// Patterns to detect query type
const EXITS_FROM_PATTERNS = [
  /where (?:do|does|did) .* (?:exit|go|leave|move)/i,
  /(?:exit|exits|exited) (?:from|out of)/i,
  /(?:leave|leaving|left) .* (?:to|for)/i,
  /after .* where/i,
  /what (?:industries|companies|roles) .* (?:exit|go|move) to/i,
  /(?:from|at) .* (?:exit|go|leave)/i,
];

const EXITS_TO_PATTERNS = [
  /(?:path|paths|route|routes|way|ways) to (?:become|get|land|join)/i,
  /how (?:do|does|can|to) .* (?:become|get to|join|land)/i,
  /where (?:do|does|did) .* (?:hire|recruit|come) from/i,
  /(?:hire|hires|hiring|recruit|recruits) (?:from|out of)/i,
  /(?:background|backgrounds) .* (?:at|for|to join)/i,
  /what .* (?:hire|recruit|look for)/i,
  /(?:come|coming|came) from/i,
  /(?:path|pipeline) (?:to|into)/i,
];

const COMPARE_PATTERNS = [
  /(?:is|are) .* (?:better|worse|best) .* (?:for|to)/i,
  /(?:compare|comparing|vs|versus|or) .*/i,
  /(?:which|what) .* (?:better|best|more)/i,
  /.* (?:vs|versus|or|compared to) .*/i,
  /(?:bain|mckinsey|bcg|goldman) .* (?:or|vs|versus) .* (?:bain|mckinsey|bcg|goldman)/i,
];

export function parseQuery(query: string): ParsedQuery {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Extract companies
  const companies = extractCompanies(normalizedQuery);
  
  // Extract roles
  const roles = extractRoles(normalizedQuery);
  
  // Extract industries
  const industries = extractIndustries(normalizedQuery);
  
  // Extract locations (basic for now)
  const locations = extractLocations(normalizedQuery);
  
  // Determine query type
  const { type, confidence } = determineQueryType(normalizedQuery, companies, roles, industries);
  
  // Check if query is generic (no specific role/industry filter)
  const isGeneric = roles.length === 0 && industries.length === 0;
  
  // Generate follow-up suggestion if needed
  const suggestedFollowUp = generateFollowUp(type, companies, roles, industries, isGeneric);
  
  return {
    type,
    companies,
    roles,
    industries,
    locations,
    isGeneric,
    originalQuery: query,
    confidence,
    suggestedFollowUp,
  };
}

function extractCompanies(query: string): string[] {
  const found: string[] = [];
  
  // Sort aliases by length (longest first) to match longer names before shorter ones
  const sortedAliases = Object.entries(COMPANY_ALIASES)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [alias, fullName] of sortedAliases) {
    // Use word boundary matching
    const regex = new RegExp(`\\b${escapeRegex(alias)}\\b`, 'i');
    if (regex.test(query) && !found.includes(fullName)) {
      found.push(fullName);
    }
  }
  
  return found;
}

function extractRoles(query: string): string[] {
  const found: string[] = [];
  
  for (const role of ROLE_PATTERNS) {
    const regex = new RegExp(`\\b${escapeRegex(role)}s?\\b`, 'i');
    if (regex.test(query)) {
      // Normalize the role
      const normalized = role.charAt(0).toUpperCase() + role.slice(1);
      if (!found.includes(normalized)) {
        found.push(normalized);
      }
    }
  }
  
  return found;
}

function extractIndustries(query: string): string[] {
  const found: string[] = [];
  
  for (const { pattern, industry } of INDUSTRY_PATTERNS) {
    if (pattern.test(query) && !found.includes(industry)) {
      found.push(industry);
    }
  }
  
  return found;
}

function extractLocations(query: string): string[] {
  // Basic location extraction - can be expanded
  const locationPatterns = [
    /\b(new york|nyc|ny)\b/i,
    /\b(san francisco|sf|bay area)\b/i,
    /\b(los angeles|la)\b/i,
    /\b(chicago)\b/i,
    /\b(boston)\b/i,
    /\b(seattle)\b/i,
    /\b(london)\b/i,
    /\b(singapore)\b/i,
    /\b(hong kong)\b/i,
  ];
  
  const found: string[] = [];
  for (const pattern of locationPatterns) {
    const match = query.match(pattern);
    if (match) {
      found.push(match[1]);
    }
  }
  
  return found;
}

function determineQueryType(
  query: string, 
  companies: string[], 
  roles: string[], 
  industries: string[]
): { type: QueryType; confidence: number } {
  // Check for compare patterns first (often have two companies)
  if (companies.length >= 2) {
    for (const pattern of COMPARE_PATTERNS) {
      if (pattern.test(query)) {
        return { type: 'COMPARE', confidence: 0.9 };
      }
    }
  }
  
  // Check for EXITS_TO patterns
  for (const pattern of EXITS_TO_PATTERNS) {
    if (pattern.test(query)) {
      return { type: 'EXITS_TO', confidence: 0.85 };
    }
  }
  
  // Check for EXITS_FROM patterns
  for (const pattern of EXITS_FROM_PATTERNS) {
    if (pattern.test(query)) {
      return { type: 'EXITS_FROM', confidence: 0.85 };
    }
  }
  
  // If we have a company but unclear direction, default to EXITS_FROM (more common)
  if (companies.length > 0) {
    // Look for "to" vs "from" hints
    if (/\bto\s+(become|join|work|get)/i.test(query)) {
      return { type: 'EXITS_TO', confidence: 0.7 };
    }
    if (/\bfrom\b/i.test(query)) {
      return { type: 'EXITS_FROM', confidence: 0.7 };
    }
    
    // Default to generic about the company
    return { type: 'GENERIC', confidence: 0.6 };
  }
  
  // Need clarification
  return { type: 'CLARIFICATION', confidence: 0.3 };
}

function generateFollowUp(
  type: QueryType,
  companies: string[],
  roles: string[],
  industries: string[],
  isGeneric: boolean
): string | undefined {
  if (type === 'CLARIFICATION') {
    return "I'd be happy to help! Could you specify which company you're interested in? For example: 'Where do consultants from McKinsey exit to?' or 'What backgrounds do Google PMs have?'";
  }
  
  if (isGeneric && companies.length > 0 && type !== 'COMPARE') {
    return `I'll show you the top 10 most common exits. Would you like to filter by a specific role (e.g., "consultant", "analyst") or industry (e.g., "private equity", "tech")?`;
  }
  
  return undefined;
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Export for testing
export { COMPANY_ALIASES, ROLE_PATTERNS, INDUSTRY_PATTERNS };



