import { ExitData, NetworkData, NetworkNode, NetworkLink, CompanyType } from "@/types";

// Function to determine company type (to be replaced with API data)
function getCompanyType(companyName: string): CompanyType {
  // This will be populated from API data
  return "Other";
}

// Generate network data from exit data
export function generateNetworkData(allExits: ExitData[]): NetworkData {
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

  // Build links and update stats
  const linkMap = new Map<string, { weight: number; totalYears: number }>();
  
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
    
    const linkKey = `${exit.start_company}->${exit.exit_company}`;
    const link = linkMap.get(linkKey);
    if (link) {
      link.weight++;
      link.totalYears += exit.avg_years_before_exit;
    } else {
      linkMap.set(linkKey, {
        weight: 1,
        totalYears: exit.avg_years_before_exit,
      });
    }
  });

  // Generate nodes
  const nodes: NetworkNode[] = Array.from(companyStats.entries()).map(([name, stats]) => {
    const topExits = Array.from(stats.exitMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3)
      .map(([company, data]) => ({
        company,
        count: data.count,
        avgYears: data.totalYears / data.count,
      }));

    return {
      id: name,
      name: name,
      type: getCompanyType(name),
      incoming: stats.incoming,
      outgoing: stats.outgoing,
      avgYearsBeforeExit: stats.count > 0 ? stats.totalYears / stats.count : 0,
      topExitCompanies: topExits,
      mbaPercentage: stats.outgoing > 0 ? (stats.mbaCount / stats.outgoing) * 100 : 0,
    };
  });

  // Generate links
  const links: NetworkLink[] = Array.from(linkMap.entries()).map(([key, data]) => {
    const [source, target] = key.split("->");
    return {
      source,
      target,
      weight: data.weight,
      avgYears: data.totalYears / data.weight,
    };
  });

  return { nodes, links };
}

// Placeholder for API-fetched network data
export let networkData: NetworkData = { nodes: [], links: [] };

// Function to update network data from API
export function setNetworkData(data: NetworkData): void {
  networkData = data;
}