"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Clock, GraduationCap, Building2, Users } from "lucide-react";
import { HeatmapCompany } from "@/lib/heatmapData";
import { CompanyType } from "@/types";

interface HeatmapDetailPanelProps {
  company: HeatmapCompany | null;
  onClose: () => void;
}

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

export default function HeatmapDetailPanel({ company, onClose }: HeatmapDetailPanelProps) {
  if (!company) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-gray-900/95 backdrop-blur-xl border-l border-gray-700 shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700 p-6 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          <div className="flex items-start gap-4">
            {/* Company Logo Placeholder */}
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
              style={{ backgroundColor: typeColors[company.industry] }}
            >
              {company.name.split(/[\s&]+/).slice(0, 2).map(w => w[0]).join("").toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white mb-2 truncate">
                {company.name}
              </h2>
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: typeColors[company.industry] + "30",
                  color: typeColors[company.industry],
                }}
              >
                {company.industry}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Company Size */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Company Size
              </span>
            </div>
            <div className="text-3xl font-bold text-white">
              {company.employeeCount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">employees</div>
          </div>

          {/* Employee Movement */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Employee Movement
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Incoming
                  </span>
                </div>
                <div className="text-3xl font-bold text-white">
                  +{company.incoming}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Outgoing
                  </span>
                </div>
                <div className="text-3xl font-bold text-white">
                  -{company.outgoing}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Key Metrics */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Key Metrics
            </h3>
            
            <div className="space-y-3">
              {/* Average Years Before Exit */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Avg. Years Before Exit
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {company.avgYearsBeforeExit.toFixed(1)} years
                </div>
              </div>

              {/* MBA Percentage */}
              {company.mbaPercentage > 0 && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      Pursuing MBAs
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {company.mbaPercentage.toFixed(0)}%
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Exit Companies */}
          {company.exits.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Top Exit Destinations
              </h3>
              
              <div className="space-y-3">
                {company.exits.map((exit, index) => (
                  <motion.div
                    key={exit.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/70 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm mb-1 truncate">
                          {exit.to}
                        </div>
                        <div className="text-xs text-gray-400">
                          {exit.avgYears.toFixed(1)} years avg tenure
                        </div>
                      </div>
                      <div className="ml-3">
                        <div
                          className="px-3 py-1 rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: typeColors[company.industry] }}
                        >
                          {exit.count}
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(exit.count / company.outgoing) * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                        className="h-1.5 rounded-full"
                        style={{ backgroundColor: typeColors[company.industry] }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              View Full Details
            </button>
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg border border-gray-700 transition-colors">
              Compare with Others
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

