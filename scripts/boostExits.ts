/**
 * Boost Exits Script - Process companies under 150 exits with 3000 employee cap
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const AVIATO_API_KEY = process.env.AVIATO_API_KEY;
const AVIATO_BASE_URL = process.env.AVIATO_API_BASE_URL || 'https://data.api.aviato.co';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!AVIATO_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) { process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const MAX_EMPLOYEES = 3000;
const TARGET_EXITS = 150;
const EXIT_DATE_CUTOFF = new Date('2020-01-01');
const RATE_LIMIT_MS = 400;

// Companies that need boosting - map company name to search term and aliases
const COMPANIES_TO_BOOST: Record<string, { search: string; aliases: string[]; id?: string }> = {
  'EY-Parthenon': { search: 'EY-Parthenon', aliases: ['ey-parthenon', 'parthenon', 'parthenon group', 'parthenon-ey'] },
  'Oliver Wyman': { search: 'Oliver Wyman', aliases: ['oliver wyman'] },
  'Boston Consulting Group': { search: 'Boston Consulting Group', aliases: ['boston consulting', 'bcg'] },
  'KPMG': { search: 'KPMG', aliases: ['kpmg'] },
  'J.P. Morgan': { search: 'J.P. Morgan', aliases: ['j.p. morgan', 'jp morgan', 'jpmorgan'], id: '02nTEbvdJ7RaCvba68kr67Ez7KuYAIU' },
  'McKinsey': { search: 'McKinsey', aliases: ['mckinsey', 'mckinsey & company'] },
  'Morgan Stanley': { search: 'Morgan Stanley', aliases: ['morgan stanley'] },
  'Strategy&': { search: 'Strategy&', aliases: ['strategy&', 'strategy and', 'booz'], id: 'Igw6eIEgea0roHxShX1RH38JrYo3VpH' },
  'Lazard': { search: 'Lazard', aliases: ['lazard'] },
  'Monitor Deloitte': { search: 'Monitor Deloitte', aliases: ['monitor deloitte', 'deloitte', 'monitor group'], id: 'JO3BD4JxyF-eFpyJ2x_cSpaGZ4QmMsh' },
  'Kearney': { search: 'Kearney', aliases: ['kearney', 'a.t. kearney', 'at kearney'] },
};

function isUSA(location: string | null): boolean {
  if (!location) return false;
  return location.toLowerCase().includes('united states');
}

function categorizeCompany(name: string): string {
  const n = name.toLowerCase();
  if (/university|college|school|mba|harvard|stanford|wharton|columbia|booth|kellogg|sloan|haas|stern|fuqua|tuck|ross|darden|anderson|insead|berkeley|mit|cornell|duke|northwestern|yale|upenn/i.test(n)) return 'Education / MBA';
  if (/blackstone|kkr|carlyle|apollo|tpg|bain capital|warburg|general atlantic|advent|cvc|eqt|hellman|silver lake|vista equity|thoma bravo|providence|ta associates|summit partners|francisco partners|insight partners|sixth street|stepstone/i.test(n)) return 'Private Equity';
  if (/sequoia|andreessen|a16z|accel|greylock|benchmark|kleiner|lightspeed|nea|index ventures|general catalyst|bessemer|founders fund|first round|union square|khosla|battery|spark capital/i.test(n)) return 'Venture Capital';
  if (/bridgewater|citadel|two sigma|de shaw|point72|millennium|elliott|third point|baupost|tiger global|renaissance|jane street|hudson river|worldquant|aqr|chilton/i.test(n)) return 'Hedge Fund';
  if (/goldman sachs|morgan stanley|jpmorgan|jp morgan|j\.p\. morgan|bank of america|merrill lynch|citi|credit suisse|deutsche bank|barclays|ubs|evercore|lazard|centerview|moelis|pjt|perella|qatalyst|greenhill|rothschild|jefferies|hsbc|nomura|rbc|td securities|baird|houlihan|william blair|raymond james|guggenheim/i.test(n)) return 'Investment Banking';
  if (/mckinsey|boston consulting|bcg|bain & company|deloitte|accenture|pwc|ey |ernst|kpmg|oliver wyman|lek|kearney|strategy&|booz allen|alixpartners|monitor|parthenon/i.test(n)) return 'Consulting';
  if (/google|alphabet|meta|facebook|amazon|microsoft|apple|netflix|uber|airbnb|stripe|salesforce|snowflake|databricks|palantir|openai|slack|zoom|shopify|robinhood|coinbase|doordash|lyft|twitter|linkedin|oracle|adobe|ibm|nvidia|tesla|tiktok|bloomberg|mastercard|visa/i.test(n)) return 'Big Tech';
  if (/blackrock|fidelity|vanguard|state street|pimco|wellington|t\. rowe|franklin|invesco|asset management|wealth|advisors/i.test(n)) return 'Asset Management';
  return 'Other';
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fetchWithRetry(url: string, options: RequestInit, retries = 5): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429) { await sleep(Math.pow(2, i + 1) * 1000); continue; }
      return res;
    } catch (e) { if (i < retries - 1) { await sleep(Math.pow(2, i + 1) * 1000); continue; } throw e; }
  }
  return fetch(url, options);
}

function getHeaders() { return { 'Authorization': `Bearer ${AVIATO_API_KEY}`, 'Content-Type': 'application/json' }; }

async function processCompany(companyName: string, config: { search: string; aliases: string[]; id?: string }) {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log(`📊 Processing: ${companyName} (3000 cap)`);
  console.log('════════════════════════════════════════════════════════════\n');

  const { count: currentCount } = await supabase.from('exits').select('*', { count: 'exact', head: true }).eq('source_company_name', companyName);
  console.log(`📈 Current exits: ${currentCount}`);
  if ((currentCount || 0) >= TARGET_EXITS) {
    console.log('✅ Already has 150+ exits! Skipping.\n');
    return;
  }

  let companyId = config.id;
  
  if (!companyId) {
    await sleep(RATE_LIMIT_MS);
    const searchRes = await fetchWithRetry(`${AVIATO_BASE_URL}/company/search`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ dsl: { nameQuery: config.search, limit: 10, offset: 0 } }),
    });
    
    const searchData = await searchRes.json();
    const company = searchData.items?.find((c: any) => 
      config.aliases.some(a => c.name.toLowerCase().includes(a))
    );
    if (!company) { console.log('❌ Company not found'); return; }
    companyId = company.id;
    console.log(`✅ Found: ${company.name} (ID: ${companyId})`);
  } else {
    console.log(`✅ Using preset ID: ${companyId}`);
  }

  console.log('📋 Fetching former employees...');
  let allEmployees: any[] = [];
  let page = 1, totalPages = 1;

  while (page <= totalPages && allEmployees.length < MAX_EMPLOYEES) {
    await sleep(RATE_LIMIT_MS);
    const empRes = await fetchWithRetry(`${AVIATO_BASE_URL}/company/employees?id=${companyId}&perPage=100&page=${page}&current=false`, { headers: getHeaders() });
    if (!empRes.ok) { 
      console.log(`  ❌ Page ${page} failed: ${empRes.status}`);
      page++; 
      continue; 
    }
    const empData = await empRes.json();
    if (empData.employees?.length > 0) {
      allEmployees = allEmployees.concat(empData.employees);
      totalPages = empData.pages || 1;
      console.log(`  Page ${page}/${totalPages}: Total ${allEmployees.length}`);
    } else break;
    if (allEmployees.length >= MAX_EMPLOYEES) { allEmployees = allEmployees.slice(0, MAX_EMPLOYEES); break; }
    page++;
  }

  console.log(`\n✅ Total employees: ${allEmployees.length}`);
  if (allEmployees.length === 0) { console.log('❌ No employees found'); return; }

  let skippedUSA = 0, skipped2020 = 0, newExits = 0;

  for (let i = 0; i < allEmployees.length; i++) {
    const emp = allEmployees[i];
    if (i > 0 && i % 100 === 0) {
      const { count } = await supabase.from('exits').select('*', { count: 'exact', head: true }).eq('source_company_name', companyName);
      console.log(`  Progress: ${i}/${allEmployees.length} | DB Exits: ${count} | New: ${newExits}`);
      if ((count || 0) >= TARGET_EXITS) { console.log('  ✅ Reached 150!'); break; }
    }

    try {
      await sleep(RATE_LIMIT_MS);
      const enrichRes = await fetchWithRetry(`${AVIATO_BASE_URL}/person/enrich?id=${emp.personID}`, { headers: getHeaders() });
      if (!enrichRes.ok) continue;
      const person = await enrichRes.json();
      if (!person?.experienceList) continue;
      if (!isUSA(person.location)) { skippedUSA++; continue; }

      await supabase.from('persons').upsert({
        aviato_id: person.id, full_name: person.fullName, first_name: person.firstName,
        last_name: person.lastName, location: person.location, headline: person.headline,
        linkedin_url: person.URLs?.linkedin,
      }, { onConflict: 'aviato_id' });

      const sortedExp = [...person.experienceList].sort((a: any, b: any) => 
        (b.startDate ? new Date(b.startDate).getTime() : 0) - (a.startDate ? new Date(a.startDate).getTime() : 0)
      );
      
      const isSource = (name: string) => config.aliases.some(a => name.toLowerCase().includes(a));
      const sourceExp = sortedExp.find((exp: any) => isSource(exp.companyName || ''));
      if (!sourceExp?.endDate) continue;
      const sourceEnd = new Date(sourceExp.endDate);
      if (sourceEnd < EXIT_DATE_CUTOFF) { skipped2020++; continue; }

      let nextJob = null;
      for (const exp of sortedExp) {
        if (isSource(exp.companyName || '')) continue;
        const expStart = exp.startDate ? new Date(exp.startDate) : null;
        if (expStart && expStart >= sourceEnd && (!nextJob || expStart < new Date(nextJob.startDate))) nextJob = exp;
      }
      if (!nextJob) continue;

      let years = 0;
      if (sourceExp.startDate && sourceExp.endDate) {
        years = (new Date(sourceExp.endDate).getTime() - new Date(sourceExp.startDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      }

      const { error } = await supabase.from('exits').upsert({
        person_id: emp.personID, source_company_id: companyId, source_company_name: companyName,
        source_role: emp.positionList?.[0]?.title || 'Unknown',
        source_start_date: sourceExp.startDate?.split('T')[0] || null,
        source_end_date: sourceExp.endDate?.split('T')[0] || null,
        exit_company_id: nextJob.companyID, exit_company_name: nextJob.companyName || 'Unknown',
        exit_role: nextJob.positionList?.[0]?.title || 'Unknown',
        exit_start_date: nextJob.startDate?.split('T')[0] || null,
        exit_industry: categorizeCompany(nextJob.companyName || ''),
        years_at_source: Math.round(years * 100) / 100,
      }, { onConflict: 'person_id,source_company_name' });
      
      if (!error) newExits++;
    } catch (e) {}
  }

  const { count: finalCount } = await supabase.from('exits').select('*', { count: 'exact', head: true }).eq('source_company_name', companyName);
  console.log(`\n✅ ${companyName} COMPLETE`);
  console.log(`   Final exits: ${finalCount} | New: ${newExits} | Skipped USA: ${skippedUSA}`);
}

async function main() {
  // Get company from command line argument
  const targetCompany = process.argv[2];
  
  if (!targetCompany) {
    // Show status of all companies
    console.log('\n📊 COMPANY EXIT STATUS:\n');
    for (const [name] of Object.entries(COMPANIES_TO_BOOST)) {
      const { count } = await supabase.from('exits').select('*', { count: 'exact', head: true }).eq('source_company_name', name);
      const status = (count || 0) >= TARGET_EXITS ? '✅' : '❌';
      console.log(`  ${status} ${name}: ${count || 0}`);
    }
    console.log('\nUsage: npx tsx scripts/boostExits.ts "Company Name"');
    console.log('Example: npx tsx scripts/boostExits.ts "McKinsey"');
    return;
  }

  const config = COMPANIES_TO_BOOST[targetCompany];
  if (!config) {
    console.log(`❌ Unknown company: ${targetCompany}`);
    console.log('Available companies:', Object.keys(COMPANIES_TO_BOOST).join(', '));
    return;
  }

  await processCompany(targetCompany, config);
}

main().catch(console.error);
