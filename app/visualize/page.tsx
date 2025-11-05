"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import NetworkGraph from "@/components/NetworkGraph";
import CompanyDetailPanel from "@/components/CompanyDetailPanel";
import NetworkLegend from "@/components/NetworkLegend";
import NetworkFilters from "@/components/NetworkFilters";
import { networkData } from "@/lib/networkData";
import { NetworkNode, CompanyType } from "@/types";

export default function VisualizePage() {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeWindow, setTimeWindow] = useState<"1year" | "2years" | "all">("all");
  const [filteredTypes, setFilteredTypes] = useState<Set<CompanyType>>(
    new Set(["Consulting", "Banking", "Tech", "PE/VC", "Other"])
  );

  // Filter data based on search and time window
  const filteredData = useMemo(() => {
    let nodes = networkData.nodes;
    let links = networkData.links;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      nodes = nodes.filter((node) =>
        node.name.toLowerCase().includes(query)
      );
      const nodeIds = new Set(nodes.map((n) => n.id));
      links = links.filter(
        (link) =>
          nodeIds.has(link.source as string) && nodeIds.has(link.target as string)
      );
    }

    // Time window filtering would require date data in the exit records
    // For now, we'll use all data regardless of time window
    // In a real implementation, you'd filter based on dates
    // Note: timeWindow is kept in dependencies for future implementation

    return { nodes, links };
  }, [searchQuery, timeWindow]);

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

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node);
  };

  const handleClosePanel = () => {
    setSelectedNode(null);
  };

  return (
    <div className="relative w-full h-screen bg-gray-950 overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-10"
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
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-gray-950 via-gray-950/80 to-transparent p-6 z-30 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-lg bg-gray-900/80 backdrop-blur-sm border border-gray-700 hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Network Visualization</h1>
              <p className="text-sm text-gray-400">
                Explore how people move between companies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/explore")}
              className="px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              View List
            </button>
          </div>
        </div>
      </motion.div>

      {/* Network Graph */}
      <div className="absolute inset-0">
        <NetworkGraph
          data={filteredData}
          onNodeClick={handleNodeClick}
          selectedNode={selectedNode}
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

      {/* Detail Panel */}
      {selectedNode && (
        <CompanyDetailPanel node={selectedNode} onClose={handleClosePanel} />
      )}

      {/* Instructions */}
      {!selectedNode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 right-6 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg p-4 max-w-xs z-30"
        >
          <div className="text-xs text-gray-400 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Hover over nodes to see connections</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Click to view company details</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Drag nodes to rearrange</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Scroll to zoom in/out</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

