"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import Treemap from "@/components/Treemap";
import NetworkLegend from "@/components/NetworkLegend";
import NetworkFilters from "@/components/NetworkFilters";
import { heatmapData } from "@/lib/heatmapData";
import { CompanyType } from "@/types";

export default function HeatmapPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeWindow, setTimeWindow] = useState<"1year" | "2years" | "all">("all");
  const [filteredTypes, setFilteredTypes] = useState<Set<CompanyType>>(
    new Set(["Consulting", "Banking", "Tech", "PE/VC", "Startup", "Corporate", "Education", "Other"])
  );

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery) return heatmapData;

    const query = searchQuery.toLowerCase();
    const filteredChildren = heatmapData.children
      .map(group => ({
        ...group,
        children: group.children.filter(company =>
          company.name.toLowerCase().includes(query)
        ),
      }))
      .filter(group => group.children.length > 0);

    return {
      ...heatmapData,
      children: filteredChildren,
    };
  }, [searchQuery]);

  // Get all companies for arrow rendering
  const allCompanies = useMemo(() => {
    return heatmapData.children.flatMap(group => group.children);
  }, []);

  const handleToggleType = (type: CompanyType) => {
    setFilteredTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: "#0B1220" }}>
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(231, 236, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(231, 236, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Header with design system */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-30 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(11, 18, 32, 0.95) 0%, rgba(11, 18, 32, 0.7) 70%, transparent 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between p-6 pointer-events-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="p-2.5 rounded-xl backdrop-blur-xl transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "rgba(18, 25, 41, 0.8)",
                border: "1px solid #1E2A44",
              }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: "#E7ECF6" }} />
            </button>
            <div>
              <h1 
                className="flex items-center gap-2"
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#E7ECF6",
                }}
              >
                <Layers className="w-6 h-6" />
                Career Transition Heatmap
              </h1>
              <p style={{ fontSize: "14px", color: "#8A95AD", marginTop: "2px" }}>
                Visual exploration of talent movement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/explore")}
              className="px-4 py-2.5 rounded-xl backdrop-blur-xl transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "rgba(18, 25, 41, 0.8)",
                border: "1px solid #1E2A44",
                color: "#E7ECF6",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              View List
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Treemap */}
      <div className="absolute inset-0 pt-24 pb-6 px-6">
        <Treemap
          data={filteredData}
          filteredTypes={filteredTypes}
        />
      </div>

      {/* Filters */}
      <NetworkFilters
        onSearch={setSearchQuery}
        timeWindow={timeWindow}
        onTimeWindowChange={setTimeWindow}
      />

      {/* Legend */}
      <NetworkLegend
        filteredTypes={filteredTypes}
        onToggleType={handleToggleType}
      />

      {/* Instructions */}
      {(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 right-6 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg p-4 max-w-xs z-30"
        >
          <div className="text-xs font-semibold text-white mb-2 uppercase tracking-wide">
            How to Use
          </div>
          <div className="text-xs text-gray-400 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Size = company employee count</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Color = industry type</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Hover to see company details</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Click to view detailed exit flow</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-6 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg p-4 z-30"
        style={{ marginBottom: "120px" }} // Above legend
      >
        <div className="text-xs font-semibold text-white mb-2 uppercase tracking-wide">
          Total Coverage
        </div>
        <div className="flex items-center gap-4">
          <div>
            <div className="text-2xl font-bold text-white">
              {allCompanies.length}
            </div>
            <div className="text-xs text-gray-400">Companies</div>
          </div>
          <div className="w-px h-8 bg-gray-700" />
          <div>
            <div className="text-2xl font-bold text-white">
              {allCompanies.reduce((sum, c) => sum + c.outgoing, 0)}
            </div>
            <div className="text-xs text-gray-400">Transitions</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

