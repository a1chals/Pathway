"use client";

import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import dynamic from 'next/dynamic';
import { TalentGraphNode, TalentGraphLink } from '@/types/talentGraph';
import { CompanyType } from '@/types';

// Dynamically import to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

interface TalentGraphProps {
  nodes: TalentGraphNode[];
  links: TalentGraphLink[];
  selectedNode: TalentGraphNode | null;
  selectedNodes: TalentGraphNode[];
  onNodeClick: (node: TalentGraphNode | null, event?: MouseEvent) => void;
  onNodeRightClick?: (node: TalentGraphNode) => void;
}

export interface TalentGraphRef {
  centerAt: (nodeId: string, x?: number, y?: number) => void;
  zoom: (level: number, duration?: number) => void;
}

const industryColors: Record<CompanyType, string> = {
  Tech: "#8b7dff",
  Consulting: "#34d399",
  Banking: "#60a5fa",
  "PE/VC": "#fbbf24",
  Startup: "#f472b6",
  Education: "#fcd34d",
  Corporate: "#a3b8cc",
  Other: "#94a3b8",
};

const TalentGraph = forwardRef<TalentGraphRef, TalentGraphProps>(({
  nodes,
  links,
  selectedNode,
  selectedNodes,
  onNodeClick,
  onNodeRightClick,
}, ref) => {
  const graphRef = useRef<any>();

  useImperativeHandle(ref, () => ({
    centerAt: (nodeId: string, x: number = 0, y: number = 0) => {
      if (graphRef.current) {
        // Wait for next frame to ensure node is rendered
        setTimeout(() => {
          if (graphRef.current) {
            const graphData = graphRef.current.graphData();
            const nodeObj = graphData.nodes.find((n: any) => n.id === nodeId);
            if (nodeObj && nodeObj.x !== undefined && nodeObj.y !== undefined) {
              graphRef.current.centerAt(nodeObj.x + x, nodeObj.y + y);
            }
          }
        }, 100);
      }
    },
    zoom: (level: number, duration: number = 1000) => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(duration, 20, (node: any) => true);
      }
    },
  }));

  // Calculate node size based on total exits or employee count
  const getNodeSize = useCallback((node: TalentGraphNode) => {
    const baseSize = 5;
    const exitMultiplier = Math.sqrt((node.totalExits || 0) + 1) * 0.5;
    const employeeMultiplier = Math.sqrt((node.employeeCount || 0) / 1000) * 0.3;
    return baseSize + exitMultiplier + employeeMultiplier;
  }, []);

  // Get node color based on industry and selection state
  const getNodeColor = useCallback((node: TalentGraphNode) => {
    if (selectedNodes.length === 2) {
      // Compare mode: highlight selected, dim others
      const isSelected = selectedNodes.some(n => n.id === node.id);
      if (isSelected) {
        return industryColors[node.industry] || industryColors.Other;
      }
      return '#d1d5db'; // Dimmed
    }
    
    if (selectedNode) {
      // Single selection mode: highlight selected and neighbors
      const isSelected = selectedNode.id === node.id;
      const isNeighbor = links.some(
        (link: any) => {
          const sourceId = typeof link.source === 'string' ? link.source : link.source?.id;
          const targetId = typeof link.target === 'string' ? link.target : link.target?.id;
          return (sourceId === node.id && targetId === selectedNode.id) ||
                 (targetId === node.id && sourceId === selectedNode.id);
        }
      );
      
      if (isSelected) {
        return industryColors[node.industry] || industryColors.Other;
      }
      if (isNeighbor) {
        return industryColors[node.industry] || industryColors.Other;
      }
      return '#e5e7eb'; // Dimmed
    }
    
    return industryColors[node.industry] || industryColors.Other;
  }, [selectedNode, selectedNodes, links]);

  // Get link opacity and color based on selection
  const getLinkColor = useCallback((link: any) => {
    // Handle both string IDs and node objects
    const sourceId = typeof link.source === 'string' ? link.source : link.source?.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target?.id;
    
    if (selectedNodes.length === 2) {
      // Compare mode: only show links between selected nodes
      const sourceSelected = selectedNodes.some(n => n.id === sourceId);
      const targetSelected = selectedNodes.some(n => n.id === targetId);
      if (sourceSelected && targetSelected) {
        return '#3b82f6'; // Blue-500 for better visibility
      }
      return 'rgba(209, 213, 219, 0.3)'; // Very dim
    }
    
    if (selectedNode) {
      // Single selection: highlight links to/from selected node
      const isConnected = sourceId === selectedNode.id || targetId === selectedNode.id;
      if (isConnected) {
        return 'rgba(59, 130, 246, 0.7)'; // Blue-500 with opacity
      }
      return 'rgba(209, 213, 219, 0.5)'; // Dimmed
    }
    
    return 'rgba(107, 114, 128, 0.4)'; // Default
  }, [selectedNode, selectedNodes]);

  // Get link width based on count
  const getLinkWidth = useCallback((link: any) => {
    return Math.sqrt(link.count || 1) * 0.5;
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((node: TalentGraphNode, event: MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd click for compare mode
      onNodeRightClick?.(node);
    } else {
      // Regular click
      onNodeClick(node, event);
    }
  }, [onNodeClick, onNodeRightClick]);

  // Force engine configuration for industry clustering
  useEffect(() => {
    if (!graphRef.current || nodes.length === 0) return;

    const graph = graphRef.current;
    
    // Configure force engine
    graph.d3Force('charge')?.strength(-300);
    graph.d3Force('link')?.distance((link: any) => {
      // Shorter distance for same industry
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      const sourceNode = nodes.find(n => n.id === sourceId);
      const targetNode = nodes.find(n => n.id === targetId);
      if (sourceNode && targetNode && sourceNode.industry === targetNode.industry) {
        return 80;
      }
      return 150;
    });
  }, [nodes, links]);

  if (typeof window === 'undefined') {
    return <div className="w-full h-full bg-white" />;
  }

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={{ nodes, links }}
      nodeLabel={(node: TalentGraphNode) => `${node.name}\n${node.industry}`}
      nodeColor={getNodeColor}
      nodeVal={getNodeSize}
      linkColor={getLinkColor}
      linkWidth={getLinkWidth}
      linkCurvature={0.2}
      linkDirectionalArrowLength={4}
      linkDirectionalArrowRelPos={1}
      onNodeClick={handleNodeClick}
      backgroundColor="#ffffff"
      cooldownTicks={100}
      onEngineStop={() => {
        if (graphRef.current) {
          graphRef.current.zoomToFit(400);
        }
      }}
    />
  );
});

TalentGraph.displayName = 'TalentGraph';

export default TalentGraph;

