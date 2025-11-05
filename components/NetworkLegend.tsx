"use client";

import { motion } from "framer-motion";
import { CompanyType } from "@/types";

interface NetworkLegendProps {
  filteredTypes: Set<CompanyType>;
  onToggleType: (type: CompanyType) => void;
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

const typeLabels: Record<CompanyType, string> = {
  Consulting: "🟩 Consulting",
  Banking: "🟦 Banking / Finance",
  Tech: "🟪 Tech",
  "PE/VC": "🟧 PE / VC",
  Startup: "Startup",
  Corporate: "Corporate",
  Education: "🎓 Education",
  Other: "🟨 Other",
};

export default function NetworkLegend({ filteredTypes, onToggleType }: NetworkLegendProps) {
  const types: CompanyType[] = ["Consulting", "Banking", "Tech", "PE/VC", "Startup", "Corporate", "Education", "Other"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-4 left-4 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-xl p-2.5 shadow-2xl z-40 max-w-[280px]"
    >
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        Industry Types
      </div>
      
      <div className="grid grid-cols-2 gap-1.5">
        {types.map((type) => {
          const isActive = filteredTypes.has(type);
          
          return (
            <button
              key={type}
              onClick={() => onToggleType(type)}
              className={`
                w-full flex items-center gap-1.5 px-1.5 py-1 rounded-md transition-all text-left
                ${isActive 
                  ? "bg-gray-800 border border-gray-600" 
                  : "bg-gray-800/30 border border-gray-700/50 opacity-50"
                }
                hover:bg-gray-800 hover:opacity-100
              `}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: typeColors[type] }}
              />
              <span className="text-[10px] text-white font-medium truncate">
                {typeLabels[type]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 pt-1.5 border-t border-gray-700 col-span-2">
        <button
          onClick={() => {
            if (filteredTypes.size === types.length) {
              // If all selected, deselect all
              types.forEach(type => onToggleType(type));
            } else {
              // Otherwise, select all
              types.forEach(type => {
                if (!filteredTypes.has(type)) {
                  onToggleType(type);
                }
              });
            }
          }}
          className="w-full text-[10px] text-gray-400 hover:text-white transition-colors font-medium uppercase tracking-wide"
        >
          {filteredTypes.size === types.length ? "Deselect All" : "Select All"}
        </button>
      </div>
    </motion.div>
  );
}

