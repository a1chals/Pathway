"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Users, ExternalLink, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  getCompaniesInIndustry,
  getPeopleExitsByIndustry,
  CompanyInIndustry,
  PersonExit,
} from '@/lib/talentExitNetwork';
import PersonDetailPanel from '@/components/PersonDetailPanel';

export default function IndustryDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sourceCompany = searchParams.get('company') || null;
  const industry = searchParams.get('industry') || '';
  const category = searchParams.get('category') as 'investment_banking' | 'consulting' | null;

  const [companies, setCompanies] = useState<CompanyInIndustry[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [people, setPeople] = useState<PersonExit[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<PersonExit | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [allSourceCompanies, setAllSourceCompanies] = useState<string[]>([]);

  useEffect(() => {
    async function loadCompanies() {
      if (!industry) return;
      setLoading(true);
      try {
        if (sourceCompany) {
          // Specific source company
          const data = await getCompaniesInIndustry(sourceCompany, industry);
          setCompanies(data);
          setAllSourceCompanies([sourceCompany]);
        } else if (category) {
          // All companies in category - aggregate across all source companies
          const { SOURCE_COMPANIES } = await import('@/lib/talentExitNetwork');
          const sourceCompanies = SOURCE_COMPANIES.filter(c => c.category === category);
          const allExits = new Map<string, number>();
          
          for (const sc of sourceCompanies) {
            const data = await getCompaniesInIndustry(sc.name, industry);
            data.forEach(company => {
              allExits.set(
                company.companyName,
                (allExits.get(company.companyName) || 0) + company.count
              );
            });
          }
          
          const total = Array.from(allExits.values()).reduce((a, b) => a + b, 0);
          const aggregated: CompanyInIndustry[] = Array.from(allExits.entries())
            .map(([companyName, count]) => ({
              companyName,
              count,
              percentage: Math.round((count / total) * 100 * 10) / 10,
            }))
            .sort((a, b) => b.count - a.count);
          
          setCompanies(aggregated);
          setAllSourceCompanies(sourceCompanies.map(c => c.name));
        }
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCompanies();
  }, [sourceCompany, industry, category]);

  const handleCompanyClick = async (companyName: string) => {
    setSelectedCompany(companyName);
    setLoadingPeople(true);
    try {
      // Get people from all source companies
      const allPeople: PersonExit[] = [];
      for (const sc of allSourceCompanies) {
        const data = await getPeopleExitsByIndustry(sc, industry);
        // Filter to this specific exit company
        const filtered = data.filter(p => 
          p.exitCompanyName.toLowerCase().includes(companyName.toLowerCase())
        );
        allPeople.push(...filtered);
      }
      setPeople(allPeople);
    } catch (error) {
      console.error('Error loading people:', error);
    } finally {
      setLoadingPeople(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen checkered-bg pt-12">
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <div className="text-center">
            <div className="text-gray-800 text-lg mb-2">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen checkered-bg pt-12">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-gray-700 bg-white retro-outset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (sourceCompany) {
                    router.push(`/talent-exit-network/company?company=${encodeURIComponent(sourceCompany)}&category=${category || ''}`);
                  } else {
                    router.push('/talent-exit-network');
                  }
                }}
                className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
              >
                <ArrowLeft className="h-5 w-5 text-gray-800" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
                  {industry}
                </h1>
                <p className="text-xs text-gray-600 uppercase tracking-wide">
                  {sourceCompany 
                    ? `Exits from ${sourceCompany}`
                    : category === 'investment_banking' 
                      ? 'Exits from Investment Banking firms'
                      : 'Exits from Consulting firms'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCompany ? (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-2">
                Companies ({companies.length})
              </h2>
              <p className="text-sm text-gray-600">
                Click on a company to see the people who exited there
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company, index) => (
                <motion.button
                  key={company.companyName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCompanyClick(company.companyName)}
                  className="p-4 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                      {company.companyName}
                    </h3>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold">{company.count}</span> exits
                    </div>
                    <div className="text-xs text-gray-500">
                      {company.percentage}% of {industry} exits
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              {selectedCompany && (
                <button
                  onClick={() => {
                    setSelectedCompany(null);
                    setPeople([]);
                    setSelectedPerson(null);
                  }}
                  className="mb-4 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to companies
                </button>
              )}
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-2">
                {selectedCompany}
              </h2>
              <p className="text-sm text-gray-600">
                {people.length} people from {allSourceCompanies.length === 1 ? allSourceCompanies[0] : `${allSourceCompanies.length} source companies`} → {selectedCompany}
              </p>
            </div>

            {loadingPeople ? (
              <div className="text-center py-12">
                <div className="text-gray-600">Loading people...</div>
              </div>
            ) : (
              <div className="space-y-3">
                {people.map((person, index) => (
                  <motion.div
                    key={person.personId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => setSelectedPerson(person)}
                    className="p-4 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-800 text-sm">
                            {person.fullName || 'Unknown Name'}
                          </h3>
                          {person.linkedinUrl && (
                            <a
                              href={person.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>
                            <span className="font-semibold">{person.sourceRole}</span> →{' '}
                            <span className="font-semibold">{person.exitRole}</span>
                          </div>
                          {person.yearsAtSource > 0 && (
                            <div>
                              {person.yearsAtSource.toFixed(1)} years at source
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-4" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Person Detail Panel */}
      {selectedPerson && (
        <PersonDetailPanel
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      )}
    </div>
  );
}
