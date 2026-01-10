import { NextRequest, NextResponse } from 'next/server';
import { aviato, AviatoEmployee, AviatoExperience } from '@/lib/aviato';
import { ExitData } from '@/types';

/**
 * Get exit data for a company - finds former employees and where they went
 * 
 * This endpoint:
 * 1. Gets former employees of the specified company
 * 2. For each person, looks at their experience after leaving
 * 3. Aggregates the data into exit patterns
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');
    const companyName = searchParams.get('companyName');
    const perPage = parseInt(searchParams.get('perPage') || '100', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    if (!companyId) {
      return NextResponse.json(
        { error: 'companyId is required' },
        { status: 400 }
      );
    }

    // Get former employees (current=false)
    const employeesResult = await aviato.getCompanyEmployees(companyId, {
      perPage,
      page,
      current: false, // Only former employees
    });

    const exits: ExitData[] = [];

    // Process each former employee to find their next role
    for (const employee of employeesResult.employees) {
      const exitData = processEmployeeExit(employee, companyName || employee.companyName);
      if (exitData) {
        exits.push(exitData);
      }
    }

    return NextResponse.json({
      exits,
      totalResults: employeesResult.totalResults,
      pages: employeesResult.pages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Get exits error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get exits' },
      { status: 500 }
    );
  }
}

/**
 * Process an employee's career history to extract exit data
 */
function processEmployeeExit(employee: AviatoEmployee, sourceCompanyName: string): ExitData | null {
  const person = employee.person;
  const experiences = person.experienceList || [];
  
  // Find the experience at the source company
  const sourceExperience = experiences.find(
    exp => exp.companyID === employee.companyID || 
           exp.companyName?.toLowerCase() === sourceCompanyName.toLowerCase()
  );

  if (!sourceExperience) {
    return null;
  }

  // Find the next experience after leaving the source company
  const nextExperience = findNextExperience(experiences, sourceExperience, sourceCompanyName);

  if (!nextExperience) {
    return null;
  }

  // Calculate years at source company
  const yearsAtSource = calculateYearsAtCompany(sourceExperience);

  // Get the role at source company
  const sourceRole = getLatestRole(sourceExperience);
  const exitRole = getLatestRole(nextExperience);

  // Determine industry based on company name (can be enhanced with company enrichment)
  const exitIndustry = categorizeCompany(nextExperience.companyName);

  return {
    start_company: sourceCompanyName,
    start_role: sourceRole,
    exit_company: nextExperience.companyName,
    exit_role: exitRole,
    industry: exitIndustry,
    avg_years_before_exit: yearsAtSource,
  };
}

/**
 * Find the next experience after leaving a company
 */
function findNextExperience(
  experiences: AviatoExperience[],
  sourceExperience: AviatoExperience,
  sourceCompanyName: string
): AviatoExperience | null {
  if (!sourceExperience.endDate) {
    return null; // Still at the company
  }

  const sourceEndDate = new Date(sourceExperience.endDate);

  // Sort experiences by start date
  const sortedExperiences = experiences
    .filter(exp => 
      exp.companyName?.toLowerCase() !== sourceCompanyName.toLowerCase() &&
      exp.startDate
    )
    .sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateA - dateB;
    });

  // Find the first experience that started after or around when they left
  for (const exp of sortedExperiences) {
    if (exp.startDate) {
      const startDate = new Date(exp.startDate);
      // Allow some overlap (within 3 months)
      if (startDate >= new Date(sourceEndDate.getTime() - 90 * 24 * 60 * 60 * 1000)) {
        return exp;
      }
    }
  }

  return null;
}

/**
 * Calculate years at a company
 */
function calculateYearsAtCompany(experience: AviatoExperience): number {
  if (!experience.startDate) {
    return 2.5; // Default estimate
  }

  const startDate = new Date(experience.startDate);
  const endDate = experience.endDate ? new Date(experience.endDate) : new Date();
  
  const years = (endDate.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return Math.round(years * 10) / 10; // Round to 1 decimal
}

/**
 * Get the latest/most senior role from an experience
 */
function getLatestRole(experience: AviatoExperience): string {
  if (!experience.positionList || experience.positionList.length === 0) {
    return 'Unknown Role';
  }

  // Sort by end date (null = current) and take the latest
  const sorted = [...experience.positionList].sort((a, b) => {
    if (!a.endDate) return -1;
    if (!b.endDate) return 1;
    return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
  });

  return sorted[0].title || 'Unknown Role';
}

/**
 * Categorize a company into an industry
 */
function categorizeCompany(companyName: string): string {
  const name = companyName.toLowerCase();

  // MBA/Education
  if (name.includes('business school') || name.includes('mba') || 
      name.includes('university') || name.includes('school of') ||
      name.includes('stanford') || name.includes('harvard') ||
      name.includes('wharton') || name.includes('mit sloan') ||
      name.includes('kellogg') || name.includes('booth')) {
    return 'Graduate Education';
  }

  // Venture Capital
  if (name.includes('capital') || name.includes('ventures') || 
      name.includes('partners') || name.includes('vc') ||
      name.includes('sequoia') || name.includes('andreessen') ||
      name.includes('a16z') || name.includes('accel') ||
      name.includes('benchmark') || name.includes('greylock')) {
    return 'Venture Capital';
  }

  // Private Equity
  if (name.includes('equity') || name.includes('blackstone') ||
      name.includes('kkr') || name.includes('carlyle') ||
      name.includes('apollo') || name.includes('tpg')) {
    return 'Private Equity';
  }

  // Consulting
  if (name.includes('mckinsey') || name.includes('bain') ||
      name.includes('bcg') || name.includes('boston consulting') ||
      name.includes('deloitte') || name.includes('accenture') ||
      name.includes('pwc') || name.includes('ey ') ||
      name.includes('kpmg') || name.includes('oliver wyman')) {
    return 'Consulting';
  }

  // Banking
  if (name.includes('goldman') || name.includes('morgan stanley') ||
      name.includes('jpmorgan') || name.includes('bank') ||
      name.includes('citi') || name.includes('barclays') ||
      name.includes('credit suisse') || name.includes('ubs')) {
    return 'Banking';
  }

  // Big Tech
  if (name.includes('google') || name.includes('meta') ||
      name.includes('facebook') || name.includes('amazon') ||
      name.includes('apple') || name.includes('microsoft') ||
      name.includes('netflix')) {
    return 'Big Tech';
  }

  // Startups (common indicators)
  if (name.includes('founder') || name.includes('co-founder') ||
      name.includes('stealth') || name.includes('startup')) {
    return 'Startup';
  }

  // Tech companies
  if (name.includes('tech') || name.includes('software') ||
      name.includes('ai') || name.includes('data') ||
      name.includes('cloud') || name.includes('saas')) {
    return 'Tech';
  }

  return 'Other';
}






