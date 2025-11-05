import { ExitData, CompanyType } from "@/types";
import { getCompanyMetadata, CompanyMetadata } from "@/lib/companyMetadata";

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
  // Extended metadata
  metadata?: CompanyMetadata;
}

export interface HeatmapData {
  name: string;
  children: Array<{
    name: CompanyType;
    children: HeatmapCompany[];
  }>;
}

// Company logos (transparent background PNG/SVG URLs)
const companyLogos: Record<string, string> = {
  // Consulting
  "McKinsey & Company": "https://logo.clearbit.com/mckinsey.com",
  "BCG": "https://logo.clearbit.com/bcg.com",
  "Boston Consulting Group": "https://logo.clearbit.com/bcg.com",
  "Bain & Company": "https://logo.clearbit.com/bain.com",
  "Deloitte": "https://logo.clearbit.com/deloitte.com",
  "EY": "https://logo.clearbit.com/ey.com",
  "Ernst & Young": "https://logo.clearbit.com/ey.com",
  "PwC": "https://logo.clearbit.com/pwc.com",
  "PricewaterhouseCoopers": "https://logo.clearbit.com/pwc.com",
  "KPMG": "https://logo.clearbit.com/kpmg.com",
  "Accenture": "https://logo.clearbit.com/accenture.com",
  "Oliver Wyman": "https://logo.clearbit.com/oliverwyman.com",
  "A.T. Kearney": "https://logo.clearbit.com/atkearney.com",
  "L.E.K. Consulting": "https://logo.clearbit.com/lek.com",
  
  // Banking
  "Goldman Sachs": "https://logo.clearbit.com/goldmansachs.com",
  "JPMorgan Chase": "https://logo.clearbit.com/jpmorganchase.com",
  "JPMorgan": "https://logo.clearbit.com/jpmorganchase.com",
  "Morgan Stanley": "https://logo.clearbit.com/morganstanley.com",
  "Bank of America": "https://logo.clearbit.com/bankofamerica.com",
  "Citigroup": "https://logo.clearbit.com/citigroup.com",
  "Citi": "https://logo.clearbit.com/citi.com",
  
  // PE/VC
  "Blackstone": "https://logo.clearbit.com/blackstone.com",
  "KKR": "https://logo.clearbit.com/kkr.com",
  "Carlyle Group": "https://logo.clearbit.com/carlyle.com",
  "Apollo Global Management": "https://logo.clearbit.com/apollo.com",
  "Bain Capital": "https://logo.clearbit.com/baincapital.com",
  "TPG": "https://logo.clearbit.com/tpg.com",
  "Sequoia Capital": "https://logo.clearbit.com/sequoiacap.com",
  "Andreessen Horowitz": "https://logo.clearbit.com/a16z.com",
  "General Catalyst": "https://logo.clearbit.com/generalcatalyst.com",
  "Accel": "https://logo.clearbit.com/accel.com",
  
  // Tech
  "Google": "https://logo.clearbit.com/google.com",
  "Amazon": "https://logo.clearbit.com/amazon.com",
  "Meta": "https://logo.clearbit.com/meta.com",
  "Facebook": "https://logo.clearbit.com/facebook.com",
  "Apple": "https://logo.clearbit.com/apple.com",
  "Microsoft": "https://logo.clearbit.com/microsoft.com",
  "Netflix": "https://logo.clearbit.com/netflix.com",
  "Uber": "https://logo.clearbit.com/uber.com",
  "Airbnb": "https://logo.clearbit.com/airbnb.com",
  "Tesla": "https://logo.clearbit.com/tesla.com",
  "Salesforce": "https://logo.clearbit.com/salesforce.com",
  "Adobe": "https://logo.clearbit.com/adobe.com",
  "Stripe": "https://logo.clearbit.com/stripe.com",
  "DoorDash": "https://logo.clearbit.com/doordash.com",
  "Spotify": "https://logo.clearbit.com/spotify.com",
  "Zoom": "https://logo.clearbit.com/zoom.us",
  "LinkedIn": "https://logo.clearbit.com/linkedin.com",
  "Twitter": "https://logo.clearbit.com/twitter.com",
  "Snap": "https://logo.clearbit.com/snap.com",
  
  // Education
  "Harvard Business School": "https://logo.clearbit.com/hbs.edu",
  "Stanford GSB": "https://logo.clearbit.com/gsb.stanford.edu",
  "Wharton School": "https://logo.clearbit.com/wharton.upenn.edu",
  "MIT Sloan": "https://logo.clearbit.com/mitsloan.mit.edu",
};

// Company type mappings with estimated employee counts
const companyData: Record<string, { type: CompanyType; employeeCount: number }> = {
  // Consulting firms
  "McKinsey & Company": { type: "Consulting", employeeCount: 45000 },
  "BCG": { type: "Consulting", employeeCount: 32000 },
  "Boston Consulting Group": { type: "Consulting", employeeCount: 32000 },
  "Bain & Company": { type: "Consulting", employeeCount: 14000 },
  "Deloitte": { type: "Consulting", employeeCount: 415000 },
  "EY": { type: "Consulting", employeeCount: 365000 },
  "Ernst & Young": { type: "Consulting", employeeCount: 365000 },
  "PwC": { type: "Consulting", employeeCount: 364000 },
  "PricewaterhouseCoopers": { type: "Consulting", employeeCount: 364000 },
  "KPMG": { type: "Consulting", employeeCount: 273000 },
  "Accenture": { type: "Consulting", employeeCount: 738000 },
  "Oliver Wyman": { type: "Consulting", employeeCount: 6000 },
  "A.T. Kearney": { type: "Consulting", employeeCount: 3600 },
  "L.E.K. Consulting": { type: "Consulting", employeeCount: 1600 },
  
  // Banking
  "Goldman Sachs": { type: "Banking", employeeCount: 49000 },
  "JPMorgan Chase": { type: "Banking", employeeCount: 293000 },
  "JPMorgan": { type: "Banking", employeeCount: 293000 },
  "Morgan Stanley": { type: "Banking", employeeCount: 82000 },
  "Bank of America": { type: "Banking", employeeCount: 213000 },
  "Citigroup": { type: "Banking", employeeCount: 240000 },
  "Citi": { type: "Banking", employeeCount: 240000 },
  "Deutsche Bank": { type: "Banking", employeeCount: 84000 },
  "Credit Suisse": { type: "Banking", employeeCount: 50000 },
  "UBS": { type: "Banking", employeeCount: 72000 },
  "Barclays": { type: "Banking", employeeCount: 89000 },
  
  // PE/VC
  "Blackstone": { type: "PE/VC", employeeCount: 4700 },
  "KKR": { type: "PE/VC", employeeCount: 3500 },
  "Carlyle Group": { type: "PE/VC", employeeCount: 2100 },
  "Apollo Global Management": { type: "PE/VC", employeeCount: 2000 },
  "Bain Capital": { type: "PE/VC", employeeCount: 1600 },
  "TPG": { type: "PE/VC", employeeCount: 1400 },
  "Sequoia Capital": { type: "PE/VC", employeeCount: 280 },
  "Andreessen Horowitz": { type: "PE/VC", employeeCount: 450 },
  "General Catalyst": { type: "PE/VC", employeeCount: 180 },
  "Accel": { type: "PE/VC", employeeCount: 150 },
  
  // Tech
  "Google": { type: "Tech", employeeCount: 182000 },
  "Amazon": { type: "Tech", employeeCount: 1540000 },
  "Meta": { type: "Tech", employeeCount: 86000 },
  "Facebook": { type: "Tech", employeeCount: 86000 },
  "Apple": { type: "Tech", employeeCount: 164000 },
  "Microsoft": { type: "Tech", employeeCount: 221000 },
  "Netflix": { type: "Tech", employeeCount: 13000 },
  "Uber": { type: "Tech", employeeCount: 32800 },
  "Airbnb": { type: "Tech", employeeCount: 6800 },
  "Tesla": { type: "Tech", employeeCount: 128000 },
  "Salesforce": { type: "Tech", employeeCount: 79000 },
  "Adobe": { type: "Tech", employeeCount: 29000 },
  "Stripe": { type: "Tech", employeeCount: 8000 },
  "DoorDash": { type: "Tech", employeeCount: 8600 },
  "Spotify": { type: "Tech", employeeCount: 9800 },
  "Zoom": { type: "Tech", employeeCount: 7700 },
  "LinkedIn": { type: "Tech", employeeCount: 20000 },
  "Twitter": { type: "Tech", employeeCount: 7500 },
  "Snap": { type: "Tech", employeeCount: 5600 },
  "Pinterest": { type: "Tech", employeeCount: 4100 },
  
  // Education (MBA Programs)
  "Harvard Business School": { type: "Education", employeeCount: 900 },
  "Stanford GSB": { type: "Education", employeeCount: 850 },
  "Wharton School": { type: "Education", employeeCount: 800 },
  "MIT Sloan": { type: "Education", employeeCount: 750 },
  "Columbia Business School": { type: "Education", employeeCount: 700 },
  "Kellogg School of Management": { type: "Education", employeeCount: 650 },
  "Chicago Booth": { type: "Education", employeeCount: 600 },
};

function getCompanyInfo(companyName: string): { type: CompanyType; employeeCount: number } {
  // Try exact match first
  if (companyData[companyName]) {
    return companyData[companyName];
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(companyData)) {
    if (companyName.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(companyName.toLowerCase())) {
      return value;
    }
  }
  
  // Default for unknown companies
  return { type: "Other", employeeCount: 5000 };
}

export function generateHeatmapData(): HeatmapData {
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

  // Build stats
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
  });

  // Generate companies
  const companies: HeatmapCompany[] = Array.from(companyStats.entries()).map(([name, stats]) => {
    const info = getCompanyInfo(name);
    const metadata = getCompanyMetadata(name);
    
    // Get ALL exit companies (not just top 5)
    const allExits = Array.from(stats.exitMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map(([company, data]) => ({
        to: company,
        count: data.count,
        avgYears: data.totalYears / data.count,
      }));

    return {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: name,
      industry: info.type,
      employeeCount: info.employeeCount,
      avgYearsBeforeExit: stats.count > 0 ? stats.totalYears / stats.count : 0,
      incoming: stats.incoming,
      outgoing: stats.outgoing,
      exits: allExits,
      mbaPercentage: stats.outgoing > 0 ? (stats.mbaCount / stats.outgoing) * 100 : 0,
      logo: companyLogos[name] || metadata?.logo,
      metadata: metadata || undefined,
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

  // Create hierarchical structure
  const children = Array.from(grouped.entries()).map(([industry, companies]) => ({
    name: industry,
    children: companies,
  }));

  return {
    name: "All Companies",
    children,
  };
}

export const heatmapData = generateHeatmapData();

// Re-export metadata types for convenience
export type { CompanyMetadata } from "@/lib/companyMetadata";
export { getCompanyMetadata, companyMetadata } from "@/lib/companyMetadata";

// Helper function to get raw exit data for a specific company
export function getRawExitDataForCompany(companyName: string): ExitData[] {
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
  
  // Filter exits for the specific company
  return allExits.filter(exit => exit.start_company === companyName);
}

