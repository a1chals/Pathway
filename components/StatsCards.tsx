"use client";

import { motion } from "framer-motion";
import { Calendar, TrendingUp, GraduationCap } from "lucide-react";
import { ExitData } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  data: ExitData[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
  }),
};

const cardTransition = (i: number) => ({
  delay: i * 0.1,
  duration: 0.5,
  ease: [0.25, 0.1, 0.25, 1] as const,
});

export default function StatsCards({ data }: StatsCardsProps) {
  // Calculate average years before exit
  const avgYears = (
    data.reduce((sum, exit) => sum + exit.avg_years_before_exit, 0) / data.length
  ).toFixed(1);

  // Find most common industry
  const industryCounts: Record<string, number> = {};
  data.forEach((exit) => {
    industryCounts[exit.industry] = (industryCounts[exit.industry] || 0) + 1;
  });
  const mostCommonIndustry = Object.entries(industryCounts).reduce((a, b) =>
    industryCounts[a[0]] > industryCounts[b[0]] ? a : b
  )[0];

  // Count MBA exits
  const mbaExits = data.filter(
    (exit) => exit.industry === "Graduate Education"
  ).length;
  const mbaPercentage = ((mbaExits / data.length) * 100).toFixed(0);

  // Count unique exit companies
  const uniqueCompanies = new Set(data.map((exit) => exit.exit_company)).size;

  const stats = [
    {
      label: "Avg. Years Before Exit",
      value: avgYears,
      icon: Calendar,
    },
    {
      label: "Most Common Exit",
      value: mostCommonIndustry,
      icon: TrendingUp,
    },
    {
      label: "% Pursuing MBAs",
      value: `${mbaPercentage}%`,
      icon: GraduationCap,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={cardTransition(index)}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <Card className="overflow-hidden border-2 border-gray-700 bg-white hover:shadow-lg transition-all duration-300 retro-outset">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-sm border-2 border-gray-700 bg-gray-700 retro-inset">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                  {stat.label}
                </h3>
                <p className="text-4xl font-bold text-gray-800 tracking-tight">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

