"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeMessageAction } from "@/app/actions";
import { useThreatHistory } from "@/contexts/threat-history-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import AnalysisResultCard from "./analysis-result-card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  messageContent: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  context: z.string().optional(),
});

export default function MessageAnalyzer() {
  const [isPending, startTransition] = useTransition();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { addThreatToHistory } = useThreatHistory();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      messageContent: "",
      context: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setAnalysisResult(null);
    startTransition(async () => {
      const result = await analyzeMessageAction({
        messageContent: values.messageContent,
        context: values.context || 'none',
      });

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: result.error,
        });
        setAnalysisResult(null);
      } else if (result.success) {
        setAnalysisResult(result.success);
        addThreatToHistory({
          id: crypto.randomUUID(),
          type: "Message",
          content: values.messageContent.substring(0, 50) + "...",
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
          <CardTitle>Analyze Message</CardTitle>
          <CardDescription>
            Paste the content of a suspicious message and provide any context (e.g., sender, subject).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="messageContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Click here to claim your prize...'"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Context (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., From: support@bank.com, Subject: Urgent Action Required" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="animate-spin" /> : "Analyze Message"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AnalysisResultCard 
        isLoading={isPending} 
        result={analysisResult} 
        messageContent={form.getValues('messageContent')}
      />
    </div>
  );
}
