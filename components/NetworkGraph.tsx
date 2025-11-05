"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { NetworkData, NetworkNode, CompanyType } from "@/types";

interface NetworkGraphProps {
  data: NetworkData;
  onNodeClick: (node: NetworkNode) => void;
  selectedNode: NetworkNode | null;
  filteredTypes: Set<CompanyType>;
}

const typeColors: Record<CompanyType, string> = {
  Consulting: "#22c55e", // green
  Banking: "#3b82f6", // blue
  Tech: "#a855f7", // purple
  "PE/VC": "#f97316", // orange
  Startup: "#ec4899", // pink
  Corporate: "#8b5cf6", // violet
  Education: "#f59e0b", // amber
  Other: "#eab308", // yellow
};

export default function NetworkGraph({
  data,
  onNodeClick,
  selectedNode,
  filteredTypes,
}: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);

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

    // Filter data based on selected types
    const filteredNodes = data.nodes.filter(node => filteredTypes.has(node.type));
    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = data.links.filter(
      link => filteredNodeIds.has(link.source as string) && filteredNodeIds.has(link.target as string)
    );

    // Create container group for zoom
    const container = svg
      .append("g")
      .attr("class", "container");

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3
      .forceSimulation(filteredNodes as any)
      .force(
        "link",
        d3
          .forceLink(filteredLinks)
          .id((d: any) => d.id)
          .distance((d: any) => 100 - d.weight * 5)
          .strength(0.5)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Create links
    const link = container
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(filteredLinks)
      .enter()
      .append("line")
      .attr("stroke", "#374151")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", (d: any) => Math.sqrt(d.weight) * 1.5);

    // Create node groups
    const nodeGroup = container
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(filteredNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(
        d3
          .drag<any, any>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // Add circles to nodes
    const circles = nodeGroup
      .append("circle")
      .attr("r", (d: any) => {
        const size = Math.max(20, Math.min(40, Math.sqrt(d.outgoing + d.incoming) * 3));
        return size;
      })
      .attr("fill", (d: any) => typeColors[d.type as CompanyType])
      .attr("stroke", "#1f2937")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))");

    // Add company initials as text
    nodeGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("pointer-events", "none")
      .text((d: any) => {
        // Get initials from company name
        const words = d.name.split(/[\s&]+/);
        if (words.length === 1) {
          return d.name.slice(0, 2).toUpperCase();
        }
        return words
          .slice(0, 2)
          .map((w: string) => w[0])
          .join("")
          .toUpperCase();
      });

    // Add hover and click interactions
    nodeGroup
      .on("mouseenter", function (event, d: any) {
        setHoveredNode(d);
        
        // Highlight connected nodes
        const connectedIds = new Set<string>();
        filteredLinks.forEach(link => {
          if ((link.source as any).id === d.id) {
            connectedIds.add((link.target as any).id);
          }
          if ((link.target as any).id === d.id) {
            connectedIds.add((link.source as any).id);
          }
        });

        // Fade non-connected nodes
        circles
          .style("opacity", (node: any) =>
            node.id === d.id || connectedIds.has(node.id) ? 1 : 0.2
          );

        link
          .style("opacity", (l: any) =>
            (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.1
          )
          .attr("stroke", (l: any) =>
            (l.source.id === d.id || l.target.id === d.id) ? typeColors[d.type as CompanyType] : "#374151"
          );

        // Enlarge hovered node
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", function() {
            const currentR = parseFloat(d3.select(this).attr("r"));
            return currentR * 1.2;
          });
      })
      .on("mouseleave", function () {
        setHoveredNode(null);

        // Reset all nodes
        circles.style("opacity", 1);
        link
          .style("opacity", 0.3)
          .attr("stroke", "#374151");

        // Reset node size
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", function(d: any) {
            const size = Math.max(20, Math.min(40, Math.sqrt(d.outgoing + d.incoming) * 3));
            return size;
          });
      })
      .on("click", (event, d: any) => {
        event.stopPropagation();
        onNodeClick(d);
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Highlight selected node
    if (selectedNode) {
      circles
        .attr("stroke-width", (d: any) => (d.id === selectedNode.id ? 4 : 2))
        .attr("stroke", (d: any) => (d.id === selectedNode.id ? "#ffffff" : "#1f2937"));
    }

    return () => {
      simulation.stop();
    };
  }, [data, dimensions, selectedNode, filteredTypes, onNodeClick]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: "transparent" }}
      />
      
      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="absolute pointer-events-none z-50 bg-gray-900/95 border border-gray-700 rounded-lg px-4 py-3 shadow-xl backdrop-blur-sm"
          style={{
            left: "50%",
            top: "20px",
            transform: "translateX(-50%)",
          }}
        >
          <div className="text-white font-semibold text-sm mb-1">
            {hoveredNode.name}
          </div>
          <div
            className="inline-block px-2 py-1 rounded text-xs font-medium"
            style={{ backgroundColor: typeColors[hoveredNode.type] + "40", color: typeColors[hoveredNode.type] }}
          >
            {hoveredNode.type}
          </div>
          <div className="text-gray-300 text-xs mt-2 space-y-1">
            <div>↗ Outgoing: {hoveredNode.outgoing}</div>
            <div>↙ Incoming: {hoveredNode.incoming}</div>
          </div>
        </div>
      )}
    </div>
  );
}

