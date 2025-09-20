"use client";

import { useThreatHistory } from "@/contexts/threat-history-context";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  high: {
    label: "High",
    color: "hsl(var(--destructive))",
  },
  medium: {
    label: "Medium",
    color: "hsl(var(--chart-3))",
  },
  low: {
    label: "Low",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function ThreatAnalyticsChart() {
  const { threatHistory } = useThreatHistory();

  const chartData = [
    {
      riskLevel: "low",
      count: threatHistory.filter((t) => t.result.riskLevel === "low").length,
    },
    {
      riskLevel: "medium",
      count: threatHistory.filter((t) => t.result.riskLevel === "medium").length,
    },
    {
      riskLevel: "high",
      count: threatHistory.filter((t) => t.result.riskLevel === "high").length,
    },
  ];

  if (threatHistory.length === 0) {
    return (
      <div className="flex h-[250px] w-full items-center justify-center rounded-lg border-2 border-dashed bg-card/50">
        <p className="text-muted-foreground">No data to display. Analyze a message or URL to see results.</p>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 5,
          right: 10,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="riskLevel"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
        />
        <YAxis allowDecimals={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="count" fill="var(--color-low)" radius={4}>
          {chartData.map((entry) => (
             <rect key={entry.riskLevel} fill={`var(--color-${entry.riskLevel})`} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
