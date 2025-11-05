"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Briefcase } from "lucide-react";
import { ExitData } from "@/types";

interface TransitionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  exitCompany: string;
  transitions: ExitData[];
  sourceCompany: string;
}

export default function TransitionSidebar({
  isOpen,
  onClose,
  exitCompany,
  transitions,
  sourceCompany,
}: TransitionSidebarProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-white border-l-2 border-gray-700 z-50 retro-outset overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b-2 border-gray-700 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
                  Transitions to {exitCompany}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-sm border-2 border-gray-700 bg-white hover:retro-pressed transition-all retro-outset"
                >
                  <X className="w-4 h-4 text-gray-800" />
                </button>
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">
                {transitions.length} transition{transitions.length !== 1 ? "s" : ""} from {sourceCompany}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {transitions.map((transition, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border-2 border-gray-700 rounded-sm p-4 retro-outset"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset flex-shrink-0">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            {transition.start_role}
                          </span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            {transition.exit_role}
                          </span>
                        </div>
                        <div className="text-sm text-gray-800 font-medium mb-1">
                          {transition.exit_company}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="uppercase tracking-wide">{transition.industry}</span>
                          <span>•</span>
                          <span>{transition.avg_years_before_exit.toFixed(1)} years</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

