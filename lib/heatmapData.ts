import { ExitData, CompanyType } from "@/types";

export interface HeatmapCompany {
  id: string;
  name: string;
  industry: CompanyType;
  employeeCount: number;
  avgYearsBeforeExit: number;
  incoming: number;
  outgoing: number;
  exits: Array<{ to: string; count: number; avgYears: number }>;
  mbaPercentage: number;
  logo?: string;
  metadata?: CompanyMetadata;
}

export interface HeatmapData {
  name: string;
  children: Array<{
    name: CompanyType;
    children: HeatmapCompany[];
  }>;
}

export interface CompanyMetadata {
  id: string;
  name: string;
  industry: CompanyType;
  employeeCount: number;
  founded: number;
  headquarters: string;
  website: string;
  description: string;
  focusAreas: string[];
  notableFacts: string[];
  logo?: string;
}

// Company logos (using clearbit for consistency)
export const companyLogos: Record<string, string> = {
  // These will be populated from API data or can be used as fallbacks
};

// Placeholder for API-fetched heatmap data
export let heatmapData: HeatmapData = {
  name: "All Companies",
  children: [],
};

// Function to update heatmap data from API
export function setHeatmapData(data: HeatmapData): void {
  heatmapData = data;
}

// Helper function to generate heatmap data from exit data
export function generateHeatmapDataFromExits(allExits: ExitData[]): HeatmapData {
  // Track company statistics
  const companyStats = new Map<string, {
    incoming: number;
    outgoing: number;
    totalYears: number;
    count: number;
    exitMap: Map<string, { count: number; totalYears: number }>;
    mbaCount: number;
  }>();

  // Initialize stats for all companies
  const allCompanies = new Set<string>();
  allExits.forEach(exit => {
    allCompanies.add(exit.start_company);
    allCompanies.add(exit.exit_company);
  });

  allCompanies.forEach(company => {
    if (!companyStats.has(company)) {
      companyStats.set(company, {
        incoming: 0,
        outgoing: 0,
        totalYears: 0,
        count: 0,
        exitMap: new Map(),
        mbaCount: 0,
      });
    }
  });

  // Build stats
  allExits.forEach(exit => {
    const startStats = companyStats.get(exit.start_company)!;
    const exitStats = companyStats.get(exit.exit_company)!;
    
    startStats.outgoing++;
    startStats.count++;
    startStats.totalYears += exit.avg_years_before_exit;
    
    if (exit.industry === "Graduate Education" || 
        exit.exit_company.includes("Business School") ||
        exit.exit_role.includes("MBA")) {
      startStats.mbaCount++;
    }
    
    exitStats.incoming++;
    
    const exitEntry = startStats.exitMap.get(exit.exit_company);
    if (exitEntry) {
      exitEntry.count++;
      exitEntry.totalYears += exit.avg_years_before_exit;
    } else {
      startStats.exitMap.set(exit.exit_company, {
        count: 1,
        totalYears: exit.avg_years_before_exit,
      });
    }
  });

  // Generate companies
  const companies: HeatmapCompany[] = Array.from(companyStats.entries()).map(([name, stats]) => {
    const allExitsForCompany = Array.from(stats.exitMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map(([company, data]) => ({
        to: company,
        count: data.count,
        avgYears: data.totalYears / data.count,
      }));

    return {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: name,
      industry: "Other" as CompanyType, // Will be populated from API
      employeeCount: 0, // Will be populated from API
      avgYearsBeforeExit: stats.count > 0 ? stats.totalYears / stats.count : 0,
      incoming: stats.incoming,
      outgoing: stats.outgoing,
      exits: allExitsForCompany,
      mbaPercentage: stats.outgoing > 0 ? (stats.mbaCount / stats.outgoing) * 100 : 0,
    };
  });

  // Group by industry
  const grouped = new Map<CompanyType, HeatmapCompany[]>();
  companies.forEach(company => {
    if (!grouped.has(company.industry)) {
      grouped.set(company.industry, []);
    }
    grouped.get(company.industry)!.push(company);
  });

  const children = Array.from(grouped.entries()).map(([industry, companies]) => ({
    name: industry,
    children: companies.sort((a, b) => b.employeeCount - a.employeeCount),
  }));

  return {
    name: "All Companies",
    children,
  };
}

// Helper function to get raw exit data for a specific company (to be replaced with API call)
export function getRawExitDataForCompany(companyName: string): ExitData[] {
  // This will be replaced with an API call
  return [];
}

// Helper function to get company metadata (to be replaced with API call)
export function getCompanyMetadata(companyName: string): CompanyMetadata | null {
  // This will be replaced with an API call
  return null;
}
