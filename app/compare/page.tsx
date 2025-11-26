"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, TrendingUp, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { heatmapData } from "@/lib/heatmapData";
import { HeatmapCompany } from "@/lib/heatmapData";
import { CompanyType } from "@/types";

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

interface IndustryBreakdown {
  [industry: string]: number;
}

export default function ComparePage() {
  const router = useRouter();
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [selectedCompany1, setSelectedCompany1] = useState<HeatmapCompany | null>(null);
  const [selectedCompany2, setSelectedCompany2] = useState<HeatmapCompany | null>(null);

  // Get all companies
  const allCompanies = useMemo(() => {
    return heatmapData.children.flatMap(group => group.children);
  }, []);

  // Filter companies for search 1
  const filteredCompanies1 = useMemo(() => {
    if (!searchQuery1) return [];
    const query = searchQuery1.toLowerCase();
    return allCompanies.filter(company =>
      company.name.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [searchQuery1, allCompanies]);

  // Filter companies for search 2
  const filteredCompanies2 = useMemo(() => {
    if (!searchQuery2) return [];
    const query = searchQuery2.toLowerCase();
    return allCompanies.filter(company =>
      company.name.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [searchQuery2, allCompanies]);

  // Calculate industry breakdown for a company
  const getIndustryBreakdown = (company: HeatmapCompany): IndustryBreakdown => {
    const breakdown: IndustryBreakdown = {};
    
    company.exits.forEach(exit => {
      // Find the destination company to get its industry
      const destCompany = allCompanies.find(c => 
        c.name.toLowerCase() === exit.to.toLowerCase()
      );
      
      if (destCompany) {
        const industry = destCompany.industry;
        breakdown[industry] = (breakdown[industry] || 0) + exit.count;
      } else {
        // If we can't find the company, categorize as "Other"
        breakdown["Other"] = (breakdown["Other"] || 0) + exit.count;
      }
    });
    
    return breakdown;
  };

  const company1Breakdown = selectedCompany1 ? getIndustryBreakdown(selectedCompany1) : {};
  const company2Breakdown = selectedCompany2 ? getIndustryBreakdown(selectedCompany2) : {};

  const company1Total = Object.values(company1Breakdown).reduce((sum, val) => sum + val, 0);
  const company2Total = Object.values(company2Breakdown).reduce((sum, val) => sum + val, 0);

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
            {searchQuery1 && filteredCompanies1.length > 0 && !selectedCompany1 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 max-h-60 overflow-y-auto rounded-sm border-2 border-gray-700 bg-white"
              >
                {filteredCompanies1.map((company) => (
                  <button
                    key={company.id}
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
                      <div className="text-xs text-gray-600">{company.industry}</div>
                    </div>
                  </button>
                ))}
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
                    <div className="text-xs text-gray-600">{selectedCompany1.industry}</div>
                  </div>
                  <button
                    onClick={() => setSelectedCompany1(null)}
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
            {searchQuery2 && filteredCompanies2.length > 0 && !selectedCompany2 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 max-h-60 overflow-y-auto rounded-sm border-2 border-gray-700 bg-white"
              >
                {filteredCompanies2.map((company) => (
                  <button
                    key={company.id}
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
                      <div className="text-xs text-gray-600">{company.industry}</div>
                    </div>
                  </button>
                ))}
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
                    <div className="text-xs text-gray-600">{selectedCompany2.industry}</div>
                  </div>
                  <button
                    onClick={() => setSelectedCompany2(null)}
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

      {/* Comparison Results */}
      {selectedCompany1 && selectedCompany2 && (
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
              <div className="text-4xl font-bold text-gray-800">{company1Total}</div>
              <div className="text-xs text-gray-600 mt-1">
                Avg. {selectedCompany1.avgYearsBeforeExit.toFixed(1)} years before exit
              </div>
            </div>
            <div className="rounded-sm border-2 border-gray-700 bg-white p-6 retro-outset">
              <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                Total Exits from {selectedCompany2.name}
              </div>
              <div className="text-4xl font-bold text-gray-800">{company2Total}</div>
              <div className="text-xs text-gray-600 mt-1">
                Avg. {selectedCompany2.avgYearsBeforeExit.toFixed(1)} years before exit
              </div>
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

