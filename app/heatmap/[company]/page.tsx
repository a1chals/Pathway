"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, Clock, GraduationCap, Users, Building2 } from "lucide-react";
import CompanyFlowVisualization from "@/components/CompanyFlowVisualization";
import TransitionSidebar from "@/components/TransitionSidebar";
import { heatmapData, getRawExitDataForCompany } from "@/lib/heatmapData";
import { HeatmapCompany } from "@/lib/heatmapData";
import { useMemo, useState } from "react";
import { CompanyType, ExitData } from "@/types";

const typeColors: Record<CompanyType, string> = {
  Consulting: "#34d399", // Green
  Banking: "#60a5fa", // Blue
  Tech: "#8b7dff", // Purple
  "PE/VC": "#fbbf24", // Yellow
  Startup: "#f472b6", // Pink
  Corporate: "#a3b8cc", // Blue-grey
  Education: "#fcd34d", // Yellow
  Other: "#94a3b8", // Grey
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

  // Get raw exit data for this company
  const rawExitData = useMemo(() => {
    if (!company) return [];
    return getRawExitDataForCompany(company.name);
  }, [company]);

  // Get destination companies
  const destinationCompanies = useMemo(() => {
    if (!company) return [];
    return company.exits
      .map((exit) => allCompanies.find((c) => c.name === exit.to))
      .filter((c): c is HeatmapCompany => c !== undefined);
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
        <div className="text-gray-800 text-center">
          <h1 className="text-2xl font-bold mb-4 uppercase tracking-wide">Company Not Found</h1>
          <button
            onClick={() => router.push("/heatmap")}
            className="px-6 py-3 bg-white border-2 border-gray-700 hover:retro-pressed transition-all retro-outset text-gray-800 uppercase tracking-wide"
          >
            Back to Heatmap
          </button>
        </div>
      </div>
    );
  }

  const mostCommonExitIndustry = destinationCompanies.length > 0
    ? destinationCompanies[0].industry
    : "Various";

  return (
    <div className="relative w-full h-screen checkered-bg overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 bg-white border-b-2 border-gray-700 p-6 z-30 retro-outset"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/heatmap")}
              className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:retro-pressed transition-all retro-outset"
            >
              <ArrowLeft className="w-5 h-5 text-gray-800" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
                {company.name} Exit Flow
              </h1>
              <p className="text-sm text-gray-600 uppercase tracking-wide">
                Visualizing career transitions from {company.name}
              </p>
            </div>
          </div>

          <div
            className="px-4 py-2 rounded-sm border-2 border-gray-700 bg-white text-sm font-medium retro-outset uppercase tracking-wide"
            style={{
              color: typeColors[company.industry],
            }}
          >
            {company.industry}
          </div>
        </div>
      </motion.div>

      {/* Main Flow Visualization */}
      <div className="absolute inset-0 pt-28 pb-44">
        <CompanyFlowVisualization
          company={company}
          destinationCompanies={destinationCompanies}
          rawExitData={rawExitData}
          onBubbleClick={handleBubbleClick}
        />
      </div>

      {/* Transition Sidebar */}
      <TransitionSidebar
        isOpen={selectedExitCompany !== null}
        onClose={handleCloseSidebar}
        exitCompany={selectedExitCompany || ""}
        transitions={selectedTransitions}
        sourceCompany={company.name}
      />

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-6 right-6 z-30 pointer-events-none"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto pointer-events-auto">
          {/* Company Size */}
          <div className="bg-white border-2 border-gray-700 rounded-sm p-4 retro-outset">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
                <Users className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs text-gray-600 uppercase tracking-wide">
                Company Size
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {company.employeeCount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 mt-1 uppercase">employees</div>
          </div>

          {/* Outgoing */}
          <div className="bg-white border-2 border-gray-700 rounded-sm p-4 retro-outset">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
                <TrendingDown className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs text-gray-600 uppercase tracking-wide">
                Outgoing
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {company.outgoing}
            </div>
            <div className="text-xs text-gray-600 mt-1 uppercase">exits tracked</div>
          </div>

          {/* Incoming */}
          <div className="bg-white border-2 border-gray-700 rounded-sm p-4 retro-outset">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs text-gray-600 uppercase tracking-wide">
                Incoming
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {company.incoming}
            </div>
            <div className="text-xs text-gray-600 mt-1 uppercase">joins</div>
          </div>

          {/* Avg Years */}
          <div className="bg-white border-2 border-gray-700 rounded-sm p-4 retro-outset">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
                <Clock className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs text-gray-600 uppercase tracking-wide">
                Avg Tenure
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {company.avgYearsBeforeExit.toFixed(1)}y
            </div>
            <div className="text-xs text-gray-600 mt-1 uppercase">before exit</div>
          </div>

          {/* MBA % */}
          {company.mbaPercentage > 0 && (
            <div className="bg-white border-2 border-gray-700 rounded-sm p-4 retro-outset">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
                  <GraduationCap className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-gray-600 uppercase tracking-wide">
                  MBA Pursuit
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {company.mbaPercentage.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600 mt-1 uppercase">of exits</div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute top-24 right-6 bg-white border-2 border-gray-700 rounded-sm p-4 max-w-xs z-30 retro-outset"
      >
        <div className="text-xs font-semibold text-gray-800 mb-3 uppercase tracking-wide">
          Legend
        </div>
        <div className="text-xs text-gray-700 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-800 rounded-full border border-gray-700" />
            <span>Circle size = number of exits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-800 rounded-full border border-gray-700" />
            <span>Color = industry type</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-800 rounded-full border border-gray-700" />
            <span>Click to view transitions</span>
          </div>
        </div>
      </motion.div>

      {/* Most Common Exit */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute top-24 left-6 bg-white border-2 border-gray-700 rounded-sm p-4 max-w-xs z-30 retro-outset"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
            <Building2 className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Most Common Exit
          </span>
        </div>
        <div className="text-lg font-bold text-gray-800 uppercase">{mostCommonExitIndustry}</div>
        <div className="text-xs text-gray-600 mt-1 uppercase">
          {company.exits.length} destinations shown
        </div>
      </motion.div>
    </div>
  );
}

