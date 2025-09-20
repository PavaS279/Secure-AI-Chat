"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { scanUrlAction } from "@/app/actions";
import { useThreatHistory } from "@/contexts/threat-history-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import AnalysisResultCard from "./analysis-result-card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

export default function UrlScanner() {
  const [isPending, startTransition] = useTransition();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { addThreatToHistory } = useThreatHistory();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setAnalysisResult(null);
    startTransition(async () => {
      const result = await scanUrlAction({ url: values.url });

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Scan Failed",
          description: result.error,
        });
        setAnalysisResult(null);
      } else if (result.success) {
        setAnalysisResult(result.success);
        addThreatToHistory({
          id: crypto.randomUUID(),
          type: "URL",
          content: values.url,
          result: result.success,
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Scan URL</CardTitle>
          <CardDescription>
            Enter a URL to check it for phishing, malware, and other threats.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="animate-spin" /> : "Scan URL"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <AnalysisResultCard 
        isLoading={isPending} 
        result={analysisResult} 
        messageContent={form.getValues('url')}
      />
    </div>
  );
}
