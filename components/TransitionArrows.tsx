"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { HeatmapCompany } from "@/lib/heatmapData";
import { CompanyType } from "@/types";

interface TransitionArrowsProps {
  sourceCompany: HeatmapCompany;
  allCompanies: HeatmapCompany[];
  containerRef: React.RefObject<HTMLDivElement>;
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

export default function TransitionArrows({
  sourceCompany,
  allCompanies,
  containerRef,
}: TransitionArrowsProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Find positions of companies in the DOM
    const getCompanyPosition = (company: HeatmapCompany) => {
      // Find the rect element with matching company data
      const cells = container.querySelectorAll('.cell');
      for (const cell of Array.from(cells)) {
        const rect = cell.querySelector('rect');
        if (rect) {
          const bbox = rect.getBoundingClientRect();
          const containerBbox = container.getBoundingClientRect();
          return {
            x: bbox.left - containerBbox.left + bbox.width / 2,
            y: bbox.top - containerBbox.top + bbox.height / 2,
          };
        }
      }
      return { x: rect.width / 2, y: rect.height / 2 };
    };

    const sourcePos = getCompanyPosition(sourceCompany);

    // Get target positions for exit companies
    const arrows = sourceCompany.exits.map(exit => {
      const targetCompany = allCompanies.find(c => c.name === exit.to);
      if (!targetCompany) return null;

      const targetPos = getCompanyPosition(targetCompany);

      return {
        source: sourcePos,
        target: targetPos,
        count: exit.count,
        company: targetCompany,
      };
    }).filter(Boolean);

    // Note: In a real implementation, we'd draw curved SVG paths here
    // For now, we'll use a simpler approach with the visual feedback in the treemap itself
  }, [sourceCompany, allCompanies, containerRef]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {/* Arrows will be drawn here */}
    </svg>
  );
}

