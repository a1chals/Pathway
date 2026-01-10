import { CompanyType } from './index';

export interface TalentGraphNode {
  id: string;
  name: string;
  industry: CompanyType;
  employeeCount?: number;
  totalExits?: number;
  incoming?: number;
  outgoing?: number;
  logo?: string;
}

export interface TalentGraphLink {
  source: string;
  target: string;
  count: number;
  avgYears: number;
}

export interface TalentGraphData {
  nodes: TalentGraphNode[];
  links: TalentGraphLink[];
}

export interface PersonTransition {
  personId: string;
  fullName: string;
  headline?: string;
  linkedinUrl?: string;
  sourceRole: string;
  exitRole: string;
  yearsAtSource: number;
  exitDate?: string;
}

export interface CompanyStats {
  name: string;
  industry: CompanyType;
  incoming: number;
  outgoing: number;
  totalExits: number;
  avgYearsBeforeExit: number;
  topDestinations: Array<{
    company: string;
    count: number;
  }>;
  topSources: Array<{
    company: string;
    count: number;
  }>;
}




