/**
 * Comprehensive Database Seed Script
 * 
 * Fetches ALL data from Aviato API and loads it into Supabase
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
// COMPREHENSIVE COMPANY LIST - ALL MAJOR FIRMS
// ============================================
const COMPANIES_TO_SEED = [
  // ========== CONSULTING - MBB ==========
  'Bain & Company',
  'McKinsey & Company', 
  'BCG',
  
  // ========== CONSULTING - Big 4 ==========
  'Deloitte Consulting',
  'Accenture',
  'PwC',
  'EY',
  'KPMG',
  
  // ========== CONSULTING - Tier 2 ==========
  'Oliver Wyman',
  'LEK Consulting',
  'Roland Berger',
  'Kearney',
  'Strategy&',
  'Booz Allen Hamilton',
  'AlixPartners',
  
  // ========== INVESTMENT BANKS - Bulge Bracket ==========
  'Goldman Sachs',
  'Morgan Stanley',
  'JPMorgan',
  'Bank of America Merrill Lynch',
  'Citigroup',
  'Credit Suisse',
  'Deutsche Bank',
  'Barclays',
  'UBS',
  
  // ========== INVESTMENT BANKS - Elite Boutique ==========
  'Evercore',
  'Lazard',
  'Centerview Partners',
  'Moelis & Company',
  'PJT Partners',
  'Perella Weinberg Partners',
  'Qatalyst Partners',
  'Greenhill',
  'Rothschild',
  
  // ========== PRIVATE EQUITY - Mega Funds ==========
  'Blackstone',
  'KKR',
  'Carlyle Group',
  'Apollo Global Management',
  'TPG',
  'Bain Capital',
  'Warburg Pincus',
  'General Atlantic',
  'Advent International',
  'CVC Capital Partners',
  'EQT Partners',
  'Hellman & Friedman',
  'Silver Lake',
  'Vista Equity Partners',
  'Thoma Bravo',
  
  // ========== PRIVATE EQUITY - Growth Equity ==========
  'Providence Equity Partners',
  'TA Associates',
  'Summit Partners',
  'Francisco Partners',
  'Insight Partners',
  'JMI Equity',
  
  // ========== HEDGE FUNDS ==========
  'Bridgewater Associates',
  'Citadel',
  'Two Sigma',
  'DE Shaw',
  'Point72',
  'Millennium Management',
  'Elliott Management',
  'Third Point',
  'Baupost Group',
  'Tiger Global',
  
  // ========== VENTURE CAPITAL ==========
  'Sequoia Capital',
  'Andreessen Horowitz',
  'Accel',
  'Benchmark',
  'Greylock Partners',
  'Kleiner Perkins',
  'Lightspeed Venture Partners',
  'NEA',
  'Index Ventures',
  'General Catalyst',
  'Bessemer Venture Partners',
  'GGV Capital',
  'Founders Fund',
  'First Round Capital',
  'Union Square Ventures',
  
  // ========== BIG TECH - FAANG+ ==========
  'Google',
  'Meta',
  'Amazon',
  'Microsoft',
  'Apple',
  'Netflix',
  
  // ========== TECH - Unicorns & Scale-ups ==========
  'Uber',
  'Airbnb',
  'Stripe',
  'Salesforce',
  'Snowflake',
  'Databricks',
  'Palantir',
  'SpaceX',
  'OpenAI',
  'Notion',
  'Figma',
  'Slack',
  'Zoom',
  'Shopify',
  'Square',
  'Robinhood',
  'Coinbase',
  'Instacart',
  'DoorDash',
  'Lyft',
  
  // ========== CORPORATES - Fortune 500 ==========
  'Procter & Gamble',
  'Johnson & Johnson',
  'Pfizer',
  'Nike',
  'Coca-Cola',
  'PepsiCo',
  'Unilever',
  'Nestle',
  'Disney',
  'Warner Bros',
];

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

// Helper to wait
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper for API calls with exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, retries = 5): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const waitTime = Math.pow(2, i + 1) * 1000; // Exponential backoff: 2s, 4s, 8s, 16s, 32s
      console.log(`  ⏳ Rate limited, waiting ${waitTime/1000}s...`);
      await sleep(waitTime);
      continue;
    }
    
    return response;
  }
  
  // Final attempt
  return fetch(url, options);
}

// Track API usage
let totalApiCalls = 0;
let totalExitsFound = 0;
let totalPersonsEnriched = 0;

async function searchCompany(name: string) {
  console.log(`\n🔍 Searching for company: ${name}`);
  
  await sleep(500); // Rate limiting
  
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
    console.error(`  ❌ Failed to search for ${name}: ${response.status} - ${errorText}`);
    return null;
  }

  const data = await response.json();
  if (data.items && data.items.length > 0) {
    console.log(`  ✅ Found: ${data.items[0].name} (ID: ${data.items[0].id})`);
    return data.items[0];
  }
  
  console.log(`  ⚠️ No results for ${name}`);
  return null;
}

async function getFormerEmployees(companyId: string, companyName: string, page: number = 1) {
  await sleep(500); // Rate limiting
  
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

  const data = await response.json();
  return data;
}

async function enrichPerson(personId: string): Promise<any> {
  await sleep(300); // Rate limiting - faster for enrichment
  
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

function categorizeCompany(companyName: string): string {
  const name = companyName.toLowerCase();

  // Education
  if (/business school|mba|university|stanford|harvard|wharton|insead|columbia|booth|kellogg|sloan|haas|tuck|darden|fuqua|ross|stern|anderson|yale school|said business|london business|cambridge judge/i.test(name)) {
    return 'Education / MBA';
  }
  
  // Venture Capital
  if (/capital|ventures|partners|vc|sequoia|andreessen|a16z|accel|greylock|benchmark|kleiner|lightspeed|nea|index ventures|general catalyst|bessemer|ggv|founders fund|first round|union square|khosla|battery ventures|spark capital/i.test(name)) {
    if (/private equity|buyout/i.test(name)) return 'Private Equity';
    return 'Venture Capital';
  }
  
  // Private Equity
  if (/private equity|blackstone|kkr|carlyle|apollo|tpg|bain capital|warburg|general atlantic|advent|cvc|eqt|hellman|silver lake|vista equity|thoma bravo|providence equity|ta associates|summit partners|francisco partners|insight partners/i.test(name)) {
    return 'Private Equity';
  }
  
  // Hedge Funds
  if (/hedge fund|bridgewater|citadel|two sigma|de shaw|point72|millennium|elliott management|third point|baupost|tiger global|renaissance|jane street|hudson river|jump trading/i.test(name)) {
    return 'Hedge Fund';
  }
  
  // Consulting
  if (/mckinsey|bain & company|bain and company|bcg|boston consulting|deloitte|accenture|pwc|ey|kpmg|oliver wyman|lek consulting|roland berger|kearney|strategy&|booz allen|alixpartners|monitor|parthenon/i.test(name)) {
    return 'Consulting';
  }
  
  // Investment Banking
  if (/goldman sachs|morgan stanley|jpmorgan|jp morgan|bank of america|merrill lynch|citigroup|citi|credit suisse|deutsche bank|barclays|ubs|evercore|lazard|centerview|moelis|pjt partners|perella weinberg|qatalyst|greenhill|rothschild|jefferies|hsbc|nomura|wells fargo/i.test(name)) {
    return 'Investment Banking';
  }
  
  // Big Tech
  if (/google|alphabet|meta|facebook|amazon|microsoft|apple|netflix|uber|airbnb|stripe|salesforce|snowflake|databricks|palantir|spacex|openai|notion|figma|slack|zoom|shopify|square|block|robinhood|coinbase|instacart|doordash|lyft|twitter|linkedin|oracle|sap|adobe|ibm|intel|nvidia|amd|tesla/i.test(name)) {
    return 'Big Tech';
  }
  
  // Startups
  if (/startup|founded|co-founder|seed|series a|series b|stealth|labs|.io|.ai|tech/i.test(name)) {
    return 'Startup';
  }
  
  // Corporate
  if (/procter|p&g|johnson & johnson|j&j|pfizer|nike|coca-cola|pepsi|unilever|nestle|disney|warner|nbc|fox|viacom|comcast/i.test(name)) {
    return 'Corporate';
  }

  return 'Other';
}

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
      // Silently continue on duplicates
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

async function processCompany(companyName: string) {
  // Check if we already have exits for this company (resume feature)
  const { count: existingExits } = await supabase
    .from('exits')
    .select('*', { count: 'exact', head: true })
    .ilike('source_company_name', `%${companyName.split(' ')[0]}%`);
  
  if (existingExits && existingExits >= 30) {
    console.log(`\n⏭️  Skipping ${companyName} - already have ${existingExits} exits in database`);
    return { exits: existingExits, persons: 0, skipped: true };
  }

  // Step 1: Search for company
  const company = await searchCompany(companyName);
  if (!company) return { exits: 0, persons: 0 };

  // Step 2: Save company to Supabase
  const companySaved = await saveCompany(company);
  if (companySaved) {
    console.log(`  💾 Saved company to database`);
  }

  // Step 3: Get ALL former employees (paginate through all pages)
  let allEmployees: any[] = [];
  let currentPage = 1;
  let totalPages = 1;
  
  console.log(`  📋 Getting former employees...`);
  
  do {
    const result = await getFormerEmployees(company.id, company.name, currentPage);
    if (result.employees && result.employees.length > 0) {
      allEmployees = allEmployees.concat(result.employees);
      totalPages = result.pages || 1;
      console.log(`    Page ${currentPage}: Found ${result.employees.length} employees (Total: ${allEmployees.length})`);
    }
    currentPage++;
  } while (currentPage <= totalPages && allEmployees.length < 100); // Limit to 100 employees per company for MVP
  
  console.log(`  ✅ Total former employees: ${allEmployees.length}`);

  // Step 4: Enrich each person and find exits
  let exitsProcessed = 0;
  let personsProcessed = 0;
  
  console.log(`  👤 Enriching employees and finding exits...`);
  
  for (let i = 0; i < allEmployees.length; i++) {
    const emp = allEmployees[i];
    const personName = emp.person?.fullName || emp.personID;
    
    // Progress indicator every 10 people
    if (i > 0 && i % 10 === 0) {
      console.log(`    Progress: ${i}/${allEmployees.length} (${exitsProcessed} exits found)`);
    }
    
    const enriched = await enrichPerson(emp.personID);
    if (!enriched || !enriched.experienceList) {
      continue;
    }
    
    personsProcessed++;
    
    // Save person
    await savePerson(enriched);
    
    // Save all experiences
    await saveExperiences(emp.personID, enriched.experienceList);

    // Find where they went after this company
    const experiences = enriched.experienceList || [];
    const sortedExp = [...experiences].sort((a: any, b: any) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA; // Most recent first
    });

    // Find source company experience
    const companyFirstWord = company.name.toLowerCase().split(' ')[0];
    const sourceExp = sortedExp.find((exp: any) =>
      exp.companyName?.toLowerCase().includes(companyFirstWord)
    );

    if (!sourceExp || !sourceExp.endDate) {
      continue; // Must have left the company
    }

    const sourceEndDate = new Date(sourceExp.endDate);

    // Find the FIRST job after leaving source company
    let nextJob = null;
    for (const exp of sortedExp) {
      // Skip if same company
      if (exp.companyName?.toLowerCase().includes(companyFirstWord)) {
        continue;
      }
      
      const expStart = exp.startDate ? new Date(exp.startDate) : null;
      
      // Must start after leaving source company (within reasonable window)
      if (expStart && expStart >= sourceEndDate) {
        // Find the earliest job after leaving
        if (!nextJob || expStart < new Date(nextJob.startDate)) {
          nextJob = exp;
        }
      }
    }

    if (!nextJob) {
      continue;
    }

    // Calculate years at source
    let yearsAtSource = 2; // default
    if (sourceExp.startDate && sourceExp.endDate) {
      const start = new Date(sourceExp.startDate);
      const end = new Date(sourceExp.endDate);
      yearsAtSource = (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    }

    // Save exit to Supabase
    const exitData = {
      person_id: emp.personID,
      source_company_id: company.id,
      source_company_name: company.name,
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

    const saved = await saveExit(exitData);
    if (saved) {
      exitsProcessed++;
      totalExitsFound++;
    }
  }

  console.log(`  📊 Processed ${exitsProcessed} exits from ${personsProcessed} persons for ${company.name}`);
  return { exits: exitsProcessed, persons: personsProcessed };
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🚀 COMPREHENSIVE DATABASE SEED - STARTING');
  console.log('═'.repeat(60));
  console.log(`\nCompanies to process: ${COMPANIES_TO_SEED.length}`);
  console.log('This will take a while. Sit back and relax...\n');
  console.log('═'.repeat(60));

  const startTime = Date.now();
  const results: { company: string; exits: number; persons: number }[] = [];

  for (let i = 0; i < COMPANIES_TO_SEED.length; i++) {
    const company = COMPANIES_TO_SEED[i];
    console.log(`\n[${'='.repeat(20)}] COMPANY ${i + 1}/${COMPANIES_TO_SEED.length} [${'='.repeat(20)}]`);
    
    const result = await processCompany(company);
    results.push({ company, ...result });
    
    // Progress summary
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const avgPerCompany = elapsed / (i + 1);
    const remaining = Math.round(avgPerCompany * (COMPANIES_TO_SEED.length - i - 1));
    
    console.log(`\n  ⏱️  Time elapsed: ${Math.floor(elapsed/60)}m ${elapsed%60}s`);
    console.log(`  📈 Total exits so far: ${totalExitsFound}`);
    console.log(`  📊 Total persons enriched: ${totalPersonsEnriched}`);
    console.log(`  🔢 Total API calls: ${totalApiCalls}`);
    console.log(`  ⏳ Est. remaining: ${Math.floor(remaining/60)}m ${remaining%60}s`);
    
    // Wait between companies to avoid rate limiting
    if (i < COMPANIES_TO_SEED.length - 1) {
      console.log(`  ⏳ Waiting 2s before next company...`);
      await sleep(2000);
    }
  }

  const totalTime = Math.round((Date.now() - startTime) / 1000);

  console.log('\n' + '═'.repeat(60));
  console.log('✅ DATABASE SEEDING COMPLETE!');
  console.log('═'.repeat(60));
  
  // Final stats from Supabase
  const { count: exitCount } = await supabase
    .from('exits')
    .select('*', { count: 'exact', head: true });
  
  const { count: companyCount } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true });

  const { count: personCount } = await supabase
    .from('persons')
    .select('*', { count: 'exact', head: true });

  const { count: experienceCount } = await supabase
    .from('experiences')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 FINAL DATABASE STATS:`);
  console.log(`   Companies:   ${companyCount}`);
  console.log(`   Persons:     ${personCount}`);
  console.log(`   Experiences: ${experienceCount}`);
  console.log(`   Exits:       ${exitCount}`);
  console.log(`\n⏱️  Total time: ${Math.floor(totalTime/60)}m ${totalTime%60}s`);
  console.log(`🔢 Total API calls: ${totalApiCalls}`);
  
  console.log('\n📋 RESULTS BY COMPANY:');
  console.log('-'.repeat(60));
  for (const r of results) {
    console.log(`   ${r.company.padEnd(35)} | ${r.persons} persons | ${r.exits} exits`);
  }
  console.log('-'.repeat(60));
}

main().catch(console.error);
