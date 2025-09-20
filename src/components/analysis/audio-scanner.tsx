"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeAudioAction } from "@/app/actions";
import { useThreatHistory } from "@/contexts/threat-history-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Mic } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import AnalysisResultCard from "./analysis-result-card";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/webm"];

const formSchema = z.object({
  audio: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, "Audio file is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
    .refine(
      (files) => ACCEPTED_AUDIO_TYPES.includes(files?.[0]?.type),
      ".mp3, .wav, .mpeg, and .webm files are accepted."
    ),
});

const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

export default function AudioScanner() {
  const [isPending, startTransition] = useTransition();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { addThreatToHistory } = useThreatHistory();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { ref: fileRef, ...fileRest } = form.register("audio");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setAnalysisResult(null);
    const file = values.audio[0];
    if (!file) return;

    startTransition(async () => {
        try {
            const audioDataUri = await fileToDataUri(file);
            const result = await analyzeAudioAction({ audioDataUri });

            if (result.error) {
                toast({ variant: "destructive", title: "Analysis Failed", description: result.error });
                setAnalysisResult(null);
            } else if (result.success) {
                setAnalysisResult(result.success);
                addThreatToHistory({
                    id: crypto.randomUUID(),
                    type: "Audio",
                    content: `Audio: ${file.name}`,
                    result: result.success,
                    timestamp: new Date().toISOString(),
                });
            }
        } catch (error) {
             toast({ variant: "destructive", title: "Error", description: "Could not process audio file." });
        }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Audio (Vishing)</CardTitle>
          <CardDescription>
            Upload a suspicious voicemail or audio recording to check for voice phishing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="audio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audio File</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input 
                                type="file" 
                                accept={ACCEPTED_AUDIO_TYPES.join(",")}
                                {...fileRest}
                                onChange={(e) => {
                                    field.onChange(e.target.files);
                                    if (e.target.files?.[0]) {
                                        const url = URL.createObjectURL(e.target.files[0]);
                                        setPreview(url);
                                    } else {
                                        setPreview(null);
                                    }
                                }}
                                className="pt-2"
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {preview && (
                <div className="mt-4">
                    <audio controls src={preview} className="w-full" />
                </div>
              )}

              <Button type="submit" disabled={isPending || !preview} className="w-full gap-2">
                {isPending ? <Loader2 className="animate-spin" /> : <Mic />}
                Analyze Audio
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AnalysisResultCard 
        isLoading={isPending} 
        result={analysisResult} 
        messageContent={analysisResult && "transcribedText" in analysisResult ? analysisResult.transcribedText : "Audio Analysis"}
      />
    </div>
  );
}
