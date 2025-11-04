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
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-800">
              % of Exits by Industry
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
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
              <YAxis 
                tick={{ fontSize: 12, fill: "#64748b" }}
                label={{ value: '%', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: string) => [`${value}%`, "Percentage"]}
              />
              <Bar 
                dataKey="percentage" 
                radius={[8, 8, 0, 0]}
                fill="url(#colorGradient)"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

