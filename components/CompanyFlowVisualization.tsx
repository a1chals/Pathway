"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { HeatmapCompany } from "@/lib/heatmapData";
import { CompanyType, ExitData } from "@/types";

interface CompanyFlowVisualizationProps {
  company: HeatmapCompany;
  destinationCompanies: HeatmapCompany[];
  rawExitData?: ExitData[];
  onBubbleClick?: (exitCompany: string, transitions: ExitData[]) => void;
}

const typeColors: Record<CompanyType, string> = {
  Consulting: "#34d399", // Green
  Banking: "#60a5fa", // Blue
  Tech: "#8b7dff", // Purple
  "PE/VC": "#fbbf24", // Yellow
  Startup: "#f472b6", // Pink
  Corporate: "#a3b8cc", // Blue-grey
  Education: "#fcd34d", // Yellow
  Other: "#94a3b8", // Grey
};

export default function CompanyFlowVisualization({
  company,
  destinationCompanies,
  rawExitData = [],
  onBubbleClick,
}: CompanyFlowVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hasAnimatedRef = useRef(false);
  const onBubbleClickRef = useRef(onBubbleClick);
  const rawExitDataRef = useRef(rawExitData);
  const companyRef = useRef(company);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update refs when props change
  useEffect(() => {
    onBubbleClickRef.current = onBubbleClick;
    rawExitDataRef.current = rawExitData;
    companyRef.current = company;
  }, [onBubbleClick, rawExitData, company]);

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

  // Reset animation flag when company changes
  useEffect(() => {
    hasAnimatedRef.current = false;
  }, [company.id]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    const shouldAnimate = !hasAnimatedRef.current;
    
    // Only clear and recreate if not already animated
    if (!shouldAnimate) {
      // If already animated, don't re-run
      return;
    }
    
    svg.selectAll("*").remove();
    hasAnimatedRef.current = true;

    const { width, height } = dimensions;

    // Prepare data for circle packing
    // Show ALL companies as individual bubbles (no "Other" grouping)
    const exitData = company.exits.map((exit) => {
      const destCompany = destinationCompanies.find((c) => c.name === exit.to);
      return {
        name: exit.to,
        count: exit.count,
        company: destCompany,
        exit,
      };
    });

    // Create children array for hierarchy
    const children = exitData.map((d) => ({
      name: d.name,
      value: d.count, // Number of exits to this company
      company: d.company,
      exit: d.exit,
    }));

    // Shuffle the children array to break symmetry and prevent same-sized bubbles from grouping
    // This creates a more random appearance while keeping bubbles touching
    const shuffledChildren = [...children].sort(() => Math.random() - 0.5);

    // Create hierarchy for circle packing
    // Source company is the parent, destinations are children
    const hierarchyData = {
      name: company.name,
      value: company.outgoing, // Total exits
      children: shuffledChildren,
    };

    const root = d3.hierarchy(hierarchyData)
      .sum((d) => d.value || 0);
    // Don't sort - use shuffled order to break symmetry

    // Create circle pack layout
    const pack = d3.pack()
      .size([width, height])
      .padding(0); // No padding - bubbles should touch each other

    const packed = pack(root);

    // Find the source node (root) and destination nodes (children)
    const sourceNode = packed;
    const destNodes = sourceNode.children || [];

    // Create container group for zoom/pan
    const container = svg.append("g");

    // Center the packed layout
    const bounds = packed;
    const dx = width / 2 - bounds.x;
    const dy = height / 2 - bounds.y;

    // Set up zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on("zoom", (event) => {
        const transform = event.transform;
        container.attr("transform", `translate(${dx + transform.x},${dy + transform.y}) scale(${transform.k})`);
      })
      .on("start", function() {
        svg.style("cursor", "grabbing");
      })
      .on("end", function() {
        svg.style("cursor", "grab");
      });

    // Initialize with centered transform
    container.attr("transform", `translate(${dx},${dy})`);

    svg.call(zoom as any);
    svg.style("cursor", "grab");

    // Create drop shadow filter for retro effect (matching retro-outset style)
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "retro-shadow")
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");
    
    // First shadow layer: 2px 2px rgba(0, 0, 0, 0.2)
    const offset1 = filter.append("feOffset")
      .attr("in", "SourceAlpha")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("result", "offset1");
    
    const flood1 = filter.append("feFlood")
      .attr("flood-color", "rgba(0, 0, 0, 0.2)")
      .attr("result", "flood1");
    
    const composite1 = filter.append("feComposite")
      .attr("in", "flood1")
      .attr("in2", "offset1")
      .attr("operator", "in")
      .attr("result", "shadow1");
    
    // Second shadow layer: 4px 4px rgba(0, 0, 0, 0.1)
    const offset2 = filter.append("feOffset")
      .attr("in", "SourceAlpha")
      .attr("dx", 4)
      .attr("dy", 4)
      .attr("result", "offset2");
    
    const flood2 = filter.append("feFlood")
      .attr("flood-color", "rgba(0, 0, 0, 0.1)")
      .attr("result", "flood2");
    
    const composite2 = filter.append("feComposite")
      .attr("in", "flood2")
      .attr("in2", "offset2")
      .attr("operator", "in")
      .attr("result", "shadow2");
    
    // Merge both shadows with the original graphic
    const merge = filter.append("feMerge");
    merge.append("feMergeNode").attr("in", "shadow1");
    merge.append("feMergeNode").attr("in", "shadow2");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    // Draw destination nodes
    const destGroups = container
      .selectAll("g.destination")
      .data(destNodes)
      .enter()
      .append("g")
      .attr("class", "destination")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    destGroups
      .append("circle")
      .attr("r", 0)
      .attr("fill", (d) => {
        const data = d.data as any;
        return data.company?.industry ? typeColors[data.company.industry] : typeColors[company.industry];
      })
      .attr("stroke", "#4b5563")
      .attr("stroke-width", 1)
      .attr("filter", "url(#retro-shadow)")
      .style("cursor", "pointer")
      .on("click", function(event: MouseEvent, d: any) {
        const data = d.data as any;
        handleClick(event, data);
      })
      .on("mouseenter", function() {
        d3.select(this).attr("stroke-width", 1.5).attr("opacity", 0.9);
      })
      .on("mouseleave", function() {
        d3.select(this).attr("stroke-width", 1).attr("opacity", 1);
      })
      .transition()
      .delay((d, i) => shouldAnimate ? i * 30 + 50 : 0)
      .duration(shouldAnimate ? 300 : 0)
      .attr("r", (d) => d.r);

    // Store click handler reference to avoid dependency issues
    const handleClick = (event: MouseEvent, data: any) => {
      event.stopPropagation();
      if (onBubbleClickRef.current && rawExitDataRef.current.length > 0) {
        const transitions = rawExitDataRef.current.filter(
          exit => exit.start_company === companyRef.current.name && exit.exit_company === data.name
        );
        onBubbleClickRef.current(data.name, transitions);
      }
    };

    // Add company logos/initials to destinations
    destGroups.each(function (d, i) {
      const group = d3.select(this);
      const data = d.data as any;
      const destCompany = data.company;
      const radius = d.r;

      if (destCompany && destCompany.logo) {
        group
          .append("image")
          .attr("href", destCompany.logo)
          .attr("x", -radius * 0.4)
          .attr("y", -radius * 0.5)
          .attr("width", radius * 0.8)
          .attr("height", radius * 0.8)
          .attr("opacity", 0)
          .style("pointer-events", "none")
          .on("error", function () {
            d3.select(this).remove();
            addInitials(group, data.name, radius, i);
          })
          .transition()
          .delay(shouldAnimate ? i * 30 + 200 : 0)
          .duration(shouldAnimate ? 200 : 0)
          .attr("opacity", 0.95);
      } else {
        addInitials(group, data.name, radius, i);
      }
    });

    function addInitials(group: d3.Selection<SVGGElement, any, null, undefined>, name: string, radius: number, index: number) {
      group
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-" + radius * 0.1)
        .attr("fill", "#ffffff")
        .attr("font-size", `${Math.max(14, radius * 0.2)}px`)
        .attr("font-weight", "bold")
        .attr("opacity", 0)
        .text(() => {
          const words = name.split(/[\s&]+/);
          if (words.length === 1) return name.slice(0, 2).toUpperCase();
          return words.slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
        })
        .transition()
        .delay(shouldAnimate ? index * 30 + 200 : 0)
        .duration(shouldAnimate ? 200 : 0)
        .attr("opacity", 0.95);
    }

    // Source node position is used for arrow calculations but not rendered
    // (company name is already in the page title)

  }, [company, destinationCompanies, dimensions]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
