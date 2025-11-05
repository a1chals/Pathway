"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import { HeatmapCompany } from "@/lib/heatmapData";
import { CompanyType } from "@/types";

interface CompanyFlowVisualizationProps {
  company: HeatmapCompany;
  destinationCompanies: HeatmapCompany[];
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

export default function CompanyFlowVisualization({
  company,
  destinationCompanies,
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

    // Source company position (center)
    const sourceSize = 180;
    const sourcePos = { x: centerX, y: centerY };

    // Calculate destination positions in a circle
    const radius = Math.min(width, height) * 0.35;
    const destinations = company.exits.slice(0, 5).map((exit, index) => {
      const destCompany = destinationCompanies.find((c) => c.name === exit.to);
      const angle = (index / company.exits.length) * Math.PI * 2 - Math.PI / 2;
      return {
        exit,
        company: destCompany,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });

    // Create defs for arrow markers
    const defs = svg.append("defs");

    destinations.forEach((dest, index) => {
      const markerId = `arrowhead-${index}`;
      defs
        .append("marker")
        .attr("id", markerId)
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 8)
        .attr("refY", 5)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .attr("fill", typeColors[company.industry]);
    });

    const container = svg.append("g");

    // Draw curved arrows with animation
    destinations.forEach((dest, index) => {
      if (!dest.company) return;

      const maxCount = Math.max(...company.exits.map((e) => e.count));
      const strokeWidth = 3 + (dest.exit.count / maxCount) * 40;

      // Calculate control point for curve
      const dx = dest.x - sourcePos.x;
      const dy = dest.y - sourcePos.y;
      const dr = Math.sqrt(dx * dx + dy * dy);

      // Perpendicular offset for curve
      const offsetX = -dy / dr * 80;
      const offsetY = dx / dr * 80;
      const controlX = (sourcePos.x + dest.x) / 2 + offsetX;
      const controlY = (sourcePos.y + dest.y) / 2 + offsetY;

      // Calculate angle for arrow positioning
      const angle = Math.atan2(dest.y - sourcePos.y, dest.x - sourcePos.x);
      const destRadius = 70;
      const destX = dest.x - Math.cos(angle) * destRadius;
      const destY = dest.y - Math.sin(angle) * destRadius;
      const sourceRadius = sourceSize / 2 + 10;
      const sourceX = sourcePos.x + Math.cos(angle) * sourceRadius;
      const sourceY = sourcePos.y + Math.sin(angle) * sourceRadius;

      const path = d3.path();
      path.moveTo(sourceX, sourceY);
      path.quadraticCurveTo(controlX, controlY, destX, destY);

      // Draw arrow path with gradient
      const gradientId = `gradient-${index}`;
      const gradient = defs
        .append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", typeColors[company.industry])
        .attr("stop-opacity", 0.8);

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", dest.company.industry ? typeColors[dest.company.industry] : typeColors[company.industry])
        .attr("stop-opacity", 0.6);

      const arrow = container
        .append("path")
        .attr("d", path.toString())
        .attr("stroke", `url(#${gradientId})`)
        .attr("stroke-width", strokeWidth)
        .attr("fill", "none")
        .attr("opacity", 0)
        .attr("marker-end", `url(#arrowhead-${index})`)
        .style("filter", "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))");

      // Animate arrow appearance
      arrow
        .transition()
        .delay(index * 200)
        .duration(800)
        .attr("opacity", 1);

      // Animated flow effect
      const pathLength = arrow.node()?.getTotalLength() || 0;
      
      arrow
        .attr("stroke-dasharray", `${pathLength}`)
        .attr("stroke-dashoffset", pathLength)
        .transition()
        .delay(index * 200)
        .duration(1500)
        .ease(d3.easeCubicOut)
        .attr("stroke-dashoffset", 0);
    });

    // Draw destination companies
    const destGroups = container
      .selectAll("g.destination")
      .data(destinations)
      .enter()
      .append("g")
      .attr("class", "destination")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // Destination circles
    destGroups
      .append("circle")
      .attr("r", 0)
      .attr("fill", (d) => (d.company ? typeColors[d.company.industry] : typeColors[company.industry]))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 3)
      .style("filter", "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))")
      .transition()
      .delay((d, i) => i * 200 + 800)
      .duration(500)
      .attr("r", 70);

    // Company logos or initials
    destGroups
      .each(function(d, i) {
        const group = d3.select(this);
        const destCompany = d.company;
        
        if (destCompany && destCompany.logo) {
          // Show logo
          group
            .append("image")
            .attr("href", destCompany.logo)
            .attr("x", -25)
            .attr("y", -35)
            .attr("width", 50)
            .attr("height", 50)
            .attr("opacity", 0)
            .on("error", function() {
              // Fallback to initials if logo fails
              d3.select(this).remove();
              group
                .append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "-10")
                .attr("fill", "#ffffff")
                .attr("font-size", "16px")
                .attr("font-weight", "bold")
                .text(() => {
                  const name = d.exit.to;
                  const words = name.split(/[\s&]+/);
                  if (words.length === 1) return name.slice(0, 2).toUpperCase();
                  return words.slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
                });
            })
            .transition()
            .delay(i * 200 + 1000)
            .duration(300)
            .attr("opacity", 1);
        } else {
          // Show initials
          group
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-10")
            .attr("fill", "#ffffff")
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("opacity", 0)
            .text(() => {
              const name = d.exit.to;
              const words = name.split(/[\s&]+/);
              if (words.length === 1) return name.slice(0, 2).toUpperCase();
              return words.slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
            })
            .transition()
            .delay(i * 200 + 1000)
            .duration(300)
            .attr("opacity", 1);
        }
      });

    // Employee count badge
    destGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "15")
      .attr("fill", "#ffffff")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .attr("opacity", 0)
      .text((d) => d.exit.count)
      .transition()
      .delay((d, i) => i * 200 + 1000)
      .duration(300)
      .attr("opacity", 1);

    // Label below
    destGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "95")
      .attr("fill", "#ffffff")
      .attr("font-size", "13px")
      .attr("font-weight", "600")
      .attr("opacity", 0)
      .each(function (d) {
        const text = d3.select(this);
        const name = d.exit.to;
        // Truncate long names
        const displayName = name.length > 20 ? name.substring(0, 18) + "..." : name;
        text.text(displayName);
      })
      .transition()
      .delay((d, i) => i * 200 + 1000)
      .duration(300)
      .attr("opacity", 0.9);

    // Draw source company (center)
    const sourceGroup = container
      .append("g")
      .attr("transform", `translate(${sourcePos.x},${sourcePos.y})`);

    sourceGroup
      .append("circle")
      .attr("r", sourceSize / 2)
      .attr("fill", typeColors[company.industry])
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 4)
      .style("filter", "drop-shadow(0 8px 24px rgba(0, 0, 0, 0.5))");

    // Source company logo or initials
    if (company.logo) {
      sourceGroup
        .append("image")
        .attr("href", company.logo)
        .attr("x", -50)
        .attr("y", -70)
        .attr("width", 100)
        .attr("height", 100)
        .on("error", function() {
          // Fallback to initials
          d3.select(this).remove();
          sourceGroup
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-20")
            .attr("fill", "#ffffff")
            .attr("font-size", "24px")
            .attr("font-weight", "bold")
            .text(() => {
              const words = company.name.split(/[\s&]+/);
              if (words.length === 1) return company.name.slice(0, 3).toUpperCase();
              return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
            });
        });
    } else {
      sourceGroup
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-20")
        .attr("fill", "#ffffff")
        .attr("font-size", "24px")
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
      .attr("dy", "10")
      .attr("fill", "#ffffff")
      .attr("fill-opacity", 0.9)
      .attr("font-size", "14px")
      .attr("font-weight", "500")
      .text(`${company.outgoing} exits`);

    sourceGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "120")
      .attr("fill", "#ffffff")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .text(company.name);

    sourceGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "140")
      .attr("fill", "#ffffff")
      .attr("fill-opacity", 0.7)
      .attr("font-size", "13px")
      .text(company.industry);
  }, [company, destinationCompanies, dimensions]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}

