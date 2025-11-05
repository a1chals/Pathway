"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as d3 from "d3";
import { HeatmapData, HeatmapCompany } from "@/lib/heatmapData";
import { CompanyType } from "@/types";
import { colors } from "@/lib/designTokens";

interface TreemapProps {
  data: HeatmapData;
  filteredTypes: Set<CompanyType>;
}

const industryColors: Record<CompanyType, string> = {
  Tech: "#6557f5",
  Consulting: "#18b57f",
  Banking: "#2d9bf0",
  "PE/VC": "#e89b2c",
  Startup: "#eb4f7e",
  Education: "#f3c62f",
  Corporate: "#94A3B8",
  Other: "#64748b",
};

export default function TreemapPolished({
  data,
  filteredTypes,
}: TreemapProps) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredCompany, setHoveredCompany] = useState<HeatmapCompany | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

    const filteredData: HeatmapData = {
      ...data,
      children: data.children
        .filter(group => filteredTypes.has(group.name as CompanyType))
        .map(group => ({
          ...group,
          children: group.children.filter(c => filteredTypes.has(c.industry)),
        })),
    };

    const root = d3
      .hierarchy(filteredData)
      .sum((d: any) => d.employeeCount || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Treemap with proper breathing room
    const treemap = d3
      .treemap<any>()
      .size([width, height])
      .paddingOuter(8)
      .paddingTop(36)
      .paddingInner(12) // 12px between boxes
      .round(true);

    treemap(root);

    const container = svg.append("g");

    // Industry groups
    const groups = container
      .selectAll("g.industry-group")
      .data(root.children || [])
      .enter()
      .append("g")
      .attr("class", "industry-group");

    // Sector background with gradient outline
    groups
      .append("rect")
      .attr("x", (d: any) => d.x0)
      .attr("y", (d: any) => d.y0)
      .attr("width", (d: any) => d.x1 - d.x0)
      .attr("height", (d: any) => d.y1 - d.y0)
      .attr("fill", (d: any) => industryColors[d.data.name as CompanyType] + "06")
      .attr("stroke", "url(#gradientOutline)")
      .attr("stroke-width", 1)
      .attr("rx", 16);

    // Gradient for outlines
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "gradientOutline")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(255,255,255,0.05)");
    
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "transparent");

    // Sector label chips
    groups
      .append("rect")
      .attr("x", (d: any) => d.x0 + 12)
      .attr("y", (d: any) => d.y0 + 12)
      .attr("width", (d: any) => d.data.name.length * 7.5 + 20)
      .attr("height", 22)
      .attr("fill", "rgba(12, 18, 32, 0.7)")
      .attr("stroke", "rgba(30, 37, 56, 1)")
      .attr("stroke-width", 1)
      .attr("rx", 11)
      .style("backdrop-filter", "blur(12px)");

    groups
      .append("text")
      .attr("x", (d: any) => d.x0 + 22)
      .attr("y", (d: any) => d.y0 + 26)
      .attr("fill", "#8A95AD")
      .attr("font-size", "11px")
      .attr("font-weight", 600)
      .attr("text-transform", "uppercase")
      .attr("letter-spacing", "0.08em")
      .text((d: any) => d.data.name);

    // Company cells
    const cells = groups
      .selectAll("g.cell")
      .data((d: any) => d.children || [])
      .enter()
      .append("g")
      .attr("class", "cell")
      .style("cursor", "pointer");

    // Cell rectangles with gradient overlay
    const rects = cells
      .append("rect")
      .attr("x", (d: any) => d.x0)
      .attr("y", (d: any) => d.y0)
      .attr("width", (d: any) => Math.max(0, d.x1 - d.x0))
      .attr("height", (d: any) => Math.max(0, d.y1 - d.y0))
      .attr("fill", (d: any) => {
        const company: HeatmapCompany = d.data;
        return industryColors[company.industry];
      })
      .attr("stroke", "rgba(255,255,255,0.05)")
      .attr("stroke-width", 1)
      .attr("rx", 12)
      .style("filter", "drop-shadow(0 1px 3px rgba(0,0,0,0.25))")
      .style("transition", "all 200ms ease-out");

    // Gradient overlay for depth
    cells.each(function(d: any) {
      const cell = d3.select(this);
      const company: HeatmapCompany = d.data;
      const gradientId = `gradient-${company.id}`;
      
      const cellGradient = defs.append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
      
      cellGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "transparent");
      
      cellGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "rgba(0,0,0,0.1)");
      
      cell.append("rect")
        .attr("x", d.x0)
        .attr("y", d.y0)
        .attr("width", Math.max(0, d.x1 - d.x0))
        .attr("height", Math.max(0, d.y1 - d.y0))
        .attr("fill", `url(#${gradientId})`)
        .attr("rx", 12)
        .style("pointer-events", "none");
    });

    // Company content
    cells.each(function(d: any) {
      const company: HeatmapCompany = d.data;
      const width = d.x1 - d.x0;
      const height = d.y1 - d.y0;
      const centerX = (d.x0 + d.x1) / 2;
      const centerY = (d.y0 + d.y1) / 2;
      const area = width * height;
      
      const group = d3.select(this);
      
      // Logo in white circular chip
      if (company.logo && area > 3500) {
        const logoSize = Math.min(width * 0.4, height * 0.4, 40);
        
        // White circular chip
        group
          .append("circle")
          .attr("cx", centerX)
          .attr("cy", centerY - 10)
          .attr("r", logoSize / 2 + 6)
          .attr("fill", "white")
          .style("pointer-events", "none");
        
        group
          .append("image")
          .attr("href", company.logo)
          .attr("x", centerX - logoSize / 2)
          .attr("y", centerY - logoSize / 2 - 10)
          .attr("width", logoSize)
          .attr("height", logoSize)
          .attr("preserveAspectRatio", "xMidYMid meet")
          .style("pointer-events", "none")
          .on("error", function() {
            d3.select(this).remove();
            group.select("circle").remove();
            
            // Fallback text
            group
              .append("text")
              .attr("x", centerX)
              .attr("y", centerY - 5)
              .attr("text-anchor", "middle")
              .attr("fill", "white")
              .attr("font-size", "13px")
              .attr("font-weight", 600)
              .text(company.name.substring(0, 12));
          });
        
        // Company name below logo
        if (area > 6000) {
          group
            .append("text")
            .attr("x", centerX)
            .attr("y", centerY + logoSize / 2 + 8)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-size", "13px")
            .attr("font-weight", 600)
            .text(company.name.length > 20 ? company.name.substring(0, 18) + "..." : company.name);
          
          // Stats
          group
            .append("text")
            .attr("x", centerX)
            .attr("y", centerY + logoSize / 2 + 24)
            .attr("text-anchor", "middle")
            .attr("fill", "rgba(255,255,255,0.6)")
            .attr("font-size", "11px")
            .attr("font-weight", 500)
            .text(`${company.outgoing} exits • ${company.avgYearsBeforeExit.toFixed(1)} yrs`);
        }
      } else if (area > 2000) {
        // Text only for smaller boxes
        group
          .append("text")
          .attr("x", centerX)
          .attr("y", centerY - 2)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "13px")
          .attr("font-weight", 600)
          .text(company.name.substring(0, 15));
        
        if (area > 4000) {
          group
            .append("text")
            .attr("x", centerX)
            .attr("y", centerY + 14)
            .attr("text-anchor", "middle")
            .attr("fill", "rgba(255,255,255,0.6)")
            .attr("font-size", "11px")
            .attr("font-weight", 500)
            .text(`${company.outgoing} exits`);
        }
      }
    });

    // Hover interactions
    cells
      .on("mouseenter", function(event, d: any) {
        const company: HeatmapCompany = d.data;
        setHoveredCompany(company);
        setMousePos({ x: event.clientX, y: event.clientY });

        const color = industryColors[company.industry];
        
        d3.select(this)
          .select("rect")
          .transition()
          .duration(200)
          .style("filter", `drop-shadow(0 0 10px ${color}) drop-shadow(0 1px 3px rgba(0,0,0,0.25))`)
          .attr("transform", "scale(1.02)")
          .attr("transform-origin", "center");

        rects.style("opacity", (rd: any) => rd.data.id === company.id ? 1 : 0.5);
      })
      .on("mousemove", (event) => {
        setMousePos({ x: event.clientX, y: event.clientY });
      })
      .on("mouseleave", function() {
        setHoveredCompany(null);

        d3.select(this)
          .select("rect")
          .transition()
          .duration(200)
          .style("filter", "drop-shadow(0 1px 3px rgba(0,0,0,0.25))")
          .attr("transform", "scale(1)");

        rects.style("opacity", 1);
      })
      .on("click", function(event, d: any) {
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

      {/* Premium Tooltip */}
      {hoveredCompany && (
        <div
          className="fixed pointer-events-none z-[100]"
          style={{
            left: mousePos.x + 16,
            top: mousePos.y + 16,
          }}
        >
          <div
            className="rounded-xl backdrop-blur-md p-3 min-w-[200px]"
            style={{
              backgroundColor: "rgba(17, 24, 39, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              {hoveredCompany.logo && (
                <img 
                  src={hoveredCompany.logo} 
                  alt="" 
                  className="w-5 h-5 rounded"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              )}
              <span className="text-white font-semibold text-[13px]">
                {hoveredCompany.name}
              </span>
            </div>
            
            <div
              className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium mb-2"
              style={{
                backgroundColor: industryColors[hoveredCompany.industry] + "30",
                color: industryColors[hoveredCompany.industry],
              }}
            >
              {hoveredCompany.industry}
            </div>
            
            <div className="text-[11px] text-gray-400 mt-2">
              {hoveredCompany.outgoing} exits • {hoveredCompany.avgYearsBeforeExit.toFixed(1)} yrs avg
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

