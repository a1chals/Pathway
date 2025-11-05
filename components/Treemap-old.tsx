"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as d3 from "d3";
import { HeatmapData, HeatmapCompany } from "@/lib/heatmapData";
import { CompanyType } from "@/types";
import { colors, typography, borderRadius, motion, shadows } from "@/lib/designTokens";

interface TreemapProps {
  data: HeatmapData;
  filteredTypes: Set<CompanyType>;
}

const typeColors: Record<CompanyType, string> = {
  Consulting: colors.consulting,
  Banking: colors.banking,
  Tech: colors.tech,
  "PE/VC": colors.pevc,
  Startup: colors.startup,
  Corporate: colors.corporate,
  Education: colors.education,
  Other: colors.other,
};

export default function Treemap({
  data,
  filteredTypes,
}: TreemapProps) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredCompany, setHoveredCompany] = useState<HeatmapCompany | null>(null);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
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

    // Filter data by selected types
    const filteredData: HeatmapData = {
      ...data,
      children: data.children
        .filter(group => filteredTypes.has(group.name as CompanyType))
        .map(group => ({
          ...group,
          children: group.children.filter(c => filteredTypes.has(c.industry)),
        })),
    };

    // Create hierarchy
    const root = d3
      .hierarchy(filteredData)
      .sum((d: any) => d.employeeCount || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Create treemap layout with improved spacing
    const treemap = d3
      .treemap<any>()
      .size([width, height])
      .paddingOuter(8)
      .paddingTop(32)
      .paddingInner(10)
      .round(true);

    treemap(root);

    // Create groups container
    const container = svg.append("g");

    // Draw industry groups
    const groups = container
      .selectAll("g.industry-group")
      .data(root.children || [])
      .enter()
      .append("g")
      .attr("class", "industry-group");

    // Industry background rectangles with design system
    groups
      .append("rect")
      .attr("x", (d: any) => d.x0)
      .attr("y", (d: any) => d.y0)
      .attr("width", (d: any) => d.x1 - d.x0)
      .attr("height", (d: any) => d.y1 - d.y0)
      .attr("fill", (d: any) => typeColors[d.data.name as CompanyType] + "08")
      .attr("stroke", colors.stroke)
      .attr("stroke-width", 1)
      .attr("rx", 16);

    // Industry label chips (top-left corner)
    groups
      .append("rect")
      .attr("x", (d: any) => d.x0 + 8)
      .attr("y", (d: any) => d.y0 + 8)
      .attr("width", (d: any) => {
        const text = d.data.name;
        return text.length * 7 + 16;
      })
      .attr("height", 20)
      .attr("fill", colors.panel)
      .attr("rx", 6);

    groups
      .append("text")
      .attr("x", (d: any) => d.x0 + 16)
      .attr("y", (d: any) => d.y0 + 21)
      .attr("fill", colors.muted)
      .attr("font-size", typography.size.xs)
      .attr("font-weight", typography.weight.semibold)
      .attr("text-transform", "uppercase")
      .attr("letter-spacing", "0.1em")
      .text((d: any) => d.data.name);

    // Draw company cells
    const cells = groups
      .selectAll("g.cell")
      .data((d: any) => d.children || [])
      .enter()
      .append("g")
      .attr("class", "cell")
      .style("cursor", "pointer");

    // Company rectangles with improved design
    const rects = cells
      .append("rect")
      .attr("x", (d: any) => d.x0)
      .attr("y", (d: any) => d.y0)
      .attr("width", (d: any) => Math.max(0, d.x1 - d.x0))
      .attr("height", (d: any) => Math.max(0, d.y1 - d.y0))
      .attr("fill", (d: any) => {
        const company: HeatmapCompany = d.data;
        return typeColors[company.industry];
      })
      .attr("stroke", colors.stroke)
      .attr("stroke-width", 1)
      .attr("rx", 12)
      .style("filter", shadows.subtle)
      .style("transition", `all ${motion.medium}ms ${motion.easeOut}`);

    // Company logos or names
    cells
      .each(function (d: any) {
        const company: HeatmapCompany = d.data;
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        const centerX = (d.x0 + d.x1) / 2;
        const centerY = (d.y0 + d.y1) / 2;
        const area = width * height;
        
        const group = d3.select(this);
        
        // Logo with subtle pill background
        if (company.logo && area > 4000) {
          const logoSize = Math.min(width * 0.5, height * 0.5, 48);
          const pillPadding = 8;
          
          // Neutral pill background for logo
          group
            .append("rect")
            .attr("x", centerX - logoSize / 2 - pillPadding)
            .attr("y", centerY - logoSize / 2 - 12 - pillPadding)
            .attr("width", logoSize + pillPadding * 2)
            .attr("height", logoSize + pillPadding * 2)
            .attr("fill", "rgba(255, 255, 255, 0.05)")
            .attr("rx", 8)
            .style("pointer-events", "none");
          
          group
            .append("image")
            .attr("href", company.logo)
            .attr("x", centerX - logoSize / 2)
            .attr("y", centerY - logoSize / 2 - 12)
            .attr("width", logoSize)
            .attr("height", logoSize)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("pointer-events", "none")
            .on("error", function() {
              d3.select(this).remove();
              group.select("rect").remove();
              
              // Fallback to text
              group
                .append("text")
                .attr("x", centerX)
                .attr("y", centerY - 8)
                .attr("text-anchor", "middle")
                .attr("fill", colors.text)
                .attr("font-size", typography.size.sm)
                .attr("font-weight", typography.weight.medium)
                .attr("pointer-events", "none")
                .text(company.name.substring(0, 15));
            });
        } else {
          // Text-only display with hierarchy
          const fontSize = area > 8000 ? typography.size.sm : area > 4000 ? typography.size.xs : "10px";
          
          group
            .append("text")
            .attr("x", centerX)
            .attr("y", centerY - 8)
            .attr("text-anchor", "middle")
            .attr("fill", colors.text)
            .attr("font-size", fontSize)
            .attr("font-weight", typography.weight.medium)
            .attr("pointer-events", "none")
            .each(function () {
              const text = d3.select(this);
              let displayName = company.name;
              if (displayName.length > 15 && width < 90) {
                displayName = displayName.substring(0, 13) + "...";
              }
              text.text(displayName);
            });
        }
      });

    // Company stats with improved typography
    cells
      .filter((d: any) => (d.x1 - d.x0) * (d.y1 - d.y0) > 6000)
      .append("text")
      .attr("x", (d: any) => (d.x0 + d.x1) / 2)
      .attr("y", (d: any) => (d.y0 + d.y1) / 2 + 18)
      .attr("text-anchor", "middle")
      .attr("fill", colors.muted)
      .attr("font-size", typography.size.xs)
      .attr("font-weight", typography.weight.regular)
      .attr("pointer-events", "none")
      .text((d: any) => {
        const company: HeatmapCompany = d.data;
        return `${company.outgoing} exits • ${company.avgYearsBeforeExit.toFixed(1)}y`;
      });

    // Interactions
    cells
      .on("mouseenter", function (event, d: any) {
        const company: HeatmapCompany = d.data;
        setHoveredCompany(company);

        // Highlight
        d3.select(this)
          .select("rect")
          .style("filter", "drop-shadow(0 4px 12px rgba(255, 255, 255, 0.4))")
          .attr("stroke-width", 3)
          .attr("stroke", "#ffffff");

        // Fade others
        rects
          .style("opacity", (rd: any) =>
            rd.data.id === company.id ? 1 : 0.3
          );
      })
      .on("mouseleave", function () {
        setHoveredCompany(null);

        d3.select(this)
          .select("rect")
          .transition()
          .duration(motion.fast)
          .style("filter", shadows.subtle)
          .attr("transform", "scale(1)")
          .attr("stroke-width", 1)
          .attr("stroke", colors.stroke);

        rects.style("opacity", 1);
      })
      .on("click", function (event, d: any) {
        event.stopPropagation();
        const company: HeatmapCompany = d.data;
        router.push(`/heatmap/${company.id}`);
      });
  }, [data, dimensions, filteredTypes, router]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: "transparent" }}
      />

      {/* Improved Tooltip */}
      {hoveredCompany && (
        <div
          className="absolute pointer-events-none z-50 backdrop-blur-xl rounded-2xl shadow-2xl max-w-xs"
          style={{
            left: "50%",
            top: "20px",
            transform: "translateX(-50%)",
            backgroundColor: colors.panel,
            border: `1px solid ${colors.stroke}`,
          }}
        >
          <div className="p-4">
            {/* Company name */}
            <div 
              className="font-semibold mb-2"
              style={{
                fontSize: typography.size.sm,
                fontWeight: typography.weight.semibold,
                color: colors.text,
              }}
            >
              {hoveredCompany.name}
            </div>
            
            {/* Industry badge */}
            <div
              className="inline-block px-2.5 py-1 rounded-lg mb-3"
              style={{
                backgroundColor: typeColors[hoveredCompany.industry] + "20",
                color: typeColors[hoveredCompany.industry],
                fontSize: typography.size.xs,
                fontWeight: typography.weight.medium,
              }}
            >
              {hoveredCompany.industry}
            </div>
            
            {/* Stats grid */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span style={{ fontSize: typography.size.xs, color: colors.muted }}>
                  Headcount
                </span>
                <span style={{ fontSize: typography.size.xs, fontWeight: typography.weight.medium, color: colors.text }}>
                  {hoveredCompany.employeeCount.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span style={{ fontSize: typography.size.xs, color: colors.muted }}>
                  Avg before exit
                </span>
                <span style={{ fontSize: typography.size.xs, fontWeight: typography.weight.medium, color: colors.text }}>
                  {hoveredCompany.avgYearsBeforeExit.toFixed(1)}y
                </span>
              </div>
              
              {hoveredCompany.exits.length > 0 && (
                <div className="pt-2 border-t" style={{ borderColor: colors.stroke }}>
                  <div style={{ fontSize: typography.size.xs, color: colors.muted, marginBottom: "4px" }}>
                    Top exit
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: typography.size.xs, fontWeight: typography.weight.medium, color: colors.text }}>
                      {hoveredCompany.exits[0].to}
                    </span>
                    <span 
                      className="px-2 py-0.5 rounded"
                      style={{ 
                        fontSize: "10px", 
                        fontWeight: typography.weight.semibold,
                        backgroundColor: typeColors[hoveredCompany.industry] + "30",
                        color: typeColors[hoveredCompany.industry],
                      }}
                    >
                      {hoveredCompany.exits[0].count}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

