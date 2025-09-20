"use client";

import ThreatAnalyticsChart from "@/components/dashboard/threat-analytics-chart";
import ThreatHistoryTable from "@/components/dashboard/threat-history-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useThreatHistory } from "@/contexts/threat-history-context";

export default function DashboardPage() {
  const { threatHistory } = useThreatHistory();

  const analysisCounts = threatHistory.reduce(
    (acc, item) => {
      acc.total++;
      if (item.result.riskLevel === 'high') acc.high++;
      else if (item.result.riskLevel === 'medium') acc.medium++;
      else if (item.result.riskLevel === 'low') acc.low++;
      return acc;
    },
    { total: 0, high: 0, medium: 0, low: 0 }
  );

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Threat Dashboard
        </h1>
        <p className="text-muted-foreground">
          An overview of your recent security analyses.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Scans</CardTitle>
            <CardDescription>Total items analyzed this session.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{analysisCounts.total}</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">High-Risk Threats</CardTitle>
            <CardDescription>Potentially malicious items detected.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-destructive">{analysisCounts.high}</p>
          </CardContent>
        </Card>
         <Card className="border-yellow-500/50">
          <CardHeader>
            <CardTitle className="text-yellow-500">Medium-Risk Threats</CardTitle>
            <CardDescription>Suspicious items that require caution.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-yellow-500">{analysisCounts.medium}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Threat History</CardTitle>
            <CardDescription>A log of your most recent scans.</CardDescription>
          </CardHeader>
          <CardContent>
            <ThreatHistoryTable />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
            <CardDescription>A breakdown of detected risk levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <ThreatAnalyticsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
