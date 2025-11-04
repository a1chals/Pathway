"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ExitData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-2 border-gray-700 bg-white hover:shadow-lg transition-all duration-300 retro-outset">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800 uppercase tracking-wide">
              % of Exits by Industry
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis
                dataKey="industry"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12, fill: "#4b5563" }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "#4b5563" }}
                label={{ value: '%', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #4b5563",
                  borderRadius: "4px",
                  boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: string) => [`${value}%`, "Percentage"]}
              />
              <Bar 
                dataKey="percentage" 
                radius={[4, 4, 0, 0]}
                fill="#374151"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

