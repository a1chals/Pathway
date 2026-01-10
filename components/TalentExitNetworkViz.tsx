"use client";

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { IndustryExit } from '@/lib/talentExitNetwork';

interface TalentExitNetworkVizProps {
  data: Map<string, IndustryExit[]>;
  category: 'investment_banking' | 'consulting';
  onIndustryClick: (companyName: string | null, industry: string, category: 'investment_banking' | 'consulting') => void;
  width?: number;
  height?: number;
}

const CATEGORY_COLORS = {
  investment_banking: '#3b82f6', // blue
  consulting: '#22c55e', // green
};

const INDUSTRY_COLORS: Record<string, string> = {
  'Investment Banking': '#3b82f6',
  'Private Equity': '#f97316',
  'Big Tech': '#a855f7',
  'Consulting': '#22c55e',
  'Education / MBA': '#f59e0b',
  'Healthcare / Pharma': '#ef4444',
  'Financial Services': '#06b6d4',
  'Asset Management': '#6366f1',
  'Hedge Fund': '#ec4899',
  'Venture Capital': '#f43f5e',
  'Corporate (F500)': '#8b5cf6',
  'Government / Non-profit': '#64748b',
  'Media / Entertainment': '#14b8a6',
  'Real Estate': '#f97316',
  'Law Firm': '#84cc16',
  'Startup': '#ec4899',
  'Other': '#9ca3af',
};

export default function TalentExitNetworkViz({
  data,
  category,
  onIndustryClick,
  width = 800,
  height = 600,
}: TalentExitNetworkVizProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || data.size === 0) {
      // Clear if no data
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll('*').remove();
      }
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Company positions in a circle
    const companies = Array.from(data.keys());
    const companyRadius = Math.min(innerWidth, innerHeight) * 0.3;
    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;

    const companyPositions = companies.map((company, i) => {
      const angle = (i / companies.length) * 2 * Math.PI - Math.PI / 2; // Start at top
      return {
        company,
        x: centerX + companyRadius * Math.cos(angle),
        y: centerY + companyRadius * Math.sin(angle),
        angle,
      };
    });

    // Draw links from companies to industries
    const industries = new Set<string>();
    companies.forEach(company => {
      const industryExits = data.get(company) || [];
      industryExits.forEach(ie => industries.add(ie.industry));
    });

    const industryList = Array.from(industries);
    const industryRadius = Math.min(innerWidth, innerHeight) * 0.45;
    
    // Position industries in outer circle
    const industryPositions = industryList.map((industry, i) => {
      const angle = (i / industryList.length) * 2 * Math.PI - Math.PI / 2;
      return {
        industry,
        x: centerX + industryRadius * Math.cos(angle),
        y: centerY + industryRadius * Math.sin(angle),
        angle,
      };
    });

    // Create links
    const links: Array<{
      source: typeof companyPositions[0];
      target: typeof industryPositions[0];
      company: string;
      industry: string;
      percentage: number;
    }> = [];

    companies.forEach(company => {
      const industryExits = data.get(company) || [];
      industryExits.forEach(ie => {
        const sourcePos = companyPositions.find(p => p.company === company)!;
        const targetPos = industryPositions.find(p => p.industry === ie.industry)!;
        if (sourcePos && targetPos && ie.percentage > 0) {
          links.push({
            source: sourcePos,
            target: targetPos,
            company,
            industry: ie.industry,
            percentage: ie.percentage,
          });
        }
      });
    });

    // Draw links
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', CATEGORY_COLORS[category])
      .attr('stroke-opacity', d => Math.max(0.1, d.percentage / 100))
      .attr('stroke-width', d => Math.max(1, (d.percentage / 100) * 5))
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        setHoveredCompany(d.company);
        setHoveredIndustry(d.industry);
        d3.select(this)
          .attr('stroke-opacity', 1)
          .attr('stroke-width', 4);
      })
      .on('mouseleave', function(event, d) {
        setHoveredCompany(null);
        setHoveredIndustry(null);
        d3.select(this)
          .attr('stroke-opacity', Math.max(0.1, d.percentage / 100))
          .attr('stroke-width', Math.max(1, (d.percentage / 100) * 5));
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        onIndustryClick(d.company, d.industry, category);
      });

    // Draw industry nodes
    const industryGroup = g.append('g').attr('class', 'industries');
    const industryNodes = industryGroup
      .selectAll('g')
      .data(industryPositions)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer');

    industryNodes
      .append('circle')
      .attr('r', 25)
      .attr('fill', d => INDUSTRY_COLORS[d.industry] || '#9ca3af')
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 2)
      .on('mouseenter', function(event, d) {
        setHoveredIndustry(d.industry);
        d3.select(this).attr('r', 30);
      })
      .on('mouseleave', function(event, d) {
        setHoveredIndustry(null);
        d3.select(this).attr('r', 25);
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        // Clicking industry circle shows all companies
        onIndustryClick(null, d.industry, category);
      });

    // Industry labels
    industryNodes
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('dy', 45)
      .attr('fill', '#1f2937')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text(d => {
        // Abbreviate long industry names
        const abbr: Record<string, string> = {
          'Investment Banking': 'IB',
          'Private Equity': 'PE',
          'Big Tech': 'Tech',
          'Education / MBA': 'MBA',
          'Healthcare / Pharma': 'Health',
          'Financial Services': 'Finance',
          'Asset Management': 'AM',
          'Hedge Fund': 'HF',
          'Venture Capital': 'VC',
          'Corporate (F500)': 'F500',
          'Government / Non-profit': 'Gov',
          'Media / Entertainment': 'Media',
          'Real Estate': 'RE',
          'Law Firm': 'Law',
        };
        return abbr[d.industry] || d.industry.slice(0, 8);
      });

    // Draw company nodes
    const companyGroup = g.append('g').attr('class', 'companies');
    const companyNodes = companyGroup
      .selectAll('g')
      .data(companyPositions)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer');

    companyNodes
      .append('circle')
      .attr('r', 20)
      .attr('fill', CATEGORY_COLORS[category])
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .on('mouseenter', function(event, d) {
        setHoveredCompany(d.company);
        d3.select(this).attr('r', 25);
      })
      .on('mouseleave', function(event, d) {
        setHoveredCompany(null);
        d3.select(this).attr('r', 20);
      });

    // Company labels
    companyNodes
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('dy', -30)
      .attr('fill', '#1f2937')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .text(d => {
        // Abbreviate company names
        const abbr: Record<string, string> = {
          'Goldman Sachs': 'GS',
          'Morgan Stanley': 'MS',
          'J.P. Morgan': 'JPM',
          'Centerview Partners': 'CVP',
          'PJT Partners': 'PJT',
          'McKinsey': 'McK',
          'McKinsey & Company': 'McK',
          'Boston Consulting Group': 'BCG',
          'Bain & Company': 'Bain',
          'Monitor Deloitte': 'Deloitte',
          'EY-Parthenon': 'EY-P',
          'L.E.K. Consulting': 'LEK',
        };
        return abbr[d.company] || d.company.slice(0, 8);
      });

    // Tooltip will be rendered separately in React
  }, [data, category, width, height, hoveredCompany, hoveredIndustry, onIndustryClick]);

  // Find tooltip data
  const tooltipLink = hoveredCompany && hoveredIndustry
    ? Array.from(data.entries())
        .flatMap(([company, industryExits]) =>
          industryExits
            .filter(ie => ie.industry === hoveredIndustry)
            .map(ie => ({ company, industry: ie.industry, percentage: ie.percentage }))
        )
        .find(l => l.company === hoveredCompany)
    : null;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border-2 border-gray-300 rounded-sm bg-white"
      />
      {tooltipLink && (
        <div
          className="absolute bg-gray-900 text-white px-4 py-2 rounded-sm text-sm pointer-events-none z-10"
          style={{
            left: '50%',
            top: '20px',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="font-bold text-center mb-1">{tooltipLink.percentage}%</div>
          <div className="text-xs text-center text-gray-300">
            {tooltipLink.company} → {tooltipLink.industry}
          </div>
        </div>
      )}
    </div>
  );
}
