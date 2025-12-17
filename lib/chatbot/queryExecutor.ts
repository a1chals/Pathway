/**
 * Query Executor for PathSearch Chatbot
 * 
 * Executes parsed queries against the Aviato API and formats results
 */

import { ParsedQuery } from './queryParser';
import { aviato } from '../aviato';

export interface ExitDestination {
  company: string;
  count: number;
  percentage: number;
  roles: string[];
  avgYearsBeforeExit: number;
  industry?: string;
}

export interface ExitSource {
  company: string;
  count: number;
  percentage: number;
  roles: string[];
  industry?: string;
}

export interface QueryResult {
  success: boolean;
  type: ParsedQuery['type'];
  summary: string;
  data: {
    exits?: ExitDestination[];
    sources?: ExitSource[];
    comparison?: {
      company1: { name: string; exits: ExitDestination[] };
      company2: { name: string; exits: ExitDestination[] };
      winner?: string;
      insight: string;
    };
    totalPeopleAnalyzed?: number;
    topIndustries?: { industry: string; count: number; percentage: number }[];
  };
  followUpSuggestion?: string;
  error?: string;
  apiCallsUsed: number;
}

/**
 * Execute a parsed query and return results
 */
export async function executeQuery(parsedQuery: ParsedQuery): Promise<QueryResult> {
  try {
    switch (parsedQuery.type) {
      case 'EXITS_FROM':
        return await executeExitsFrom(parsedQuery);
      
      case 'EXITS_TO':
        return await executeExitsTo(parsedQuery);
      
      case 'COMPARE':
        return await executeCompare(parsedQuery);
      
      case 'GENERIC':
        return await executeGeneric(parsedQuery);
      
      case 'CLARIFICATION':
        return {
          success: true,
          type: 'CLARIFICATION',
          summary: "I need a bit more information to help you.",
          data: {},
          followUpSuggestion: parsedQuery.suggestedFollowUp,
          apiCallsUsed: 0,
        };
      
      default:
        return {
          success: false,
          type: parsedQuery.type,
          summary: "I couldn't understand that query.",
          data: {},
          error: "Unknown query type",
          apiCallsUsed: 0,
        };
    }
  } catch (error) {
    console.error('Query execution error:', error);
    return {
      success: false,
      type: parsedQuery.type,
      summary: "An error occurred while processing your query.",
      data: {},
      error: error instanceof Error ? error.message : 'Unknown error',
      apiCallsUsed: 0,
    };
  }
}

/**
 * Execute EXITS_FROM query - where do people from X go?
 */
async function executeExitsFrom(query: ParsedQuery): Promise<QueryResult> {
  const companyName = query.companies[0];
  if (!companyName) {
    return {
      success: false,
      type: 'EXITS_FROM',
      summary: "Please specify a company name.",
      data: {},
      error: "No company specified",
      apiCallsUsed: 0,
    };
  }

  let apiCallsUsed = 0;

  // Step 1: Search for company to get ID
  const searchResult = await aviato.searchCompanies({ nameQuery: companyName, limit: 1 });
  apiCallsUsed++;

  if (!searchResult.items || searchResult.items.length === 0) {
    return {
      success: false,
      type: 'EXITS_FROM',
      summary: `I couldn't find a company matching "${companyName}".`,
      data: {},
      error: "Company not found",
      apiCallsUsed,
    };
  }

  const company = searchResult.items[0];

  // Step 2: Get former employees (people who left this company)
  const employeesResult = await aviato.getCompanyEmployees(company.id, {
    perPage: 20, // Limit to conserve API credits (each will need enrichment)
    current: false, // Get former employees only
  });
  apiCallsUsed++;

  // Step 3: Enrich each person to get their full experience history
  // This lets us see where they went after leaving
  const enrichedPeople: Array<{
    personId: string;
    bainEndDate: string;
    bainRole: string;
    fullExperience: any[];
  }> = [];

  // Limit enrichment calls to conserve API credits
  const peopleToEnrich = employeesResult.employees.slice(0, 10);
  
  for (const emp of peopleToEnrich) {
    try {
      const enriched = await aviato.enrichPerson({ id: emp.personID });
      apiCallsUsed++;
      
      enrichedPeople.push({
        personId: emp.personID,
        bainEndDate: emp.endDate || '',
        bainRole: emp.positionList?.[0]?.title || 'Unknown',
        fullExperience: enriched.experienceList || [],
      });
    } catch (e) {
      // Skip if enrichment fails
      console.log(`Failed to enrich person ${emp.personID}:`, e);
    }
  }

  // Process enriched people into exit data
  const exitsResult = processEnrichedPeopleToExits(enrichedPeople, company.name);
  
  // Process and aggregate exits
  const exitMap = new Map<string, {
    count: number;
    roles: Set<string>;
    totalYears: number;
    industry: string;
  }>();

  for (const exit of exitsResult.exits) {
    // Filter by role if specified
    if (query.roles.length > 0) {
      const matchesRole = query.roles.some(role => 
        exit.start_role.toLowerCase().includes(role.toLowerCase())
      );
      if (!matchesRole) continue;
    }

    // Filter by target industry if specified
    if (query.industries.length > 0) {
      const matchesIndustry = query.industries.some(ind => 
        exit.industry.toLowerCase().includes(ind.toLowerCase())
      );
      if (!matchesIndustry) continue;
    }

    const key = exit.exit_company;
    if (!exitMap.has(key)) {
      exitMap.set(key, {
        count: 0,
        roles: new Set(),
        totalYears: 0,
        industry: exit.industry,
      });
    }
    
    const entry = exitMap.get(key)!;
    entry.count++;
    entry.roles.add(exit.exit_role);
    entry.totalYears += exit.avg_years_before_exit;
  }

  // Convert to sorted array
  const totalExits = exitsResult.exits.length;
  const exits: ExitDestination[] = Array.from(exitMap.entries())
    .map(([companyName, data]) => ({
      company: companyName,
      count: data.count,
      percentage: Math.round((data.count / totalExits) * 100),
      roles: Array.from(data.roles).slice(0, 3),
      avgYearsBeforeExit: Math.round((data.totalYears / data.count) * 10) / 10,
      industry: data.industry,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10

  // Calculate industry breakdown
  const industryMap = new Map<string, number>();
  for (const exit of exitsResult.exits) {
    const ind = exit.industry;
    industryMap.set(ind, (industryMap.get(ind) || 0) + 1);
  }
  
  const topIndustries = Array.from(industryMap.entries())
    .map(([industry, count]) => ({
      industry,
      count,
      percentage: Math.round((count / totalExits) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Generate summary
  const roleFilter = query.roles.length > 0 ? ` (${query.roles.join(', ')})` : '';
  const industryFilter = query.industries.length > 0 ? ` to ${query.industries.join('/')}` : '';
  
  const summary = exits.length > 0
    ? `Here's where ${company.name}${roleFilter} alumni typically go${industryFilter}:`
    : `I found ${totalExits} former employees but couldn't identify clear exit patterns.`;

  return {
    success: true,
    type: 'EXITS_FROM',
    summary,
    data: {
      exits,
      totalPeopleAnalyzed: totalExits,
      topIndustries,
    },
    followUpSuggestion: query.isGeneric 
      ? "Would you like to filter by a specific role or target industry?"
      : undefined,
    apiCallsUsed,
  };
}

/**
 * Execute EXITS_TO query - where do people at X come from?
 */
async function executeExitsTo(query: ParsedQuery): Promise<QueryResult> {
  const companyName = query.companies[0];
  if (!companyName) {
    return {
      success: false,
      type: 'EXITS_TO',
      summary: "Please specify a company name.",
      data: {},
      error: "No company specified",
      apiCallsUsed: 0,
    };
  }

  let apiCallsUsed = 0;

  // Step 1: Search for company to get ID
  const searchResult = await aviato.searchCompanies({ nameQuery: companyName, limit: 1 });
  apiCallsUsed++;

  if (!searchResult.items || searchResult.items.length === 0) {
    return {
      success: false,
      type: 'EXITS_TO',
      summary: `I couldn't find a company matching "${companyName}".`,
      data: {},
      error: "Company not found",
      apiCallsUsed,
    };
  }

  const company = searchResult.items[0];

  // Step 2: Get current employees (to see where they came from)
  const employeesResult = await aviato.getCompanyEmployees(company.id, {
    perPage: 100,
    current: true, // Get current employees
  });
  apiCallsUsed++;
  
  // Process employee backgrounds
  const sourceMap = new Map<string, {
    count: number;
    roles: Set<string>;
    industry: string;
  }>();

  let matchedEmployees = 0;

  for (const employee of employeesResult.employees) {
    // Filter by current role if specified
    if (query.roles.length > 0) {
      const currentRole = employee.positionList?.[0]?.title || '';
      const matchesRole = query.roles.some(role => 
        currentRole.toLowerCase().includes(role.toLowerCase())
      );
      if (!matchesRole) continue;
    }
    
    matchedEmployees++;

    // Get their experience list and find previous company
    const experiences = employee.person?.experienceList || [];
    
    // Find the experience right before joining current company
    for (const exp of experiences) {
      if (exp.companyName && exp.companyName !== company.name) {
        const key = exp.companyName;
        if (!sourceMap.has(key)) {
          sourceMap.set(key, {
            count: 0,
            roles: new Set(),
            industry: categorizeCompany(exp.companyName),
          });
        }
        
        const entry = sourceMap.get(key)!;
        entry.count++;
        
        const role = exp.positionList?.[0]?.title;
        if (role) entry.roles.add(role);
        
        break; // Only count the most recent previous company
      }
    }
  }

  // Convert to sorted array
  const totalAnalyzed = matchedEmployees;
  const sources: ExitSource[] = Array.from(sourceMap.entries())
    .map(([companyName, data]) => ({
      company: companyName,
      count: data.count,
      percentage: totalAnalyzed > 0 ? Math.round((data.count / totalAnalyzed) * 100) : 0,
      roles: Array.from(data.roles).slice(0, 3),
      industry: data.industry,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10

  // Calculate industry breakdown
  const industryMap = new Map<string, number>();
  for (const source of sources) {
    if (source.industry) {
      industryMap.set(source.industry, (industryMap.get(source.industry) || 0) + source.count);
    }
  }
  
  const topIndustries = Array.from(industryMap.entries())
    .map(([industry, count]) => ({
      industry,
      count,
      percentage: totalAnalyzed > 0 ? Math.round((count / totalAnalyzed) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Generate summary
  const roleFilter = query.roles.length > 0 ? `${query.roles.join('/')}s` : 'employees';
  
  const summary = sources.length > 0
    ? `Here's where ${company.name} ${roleFilter} typically come from:`
    : `I analyzed ${totalAnalyzed} employees but couldn't identify clear source patterns.`;

  return {
    success: true,
    type: 'EXITS_TO',
    summary,
    data: {
      sources,
      totalPeopleAnalyzed: totalAnalyzed,
      topIndustries,
    },
    followUpSuggestion: query.isGeneric 
      ? "Would you like to filter by a specific role (e.g., 'Product Manager')?"
      : undefined,
    apiCallsUsed,
  };
}

/**
 * Execute COMPARE query - compare two companies
 */
async function executeCompare(query: ParsedQuery): Promise<QueryResult> {
  if (query.companies.length < 2) {
    return {
      success: false,
      type: 'COMPARE',
      summary: "Please specify two companies to compare.",
      data: {},
      error: "Need at least two companies",
      apiCallsUsed: 0,
    };
  }

  const [company1Name, company2Name] = query.companies;
  
  // Execute EXITS_FROM for both companies
  const query1: ParsedQuery = { ...query, companies: [company1Name] };
  const query2: ParsedQuery = { ...query, companies: [company2Name] };
  
  const [result1, result2] = await Promise.all([
    executeExitsFrom(query1),
    executeExitsFrom(query2),
  ]);

  const apiCallsUsed = result1.apiCallsUsed + result2.apiCallsUsed;

  if (!result1.success || !result2.success) {
    return {
      success: false,
      type: 'COMPARE',
      summary: "I had trouble getting data for one of the companies.",
      data: {},
      error: result1.error || result2.error,
      apiCallsUsed,
    };
  }

  // Compare the results
  const targetIndustry = query.industries[0] || 'Private Equity'; // Default comparison
  
  const exits1 = result1.data.exits || [];
  const exits2 = result2.data.exits || [];
  
  // Calculate exit rate to target industry
  const targetExits1 = exits1.filter(e => 
    e.industry?.toLowerCase().includes(targetIndustry.toLowerCase())
  );
  const targetExits2 = exits2.filter(e => 
    e.industry?.toLowerCase().includes(targetIndustry.toLowerCase())
  );

  const rate1 = targetExits1.reduce((sum, e) => sum + e.percentage, 0);
  const rate2 = targetExits2.reduce((sum, e) => sum + e.percentage, 0);

  const winner = rate1 > rate2 ? company1Name : rate2 > rate1 ? company2Name : undefined;
  
  let insight: string;
  if (winner) {
    const diff = Math.abs(rate1 - rate2);
    insight = `${winner} shows ${diff}% higher exit rate to ${targetIndustry}. `;
    
    // Add specific destination info
    const winnerExits = winner === company1Name ? targetExits1 : targetExits2;
    if (winnerExits.length > 0) {
      insight += `Top destinations include ${winnerExits.slice(0, 2).map(e => e.company).join(' and ')}.`;
    }
  } else {
    insight = `Both companies show similar exit rates to ${targetIndustry} (around ${rate1}%).`;
  }

  const summary = `Comparing ${company1Name} vs ${company2Name} for ${targetIndustry} exits:`;

  return {
    success: true,
    type: 'COMPARE',
    summary,
    data: {
      comparison: {
        company1: { name: company1Name, exits: exits1 },
        company2: { name: company2Name, exits: exits2 },
        winner,
        insight,
      },
    },
    apiCallsUsed,
  };
}

/**
 * Execute GENERIC query - general info about a company
 */
async function executeGeneric(query: ParsedQuery): Promise<QueryResult> {
  // For generic queries, default to EXITS_FROM with top 10
  const result = await executeExitsFrom(query);
  
  if (result.success) {
    result.followUpSuggestion = 
      "These are the top 10 exit destinations by volume. Would you like to:\n" +
      "• Filter by role (e.g., 'consultants', 'analysts')\n" +
      "• Filter by industry (e.g., 'to private equity', 'to tech')\n" +
      "• See where employees come FROM instead?";
  }
  
  return result;
}

/**
 * Helper to categorize a company into an industry
 */
function categorizeCompany(companyName: string): string {
  const name = companyName.toLowerCase();

  if (/business school|mba|university|stanford|harvard|wharton/i.test(name)) {
    return 'Education';
  }
  if (/capital|ventures|partners|vc|sequoia|andreessen|a16z|accel/i.test(name)) {
    return 'Venture Capital';
  }
  if (/equity|blackstone|kkr|carlyle|apollo|tpg/i.test(name)) {
    return 'Private Equity';
  }
  if (/mckinsey|bain|bcg|boston consulting|deloitte|accenture|pwc|ey|kpmg/i.test(name)) {
    return 'Consulting';
  }
  if (/goldman|morgan stanley|jpmorgan|bank|citi|barclays/i.test(name)) {
    return 'Banking';
  }
  if (/google|meta|facebook|amazon|apple|microsoft|netflix/i.test(name)) {
    return 'Big Tech';
  }

  return 'Other';
}

/**
 * Process Aviato employees result into exit data format
 */
interface ProcessedExit {
  start_role: string;
  exit_role: string;
  exit_company: string;
  industry: string;
  avg_years_before_exit: number;
}

interface ProcessedExitsResult {
  exits: ProcessedExit[];
  totalCount: number;
}

import { EmployeesResult, PersonSearchResult, AviatoExperience } from '../aviato';

/**
 * Process enriched people data to find where they went after leaving a company
 */
function processEnrichedPeopleToExits(
  enrichedPeople: Array<{
    personId: string;
    bainEndDate: string;
    bainRole: string;
    fullExperience: AviatoExperience[];
  }>,
  sourceCompanyName: string
): ProcessedExitsResult {
  const exits: ProcessedExit[] = [];

  for (const person of enrichedPeople) {
    const experiences = person.fullExperience;
    
    // Sort experiences by start date (most recent first)
    const sortedExp = [...experiences].sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA; // Most recent first
    });

    // Find the source company experience
    const sourceExp = sortedExp.find(exp => 
      exp.companyName?.toLowerCase().includes(sourceCompanyName.toLowerCase())
    );

    if (!sourceExp) continue;

    const sourceEndDate = sourceExp.endDate ? new Date(sourceExp.endDate) : null;

    // Find the first job that started after leaving source company
    let nextJob: AviatoExperience | null = null;
    
    for (const exp of sortedExp) {
      // Skip the source company itself
      if (exp.companyName?.toLowerCase().includes(sourceCompanyName.toLowerCase())) {
        continue;
      }
      
      const expStartDate = exp.startDate ? new Date(exp.startDate) : null;
      
      // If this job started after leaving source, it's likely their next job
      if (sourceEndDate && expStartDate && expStartDate >= sourceEndDate) {
        // Pick the one closest to the source end date
        if (!nextJob) {
          nextJob = exp;
        } else {
          const currentDiff = Math.abs(expStartDate.getTime() - sourceEndDate.getTime());
          const nextJobStart = nextJob.startDate ? new Date(nextJob.startDate) : null;
          const existingDiff = nextJobStart ? Math.abs(nextJobStart.getTime() - sourceEndDate.getTime()) : Infinity;
          if (currentDiff < existingDiff) {
            nextJob = exp;
          }
        }
      }
    }

    if (!nextJob) continue;

    // Calculate tenure at source
    let yearsAtSource = 2; // Default
    if (sourceExp.startDate && sourceExp.endDate) {
      const start = new Date(sourceExp.startDate);
      const end = new Date(sourceExp.endDate);
      yearsAtSource = (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    }

    exits.push({
      start_role: person.bainRole,
      exit_role: nextJob.positionList?.[0]?.title || 'Unknown',
      exit_company: nextJob.companyName || 'Unknown',
      industry: categorizeCompany(nextJob.companyName || ''),
      avg_years_before_exit: Math.max(0, yearsAtSource),
    });
  }

  return {
    exits,
    totalCount: exits.length,
  };
}

/**
 * Process person search results into exit data
 * This is used when searching for people who previously worked at a company
 */
function processPeopleToExits(
  peopleResult: PersonSearchResult,
  sourceCompanyName: string
): ProcessedExitsResult {
  const exits: ProcessedExit[] = [];

  for (const person of peopleResult.items) {
    const experiences = person.experienceList || [];
    
    // Find the experience at the source company
    let sourceExpIndex = -1;
    for (let i = 0; i < experiences.length; i++) {
      if (experiences[i].companyName?.toLowerCase().includes(sourceCompanyName.toLowerCase())) {
        sourceExpIndex = i;
        break;
      }
    }

    if (sourceExpIndex === -1) continue;

    const sourceExp = experiences[sourceExpIndex];
    
    // Find the next company after leaving source (experiences are reverse-chronological)
    // So we look at earlier indices for more recent jobs
    let nextCompanyExp = null;
    for (let i = sourceExpIndex - 1; i >= 0; i--) {
      if (experiences[i].companyName && 
          !experiences[i].companyName!.toLowerCase().includes(sourceCompanyName.toLowerCase())) {
        nextCompanyExp = experiences[i];
        break;
      }
    }

    if (!nextCompanyExp) {
      // Maybe they're currently at the next company (index 0)
      if (sourceExpIndex > 0 && experiences[0].companyName) {
        nextCompanyExp = experiences[0];
      } else {
        continue; // No next company found
      }
    }

    // Calculate tenure at source company
    let yearsAtSource = 2; // Default estimate
    if (sourceExp.startDate && sourceExp.endDate) {
      const start = new Date(sourceExp.startDate);
      const end = new Date(sourceExp.endDate);
      yearsAtSource = (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    }

    const startRole = sourceExp.positionList?.[0]?.title || 'Unknown';
    const exitRole = nextCompanyExp.positionList?.[0]?.title || 'Unknown';
    const exitCompany = nextCompanyExp.companyName || 'Unknown';

    exits.push({
      start_role: startRole,
      exit_role: exitRole,
      exit_company: exitCompany,
      industry: categorizeCompany(exitCompany),
      avg_years_before_exit: Math.max(0, yearsAtSource),
    });
  }

  return {
    exits,
    totalCount: exits.length,
  };
}

function processEmployeesToExits(
  employeesResult: EmployeesResult,
  sourceCompanyName: string
): ProcessedExitsResult {
  const exits: ProcessedExit[] = [];

  for (const employee of employeesResult.employees) {
    // Find the experience at the source company
    const experiences = employee.person?.experienceList || [];
    let sourceExp = null;
    let sourceExpIndex = -1;

    for (let i = 0; i < experiences.length; i++) {
      if (experiences[i].companyName?.toLowerCase().includes(sourceCompanyName.toLowerCase())) {
        sourceExp = experiences[i];
        sourceExpIndex = i;
        break;
      }
    }

    if (!sourceExp) continue;

    // Find the next company after leaving source
    // Experiences are usually sorted reverse-chronologically
    let nextCompanyExp = null;
    for (let i = sourceExpIndex - 1; i >= 0; i--) {
      if (experiences[i].companyName && 
          !experiences[i].companyName!.toLowerCase().includes(sourceCompanyName.toLowerCase())) {
        nextCompanyExp = experiences[i];
        break;
      }
    }

    if (!nextCompanyExp) continue;

    // Calculate tenure at source company
    let yearsAtSource = 2; // Default estimate
    if (sourceExp.startDate && sourceExp.endDate) {
      const start = new Date(sourceExp.startDate);
      const end = new Date(sourceExp.endDate);
      yearsAtSource = (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    }

    const startRole = sourceExp.positionList?.[0]?.title || 'Unknown';
    const exitRole = nextCompanyExp.positionList?.[0]?.title || 'Unknown';
    const exitCompany = nextCompanyExp.companyName || 'Unknown';

    exits.push({
      start_role: startRole,
      exit_role: exitRole,
      exit_company: exitCompany,
      industry: categorizeCompany(exitCompany),
      avg_years_before_exit: Math.max(0, yearsAtSource),
    });
  }

  return {
    exits,
    totalCount: exits.length,
  };
}
