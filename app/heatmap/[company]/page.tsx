"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, Clock, GraduationCap, Users } from "lucide-react";
import CompanyFlowVisualization from "@/components/CompanyFlowVisualization";
import TransitionSidebar from "@/components/TransitionSidebar";
import { heatmapData, getRawExitDataForCompany } from "@/lib/heatmapData";
import { HeatmapCompany } from "@/lib/heatmapData";
import { useMemo, useState } from "react";
import { CompanyType, ExitData } from "@/types";

// Retro industry colors (lighter, more vibrant)
const industryColors: Record<CompanyType, string> = {
  Consulting: "#4ade80",
  Banking: "#60a5fa",
  Tech: "#c084fc",
  "PE/VC": "#fb923c",
  Startup: "#f472b6",
  Corporate: "#a78bfa",
  Education: "#fbbf24",
  Other: "#facc15",
};

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.company as string;
  const [selectedExitCompany, setSelectedExitCompany] = useState<string | null>(null);
  const [selectedTransitions, setSelectedTransitions] = useState<ExitData[]>([]);

  // Get all companies
  const allCompanies = useMemo(() => {
    return heatmapData.children.flatMap((group) => group.children);
  }, []);

  // Find the selected company
  const company = useMemo(() => {
    return allCompanies.find((c) => c.id === companyId);
  }, [allCompanies, companyId]);

  // Get destination companies - show top 8, group rest as "Other"
  const { topDestinations, otherCount, otherCompanies } = useMemo(() => {
    if (!company) return { topDestinations: [], otherCount: 0, otherCompanies: [] };
    
    const top = company.exits.slice(0, 8);
    const rest = company.exits.slice(8);
    
    const topDest = top
      .map((exit) => ({
        exit,
        company: allCompanies.find((c) => c.name === exit.to),
      }))
      .filter((d) => d.company !== undefined);
    
    const otherTotal = rest.reduce((sum, exit) => sum + exit.count, 0);
    const otherComps = rest.map((exit) => exit.to);
    
    return {
      topDestinations: topDest,
      otherCount: otherTotal,
      otherCompanies: otherComps,
    };
  }, [company, allCompanies]);

  const handleBubbleClick = (exitCompany: string, transitions: ExitData[]) => {
    setSelectedExitCompany(exitCompany);
    setSelectedTransitions(transitions);
  };

  const handleCloseSidebar = () => {
    setSelectedExitCompany(null);
    setSelectedTransitions([]);
  };

  if (!company) {
    return (
      <div className="min-h-screen checkered-bg flex items-center justify-center">
        <div className="bg-white retro-outset p-8 rounded-sm border-2 border-gray-700 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Company Not Found</h1>
          <button
            onClick={() => router.push("/heatmap")}
            className="px-6 py-3 bg-white border-2 border-gray-700 rounded-sm retro-outset hover:retro-pressed transition-all duration-150 font-semibold text-gray-800 uppercase tracking-wide"
          >
            Back to Movement Map
          </button>
        </div>
      </div>
    );
  }

  const mostCommonExitIndustry = topDestinations.length > 0 && topDestinations[0].company
    ? topDestinations[0].company.industry
    : "Various";

  return (
    <div className="min-h-screen checkered-bg">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 bg-white border-b-2 border-gray-700 retro-outset"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/heatmap")}
                className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:retro-pressed transition-all duration-150 retro-outset"
              >
                <ArrowLeft className="w-4 h-4 text-gray-800" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800 tracking-tight uppercase">
                  {company.name} Exit Flow
                </h1>
                <p className="text-xs text-gray-600 uppercase tracking-wide">
                  Career transition destinations
                </p>
              </div>
            </div>

            <div
              className="px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider border-2 border-gray-700 retro-outset"
              style={{
                backgroundColor: industryColors[company.industry],
                color: "#1f2937",
              }}
            >
              {company.industry}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto px-6 py-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Company Size */}
          <div className="bg-white retro-outset border-2 border-gray-700 rounded-sm p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3 h-3 text-gray-600" />
              <span className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold">
                Company Size
              </span>
            </div>
            <div className="text-xl font-bold text-gray-800">
              {company.employeeCount.toLocaleString()}
            </div>
            <div className="text-[10px] text-gray-600 uppercase">employees</div>
          </div>

          {/* Outgoing */}
          <div className="bg-white retro-outset border-2 border-gray-700 rounded-sm p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-3 h-3 text-red-600" />
              <span className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold">
                Outgoing
              </span>
            </div>
            <div className="text-xl font-bold text-gray-800">
              {company.outgoing}
            </div>
            <div className="text-[10px] text-gray-600 uppercase">exits tracked</div>
          </div>

          {/* Incoming */}
          <div className="bg-white retro-outset border-2 border-gray-700 rounded-sm p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold">
                Incoming
              </span>
            </div>
            <div className="text-xl font-bold text-gray-800">
              {company.incoming}
            </div>
            <div className="text-[10px] text-gray-600 uppercase">joins</div>
          </div>

          {/* Avg Years */}
          <div className="bg-white retro-outset border-2 border-gray-700 rounded-sm p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3 h-3 text-purple-600" />
              <span className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold">
                Avg Tenure
              </span>
            </div>
            <div className="text-xl font-bold text-gray-800">
              {company.avgYearsBeforeExit.toFixed(1)}y
            </div>
            <div className="text-[10px] text-gray-600 uppercase">before exit</div>
          </div>

          {/* MBA % */}
          <div className="bg-white retro-outset border-2 border-gray-700 rounded-sm p-3">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-3 h-3 text-yellow-600" />
              <span className="text-[10px] text-gray-600 uppercase tracking-wide font-semibold">
                MBA Pursuit
              </span>
            </div>
            <div className="text-xl font-bold text-gray-800">
              {company.mbaPercentage.toFixed(0)}%
            </div>
            <div className="text-[10px] text-gray-600 uppercase">of exits</div>
          </div>
        </div>
      </motion.div>

      {/* Main Flow Visualization */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <CompanyFlowVisualization
          company={company}
          topDestinations={topDestinations}
          otherCount={otherCount}
          otherCompanies={otherCompanies}
        />
      </div>
    </div>
  );
}
