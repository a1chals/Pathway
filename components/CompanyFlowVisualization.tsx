"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import { HeatmapCompany } from "@/lib/heatmapData";
import { CompanyType } from "@/types";

interface CompanyFlowVisualizationProps {
  company: HeatmapCompany;
  topDestinations: Array<{
    exit: { to: string; count: number };
    company: HeatmapCompany | undefined;
  }>;
  otherCount: number;
  otherCompanies: string[];
}

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

export default function CompanyFlowVisualization({
  company,
  topDestinations,
  otherCount,
  otherCompanies,
}: CompanyFlowVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    // Source company size
    const sourceSize = 140;
    const sourcePos = { x: centerX, y: centerY };

    // All destinations including "Other" if there are more than 8
    const allDestinations = [...topDestinations];
    if (otherCount > 0) {
      allDestinations.push({
        exit: { to: "Other Companies", count: otherCount },
        company: undefined,
      });
    }

    // Calculate max count for arrow width scaling
    const maxCount = Math.max(...allDestinations.map((d) => d.exit.count));

    // Calculate destination positions in a circle
    const radius = Math.min(width, height) * 0.38;
    const destinations = allDestinations.map((dest, index) => {
      const angle = (index / allDestinations.length) * Math.PI * 2 - Math.PI / 2;
      return {
        ...dest,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });

    const container = svg.append("g");
    
    // Create separate groups for arrows and nodes (arrows behind, nodes in front)
    const arrowGroup = container.append("g").attr("class", "arrows");
    const nodeGroup = container.append("g").attr("class", "nodes");

    // Draw arrows FIRST (so they appear behind nodes)
    destinations.forEach((dest, index) => {
      // Calculate arrow width based on count (min 6px, max 50px)
      const strokeWidth = 6 + (dest.exit.count / maxCount) * 44;

      // Calculate start and end points
      const angle = Math.atan2(dest.y - sourcePos.y, dest.x - sourcePos.x);
      const destRadius = 60;
      const destX = dest.x - Math.cos(angle) * destRadius;
      const destY = dest.y - Math.sin(angle) * destRadius;
      const sourceRadius = sourceSize / 2 + 5;
      const sourceX = sourcePos.x + Math.cos(angle) * sourceRadius;
      const sourceY = sourcePos.y + Math.sin(angle) * sourceRadius;

      // Create straight arrow path
      const path = d3.path();
      path.moveTo(sourceX, sourceY);
      path.lineTo(destX, destY);

      // Determine arrow color
      const arrowColor = dest.company
        ? industryColors[dest.company.industry]
        : "#9ca3af"; // gray for misc

      // Draw arrow - make it visible immediately
      const arrow = arrowGroup
        .append("path")
        .attr("d", path.toString())
        .attr("stroke", arrowColor)
        .attr("stroke-width", strokeWidth)
        .attr("fill", "none")
        .attr("opacity", 0.85)
        .attr("stroke-linecap", "round")
        .style("filter", "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3))");

      // Add arrowhead - make it visible immediately
      const arrowheadSize = Math.min(strokeWidth * 0.7, 18);
      const arrowhead = arrowGroup
        .append("polygon")
        .attr("points", `0,${-arrowheadSize/2} ${arrowheadSize * 1.2},0 0,${arrowheadSize/2}`)
        .attr("fill", arrowColor)
        .attr("opacity", 0.85)
        .attr("transform", () => {
          const arrowAngle = (Math.atan2(destY - sourceY, destX - sourceX) * 180) / Math.PI;
          return `translate(${destX},${destY}) rotate(${arrowAngle})`;
        })
        .style("filter", "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))");
    });

    // Draw destination companies (using nodeGroup so they appear on top)
    const destGroups = nodeGroup
      .selectAll("g.destination")
      .data(destinations)
      .enter()
      .append("g")
      .attr("class", "destination")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // Destination circles (retro style with border) - show immediately
    destGroups
      .append("circle")
      .attr("r", 60)
      .attr("fill", (d) =>
        d.company ? industryColors[d.company.industry] : "#e5e7eb"
      )
      .attr("stroke", "#374151")
      .attr("stroke-width", 3);

    // Company logos or initials
    destGroups.each(function (d, i) {
      const group = d3.select(this);
      const destCompany = d.company;

      if (destCompany && destCompany.logo) {
        // Show logo with transparent background
        group
          .append("image")
          .attr("href", destCompany.logo)
          .attr("x", -25)
          .attr("y", -35)
          .attr("width", 50)
          .attr("height", 50)
          .attr("opacity", 1)
          .style("mix-blend-mode", "multiply")
          .on("error", function () {
            // Fallback to initials if logo fails
            d3.select(this).remove();
            group
              .append("text")
              .attr("text-anchor", "middle")
              .attr("dy", "-5")
              .attr("fill", "#1f2937")
              .attr("font-size", "14px")
              .attr("font-weight", "bold")
              .attr("opacity", 1)
              .text(() => {
                const name = d.exit.to;
                const words = name.split(/[\s&]+/);
                if (words.length === 1) return name.slice(0, 2).toUpperCase();
                return words
                  .slice(0, 2)
                  .map((w: string) => w[0])
                  .join("")
                  .toUpperCase();
              });
          });
      } else if (d.exit.to === "Other Companies") {
        // Show "+" for misc
        group
          .append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "-5")
          .attr("fill", "#6b7280")
          .attr("font-size", "32px")
          .attr("font-weight", "bold")
          .attr("opacity", 1)
          .text("+");
      } else {
        // Show initials
        group
          .append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "-5")
          .attr("fill", "#1f2937")
          .attr("font-size", "14px")
          .attr("font-weight", "bold")
          .attr("opacity", 1)
          .text(() => {
            const name = d.exit.to;
            const words = name.split(/[\s&]+/);
            if (words.length === 1) return name.slice(0, 2).toUpperCase();
            return words
              .slice(0, 2)
              .map((w: string) => w[0])
              .join("")
              .toUpperCase();
          });
      }
    });

    // Employee count badge - show immediately
    destGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "20")
      .attr("fill", "#1f2937")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("opacity", 1)
      .text((d) => d.exit.count);

    // Label below circle - show immediately
    destGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "85")
      .attr("fill", "#374151")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("opacity", 1)
      .each(function (d) {
        const text = d3.select(this);
        const name = d.exit.to;
        // Truncate long names
        const displayName = name.length > 18 ? name.substring(0, 16) + "..." : name;
        text.text(displayName.toUpperCase());
      });

    // Draw source company (center) - using nodeGroup so it appears on top
    const sourceGroup = nodeGroup
      .append("g")
      .attr("transform", `translate(${sourcePos.x},${sourcePos.y})`);

    sourceGroup
      .append("circle")
      .attr("r", sourceSize / 2)
      .attr("fill", industryColors[company.industry])
      .attr("stroke", "#374151")
      .attr("stroke-width", 4)
      .style("filter", "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))");

    // Source company logo or initials with transparent background
    if (company.logo) {
      sourceGroup
        .append("image")
        .attr("href", company.logo)
        .attr("x", -40)
        .attr("y", -55)
        .attr("width", 80)
        .attr("height", 80)
        .style("mix-blend-mode", "multiply")
        .on("error", function () {
          // Fallback to initials
          d3.select(this).remove();
          sourceGroup
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-10")
            .attr("fill", "#1f2937")
            .attr("font-size", "20px")
            .attr("font-weight", "bold")
            .text(() => {
              const words = company.name.split(/[\s&]+/);
              if (words.length === 1) return company.name.slice(0, 3).toUpperCase();
              return words
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase();
            });
        });
    } else {
      sourceGroup
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-10")
        .attr("fill", "#1f2937")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .text(() => {
          const words = company.name.split(/[\s&]+/);
          if (words.length === 1) {
            return company.name.slice(0, 3).toUpperCase();
          }
          return words
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();
        });
    }

    sourceGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "15")
      .attr("fill", "#1f2937")
      .attr("fill-opacity", 0.8)
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .text(`${company.outgoing} EXITS`);

    sourceGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "100")
      .attr("fill", "#1f2937")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(company.name.toUpperCase());
  }, [company, topDestinations, otherCount, dimensions]);

  return (
    <div className="bg-white retro-outset border-2 border-gray-700 rounded-sm p-6">
      {/* Arrow Legend */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-bold text-gray-800 uppercase tracking-wider">
          Exit Flow Visualization
        </div>
        <div className="text-xs text-gray-600 space-x-4 flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-gradient-to-r from-gray-400 to-gray-600"></div>
            <span>Arrow width = # of exits</span>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="relative w-full" style={{ height: "650px" }}>
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Legend for Other companies */}
      {otherCount > 0 && otherCompanies.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-4 p-4 bg-gray-100 border-2 border-gray-700 rounded-sm retro-inset"
        >
          <div className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wider">
            Other Companies ({otherCount} total exits):
          </div>
          <div className="text-xs text-gray-600 leading-relaxed">
            {otherCompanies.join(" • ")}
          </div>
        </motion.div>
      )}
    </div>
  );
}
