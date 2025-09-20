
"use client";

import ThreatIndicator from "@/components/extension/threat-indicator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, FileWarning, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";

export default function ExtensionPage() {
  const [counts, setCounts] = useState({
    safeLinks: 12,
    trackers: 3,
    maliciousScripts: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prevCounts => ({
        safeLinks: prevCounts.safeLinks + Math.floor(Math.random() * 3) + 1,
        trackers: Math.random() > 0.7 ? prevCounts.trackers + 1 : prevCounts.trackers,
        // Only occasionally find a "malicious script" for demo purposes
        maliciousScripts: Math.random() > 0.95 ? 1 : 0,
      }));
    }, 3500);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Browser Extension
        </h1>
        <p className="text-muted-foreground">
          Simulating real-time threat protection as you browse.
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
            <p className="text-sm text-muted-foreground">Current Page Status</p>
           <ThreatIndicator />
            <p className="text-lg font-medium">You are protected.</p>
             <p className="text-xs text-muted-foreground max-w-xs">
                SecureChat AI is actively scanning this page for phishing links, malicious scripts, and social engineering tactics.
            </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Real-time Detections</CardTitle>
            <CardDescription>A summary of threats found on the current page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-green-400" />
                    <span className="font-medium">Safe Links</span>
                </div>
                <span className="font-bold text-lg">{counts.safeLinks}</span>
            </div>
             <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div className="flex items-center gap-3">
                    <FileWarning className="h-5 w-5 text-yellow-400" />
                    <span className="font-medium">Trackers Blocked</span>
                </div>
                <span className="font-bold text-lg">{counts.trackers}</span>
            </div>
             <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-red-400" />
                    <span className="font-medium">Malicious Scripts</span>
                </div>
                <span className="font-bold text-lg">{counts.maliciousScripts}</span>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
