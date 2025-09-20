"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitFeedbackAction } from "@/app/actions";
import type { AnalysisResult } from "@/lib/types";

export default function FeedbackButtons({
  messageContent,
  result,
}: {
  messageContent: string;
  result: AnalysisResult;
}) {
  const [isPending, startTransition] = useTransition();
  const [feedbackSent, setFeedbackSent] = useState(false);
  const { toast } = useToast();
  
  const handleFeedback = (isCorrect: boolean) => {
    if (!messageContent || !result) return;
    setFeedbackSent(true);

    startTransition(async () => {
      const response = await submitFeedbackAction({
        messageContent,
        isThreat: result.riskLevel !== "low",
        threatType: result.threats?.[0] || result.specificThreats?.[0] || "general",
        feedbackText: `User marked detection as ${isCorrect ? 'correct' : 'incorrect'}`,
      });

      if (response.success) {
        toast({
          title: "Feedback Submitted",
          description: "Thank you for helping improve our detection system.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Feedback Failed",
          description: response.error,
        });
        setFeedbackSent(false); // Allow retry
      }
    });
  };

  if (feedbackSent) {
    return <p className="text-sm text-muted-foreground text-center pt-4">Thank you for your feedback!</p>;
  }

  return (
    <div className="border-t border-border/50 pt-4 mt-4 flex items-center justify-center gap-4">
      <span className="text-sm text-muted-foreground">Was this analysis helpful?</span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleFeedback(true)}
        disabled={isPending}
        aria-label="Correct analysis"
      >
        {isPending ? <Loader2 className="animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleFeedback(false)}
        disabled={isPending}
        aria-label="Incorrect analysis"
      >
        {isPending ? <Loader2 className="animate-spin" /> : <ThumbsDown className="h-4 w-4" />}
      </Button>
    </div>
  );
}
