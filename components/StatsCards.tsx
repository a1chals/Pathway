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
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

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
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      label: "Most Common Exit",
      value: mostCommonIndustry,
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      label: "% Pursuing MBAs",
      value: `${mbaPercentage}%`,
      icon: GraduationCap,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
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
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className={`overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} hover:shadow-xl transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">
                  {stat.label}
                </h3>
                <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
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

