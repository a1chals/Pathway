"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Building2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  getCompanyIndustryBreakdown,
  getCompanyLogoUrl,
  IndustryExit,
} from '@/lib/talentExitNetwork';

export default function CompanyDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyName = searchParams.get('company') || '';
  const category = searchParams.get('category') as 'investment_banking' | 'consulting' | null;

  const [industries, setIndustries] = useState<IndustryExit[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalExits, setTotalExits] = useState(0);

  useEffect(() => {
    async function loadIndustries() {
      if (!companyName) return;
      setLoading(true);
      try {
        const data = await getCompanyIndustryBreakdown(companyName);
        setIndustries(data);
        setTotalExits(data.reduce((sum, ind) => sum + ind.count, 0));
      } catch (error) {
        console.error('Error loading industries:', error);
      } finally {
        setLoading(false);
      }
    }
    loadIndustries();
  }, [companyName]);

  const handleIndustryClick = (industry: string) => {
    router.push(`/talent-exit-network/industry?company=${encodeURIComponent(companyName)}&industry=${encodeURIComponent(industry)}&category=${category || ''}`);
  };

  const logoUrl = getCompanyLogoUrl(companyName);

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
                onClick={() => router.push('/talent-exit-network')}
                className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed"
              >
                <ArrowLeft className="h-5 w-5 text-gray-800" />
              </button>
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={companyName}
                    className="w-10 h-10 rounded-sm border border-gray-300 object-contain bg-white p-1"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-sm border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
                    {companyName}
                  </h1>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    {totalExits} total exits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
              Exit Industries
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Click on an industry to see specific companies and people who exited there
          </p>
        </div>

        {industries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600">No exit data available</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((industry, index) => (
              <motion.button
                key={industry.industry}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleIndustryClick(industry.industry)}
                className="p-6 rounded-sm border-2 border-gray-700 bg-white hover:bg-gray-50 transition-colors retro-outset hover:retro-pressed text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-800 text-base uppercase tracking-wide flex-1">
                    {industry.industry}
                  </h3>
                  <div className="text-2xl font-bold text-gray-800 ml-4">
                    {industry.percentage}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Exits:</span>
                    <span className="font-semibold text-gray-800">{industry.count}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-sm overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${industry.percentage}%` }}
                      transition={{ duration: 0.5, delay: index * 0.03 }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
