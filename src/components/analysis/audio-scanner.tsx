
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeAudioAction } from "@/app/actions";
import { useThreatHistory } from "@/contexts/threat-history-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Mic, StopCircle, MicOff } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import AnalysisResultCard from "./analysis-result-card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/webm", "audio/mp4", "audio/ogg", "audio/x-m4a"];

const formSchema = z.object({
  audio: z.custom<FileList>()
    .refine((files) => files?.length > 0, {
        message: "Audio file is required if not recording.",
    })
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
    .refine(
      (files) => files && ACCEPTED_AUDIO_TYPES.includes(files[0]?.type),
      ".mp3, .wav, .mpeg, .webm and .m4a files are accepted."
    ).optional(),
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
  const [fileName, setFileName] = useState<string>("");
  
  const [isRecording, setIsRecording] = useState(false);
  const [isRecorderBlocked, setIsRecorderBlocked] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const { addThreatToHistory } = useThreatHistory();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { formState, setValue, clearErrors } = form;

  const handleRecord = async () => {
    if (isRecording) {
        mediaRecorder.current?.stop();
        setIsRecording(false);
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsRecorderBlocked(false);
        setIsRecording(true);
        setAnalysisResult(null);
        setPreview(null);
        setHasRecording(false);
        setValue("audio", undefined);
        clearErrors("audio");

        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
            audioChunks.current.push(event.data);
        };
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setPreview(audioUrl);
            setHasRecording(true);
            setFileName("recorded_audio.webm");
            audioChunks.current = [];
            stream.getTracks().forEach(track => track.stop()); // Stop microphone
        };
        mediaRecorder.current.start();
    } catch (error) {
        console.error("Microphone access denied:", error);
        setIsRecorderBlocked(true);
        toast({ variant: "destructive", title: "Microphone Access Denied", description: "Please enable microphone permissions in your browser settings." });
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setAnalysisResult(null);

    let audioDataUri: string | null = null;
    let currentFileName = "Recording";

    if (values.audio && values.audio.length > 0) {
        const file = values.audio[0];
        currentFileName = file.name;
        audioDataUri = await fileToDataUri(file);
    } else if (preview && hasRecording) {
        // Fetch the blob from preview URL and convert to data URI
        const response = await fetch(preview);
        const blob = await response.blob();
        audioDataUri = await fileToDataUri(blob as File);
        currentFileName = fileName;
    }

    if (!audioDataUri) {
        toast({ variant: "destructive", title: "No Audio", description: "Please upload or record audio to analyze." });
        return;
    }

    const finalAudioDataUri = audioDataUri;

    startTransition(async () => {
        try {
            const result = await analyzeAudioAction({ audioDataUri: finalAudioDataUri });

            if (result.error) {
                toast({ variant: "destructive", title: "Analysis Failed", description: result.error });
                setAnalysisResult(null);
            } else if (result.success) {
                setAnalysisResult(result.success);
                addThreatToHistory({
                    id: crypto.randomUUID(),
                    type: "Audio",
                    content: `Audio: ${currentFileName}`,
                    result: result.success,
                    timestamp: new Date().toISOString(),
                });
            }
        } catch (error) {
             toast({ variant: "destructive", title: "Error", description: "Could not process audio file." });
        }
    });
  }
  
  const isSubmitDisabled = isPending || (!formState.isValid && !hasRecording);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Audio (Vishing)</CardTitle>
          <CardDescription>
            Upload or record a suspicious voicemail to check for voice phishing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <div className="space-y-2">
                <p className="text-sm font-medium">Record Audio</p>
                <div className="flex gap-2">
                    <Button type="button" variant={isRecording ? "destructive" : "outline"} onClick={handleRecord} className="w-full gap-2">
                        {isRecording ? <StopCircle/> : <Mic />}
                        {isRecording ? "Stop Recording" : "Record Audio"}
                    </Button>
                </div>
                {isRecorderBlocked && (
                    <Alert variant="destructive" className="mt-2">
                        <MicOff className="h-4 w-4" />
                        <AlertTitle>Microphone Access Denied</AlertTitle>
                        <AlertDescription>
                            Please enable microphone permissions in your browser settings to use this feature.
                        </AlertDescription>
                    </Alert>
                )}
              </div>

              <div className="flex items-center gap-4">
                <hr className="flex-grow border-t border-border" />
                <span className="text-muted-foreground text-sm">OR</span>
                <hr className="flex-grow border-t border-border" />
              </div>

              <FormField
                control={form.control}
                name="audio"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Upload Audio File</FormLabel>
                    <FormControl>
                        <Input 
                            type="file" 
                            accept={ACCEPTED_AUDIO_TYPES.join(",")}
                            onChange={(e) => {
                                onChange(e.target.files);
                                if (e.target.files?.[0]) {
                                    const url = URL.createObjectURL(e.target.files[0]);
                                    setPreview(url);
                                    setHasRecording(false);
                                    setFileName(e.target.files[0].name);
                                } else {
                                    setPreview(null);
                                    setFileName("");
                                }
                            }}
                           {...rest}
                           className="pt-2"
                        />
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

              <Button type="submit" disabled={isSubmitDisabled} className="w-full gap-2">
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

    