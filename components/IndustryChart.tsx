"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ExitData } from "@/types";

interface IndustryChartProps {
  data: ExitData[];
}

export default function IndustryChart({ data }: IndustryChartProps) {
  // Group exits by industry and calculate percentages
  const industryCounts: Record<string, number> = {};
  data.forEach((exit) => {
    industryCounts[exit.industry] = (industryCounts[exit.industry] || 0) + 1;
  });

  const total = data.length;
  const chartData = Object.entries(industryCounts).map(([industry, count]) => ({
    industry,
    percentage: ((count / total) * 100).toFixed(1),
    count,
  }));

  // Sort by percentage descending
  chartData.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        % of Exits by Industry
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="industry"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
            formatter={(value: string) => [`${value}%`, "Percentage"]}
          />
          <Bar dataKey="percentage" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

