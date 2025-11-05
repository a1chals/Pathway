import { ExitData, NetworkData, NetworkNode, NetworkLink, CompanyType } from "@/types";

// Import all exit data
import mckinsey_exits from "@/data/mckinsey_exits.json";
import bcg_exits from "@/data/bcg_exits.json";
import bain_exits from "@/data/bain_exits.json";
import deloitte_exits from "@/data/deloitte_exits.json";
import ey_exits from "@/data/ey_exits.json";
import pwc_exits from "@/data/pwc_exits.json";
import kpmg_exits from "@/data/kpmg_exits.json";
import accenture_exits from "@/data/accenture_exits.json";
import oliver_wyman_exits from "@/data/oliver_wyman_exits.json";
import at_kearney_exits from "@/data/at_kearney_exits.json";
import lek_exits from "@/data/lek_exits.json";

// Company type mappings
const companyTypeMap: Record<string, CompanyType> = {
  // Consulting firms
  "McKinsey & Company": "Consulting",
  "BCG": "Consulting",
  "Boston Consulting Group": "Consulting",
  "Bain & Company": "Consulting",
  "Deloitte": "Consulting",
  "EY": "Consulting",
  "Ernst & Young": "Consulting",
  "PwC": "Consulting",
  "PricewaterhouseCoopers": "Consulting",
  "KPMG": "Consulting",
  "Accenture": "Consulting",
  "Oliver Wyman": "Consulting",
  "A.T. Kearney": "Consulting",
  "L.E.K. Consulting": "Consulting",
  
  // Banking
  "Goldman Sachs": "Banking",
  "JPMorgan Chase": "Banking",
  "JPMorgan": "Banking",
  "Morgan Stanley": "Banking",
  "Bank of America": "Banking",
  "Citigroup": "Banking",
  "Citi": "Banking",
  "Deutsche Bank": "Banking",
  "Credit Suisse": "Banking",
  "UBS": "Banking",
  "Barclays": "Banking",
  
  // PE/VC
  "Blackstone": "PE/VC",
  "KKR": "PE/VC",
  "Carlyle Group": "PE/VC",
  "Apollo Global Management": "PE/VC",
  "Bain Capital": "PE/VC",
  "TPG": "PE/VC",
  "Sequoia Capital": "PE/VC",
  "Andreessen Horowitz": "PE/VC",
  "General Catalyst": "PE/VC",
  "Accel": "PE/VC",
  
  // Tech
  "Google": "Tech",
  "Amazon": "Tech",
  "Meta": "Tech",
  "Facebook": "Tech",
  "Apple": "Tech",
  "Microsoft": "Tech",
  "Netflix": "Tech",
  "Uber": "Tech",
  "Airbnb": "Tech",
  "Tesla": "Tech",
  "Salesforce": "Tech",
  "Adobe": "Tech",
  "Stripe": "Tech",
  "DoorDash": "Tech",
  "Spotify": "Tech",
  "Zoom": "Tech",
  "LinkedIn": "Tech",
  "Twitter": "Tech",
  "Snap": "Tech",
  "Pinterest": "Tech",
};

function getCompanyType(companyName: string): CompanyType {
  // Try exact match first
  if (companyTypeMap[companyName]) {
    return companyTypeMap[companyName];
  }
  
  // Try partial match
  for (const [key, type] of Object.entries(companyTypeMap)) {
    if (companyName.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(companyName.toLowerCase())) {
      return type;
    }
  }
  
  // Fallback to industry-based classification
  return "Other";
}

export function generateNetworkData(): NetworkData {
  // Combine all exit data
  const allExits: ExitData[] = [
    ...mckinsey_exits,
    ...bcg_exits,
    ...bain_exits,
    ...deloitte_exits,
    ...ey_exits,
    ...pwc_exits,
    ...kpmg_exits,
    ...accenture_exits,
    ...oliver_wyman_exits,
    ...at_kearney_exits,
    ...lek_exits,
  ] as ExitData[];

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
    
    // Update outgoing for start company
    startStats.outgoing++;
    startStats.count++;
    startStats.totalYears += exit.avg_years_before_exit;
    
    // Track MBA exits
    if (exit.industry === "Graduate Education" || 
        exit.exit_company.includes("Business School") ||
        exit.exit_role.includes("MBA")) {
      startStats.mbaCount++;
    }
    
    // Update incoming for exit company
    exitStats.incoming++;
    
    // Track top exit companies
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
    
    // Create link
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
    // Get top 3 exit companies
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

export const networkData = generateNetworkData();

