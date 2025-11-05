export interface ExitData {
  start_company: string;
  start_role: string;
  exit_company: string;
  exit_role: string;
  industry: string;
  avg_years_before_exit: number;
}

export type CompanyType = "Consulting" | "Banking" | "Tech" | "PE/VC" | "Startup" | "Corporate" | "Education" | "Other";

export interface NetworkNode {
  id: string;
  name: string;
  type: CompanyType;
  logo?: string;
  incoming: number;
  outgoing: number;
  avgYearsBeforeExit: number;
  topExitCompanies: { company: string; count: number; avgYears: number }[];
  employeeCount?: number;
  mbaPercentage?: number;
}

export interface NetworkLink {
  source: string;
  target: string;
  weight: number;
  avgYears: number;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

