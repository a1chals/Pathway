/**
 * Data fetching utilities for Talent Exit Network visualization
 */

import { supabase, CachedExit, CachedPerson } from './supabase';

export interface SourceCompany {
  name: string;
  category: 'investment_banking' | 'consulting';
  displayName: string; // Normalized name for display
}

export interface IndustryExit {
  industry: string;
  count: number;
  percentage: number;
}

export interface CompanyInIndustry {
  companyName: string;
  count: number;
  percentage: number;
}

export interface PersonExit {
  personId: string;
  fullName: string | null;
  linkedinUrl: string | null;
  sourceCompanyName: string;
  sourceRole: string;
  exitRole: string;
  exitCompanyName: string;
  yearsAtSource: number;
  sourceStartDate: string | null;
  sourceEndDate: string | null;
  exitStartDate: string | null;
}

export interface CompanySummary {
  displayName: string;
  totalExits: number;
  topIndustries: IndustryExit[];
  logoUrl?: string;
}

// The 17 source companies - normalized
export const SOURCE_COMPANIES: SourceCompany[] = [
  // Investment Banking (7)
  { name: 'Goldman Sachs', displayName: 'Goldman Sachs', category: 'investment_banking' },
  { name: 'Morgan Stanley', displayName: 'Morgan Stanley', category: 'investment_banking' },
  { name: 'J.P. Morgan', displayName: 'J.P. Morgan', category: 'investment_banking' },
  { name: 'JPMorgan', displayName: 'J.P. Morgan', category: 'investment_banking' },
  { name: 'Centerview Partners', displayName: 'Centerview Partners', category: 'investment_banking' },
  { name: 'Evercore', displayName: 'Evercore', category: 'investment_banking' },
  { name: 'PJT Partners', displayName: 'PJT Partners', category: 'investment_banking' },
  { name: 'Lazard', displayName: 'Lazard', category: 'investment_banking' },
  // Consulting (10)
  { name: 'McKinsey', displayName: 'McKinsey & Company', category: 'consulting' },
  { name: 'McKinsey & Company', displayName: 'McKinsey & Company', category: 'consulting' },
  { name: 'Boston Consulting Group', displayName: 'Boston Consulting Group', category: 'consulting' },
  { name: 'Bain & Company', displayName: 'Bain & Company', category: 'consulting' },
  { name: 'Deloitte', displayName: 'Deloitte', category: 'consulting' },
  { name: 'Monitor Deloitte', displayName: 'Monitor Deloitte', category: 'consulting' },
  { name: 'Strategy&', displayName: 'Strategy&', category: 'consulting' },
  { name: 'EY', displayName: 'EY', category: 'consulting' },
  { name: 'EY-Parthenon', displayName: 'EY-Parthenon', category: 'consulting' },
  { name: 'KPMG', displayName: 'KPMG', category: 'consulting' },
  { name: 'Oliver Wyman', displayName: 'Oliver Wyman', category: 'consulting' },
  { name: 'L.E.K. Consulting', displayName: 'L.E.K. Consulting', category: 'consulting' },
  { name: 'Kearney', displayName: 'Kearney', category: 'consulting' },
];

// Get logo URL for a company
export function getCompanyLogoUrl(companyName: string): string | null {
  const domainMap: Record<string, string> = {
    'Goldman Sachs': 'goldmansachs.com',
    'Morgan Stanley': 'morganstanley.com',
    'J.P. Morgan': 'jpmorgan.com',
    'Centerview Partners': 'centerviewpartners.com',
    'Evercore': 'evercore.com',
    'PJT Partners': 'pjtpartners.com',
    'Lazard': 'lazard.com',
    'McKinsey & Company': 'mckinsey.com',
    'Boston Consulting Group': 'bcg.com',
    'Bain & Company': 'bain.com',
    'Deloitte': 'deloitte.com',
    'Monitor Deloitte': 'deloitte.com',
    'Strategy&': 'strategyand.pwc.com',
    'EY': 'ey.com',
    'EY-Parthenon': 'ey.com',
    'KPMG': 'kpmg.com',
    'Oliver Wyman': 'oliverwyman.com',
    'L.E.K. Consulting': 'lek.com',
    'Kearney': 'kearney.com',
  };
  
  const domain = domainMap[companyName];
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}`;
}

/**
 * Get company summaries for a category
 */
export async function getCompanySummaries(
  category: 'investment_banking' | 'consulting'
): Promise<Map<string, CompanySummary>> {
  const companies = SOURCE_COMPANIES.filter(c => c.category === category);
  
  // Group by display name
  const companyGroups = new Map<string, SourceCompany[]>();
  companies.forEach(company => {
    if (!companyGroups.has(company.displayName)) {
      companyGroups.set(company.displayName, []);
    }
    companyGroups.get(company.displayName)!.push(company);
  });
  
  const result = new Map<string, CompanySummary>();
  
  for (const [displayName, variations] of companyGroups.entries()) {
    // Get all exits for all variations
    const allExits: any[] = [];
    for (const company of variations) {
      const { data, error } = await supabase
        .from('exits')
        .select('exit_industry')
        .ilike('source_company_name', `%${company.name}%`);
      
      if (!error && data) {
        allExits.push(...data);
      }
    }
    
    if (allExits.length === 0) continue;
    
    const total = allExits.length;
    const industryCounts = new Map<string, number>();
    
    allExits.forEach(exit => {
      const industry = exit.exit_industry || 'Other';
      industryCounts.set(industry, (industryCounts.get(industry) || 0) + 1);
    });
    
    const topIndustries: IndustryExit[] = Array.from(industryCounts.entries())
      .map(([industry, count]) => ({
        industry,
        count,
        percentage: Math.round((count / total) * 100 * 10) / 10,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 industries
    
    result.set(displayName, {
      displayName,
      totalExits: total,
      topIndustries,
      logoUrl: getCompanyLogoUrl(displayName),
    });
  }
  
  return result;
}

/**
 * Get industry breakdown for a specific company
 */
export async function getCompanyIndustryBreakdown(
  companyName: string
): Promise<IndustryExit[]> {
  // Find all variations
  const variations = SOURCE_COMPANIES.filter(c => 
    c.displayName === companyName || c.name.toLowerCase().includes(companyName.toLowerCase())
  );
  
  if (variations.length === 0) return [];
  
  const allExits: any[] = [];
  for (const company of variations) {
    const { data, error } = await supabase
      .from('exits')
      .select('exit_industry')
      .ilike('source_company_name', `%${company.name}%`);
    
    if (!error && data) {
      allExits.push(...data);
    }
  }
  
  if (allExits.length === 0) return [];
  
  const total = allExits.length;
  const industryCounts = new Map<string, number>();
  
  allExits.forEach(exit => {
    const industry = exit.exit_industry || 'Other';
    industryCounts.set(industry, (industryCounts.get(industry) || 0) + 1);
  });
  
  return Array.from(industryCounts.entries())
    .map(([industry, count]) => ({
      industry,
      count,
      percentage: Math.round((count / total) * 100 * 10) / 10,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get industry breakdown for all companies in a category
 */
export async function getIndustryBreakdownByCategory(
  category: 'investment_banking' | 'consulting'
): Promise<Map<string, IndustryExit[]>> {
  const companies = SOURCE_COMPANIES.filter(c => c.category === category);
  
  // Group companies by display name (e.g., merge "McKinsey" and "McKinsey & Company")
  const companyGroups = new Map<string, string[]>();
  const displayNames = new Map<string, string>();
  
  companies.forEach(company => {
    // Use simplified name as key
    let key = company.displayName.toLowerCase();
    
    if (!companyGroups.has(key)) {
      companyGroups.set(key, []);
      displayNames.set(key, company.displayName);
    }
    companyGroups.get(key)!.push(company.name);
  });
  
  const result = new Map<string, IndustryExit[]>();
  
  for (const [key, companyVariations] of companyGroups.entries()) {
    // Build query for all variations
    const allData: any[] = [];
    for (const name of companyVariations) {
      const { data, error } = await supabase
        .from('exits')
        .select('exit_industry')
        .ilike('source_company_name', `%${name}%`);
      
      if (!error && data) {
        allData.push(...data);
      }
    }
    
    if (allData.length === 0) continue;
    
    const total = allData.length;
    const industryCounts = new Map<string, number>();
    
    allData.forEach(exit => {
      const industry = exit.exit_industry || 'Other';
      industryCounts.set(industry, (industryCounts.get(industry) || 0) + 1);
    });
    
    const industryExits: IndustryExit[] = Array.from(industryCounts.entries())
      .map(([industry, count]) => ({
        industry,
        count,
        percentage: Math.round((count / total) * 100 * 10) / 10, // 1 decimal place
      }))
      .sort((a, b) => b.count - a.count);
    
    const displayName = displayNames.get(key)!;
    result.set(displayName, industryExits);
  }
  
  return result;
}

/**
 * Get all companies that exited to a specific industry from a source company
 */
export async function getCompaniesInIndustry(
  sourceCompanyName: string,
  industry: string
): Promise<CompanyInIndustry[]> {
  // Find all variations
  const variations = SOURCE_COMPANIES.filter(c => 
    c.displayName === sourceCompanyName || c.name.toLowerCase().includes(sourceCompanyName.toLowerCase())
  );
  
  const allData: any[] = [];
  for (const company of variations) {
    const { data, error } = await supabase
      .from('exits')
      .select('exit_company_name')
      .ilike('source_company_name', `%${company.name}%`)
      .eq('exit_industry', industry);
    
    if (!error && data) {
      allData.push(...data);
    }
  }
  
  if (allData.length === 0) return [];
  
  const total = allData.length;
  const companyCounts = new Map<string, number>();
  
  allData.forEach(exit => {
    const company = exit.exit_company_name || 'Unknown';
    companyCounts.set(company, (companyCounts.get(company) || 0) + 1);
  });
  
  return Array.from(companyCounts.entries())
    .map(([companyName, count]) => ({
      companyName,
      count,
      percentage: Math.round((count / total) * 100 * 10) / 10,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get all people who exited from a source company to a specific exit company
 */
export async function getPeopleExits(
  sourceCompanyName: string,
  exitCompanyName: string,
  industry?: string
): Promise<PersonExit[]> {
  // Find all variations
  const variations = SOURCE_COMPANIES.filter(c => 
    c.displayName === sourceCompanyName || c.name.toLowerCase().includes(sourceCompanyName.toLowerCase())
  );
  
  const allExits: any[] = [];
  for (const company of variations) {
    let query = supabase
      .from('exits')
      .select(`
        person_id,
        source_company_name,
        source_role,
        exit_role,
        exit_company_name,
        years_at_source,
        source_start_date,
        source_end_date,
        exit_start_date,
        exit_industry
      `)
      .ilike('source_company_name', `%${company.name}%`)
      .ilike('exit_company_name', `%${exitCompanyName}%`);
    
    if (industry) {
      query = query.eq('exit_industry', industry);
    }
    
    const { data, error } = await query;
    if (!error && data) {
      allExits.push(...data);
    }
  }
  
  if (allExits.length === 0) return [];
  
  // Get person details
  const personIds = [...new Set(allExits.map(e => e.person_id))];
  const { data: persons } = await supabase
    .from('persons')
    .select('aviato_id, full_name, linkedin_url')
    .in('aviato_id', personIds);
  
  const personMap = new Map(
    (persons || []).map(p => [p.aviato_id, p])
  );
  
  return allExits.map(exit => {
    const person = personMap.get(exit.person_id);
    return {
      personId: exit.person_id,
      fullName: person?.full_name || null,
      linkedinUrl: person?.linkedin_url || null,
      sourceCompanyName: exit.source_company_name,
      sourceRole: exit.source_role,
      exitRole: exit.exit_role,
      exitCompanyName: exit.exit_company_name,
      yearsAtSource: exit.years_at_source || 0,
      sourceStartDate: exit.source_start_date,
      sourceEndDate: exit.source_end_date,
      exitStartDate: exit.exit_start_date,
    };
  });
}

/**
 * Get all people who exited to a specific industry from a source company
 */
export async function getPeopleExitsByIndustry(
  sourceCompanyName: string,
  industry: string
): Promise<PersonExit[]> {
  // Find all variations
  const variations = SOURCE_COMPANIES.filter(c => 
    c.displayName === sourceCompanyName || c.name.toLowerCase().includes(sourceCompanyName.toLowerCase())
  );
  
  const allExits: any[] = [];
  for (const company of variations) {
    const { data: exits, error } = await supabase
      .from('exits')
      .select(`
        person_id,
        source_company_name,
        source_role,
        exit_role,
        exit_company_name,
        years_at_source,
        source_start_date,
        source_end_date,
        exit_start_date
      `)
      .ilike('source_company_name', `%${company.name}%`)
      .eq('exit_industry', industry);
    
    if (!error && exits) {
      allExits.push(...exits);
    }
  }
  
  if (allExits.length === 0) return [];
  
  const personIds = [...new Set(allExits.map(e => e.person_id))];
  const { data: persons } = await supabase
    .from('persons')
    .select('aviato_id, full_name, linkedin_url')
    .in('aviato_id', personIds);
  
  const personMap = new Map(
    (persons || []).map(p => [p.aviato_id, p])
  );
  
  return allExits.map(exit => {
    const person = personMap.get(exit.person_id);
    return {
      personId: exit.person_id,
      fullName: person?.full_name || null,
      linkedinUrl: person?.linkedin_url || null,
      sourceCompanyName: exit.source_company_name,
      sourceRole: exit.source_role,
      exitRole: exit.exit_role,
      exitCompanyName: exit.exit_company_name,
      yearsAtSource: exit.years_at_source || 0,
      sourceStartDate: exit.source_start_date,
      sourceEndDate: exit.source_end_date,
      exitStartDate: exit.exit_start_date,
    };
  });
}
