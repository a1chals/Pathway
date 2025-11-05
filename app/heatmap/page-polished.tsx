"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Info, X } from "lucide-react";
import { useRouter } from "next/navigation";
import TreemapPolished from "@/components/TreemapPolished";
import { heatmapData } from "@/lib/heatmapData";
import { CompanyType } from "@/types";

const industryColors: Record<CompanyType, Record<string, string>> = {
  Tech: { bg: "#6557f5", text: "#6557f5" },
  Consulting: { bg: "#18b57f", text: "#18b57f" },
  Banking: { bg: "#2d9bf0", text: "#2d9bf0" },
  "PE/VC": { bg: "#e89b2c", text: "#e89b2c" },
  Startup: { bg: "#eb4f7e", text: "#eb4f7e" },
  Education: { bg: "#f3c62f", text: "#f3c62f" },
  Corporate: { bg: "#94A3B8", text: "#94A3B8" },
  Other: { bg: "#64748b", text: "#64748b" },
};

export default function HeatmapPagePolished() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeWindow, setTimeWindow] = useState<"1year" | "2years" | "all">("all");
  const [filteredTypes, setFilteredTypes] = useState<Set<CompanyType>>(
    new Set(["Consulting", "Banking", "Tech", "PE/VC", "Startup", "Corporate", "Education", "Other"])
  );
  const [showInfo, setShowInfo] = useState(false);

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

  const types: CompanyType[] = ["Consulting", "Banking", "Tech", "PE/VC", "Startup", "Corporate", "Education", "Other"];

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: "#0c1220" }}>
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(232, 237, 248, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(232, 237, 248, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Frosted Glass Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 right-4 z-40"
      >
        <div
          className="rounded-2xl backdrop-blur-md px-6 py-4 flex items-center justify-between"
          style={{
            backgroundColor: "rgba(12, 18, 32, 0.7)",
            border: "1px solid rgba(30, 37, 56, 1)",
          }}
        >
          {/* Left: Back + Search */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-xl hover:bg-white/5 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: "#E8EDF8" }} />
            </button>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#8A95AD" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies..."
                className="w-full pl-10 pr-4 py-2 rounded-xl backdrop-blur-md outline-none text-sm transition-all duration-200"
                style={{
                  backgroundColor: "rgba(30, 37, 56, 0.5)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  color: "#E8EDF8",
                }}
              />
            </div>
          </div>

          {/* Center: Title */}
          <div className="text-center px-8">
            <h1 className="text-lg font-semibold" style={{ color: "rgba(232,237,248,0.9)", letterSpacing: "0.01em" }}>
              Career Transition Heatmap
            </h1>
            <p className="text-sm" style={{ color: "#8A95AD" }}>
              Visual exploration of talent movement
            </p>
          </div>

          {/* Right: Time Window */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <div className="flex items-center rounded-xl p-1" style={{ backgroundColor: "rgba(30, 37, 56, 0.5)" }}>
              {(["1year", "2years", "all"] as const).map((window) => (
                <button
                  key={window}
                  onClick={() => setTimeWindow(window)}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: timeWindow === window ? "rgba(255,255,255,0.1)" : "transparent",
                    color: timeWindow === window ? "#E8EDF8" : "#8A95AD",
                  }}
                >
                  {window === "1year" ? "Past Year" : window === "2years" ? "Past 2 Years" : "All Time"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Treemap */}
      <div className="absolute inset-0 pt-28 pb-6 px-6">
        <TreemapPolished
          data={filteredData}
          filteredTypes={filteredTypes}
        />
      </div>

      {/* Floating Glass Filter Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="fixed bottom-6 left-6 rounded-2xl backdrop-blur-md p-4 w-64 z-40"
        style={{
          backgroundColor: "rgba(12, 18, 32, 0.7)",
          border: "1px solid rgba(30, 37, 56, 1)",
        }}
      >
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#8A95AD" }}>
          Industry Types
        </div>
        
        <div className="space-y-2">
          {types.map((type) => {
            const isActive = filteredTypes.has(type);
            const colors = industryColors[type];
            
            return (
              <button
                key={type}
                onClick={() => handleToggleType(type)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: isActive ? `${colors.bg}15` : "transparent",
                  border: `1px solid ${isActive ? colors.bg + "40" : "rgba(255,255,255,0.05)"}`,
                  opacity: isActive ? 1 : 0.5,
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: colors.bg }}
                />
                <span className="text-sm font-medium" style={{ color: "#E8EDF8" }}>
                  {type}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <button
            onClick={() => {
              if (filteredTypes.size === types.length) {
                types.forEach(type => handleToggleType(type));
              } else {
                types.forEach(type => {
                  if (!filteredTypes.has(type)) {
                    handleToggleType(type);
                  }
                });
              }
            }}
            className="w-full text-xs font-medium hover:underline transition-all"
            style={{ color: "#8A95AD" }}
          >
            {filteredTypes.size === types.length ? "Deselect All" : "Select All"}
          </button>
        </div>
      </motion.div>

      {/* Info Icon (bottom-right) */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => setShowInfo(!showInfo)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center z-40 hover:scale-110 transition-all duration-200"
        style={{
          backgroundColor: "rgba(12, 18, 32, 0.7)",
          border: "1px solid rgba(30, 37, 56, 1)",
        }}
      >
        {showInfo ? (
          <X className="w-5 h-5" style={{ color: "#E8EDF8" }} />
        ) : (
          <Info className="w-5 h-5" style={{ color: "#8A95AD" }} />
        )}
      </motion.button>

      {/* Info Overlay */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 rounded-2xl backdrop-blur-md p-4 w-72 z-40"
            style={{
              backgroundColor: "rgba(12, 18, 32, 0.9)",
              border: "1px solid rgba(30, 37, 56, 1)",
            }}
          >
            <div className="text-sm font-semibold mb-3" style={{ color: "#E8EDF8" }}>
              How to Use
            </div>
            <div className="space-y-2 text-xs" style={{ color: "#8A95AD" }}>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: "#6557f5" }} />
                <span>Size = company employee count</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: "#6557f5" }} />
                <span>Color = industry type</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: "#6557f5" }} />
                <span>Hover for company details</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: "#6557f5" }} />
                <span>Click to view detailed exit flow</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed top-24 right-6 rounded-2xl backdrop-blur-md px-4 py-3 z-30"
        style={{
          backgroundColor: "rgba(12, 18, 32, 0.7)",
          border: "1px solid rgba(30, 37, 56, 1)",
        }}
      >
        <div className="flex items-center gap-6">
          <div>
            <div className="text-2xl font-semibold" style={{ color: "#E8EDF8" }}>
              {allCompanies.length}
            </div>
            <div className="text-xs" style={{ color: "#8A95AD" }}>Companies</div>
          </div>
          <div className="w-px h-8" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
          <div>
            <div className="text-2xl font-semibold" style={{ color: "#E8EDF8" }}>
              {allCompanies.reduce((sum, c) => sum + c.outgoing, 0)}
            </div>
            <div className="text-xs" style={{ color: "#8A95AD" }}>Transitions</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

