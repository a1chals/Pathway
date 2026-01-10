/**
 * Focused Database Seed Script - 17 IB/Consulting Firms
 * 
 * Fetches exit data from Aviato API for 17 target companies
 * Filters: USA only, exits since 2020
 * 
 * Run with: npx tsx scripts/seedDatabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const AVIATO_API_KEY = process.env.AVIATO_API_KEY;
const AVIATO_BASE_URL = process.env.AVIATO_API_BASE_URL || 'https://data.api.aviato.co';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!AVIATO_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing environment variables. Check .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// CONFIGURATION
// ============================================
const MAX_EMPLOYEES_PER_COMPANY = 1500;  // Cap per company
const EXIT_DATE_CUTOFF = new Date('2020-01-01');  // Only exits since 2020
const RATE_LIMIT_MS = 400;  // Delay between API calls

// ============================================
// 17 TARGET COMPANIES WITH ALIASES
// ============================================
interface CompanyConfig {
  searchName: string;  // Name to search in Aviato
  displayName: string;  // Canonical name for our database
  aliases: string[];   // Alternative names to match in experience data
}

const TARGET_COMPANIES: CompanyConfig[] = [
  // Investment Banking
  {
    searchName: 'Goldman Sachs',
    displayName: 'Goldman Sachs',
    aliases: ['goldman sachs', 'gs', 'goldman', 'goldman sachs group', 'goldman sachs & co']
  },
  {
    searchName: 'Morgan Stanley',
    displayName: 'Morgan Stanley',
    aliases: ['morgan stanley', 'ms', 'morgan stanley & co']
  },
  {
    searchName: 'JPMorgan',
    displayName: 'J.P. Morgan',
    aliases: ['jpmorgan', 'jp morgan', 'jpm', 'jpmorgan chase', 'j.p. morgan', 'jpmorgan chase & co']
  },
  {
    searchName: 'Centerview Partners',
    displayName: 'Centerview Partners',
    aliases: ['centerview partners', 'centerview']
  },
  {
    searchName: 'Evercore',
    displayName: 'Evercore',
    aliases: ['evercore', 'evr', 'evercore isi', 'evercore partners']
  },
  {
    searchName: 'PJT Partners',
    displayName: 'PJT Partners',
    aliases: ['pjt partners', 'pjt']
  },
  {
    searchName: 'Lazard',
    displayName: 'Lazard',
    aliases: ['lazard', 'lazard freres', 'lazard asset management', 'lazard ltd']
  },
  
  // Consulting - MBB
  {
    searchName: 'McKinsey & Company',
    displayName: 'McKinsey & Company',
    aliases: ['mckinsey', 'mckinsey & company', 'mck', 'mckinsey & co', 'mckinsey and company']
  },
  {
    searchName: 'Boston Consulting Group',
    displayName: 'Boston Consulting Group',
    aliases: ['boston consulting group', 'bcg', 'the boston consulting group']
  },
  {
    searchName: 'Bain & Company',
    displayName: 'Bain & Company',
    aliases: ['bain & company', 'bain', 'bain and company', 'bain & co']
  },
  
  // Consulting - Big 4
  {
    searchName: 'Deloitte',
    displayName: 'Deloitte',
    aliases: ['deloitte', 'deloitte consulting', 'deloitte advisory', 'monitor deloitte', 'monitor group', 'deloitte llp']
  },
  {
    searchName: 'PwC',
    displayName: 'PwC',
    aliases: ['pwc', 'pricewaterhousecoopers', 'strategy&', 'strategyand', 'strategy and', 'pwc advisory']
  },
  {
    searchName: 'EY',
    displayName: 'EY',
    aliases: ['ey', 'ernst & young', 'ernst and young', 'ey-parthenon', 'parthenon group', 'parthenon-ey', 'ey parthenon']
  },
  {
    searchName: 'KPMG',
    displayName: 'KPMG',
    aliases: ['kpmg', 'kpmg advisory', 'kpmg strategy', 'kpmg llp']
  },
  
  // Consulting - Boutique
  {
    searchName: 'Oliver Wyman',
    displayName: 'Oliver Wyman',
    aliases: ['oliver wyman', 'oliverwyman']
  },
  {
    searchName: 'L.E.K. Consulting',
    displayName: 'L.E.K. Consulting',
    aliases: ['l.e.k. consulting', 'lek consulting', 'lek', 'l.e.k.']
  },
  {
    searchName: 'Kearney',
    displayName: 'Kearney',
    aliases: ['kearney', 'a.t. kearney', 'at kearney', 'a t kearney']
  },
];

// ============================================
// USA LOCATION DETECTION
// ============================================
const US_STATES = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut',
  'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa',
  'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan',
  'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire',
  'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio',
  'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
  'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia',
  'wisconsin', 'wyoming', 'district of columbia', 'dc', 'd.c.'
];

const US_STATE_ABBREVS = [
  'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga', 'hi', 'id', 'il', 'in',
  'ia', 'ks', 'ky', 'la', 'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv',
  'nh', 'nj', 'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc', 'sd', 'tn',
  'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy'
];

const US_CITIES = [
  'new york', 'nyc', 'manhattan', 'brooklyn', 'los angeles', 'chicago', 'houston',
  'phoenix', 'philadelphia', 'san antonio', 'san diego', 'dallas', 'san jose',
  'austin', 'jacksonville', 'fort worth', 'columbus', 'charlotte', 'san francisco',
  'indianapolis', 'seattle', 'denver', 'boston', 'nashville', 'detroit', 'portland',
  'las vegas', 'memphis', 'louisville', 'baltimore', 'milwaukee', 'albuquerque',
  'tucson', 'fresno', 'sacramento', 'atlanta', 'miami', 'oakland', 'minneapolis',
  'stamford', 'greenwich', 'jersey city', 'hoboken', 'palo alto', 'menlo park'
];

function isUSALocation(location: string | null | undefined): boolean {
  if (!location) return false;
  
  const loc = location.toLowerCase();
  
  // Direct country match
  if (loc.includes('united states') || loc.includes('usa') || loc.includes('u.s.a') || loc.includes('u.s.')) {
    return true;
  }
  
  // Check for US states
  for (const state of US_STATES) {
    if (loc.includes(state)) return true;
  }
  
  // Check for state abbreviations (with word boundaries)
  for (const abbrev of US_STATE_ABBREVS) {
    const regex = new RegExp(`\\b${abbrev}\\b`, 'i');
    if (regex.test(loc)) return true;
  }
  
  // Check for major US cities
  for (const city of US_CITIES) {
    if (loc.includes(city)) return true;
  }
  
  return false;
}

// ============================================
// INDUSTRY CATEGORIZATION
// ============================================
function categorizeCompany(companyName: string): string {
  const name = companyName.toLowerCase();

  // Education / MBA
  if (/business school|mba|university|stanford|harvard|wharton|insead|columbia|booth|kellogg|sloan|haas|tuck|darden|fuqua|ross|stern|anderson|yale school|said business|london business|cambridge judge|mit|berkeley|cornell|duke|northwestern|upenn|chicago/i.test(name)) {
    return 'Education / MBA';
  }
  
  // Check if it's one of our 17 source companies (lateral move)
  for (const company of TARGET_COMPANIES) {
    for (const alias of company.aliases) {
      if (name.includes(alias) || alias.includes(name)) {
        if (company.displayName.includes('Goldman') || company.displayName.includes('Morgan') || 
            company.displayName.includes('JPMorgan') || company.displayName.includes('Centerview') ||
            company.displayName.includes('Evercore') || company.displayName.includes('PJT') ||
            company.displayName.includes('Lazard')) {
          return 'Investment Banking';
        }
        return 'Consulting';
      }
    }
  }
  
  // Private Equity
  if (/private equity|blackstone|kkr|carlyle|apollo|tpg|bain capital|warburg|general atlantic|advent|cvc|eqt|hellman|silver lake|vista equity|thoma bravo|providence equity|ta associates|summit partners|francisco partners|insight partners|permira|ardian|cinven|pai partners|bridgepoint|apax|charterhouse|bc partners|nordic capital|triton|montagu/i.test(name)) {
    return 'Private Equity';
  }
  
  // Venture Capital
  if (/venture|sequoia|andreessen|a16z|accel|greylock|benchmark|kleiner|lightspeed|nea|index ventures|general catalyst|bessemer|ggv|founders fund|first round|union square|khosla|battery ventures|spark capital|redpoint|ivp|norwest|menlo ventures|canaan|felicis|forerunner|lowercase|ribbit|craft ventures/i.test(name)) {
    return 'Venture Capital';
  }
  
  // Hedge Funds
  if (/hedge fund|bridgewater|citadel|two sigma|de shaw|point72|millennium|elliott management|third point|baupost|tiger global|renaissance|jane street|hudson river|jump trading|virtu|susquehanna|drw|akuna|optiver|imc|flow traders|sig|wolverine/i.test(name)) {
    return 'Hedge Fund';
  }
  
  // Investment Banking (other banks)
  if (/investment bank|goldman sachs|morgan stanley|jpmorgan|jp morgan|bank of america|merrill lynch|citigroup|citi|credit suisse|deutsche bank|barclays|ubs|evercore|lazard|centerview|moelis|pjt partners|perella weinberg|qatalyst|greenhill|rothschild|jefferies|hsbc|nomura|wells fargo|rbc|td securities|baird|houlihan|william blair|raymond james|guggenheim|cowen|stifel|piper sandler/i.test(name)) {
    return 'Investment Banking';
  }
  
  // Consulting
  if (/consult|mckinsey|bain & company|bain and company|bcg|boston consulting|deloitte|accenture|pwc|ey|kpmg|oliver wyman|lek consulting|roland berger|kearney|strategy&|booz allen|alixpartners|monitor|parthenon|fti|huron|navigant|alvarez|analysis group|charles river|cornerstone|nera|compass lexecon|brattle/i.test(name)) {
    return 'Consulting';
  }
  
  // Big Tech
  if (/google|alphabet|meta|facebook|amazon|microsoft|apple|netflix|uber|airbnb|stripe|salesforce|snowflake|databricks|palantir|spacex|openai|notion|figma|slack|zoom|shopify|square|block|robinhood|coinbase|instacart|doordash|lyft|twitter|linkedin|oracle|sap|adobe|ibm|intel|nvidia|amd|tesla|snap|pinterest|dropbox|twilio|okta|crowdstrike|datadog|cloudflare|mongo|elastic|splunk/i.test(name)) {
    return 'Big Tech';
  }
  
  // Startups (general tech companies)
  if (/startup|founded|seed|series|stealth|labs|\.io|\.ai|tech|software|platform|app\b|saas|fintech|healthtech|edtech|proptech|insurtech|biotech|medtech/i.test(name)) {
    return 'Startup';
  }
  
  // Corporate / Fortune 500
  if (/procter|p&g|johnson & johnson|j&j|pfizer|nike|coca-cola|pepsi|unilever|nestle|disney|warner|nbc|fox|viacom|comcast|walmart|target|costco|home depot|lowes|cvs|walgreens|exxon|chevron|shell|bp|3m|general electric|ge|honeywell|caterpillar|boeing|lockheed|raytheon|northrop|general dynamics|united technologies|kraft|mondelez|kellogg|general mills|mars|hershey|starbucks|mcdonald|yum brands/i.test(name)) {
    return 'Corporate';
  }

  return 'Other';
}

// ============================================
// API HELPERS
// ============================================
interface AviatoHeaders {
  'Authorization': string;
  'Content-Type': string;
}

function getHeaders(): AviatoHeaders {
  return {
    'Authorization': `Bearer ${AVIATO_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper with exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, retries = 5): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const waitTime = Math.pow(2, i + 1) * 1000;
      console.log(`  ⏳ Rate limited, waiting ${waitTime/1000}s...`);
      await sleep(waitTime);
      continue;
    }
    
    return response;
  }
  
  return fetch(url, options);
}

// ============================================
// TRACKING STATS
// ============================================
let totalApiCalls = 0;
let totalExitsFound = 0;
let totalPersonsEnriched = 0;
let totalSkippedNonUSA = 0;
let totalSkippedPre2020 = 0;

// ============================================
// AVIATO API FUNCTIONS
// ============================================
async function searchCompany(name: string) {
  console.log(`\n🔍 Searching for: ${name}`);
  
  await sleep(RATE_LIMIT_MS);
  
  const response = await fetchWithRetry(`${AVIATO_BASE_URL}/company/search`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      dsl: {
        nameQuery: name,
        limit: 1,
        offset: 0,
      },
    }),
  });
  
  totalApiCalls++;

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`  ❌ Failed: ${response.status} - ${errorText}`);
    return null;
  }

  const data = await response.json();
  if (data.items && data.items.length > 0) {
    console.log(`  ✅ Found: ${data.items[0].name} (ID: ${data.items[0].id})`);
    return data.items[0];
  }
  
  console.log(`  ⚠️ No results`);
  return null;
}

async function getFormerEmployees(companyId: string, page: number = 1) {
  await sleep(RATE_LIMIT_MS);
  
  const response = await fetchWithRetry(
    `${AVIATO_BASE_URL}/company/employees?id=${companyId}&perPage=100&page=${page}&current=false`,
    { headers: getHeaders() }
  );
  
  totalApiCalls++;

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`  ❌ Failed to get employees: ${errorText}`);
    return { employees: [], pages: 0 };
  }

  return response.json();
}

async function enrichPerson(personId: string): Promise<any> {
  await sleep(RATE_LIMIT_MS);
  
  const response = await fetchWithRetry(
    `${AVIATO_BASE_URL}/person/enrich?id=${personId}`,
    { headers: getHeaders() }
  );
  
  totalApiCalls++;
  totalPersonsEnriched++;

  if (!response.ok) {
    return null;
  }

  return response.json();
}

// ============================================
// DATABASE FUNCTIONS
// ============================================
async function saveCompany(company: any) {
  const { error } = await supabase
    .from('companies')
    .upsert({
      aviato_id: company.id,
      name: company.name,
      country: company.country,
      region: company.region,
      locality: company.locality,
      industry_list: company.industryList || [],
      website: company.URLs?.website,
      linkedin: company.URLs?.linkedin,
      employee_count: company.employeeCount,
      founded_year: company.foundedYear,
      description: company.description,
    }, { onConflict: 'aviato_id' });

  if (error) {
    console.error(`  ❌ Failed to save company: ${error.message}`);
    return false;
  }
  return true;
}

async function savePerson(person: any) {
  const { error } = await supabase
    .from('persons')
    .upsert({
      aviato_id: person.id,
      full_name: person.fullName,
      first_name: person.firstName,
      last_name: person.lastName,
      location: person.location,
      headline: person.headline,
      linkedin_url: person.URLs?.linkedin,
    }, { onConflict: 'aviato_id' });

  if (error && !error.message.includes('duplicate')) {
    console.error(`  ❌ Failed to save person: ${error.message}`);
  }
}

async function saveExperiences(personId: string, experiences: any[]) {
  for (const exp of experiences) {
    const { error } = await supabase
      .from('experiences')
      .upsert({
        person_id: personId,
        company_id: exp.companyID,
        company_name: exp.companyName || 'Unknown',
        title: exp.positionList?.[0]?.title || 'Unknown',
        start_date: exp.startDate?.split('T')[0] || null,
        end_date: exp.endDate?.split('T')[0] || null,
        is_current: !exp.endDate,
      }, { onConflict: 'person_id,company_name,title,start_date' });
    
    if (error && !error.message.includes('duplicate')) {
      // Silently continue
    }
  }
}

async function saveExit(exitData: any) {
  const { error } = await supabase
    .from('exits')
    .upsert(exitData, { onConflict: 'person_id,source_company_name' });

  if (error) {
    if (!error.message.includes('duplicate')) {
      return false;
    }
  }
  return true;
}

// ============================================
// CHECK IF COMPANY NAME MATCHES TARGET
// ============================================
function matchesTargetCompany(companyName: string, targetConfig: CompanyConfig): boolean {
  const name = companyName.toLowerCase().trim();
  
  for (const alias of targetConfig.aliases) {
    if (name.includes(alias) || alias.includes(name)) {
      return true;
    }
  }
  
  return false;
}

// ============================================
// MAIN PROCESSING
// ============================================
async function processCompany(config: CompanyConfig) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📊 Processing: ${config.displayName}`);
  console.log(`${'═'.repeat(60)}`);

  // Search for company
  const company = await searchCompany(config.searchName);
  if (!company) return { exits: 0, persons: 0, skippedUSA: 0, skipped2020: 0 };

  // Save company
  const saved = await saveCompany(company);
  if (saved) {
    console.log(`  💾 Saved company to database`);
  }

  // Get ALL former employees (with pagination)
  let allEmployees: any[] = [];
  let currentPage = 1;
  let totalPages = 1;
  
  console.log(`  📋 Fetching former employees...`);
  
  do {
    const result = await getFormerEmployees(company.id, currentPage);
    if (result.employees && result.employees.length > 0) {
      allEmployees = allEmployees.concat(result.employees);
      totalPages = result.pages || 1;
      console.log(`    Page ${currentPage}/${totalPages}: +${result.employees.length} (Total: ${allEmployees.length})`);
    }
    currentPage++;
    
    // Check if we've hit our cap
    if (allEmployees.length >= MAX_EMPLOYEES_PER_COMPANY) {
      console.log(`    ⚠️ Hit cap of ${MAX_EMPLOYEES_PER_COMPANY} employees`);
      allEmployees = allEmployees.slice(0, MAX_EMPLOYEES_PER_COMPANY);
      break;
    }
  } while (currentPage <= totalPages);
  
  console.log(`  ✅ Total employees to process: ${allEmployees.length}`);

  // Process each employee
  let exitsProcessed = 0;
  let personsProcessed = 0;
  let skippedNonUSA = 0;
  let skippedPre2020 = 0;
  
  console.log(`  👤 Enriching employees and finding exits...`);
  
  for (let i = 0; i < allEmployees.length; i++) {
    const emp = allEmployees[i];
    
    // Progress indicator
    if (i > 0 && i % 50 === 0) {
      console.log(`    Progress: ${i}/${allEmployees.length} | Exits: ${exitsProcessed} | Skipped (non-USA): ${skippedNonUSA} | Skipped (pre-2020): ${skippedPre2020}`);
    }
    
    // Enrich person
    const enriched = await enrichPerson(emp.personID);
    if (!enriched || !enriched.experienceList) {
      continue;
    }
    
    // Check if person is in USA
    if (!isUSALocation(enriched.location)) {
      skippedNonUSA++;
      totalSkippedNonUSA++;
      continue;
    }
    
    personsProcessed++;
    
    // Save person
    await savePerson(enriched);
    
    // Save all experiences
    await saveExperiences(emp.personID, enriched.experienceList);

    // Find exit from source company
    const experiences = enriched.experienceList || [];
    const sortedExp = [...experiences].sort((a: any, b: any) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA; // Most recent first
    });

    // Find source company experience using aliases
    const sourceExp = sortedExp.find((exp: any) => 
      matchesTargetCompany(exp.companyName || '', config)
    );

    if (!sourceExp || !sourceExp.endDate) {
      continue; // Must have left the company
    }

    const sourceEndDate = new Date(sourceExp.endDate);
    
    // Check if exit is since 2020
    if (sourceEndDate < EXIT_DATE_CUTOFF) {
      skippedPre2020++;
      totalSkippedPre2020++;
      continue;
    }

    // Find the FIRST job after leaving source company
    let nextJob = null;
    for (const exp of sortedExp) {
      // Skip if same company (using alias matching)
      if (matchesTargetCompany(exp.companyName || '', config)) {
        continue;
      }
      
      const expStart = exp.startDate ? new Date(exp.startDate) : null;
      
      // Must start after leaving source company
      if (expStart && expStart >= sourceEndDate) {
        if (!nextJob || expStart < new Date(nextJob.startDate)) {
          nextJob = exp;
        }
      }
    }

    if (!nextJob) {
      continue;
    }

    // Calculate years at source
    let yearsAtSource = 0;
    if (sourceExp.startDate && sourceExp.endDate) {
      const start = new Date(sourceExp.startDate);
      const end = new Date(sourceExp.endDate);
      yearsAtSource = (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    }

    // Build exit data
    const exitData = {
      person_id: emp.personID,
      source_company_id: company.id,
      source_company_name: config.displayName,  // Use canonical name
      source_role: emp.positionList?.[0]?.title || sourceExp.positionList?.[0]?.title || 'Unknown',
      source_start_date: sourceExp.startDate?.split('T')[0] || null,
      source_end_date: sourceExp.endDate?.split('T')[0] || null,
      exit_company_id: nextJob.companyID,
      exit_company_name: nextJob.companyName || 'Unknown',
      exit_role: nextJob.positionList?.[0]?.title || 'Unknown',
      exit_start_date: nextJob.startDate?.split('T')[0] || null,
      exit_industry: categorizeCompany(nextJob.companyName || ''),
      years_at_source: Math.round(yearsAtSource * 100) / 100,
    };

    const savedExit = await saveExit(exitData);
    if (savedExit) {
      exitsProcessed++;
      totalExitsFound++;
    }
  }

  console.log(`\n  📊 Results for ${config.displayName}:`);
  console.log(`     Persons processed (USA): ${personsProcessed}`);
  console.log(`     Exits found (since 2020): ${exitsProcessed}`);
  console.log(`     Skipped (non-USA): ${skippedNonUSA}`);
  console.log(`     Skipped (pre-2020): ${skippedPre2020}`);
  
  return { exits: exitsProcessed, persons: personsProcessed, skippedUSA: skippedNonUSA, skipped2020: skippedPre2020 };
}

// ============================================
// MAIN ENTRY POINT
// ============================================
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  PATHWAY DATABASE SEED - 17 IB/CONSULTING FIRMS            ║');
  console.log('║  USA Only | Exits Since 2020                               ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\n📋 Companies to process: ${TARGET_COMPANIES.length}`);
  console.log(`📊 Max employees per company: ${MAX_EMPLOYEES_PER_COMPANY}`);
  console.log(`📅 Exit date cutoff: ${EXIT_DATE_CUTOFF.toISOString().split('T')[0]}`);
  console.log(`\n⏳ Estimated time: ${Math.round(TARGET_COMPANIES.length * MAX_EMPLOYEES_PER_COMPANY * RATE_LIMIT_MS / 60000)} minutes (worst case)`);
  console.log('\n' + '═'.repeat(60));

  const startTime = Date.now();
  const results: { company: string; exits: number; persons: number }[] = [];

  for (let i = 0; i < TARGET_COMPANIES.length; i++) {
    const config = TARGET_COMPANIES[i];
    console.log(`\n[${'▓'.repeat(Math.round((i+1)/TARGET_COMPANIES.length * 20))}${'░'.repeat(20 - Math.round((i+1)/TARGET_COMPANIES.length * 20))}] ${i + 1}/${TARGET_COMPANIES.length}`);
    
    const result = await processCompany(config);
    results.push({ company: config.displayName, exits: result.exits, persons: result.persons });
    
    // Progress summary
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const avgPerCompany = elapsed / (i + 1);
    const remaining = Math.round(avgPerCompany * (TARGET_COMPANIES.length - i - 1));
    
    console.log(`\n  ⏱️  Elapsed: ${Math.floor(elapsed/60)}m ${elapsed%60}s | Remaining: ~${Math.floor(remaining/60)}m ${remaining%60}s`);
    console.log(`  📊 Running totals: ${totalExitsFound} exits | ${totalPersonsEnriched} enriched | ${totalApiCalls} API calls`);
    
    // Wait between companies
    if (i < TARGET_COMPANIES.length - 1) {
      console.log(`  ⏳ Waiting 3s before next company...`);
      await sleep(3000);
    }
  }

  const totalTime = Math.round((Date.now() - startTime) / 1000);

  // Final database stats
  const { count: exitCount } = await supabase.from('exits').select('*', { count: 'exact', head: true });
  const { count: companyCount } = await supabase.from('companies').select('*', { count: 'exact', head: true });
  const { count: personCount } = await supabase.from('persons').select('*', { count: 'exact', head: true });
  const { count: experienceCount } = await supabase.from('experiences').select('*', { count: 'exact', head: true });

  console.log('\n' + '╔════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ SEEDING COMPLETE                                         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  console.log(`\n📊 FINAL DATABASE STATS:`);
  console.log(`   ├─ Companies:   ${companyCount}`);
  console.log(`   ├─ Persons:     ${personCount}`);
  console.log(`   ├─ Experiences: ${experienceCount}`);
  console.log(`   └─ Exits:       ${exitCount}`);
  
  console.log(`\n📈 PROCESSING STATS:`);
  console.log(`   ├─ Total API calls:     ${totalApiCalls}`);
  console.log(`   ├─ Persons enriched:    ${totalPersonsEnriched}`);
  console.log(`   ├─ Skipped (non-USA):   ${totalSkippedNonUSA}`);
  console.log(`   ├─ Skipped (pre-2020):  ${totalSkippedPre2020}`);
  console.log(`   └─ Valid exits found:   ${totalExitsFound}`);
  
  console.log(`\n⏱️  Total time: ${Math.floor(totalTime/60)}m ${totalTime%60}s`);
  
  console.log('\n📋 RESULTS BY COMPANY:');
  console.log('─'.repeat(60));
  console.log(`${'Company'.padEnd(30)} | ${'Persons'.padStart(8)} | ${'Exits'.padStart(8)}`);
  console.log('─'.repeat(60));
  for (const r of results) {
    console.log(`${r.company.padEnd(30)} | ${r.persons.toString().padStart(8)} | ${r.exits.toString().padStart(8)}`);
  }
  console.log('─'.repeat(60));
  console.log(`${'TOTAL'.padEnd(30)} | ${results.reduce((a, b) => a + b.persons, 0).toString().padStart(8)} | ${results.reduce((a, b) => a + b.exits, 0).toString().padStart(8)}`);
}

main().catch(console.error);
