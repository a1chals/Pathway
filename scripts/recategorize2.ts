/**
 * Enhanced Recategorization - Round 2
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function categorizeCompany(name: string): string {
  const n = name.toLowerCase();
  
  // Education / MBA
  if (/university|college|school|mba|harvard|stanford|wharton|columbia|booth|kellogg|sloan|haas|stern|fuqua|tuck|ross|darden|anderson|insead|berkeley|mit|cornell|duke|northwestern|yale|upenn|princeton|nyu|ucla|usc|chicago|michigan|virginia|carnegie|georgetown|emory|rice|vanderbilt|notre dame|texas a&m|uiuc|purdue|penn state|ohio state|florida|georgia tech|massachusetts institute|project destined|correlation one|braven|year up|sponsors for educational|seo |prep for prep|management leadership|mlt |joblyk/i.test(n)) return 'Education / MBA';
  
  // Private Equity
  if (/blackstone|kkr|carlyle|apollo|tpg capital|bain capital|warburg pincus|general atlantic|advent international|cvc capital|eqt partners|hellman|silver lake|vista equity|thoma bravo|providence equity|ta associates|summit partners|francisco partners|insight partners|sixth street|stepstone|centerbridge|sycamore partners|ares management|l catterton|veritas capital|apax partners|ardian|blue owl capital|oaktree capital|patient square|roark capital|audax|clearlake capital|ksl capital|bc partners|charlesbank|sk capital|omers private|new mountain|hg capital|permira|cinven|bridgepoint|pai partners|nordic capital|montagu|triton|onex|cerberus|kohlberg|welsh carson|golden gate|genstar|leonard green|american securities|gtcr|madison dearborn|h\.i\.g|lexington partners|hamilton lane|pantheon|atairos|searchlight|grain management|comvest|revelstoke|gryphon investors|alpine investors|norwest equity|platinum equity|kelso|rockwood|arclight|energy capital|kayne anderson|brookfield private|acon|sentinel capital|sun capital|american industrial|windpoint|frontenac|capvest|crestview|harvest partners|cortec|oceansound|shamrock capital|all seas capital|tidal partners|26north|bansk group|private equity/i.test(n)) return 'Private Equity';
  
  // Venture Capital
  if (/sequoia|andreessen|a16z|accel|greylock|benchmark|kleiner perkins|lightspeed|nea |index ventures|general catalyst|bessemer|founders fund|first round|union square|khosla|battery ventures|spark capital|sapphire ventures|norwest venture|dragoneer|coatue ventures|ribbit capital|felicis|forerunner|initialized|lerer hippeau|maverick ventures|redpoint|shasta|social capital|softbank vision|y combinator|ggv|dst global|ivp|menlo ventures|emergence|valar|craft ventures|lowercase|homebrew|floodgate|balderton|atomico|northzone|creandum|eqt ventures|insight venture|turn\/river|orbiMed|venture capital|vc fund/i.test(n)) return 'Venture Capital';
  
  // Hedge Fund
  if (/bridgewater|citadel|two sigma|de shaw|point72|millennium management|elliott management|third point|baupost|renaissance|jane street|hudson river|worldquant|aqr capital|chilton|viking global|rtw investments|walleye capital|mudrick capital|d1 capital|coatue management|lone pine|maverick capital|tiger global|sculptor|och.ziff|farallon|canyon|davidson kempner|fortress|king street|anchorage|soros|moore capital|brevan howard|caxton|tudor|balyasny|schonfeld|magnetar|capula|winton|systematica|man group|marshall wace|egerton|lansdowne|tci fund|element capital|bluecrest|graham capital|hedge fund/i.test(n)) return 'Hedge Fund';
  
  // Investment Banking
  if (/goldman sachs|morgan stanley|jpmorgan|jp morgan|j\.p\. morgan|bank of america securities|merrill lynch|citigroup global|citi |credit suisse|deutsche bank|barclays|ubs investment|evercore|lazard|centerview|moelis|pjt partners|perella weinberg|qatalyst|greenhill|rothschild|jefferies|hsbc |nomura|rbc capital|td securities|baird|houlihan lokey|william blair|raymond james|guggenheim securities|bnp paribas|bny mellon|texas capital|dtcc|cantor fitzgerald|societe generale|wells fargo securities|northern trust|cowen|stifel|piper sandler|truist securities|keefe bruyette|oppenheimer|wedbush|needham|craig.hallum|leerink|svb securities|lincoln international|harris williams|dc advisory|financo|peter j\. solomon|raine group|liontree|allen & company|haitong securities|investment bank/i.test(n)) return 'Investment Banking';
  
  // Consulting
  if (/mckinsey|boston consulting group|bcg|bain & company|^deloitte|deloitte consulting|deloitte advisory|^accenture|accenture strategy|^pwc|pwc strategy|pricewaterhousecoopers|^ey |^ey$|ey-parthenon|ernst & young|^kpmg|kpmg strategy|kpmg us|kpmg india|oliver wyman|l\.e\.k|lek consulting|^kearney|a\.t\. kearney|strategy&|booz allen|alixpartners|monitor deloitte|parthenon|roland berger|zs associates|^zs$|simon.kucher|analysis group|cornerstone research|charles river|clearview healthcare|putnam associates|cra international|nera economic|brattle group|compass lexecon|fti consulting|alvarez & marsal|huron consulting|navigant|west monroe|slalom|north highland|pa consulting|capgemini invent|infosys consulting|tata consulting|ibm consulting|cognizant consulting|stax|accordion|rsm us|rsm |milliman|management consult/i.test(n)) return 'Consulting';
  
  // Big Tech
  if (/^google|alphabet|^meta |facebook|instagram|whatsapp|^amazon|aws |microsoft|azure|^apple|netflix|^uber|airbnb|stripe|salesforce|snowflake|databricks|palantir|openai|anthropic|slack|zoom video|shopify|robinhood|coinbase|doordash|lyft|twitter|x corp|linkedin|oracle|adobe|^ibm|nvidia|tesla|tiktok|bytedance|bloomberg|mastercard|^visa|paypal|square|block inc|pinterest|snap inc|spotify|dropbox|docusign|servicenow|workday|splunk|crowdstrike|okta|twilio|atlassian|asana|notion|figma|canva|instacart|klaviyo|plaid|^chime|affirm|klarna|nubank|brex|ramp|rippling|gusto|deel|lattice|airtable|monday\.com|hubspot|zendesk|intercom|datadog|elastic|confluent|hashicorp|gitlab|github|vercel|intuit|cisco|youtube|wayfair|palo alto networks|c3 ai|^sap|unqork|cognizant|cash app|ebay|tencent|fanatics/i.test(n)) return 'Big Tech';
  
  // Healthcare / Pharma
  if (/pfizer|johnson & johnson|j&j|merck|novartis|roche|abbvie|bristol.myers|eli lilly|astrazeneca|sanofi|gsk|glaxo|gilead|amgen|biogen|regeneron|moderna|biontech|vertex|alexion|illumina|thermo fisher|danaher|becton|stryker|medtronic|abbott|boston scientific|intuitive surgical|edwards lifesciences|zimmer|baxter|cardinal health|mckesson|amerisource|cvs health|walgreens|unitedhealth|anthem|cigna|humana|centene|molina|wellcare|kaiser permanente|mayo clinic|cleveland clinic|mass general|johns hopkins|optum|change healthcare|veeva|iqvia|cerner|epic systems|medidata|flatiron health|tempus|grail|guardant|foundation medicine|23andme|color health|ro health|hims|teladoc|amwell|livongo|omada|noom|headspace|calm|cerebral|talkspace|ginger|lyra health|spring health|boston medical|healthcare|pharma|biotech|life science|medical device|hospital|clinic|therapeutics|bioscience|diagnostic/i.test(n)) return 'Healthcare / Pharma';
  
  // Asset Management
  if (/blackrock|fidelity investments|vanguard|state street|pimco|wellington|t\. rowe|t\.rowe|franklin templeton|invesco|capital group|american funds|jpmorgan asset|goldman sachs asset|morgan stanley investment|ubs asset|credit suisse asset|neuberger berman|lazard asset|brookfield asset|nuveen|pgim|principal global|northern trust asset|bny mellon investment|ssga|dimensional fund|gmofunds|ariel investments|dodge & cox|mfs investment|putnam investments|janus henderson|hartford funds|columbia threadneedle|schroders|abrdn|legal & general|m&g investments|baillie gifford|marathon asset|gic private|temasek|adia|calstrs|asset management|wealth management|family office|endowment|pension fund|sovereign wealth/i.test(n)) return 'Asset Management';
  
  // Financial Services
  if (/capital one|chase bank|wells fargo|^citi$|citibank|us bank|u\.s\. bank|pnc bank|truist bank|fifth third|regions bank|huntington bank|keybank|m&t bank|citizens bank|santander|td bank|bmo harris|scotiabank|american express|amex|discover financial|synchrony|ally financial|marcus|sofi|lendingclub|prosper|upstart|avant|earnest|commonbond|laurel road|figure|better\.com|rocket mortgage|blend|divvy homes|bilt rewards|point|aven|upgrade|oportun|dave|current|varo|monzo|revolut|n26|greenlight|step|copper banking|till|acorns|betterment|wealthfront|personal capital|ellevest|m1 finance|public\.com|titan invest|stash|qapital|digit|albert|cleo|brigit|empower|nerdwallet|credit karma|mint|truebill|trim|cushion|aura|experian|equifax|transunion|fico|allstate|state farm|geico|progressive|liberty mutual|travelers|hartford|chubb|aig|zurich insurance|axa|allianz|metlife|prudential financial|lincoln financial|principal financial|aflac|unum|guardian life|mass mutual|new york life|northwestern mutual|tiaa|voya|aegon|manulife|sunlife|great west|transamerica|pacific life|nationwide|usaa|lemonade|hippo|root insurance|metromile|clearcover|branch|kin insurance|jetty|sure|bestow|ladder|ethos|haven life|policygenius|the zebra|gabi|cibc|webster bank|smbc|standard chartered|fintech|neobank|digital bank|payments|lending|credit/i.test(n)) return 'Financial Services';
  
  // Corporate (F500)
  if (/walmart|target corp|costco|home depot|lowe's|kroger|albertsons|publix|mcdonald|starbucks|chipotle|yum brands|restaurant brands|domino's|darden restaurants|coca.cola|pepsico|nestle|mondelez|kraft heinz|general mills|kellogg|campbell soup|conagra|hormel|tyson foods|jbs|cargill|adm|bunge|procter & gamble|p&g|unilever|colgate|kimberly.clark|estee lauder|l'oreal|clorox|church & dwight|energizer|spectrum brands|nike|adidas|under armour|lululemon|vf corp|pvh|tapestry|capri holdings|hanesbrands|gap inc|h&m|zara|inditex|fast retailing|lvmh|kering|hermes|richemont|ralph lauren|disney|comcast|at&t|verizon|t-mobile|charter|fox corp|paramount|warner bros|sony|universal|live nation|mgm resorts|caesars|wynn|marriott|hilton|ihg|hyatt|expedia|booking holdings|tripadvisor|ford motor|gm|general motors|toyota|honda|volkswagen|bmw|mercedes|stellantis|rivian|lucid motors|boeing|airbus|lockheed martin|raytheon|northrop grumman|general dynamics|l3harris|textron|ge aerospace|honeywell|3m|caterpillar|deere|parker hannifin|emerson|rockwell automation|illinois tool|eaton|dover|ingersoll rand|xylem|fortive|ametek|roper technologies|idex|graco|lincoln electric|stanley black|snap-on|kennametal|exxon|chevron|conocophillips|occidental|pioneer natural|devon energy|diamondback|eog resources|marathon petroleum|valero|phillips 66|bp|shell|total|equinor|eni|duke energy|southern company|dominion energy|nextera|aep|exelon|xcel energy|entergy|firstenergy|ppl|evergy|consolidated edison|impossible foods|trader joe|visteon|schneider electric|corporate strategy|corp dev|corporate development/i.test(n)) return 'Corporate (F500)';
  
  // Real Estate
  if (/cbre|jll|jones lang|cushman & wakefield|colliers|newmark|marcus & millichap|eastdil|berkadia|walker & dunlop|greystar|brookfield real|blackstone real|starwood capital|colony capital|prologis|equinix|digital realty|crown castle|american tower|simon property|brookfield property|boston properties|vornado|sl green|kilroy|alexandria real|biomed realty|healthpeak|welltower|ventas|invitation homes|american homes|progress residential|tricon|pretium|amherst|cerberus real|ares real|oaktree real|apollo real|tpg real|carlyle real|kkr real|blackrock real|jpmorgan real|goldman real|morgan stanley real|cim group|related companies|tishman speyer|hines|trammell crow|lincoln property|lendlease|skanska|turner construction|bechtel|aecom|jacobs engineering|wsp|stantec|^compass$|real estate|reit|property management|commercial real estate|residential real estate|multifamily|industrial real estate|retail real estate/i.test(n)) return 'Real Estate';
  
  // Government / Non-profit
  if (/federal reserve|us treasury|treasury department|sec |securities and exchange|fdic|occ|cfpb|fhfa|fra|imf|world bank|ifc |ebrd|adb|aiib|undp|unicef|who|usaid|state department|defense department|pentagon|cia|nsa|fbi|doj|dhs|epa|fda|cdc|nih|nasa|doe|department of|white house|congress|senate|house of representatives|supreme court|internal revenue|irs|city of|county of|state of|government|public sector|non.profit|nonprofit|foundation|charity|ngo|philanthropic|gates foundation|ford foundation|rockefeller foundation|bloomberg philanthropies|open society|macarthur|hewlett foundation|packard foundation|moore foundation|walton family|lilly endowment|kresge|carnegie corporation|mellon foundation|knight foundation|pew charitable|annie e casey|robert wood johnson|california endowment|weingart|simons foundation|kavli foundation|gordon moore|alfred p\. sloan|templeton foundation|william and flora hewlett|david and lucile packard/i.test(n)) return 'Government / Non-profit';
  
  // Media / Entertainment
  if (/disney|netflix|warner|paramount|universal pictures|sony pictures|lionsgate|mgm|a24|blumhouse|legendary entertainment|amblin|bad robot|annapurna|skydance|imagine entertainment|participant media|makeready|iac|viacomcbs|fox entertainment|nbc|abc|cbs|hbo|showtime|starz|amc networks|discovery|scripps|vice media|buzzfeed|vox media|conde nast|hearst|meredith|time inc|forbes|dow jones|wsj|new york times|washington post|la times|usa today|gannett|tribune|mcclatchy|news corp|spotify|pandora|siriusxm|iheartmedia|audacy|cumulus|live nation|aeg|msg entertainment|oak view|barstool|the athletic|espn|turner sports|nba|nfl|mlb|nhl|mls|pga|ufc|wwe|ea sports|activision|take.two|epic games|riot games|roblox|unity|creative artists agency|caa|endeavor|wme|uta|icm|otter media|media|entertainment|streaming|broadcast|publishing|gaming|esports/i.test(n)) return 'Media / Entertainment';
  
  // Law Firm - NEW
  if (/cooley|kirkland|latham|skadden|sullivan & cromwell|wachtell|cravath|davis polk|simpson thacher|paul weiss|cleary gottlieb|debevoise|gibson dunn|sidley|jones day|white & case|willkie|milbank|weil gotshal|quinn emanuel|morrison foerster|orrick|hogan lovells|dechert|baker mckenzie|dla piper|norton rose|clifford chance|allen & overy|linklaters|freshfields|herbert smith|ashurst|slaughter and may|law firm|attorney|legal counsel/i.test(n)) return 'Law Firm';
  
  // Startup
  if (/stealth|early.stage|seed.stage|series a|series b|pre.seed|co.founder|founder|entrepreneur|techstars|500 startups|plug and play|alchemist accelerator|launch|antler|venture studio|incubator|accelerator/i.test(n)) return 'Startup';
  
  return 'Other';
}

async function main() {
  console.log('\n🔄 Enhanced Recategorization Round 2...\n');
  
  let allExits: any[] = [];
  let from = 0;
  
  while (true) {
    const { data } = await supabase.from('exits').select('id, exit_company_name, exit_industry').range(from, from + 999);
    if (!data || data.length === 0) break;
    allExits = allExits.concat(data);
    from += 1000;
  }
  
  console.log(`📊 Processing ${allExits.length} exits\n`);
  
  const newIndustryCount: Record<string, number> = {};
  let updated = 0;
  
  for (const exit of allExits) {
    const newIndustry = categorizeCompany(exit.exit_company_name || '');
    newIndustryCount[newIndustry] = (newIndustryCount[newIndustry] || 0) + 1;
    
    if (newIndustry !== exit.exit_industry) {
      await supabase.from('exits').update({ exit_industry: newIndustry }).eq('id', exit.id);
      updated++;
    }
  }
  
  console.log('════════════════════════════════════════════════════════════');
  console.log('📊 FINAL INDUSTRY DISTRIBUTION');
  console.log('════════════════════════════════════════════════════════════\n');
  
  const sorted = Object.entries(newIndustryCount).sort((a, b) => b[1] - a[1]);
  sorted.forEach(([industry, count]) => {
    const pct = ((count / allExits.length) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round(count / allExits.length * 40));
    console.log(`  ${industry.padEnd(24)} ${String(count).padStart(5)}  (${pct.padStart(5)}%)  ${bar}`);
  });
  
  console.log(`\n✅ Updated ${updated} exits\n`);
}

main().catch(console.error);
