"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, Clock, GraduationCap, Users, Building2 } from "lucide-react";
import CompanyFlowVisualization from "@/components/CompanyFlowVisualization";
import { heatmapData } from "@/lib/heatmapData";
import { HeatmapCompany } from "@/lib/heatmapData";
import { useMemo } from "react";
import { CompanyType } from "@/types";

const typeColors: Record<CompanyType, string> = {
  Consulting: "#22c55e",
  Banking: "#3b82f6",
  Tech: "#a855f7",
  "PE/VC": "#f97316",
  Startup: "#ec4899",
  Corporate: "#8b5cf6",
  Education: "#f59e0b",
  Other: "#eab308",
};

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.company as string;

  // Get all companies
  const allCompanies = useMemo(() => {
    return heatmapData.children.flatMap((group) => group.children);
  }, []);

  // Find the selected company
  const company = useMemo(() => {
    return allCompanies.find((c) => c.id === companyId);
  }, [allCompanies, companyId]);

  // Get destination companies
  const destinationCompanies = useMemo(() => {
    if (!company) return [];
    return company.exits
      .map((exit) => allCompanies.find((c) => c.name === exit.to))
      .filter((c): c is HeatmapCompany => c !== undefined);
  }, [company, allCompanies]);

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
          <button
            onClick={() => router.push("/heatmap")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
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
    <div className="relative w-full h-screen bg-gray-950 overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-gray-950 via-gray-950/90 to-transparent p-6 z-30"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/heatmap")}
              className="p-2 rounded-lg bg-gray-900/80 backdrop-blur-sm border border-gray-700 hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {company.name} Exit Flow
              </h1>
              <p className="text-sm text-gray-400">
                Visualizing career transitions from {company.name}
              </p>
            </div>
          </div>

          <div
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: typeColors[company.industry] + "30",
              color: typeColors[company.industry],
              border: `1px solid ${typeColors[company.industry]}40`,
            }}
          >
            {company.industry}
          </div>
        </div>
      </motion.div>

      {/* Main Flow Visualization */}
      <div className="absolute inset-0 pt-28 pb-6">
        <CompanyFlowVisualization
          company={company}
          destinationCompanies={destinationCompanies}
        />
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-6 right-6 z-30"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {/* Company Size */}
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Company Size
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              {company.employeeCount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">employees</div>
          </div>

          {/* Outgoing */}
          <div className="bg-gray-900/95 backdrop-blur-xl border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Outgoing
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              {company.outgoing}
            </div>
            <div className="text-xs text-gray-400 mt-1">exits tracked</div>
          </div>

          {/* Incoming */}
          <div className="bg-gray-900/95 backdrop-blur-xl border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Incoming
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              {company.incoming}
            </div>
            <div className="text-xs text-gray-400 mt-1">joins</div>
          </div>

          {/* Avg Years */}
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Avg Tenure
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              {company.avgYearsBeforeExit.toFixed(1)}y
            </div>
            <div className="text-xs text-gray-400 mt-1">before exit</div>
          </div>

          {/* MBA % */}
          {company.mbaPercentage > 0 && (
            <div className="bg-gray-900/95 backdrop-blur-xl border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  MBA Pursuit
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {company.mbaPercentage.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-400 mt-1">of exits</div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute top-24 right-6 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg p-4 max-w-xs z-30"
      >
        <div className="text-xs font-semibold text-white mb-3 uppercase tracking-wide">
          Arrow Legend
        </div>
        <div className="text-xs text-gray-400 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Arrow width = number of exits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Number in circle = employee count</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Color = industry type</span>
          </div>
        </div>
      </motion.div>

      {/* Most Common Exit */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute top-24 left-6 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg p-4 max-w-xs z-30"
      >
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Most Common Exit
          </span>
        </div>
        <div className="text-lg font-bold text-white">{mostCommonExitIndustry}</div>
        <div className="text-xs text-gray-400 mt-1">
          Top {company.exits.length} destinations shown
        </div>
      </motion.div>
    </div>
  );
}

