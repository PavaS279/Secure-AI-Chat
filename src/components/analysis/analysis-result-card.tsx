"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalysisResult } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, ShieldQuestion, ListChecks, Info } from "lucide-react";
import FeedbackButtons from "./feedback-buttons";

const RiskIndicator = ({ riskLevel }: { riskLevel: 'low' | 'medium' | 'high' }) => {
  const styles = {
    high: {
      Icon: ShieldAlert,
      badgeVariant: "destructive",
      badgeClass: "",
      text: "High Risk",
    },
    medium: {
      Icon: ShieldQuestion,
      badgeVariant: "secondary",
      badgeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50 hover:bg-yellow-500/30",
      text: "Medium Risk",
    },
    low: {
      Icon: ShieldCheck,
      badgeVariant: "default",
      badgeClass: "bg-green-500/20 text-green-300 border-green-500/50 hover:bg-green-500/30",
      text: "Low Risk",
    },
  }[riskLevel];

  return (
    <div className="flex items-center gap-2">
      <styles.Icon className="h-6 w-6" />
      <Badge variant={styles.badgeVariant} className={styles.badgeClass}>
        {styles.text}
      </Badge>
    </div>
  );
};


export default function AnalysisResultCard({
  isLoading,
  result,
  messageContent,
}: {
  isLoading: boolean;
  result: AnalysisResult | null;
  messageContent: string;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="flex items-center justify-center min-h-[300px] border-2 border-dashed bg-card/50">
        <div className="text-center text-muted-foreground">
          <Info className="mx-auto h-12 w-12" />
          <p className="mt-4">Analysis results will be displayed here.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card/60">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Analysis Complete</span>
          <RiskIndicator riskLevel={result.riskLevel} />
        </CardTitle>
        <CardDescription>{result.explanation}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-accent"/>Specific Threats</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {result.threats?.map((threat, index) => <li key={index}>{threat}</li>) ?? 
             result.specificThreats?.map((threat, index) => <li key={index}>{threat}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><ListChecks className="h-5 w-5 text-accent" />Safety Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {result.safetyTips.map((tip, index) => <li key={index}>{tip}</li>)}
          </ul>
        </div>
        <FeedbackButtons messageContent={messageContent} result={result} />
      </CardContent>
    </Card>
  );
}
