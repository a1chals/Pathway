"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, TrendingUp, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { CompanyType } from "@/types";
import { searchCompaniesFromDB, getCompanyExitData, CompanySearchResult, CompanyComparisonData } from "@/lib/compareUtils";

const industryColors: Record<CompanyType, string> = {
  Tech: "#8b7dff",
  Consulting: "#34d399",
  Banking: "#60a5fa",
  "PE/VC": "#fbbf24",
  Startup: "#f472b6",
  Education: "#fcd34d",
  Corporate: "#a3b8cc",
  Other: "#94a3b8",
};

export default function ComparePage() {
  const router = useRouter();
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [selectedCompany1, setSelectedCompany1] = useState<CompanySearchResult | null>(null);
  const [selectedCompany2, setSelectedCompany2] = useState<CompanySearchResult | null>(null);
  const [filteredCompanies1, setFilteredCompanies1] = useState<CompanySearchResult[]>([]);
  const [filteredCompanies2, setFilteredCompanies2] = useState<CompanySearchResult[]>([]);
  const [company1Data, setCompany1Data] = useState<CompanyComparisonData | null>(null);
  const [company2Data, setCompany2Data] = useState<CompanyComparisonData | null>(null);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoadingData1, setIsLoadingData1] = useState(false);
  const [isLoadingData2, setIsLoadingData2] = useState(false);

  // Search companies for input 1
  useEffect(() => {
    const searchCompanies = async () => {
      if (!searchQuery1.trim()) {
        setFilteredCompanies1([]);
        return;
      }

      setIsLoading1(true);
      const results = await searchCompaniesFromDB(searchQuery1, 10);
      setFilteredCompanies1(results);
      setIsLoading1(false);
    };

    const timeoutId = setTimeout(searchCompanies, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery1]);

  // Search companies for input 2
  useEffect(() => {
    const searchCompanies = async () => {
      if (!searchQuery2.trim()) {
        setFilteredCompanies2([]);
        return;
      }

      setIsLoading2(true);
      const results = await searchCompaniesFromDB(searchQuery2, 10);
      setFilteredCompanies2(results);
      setIsLoading2(false);
    };

    const timeoutId = setTimeout(searchCompanies, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery2]);

  // Load exit data for company 1
  useEffect(() => {
    if (!selectedCompany1) {
      setCompany1Data(null);
      return;
    }

    const loadData = async () => {
      setIsLoadingData1(true);
      const data = await getCompanyExitData(selectedCompany1.name);
      setCompany1Data(data);
      setIsLoadingData1(false);
    };

    loadData();
  }, [selectedCompany1]);

  // Load exit data for company 2
  useEffect(() => {
    if (!selectedCompany2) {
      setCompany2Data(null);
      return;
    }

    const loadData = async () => {
      setIsLoadingData2(true);
      const data = await getCompanyExitData(selectedCompany2.name);
      setCompany2Data(data);
      setIsLoadingData2(false);
    };

    loadData();
  }, [selectedCompany2]);

  // Calculate industry breakdown
  const company1Breakdown = useMemo(() => {
    if (!company1Data) return {};
    const breakdown: Record<string, number> = {};
    company1Data.industryBreakdown.forEach(item => {
      breakdown[item.industry] = item.count;
    });
    return breakdown;
  }, [company1Data]);

  const company2Breakdown = useMemo(() => {
    if (!company2Data) return {};
    const breakdown: Record<string, number> = {};
    company2Data.industryBreakdown.forEach(item => {
      breakdown[item.industry] = item.count;
    });
    return breakdown;
  }, [company2Data]);

  const company1Total = company1Data?.totalExits || 0;
  const company2Total = company2Data?.totalExits || 0;

  // Get all unique industries from both companies
  const allIndustries = Array.from(new Set([
    ...Object.keys(company1Breakdown),
    ...Object.keys(company2Breakdown)
  ])).sort();

  return (
    <div className="min-h-screen checkered-bg pt-12">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-gray-700 bg-white retro-outset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/")}
                  className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-800" />
                </button>
                <div className="p-2 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
                    Company Comparison
                  </h1>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Compare career paths between two companies
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Company 1 Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-sm border-2 border-gray-700 bg-white p-6 retro-outset"
          >
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-4">
              Company 1
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={searchQuery1}
                onChange={(e) => setSearchQuery1(e.target.value)}
                placeholder="Search first company..."
                className="w-full pl-10 pr-4 py-3 rounded-sm border-2 border-gray-700 bg-white outline-none text-sm text-gray-800 placeholder-gray-500 transition-all duration-150 retro-inset focus:retro-pressed"
              />
            </div>

            {/* Search Results 1 */}
            {searchQuery1 && !selectedCompany1 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 max-h-60 overflow-y-auto rounded-sm border-2 border-gray-700 bg-white"
              >
                {isLoading1 ? (
                  <div className="px-4 py-3 text-sm text-gray-600 text-center">Searching...</div>
                ) : filteredCompanies1.length > 0 ? (
                  filteredCompanies1.map((company, index) => (
                    <button
                      key={`${company.name}-${index}`}
                      onClick={() => {
                        setSelectedCompany1(company);
                        setSearchQuery1("");
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-all border-b border-gray-300 last:border-b-0 flex items-center gap-3"
                    >
                      {company.logo && (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-8 h-8 rounded"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                          {company.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {company.industry || 'Unknown'} {company.totalExits && `• ${company.totalExits} exits`}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-600 text-center">No companies found</div>
                )}
              </motion.div>
            )}

            {/* Selected Company 1 */}
            {selectedCompany1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 rounded-sm border-2 border-gray-700 bg-gray-100 retro-inset"
              >
                <div className="flex items-center gap-3">
                  {selectedCompany1.logo && (
                    <img
                      src={selectedCompany1.logo}
                      alt={selectedCompany1.name}
                      className="w-12 h-12 rounded"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  )}
                  <div className="flex-1">
                    <div className="text-base font-bold text-gray-800 uppercase tracking-wide">
                      {selectedCompany1.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {selectedCompany1.industry || 'Unknown'}
                      {isLoadingData1 && ' • Loading data...'}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCompany1(null);
                      setCompany1Data(null);
                    }}
                    className="px-3 py-1 text-xs rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset uppercase tracking-wide font-medium"
                  >
                    Clear
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Company 2 Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-sm border-2 border-gray-700 bg-white p-6 retro-outset"
          >
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-4">
              Company 2
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={searchQuery2}
                onChange={(e) => setSearchQuery2(e.target.value)}
                placeholder="Search second company..."
                className="w-full pl-10 pr-4 py-3 rounded-sm border-2 border-gray-700 bg-white outline-none text-sm text-gray-800 placeholder-gray-500 transition-all duration-150 retro-inset focus:retro-pressed"
              />
            </div>

            {/* Search Results 2 */}
            {searchQuery2 && !selectedCompany2 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 max-h-60 overflow-y-auto rounded-sm border-2 border-gray-700 bg-white"
              >
                {isLoading2 ? (
                  <div className="px-4 py-3 text-sm text-gray-600 text-center">Searching...</div>
                ) : filteredCompanies2.length > 0 ? (
                  filteredCompanies2.map((company, index) => (
                    <button
                      key={`${company.name}-${index}`}
                      onClick={() => {
                        setSelectedCompany2(company);
                        setSearchQuery2("");
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-all border-b border-gray-300 last:border-b-0 flex items-center gap-3"
                    >
                      {company.logo && (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-8 h-8 rounded"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                          {company.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {company.industry || 'Unknown'} {company.totalExits && `• ${company.totalExits} exits`}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-600 text-center">No companies found</div>
                )}
              </motion.div>
            )}

            {/* Selected Company 2 */}
            {selectedCompany2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 rounded-sm border-2 border-gray-700 bg-gray-100 retro-inset"
              >
                <div className="flex items-center gap-3">
                  {selectedCompany2.logo && (
                    <img
                      src={selectedCompany2.logo}
                      alt={selectedCompany2.name}
                      className="w-12 h-12 rounded"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  )}
                  <div className="flex-1">
                    <div className="text-base font-bold text-gray-800 uppercase tracking-wide">
                      {selectedCompany2.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {selectedCompany2.industry || 'Unknown'}
                      {isLoadingData2 && ' • Loading data...'}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCompany2(null);
                      setCompany2Data(null);
                    }}
                    className="px-3 py-1 text-xs rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset uppercase tracking-wide font-medium"
                  >
                    Clear
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Loading State - Companies selected but data loading */}
      {selectedCompany1 && selectedCompany2 && (isLoadingData1 || isLoadingData2 || !company1Data || !company2Data) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center"
        >
          <div className="rounded-sm border-2 border-gray-700 bg-white p-12 retro-outset">
            <div className="text-lg text-gray-600">Loading comparison data...</div>
          </div>
        </motion.div>
      )}

      {/* Comparison Results */}
      {selectedCompany1 && selectedCompany2 && company1Data && company2Data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
        >
          {/* Summary Stats */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="rounded-sm border-2 border-gray-700 bg-white p-6 retro-outset">
              <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                Total Exits from {selectedCompany1.name}
              </div>
              {isLoadingData1 ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : (
                <>
                  <div className="text-4xl font-bold text-gray-800">{company1Total}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Avg. {company1Data?.avgYearsBeforeExit.toFixed(1) || '0.0'} years before exit
                  </div>
                </>
              )}
            </div>
            <div className="rounded-sm border-2 border-gray-700 bg-white p-6 retro-outset">
              <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                Total Exits from {selectedCompany2.name}
              </div>
              {isLoadingData2 ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : (
                <>
                  <div className="text-4xl font-bold text-gray-800">{company2Total}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Avg. {company2Data?.avgYearsBeforeExit.toFixed(1) || '0.0'} years before exit
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Industry Breakdown Comparison */}
          <div className="rounded-sm border-2 border-gray-700 bg-white p-6 retro-outset">
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide mb-6">
              Exits by Industry
            </h2>

            <div className="space-y-4">
              {allIndustries.map((industry, index) => {
                const count1 = company1Breakdown[industry] || 0;
                const count2 = company2Breakdown[industry] || 0;
                const percent1 = company1Total > 0 ? (count1 / company1Total) * 100 : 0;
                const percent2 = company2Total > 0 ? (count2 / company2Total) * 100 : 0;
                const maxPercent = Math.max(percent1, percent2);

                return (
                  <motion.div
                    key={industry}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-sm border-2 border-gray-700 bg-gray-50 p-4 retro-inset"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-sm border-2 border-gray-700"
                          style={{ backgroundColor: industryColors[industry as CompanyType] || "#94a3b8" }}
                        />
                        <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                          {industry}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Company 1 Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>{selectedCompany1.name}</span>
                          <span className="font-bold">{count1} ({percent1.toFixed(1)}%)</span>
                        </div>
                        <div className="h-8 bg-gray-200 rounded-sm border border-gray-400 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent1}%` }}
                            transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                            className="h-full flex items-center justify-end pr-2"
                            style={{
                              backgroundColor: industryColors[industry as CompanyType] || "#94a3b8",
                            }}
                          >
                            {count1 > 0 && (
                              <span className="text-xs font-bold text-white">{count1}</span>
                            )}
                          </motion.div>
                        </div>
                      </div>

                      {/* Company 2 Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>{selectedCompany2.name}</span>
                          <span className="font-bold">{count2} ({percent2.toFixed(1)}%)</span>
                        </div>
                        <div className="h-8 bg-gray-200 rounded-sm border border-gray-400 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent2}%` }}
                            transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                            className="h-full flex items-center justify-end pr-2"
                            style={{
                              backgroundColor: industryColors[industry as CompanyType] || "#94a3b8",
                            }}
                          >
                            {count2 > 0 && (
                              <span className="text-xs font-bold text-white">{count2}</span>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Winner Indicator */}
                    {count1 !== count2 && (
                      <div className="mt-2 text-xs text-gray-600 text-center">
                        {count1 > count2 ? (
                          <span>✓ {selectedCompany1.name} sends <strong>{count1 - count2} more</strong> to {industry}</span>
                        ) : (
                          <span>✓ {selectedCompany2.name} sends <strong>{count2 - count1} more</strong> to {industry}</span>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {(!selectedCompany1 || !selectedCompany2) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center"
        >
          <div className="rounded-sm border-2 border-gray-700 bg-white p-12 retro-outset">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Search className="w-12 h-12 text-gray-400" />
              <ArrowRight className="w-8 h-8 text-gray-400" />
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide mb-2">
              Select Two Companies to Compare
            </h3>
            <p className="text-gray-600 uppercase tracking-wide text-sm">
              Search and select companies above to see how their career paths differ
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

