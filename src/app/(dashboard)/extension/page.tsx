
"use client";

import { analyzePageAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { AnalyzePageForVulnerabilitiesOutput } from "@/ai/flows/analyze-page-for-vulnerabilities";
import { FileWarning, Info, Loader2, ScanLine, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState, useTransition } from "react";

const IconMap = {
  "insecure-script": <ShieldAlert className="h-5 w-5 text-red-400" />,
  "insecure-form": <FileWarning className="h-5 w-5 text-yellow-400" />,
  "external-iframe": <FileWarning className="h-5 w-5 text-yellow-400" />,
  "dangerous-tag": <ShieldAlert className="h-5 w-5 text-red-400" />,
  "safe-link": <ShieldCheck className="h-5 w-5 text-green-400" />,
};

const TitleMap = {
    "insecure-script": "Insecure Script",
    "insecure-form": "Insecure Form",
    "external-iframe": "External Iframe",
    "dangerous-tag": "Dangerous Tag",
    "safe-link": "Safe Link",
}


export default function ExtensionPage() {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<AnalyzePageForVulnerabilitiesOutput | null>(null);
    const { toast } = useToast();

    const handleScan = () => {
        setResult(null);
        startTransition(async () => {
            const htmlContent = document.documentElement.outerHTML;
            const response = await analyzePageAction({ htmlContent });

            if (response.error) {
                toast({
                    variant: "destructive",
                    title: "Scan Failed",
                    description: response.error,
                });
            } else if (response.success) {
                setResult(response.success);
            }
        });
    }

    const counts = result?.vulnerabilities.reduce((acc, vuln) => {
        if (vuln.type === 'safe-link') acc.safeLinks++;
        else if (vuln.type === 'insecure-form' || vuln.type === 'external-iframe') acc.warnings++;
        else acc.dangers++;
        return acc;
    }, { safeLinks: 0, warnings: 0, dangers: 0 }) || { safeLinks: 0, warnings: 0, dangers: 0 };


  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Browser Extension
        </h1>
        <p className="text-muted-foreground">
          A real-time analysis of the current page's security.
        </p>
      </header>

      <Card className="bg-gradient-to-br from-card to-card/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <img src="/logo.svg" alt="SecureChat AI Logo" className="h-6 w-6" />
              SecureChat AI
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Protection</span>
              <Switch defaultChecked id="protection-switch" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">Click the button to scan the current page.</p>
            <Button onClick={handleScan} disabled={isPending} size="lg" className="rounded-full gap-2">
                {isPending ? <Loader2 className="animate-spin" /> : <ScanLine />}
                Scan Current Page
            </Button>
            {isPending && (
                 <p className="text-sm text-muted-foreground animate-pulse">Analyzing DOM for potential threats...</p>
            )}
             {result && (
                <p className="text-sm text-muted-foreground">{result.summary}</p>
             )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>On-Page Detections</CardTitle>
            <CardDescription>A summary of elements found on this page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            {isPending && (
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            )}
            {!isPending && !result && (
                 <div className="flex min-h-[150px] flex-col items-center justify-center text-center text-muted-foreground p-4 border-2 border-dashed rounded-lg">
                    <Info className="h-10 w-10 mb-2" />
                    <p>Scan results will appear here.</p>
                </div>
            )}
            {result && (
                <>
                <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-green-400" />
                        <span className="font-medium">Safe Elements</span>
                    </div>
                    <span className="font-bold text-lg">{counts.safeLinks}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <div className="flex items-center gap-3">
                        <FileWarning className="h-5 w-5 text-yellow-400" />
                        <span className="font-medium">Warnings</span>
                    </div>
                    <span className="font-bold text-lg">{counts.warnings}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="h-5 w-5 text-red-400" />
                        <span className="font-medium">Dangerous Elements</span>
                    </div>
                    <span className="font-bold text-lg">{counts.dangers}</span>
                </div>

                {result.vulnerabilities.filter(v => v.type !== 'safe-link').length > 0 && (
                  <div className="pt-4 space-y-2">
                    <h4 className="font-semibold">Details:</h4>
                    {result.vulnerabilities.filter(v => v.type !== 'safe-link').map((vuln, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 text-xs border rounded-lg bg-card/50">
                        {IconMap[vuln.type]}
                        <div className="flex-1">
                          <p className="font-bold text-foreground">{TitleMap[vuln.type]}</p>
                          <p className="text-muted-foreground mt-1">{vuln.description}</p>
                           <code className="block mt-2 p-2 rounded-md bg-muted/50 text-foreground text-xs break-all">{vuln.element}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </>
            )}
        </CardContent>
      </Card>

    </div>
  );
}
