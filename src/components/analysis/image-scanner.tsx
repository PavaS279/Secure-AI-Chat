"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeImageAction } from "@/app/actions";
import { useThreatHistory } from "@/contexts/threat-history-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageUp, Loader2 } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import AnalysisResultCard from "./analysis-result-card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  image: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 4MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

export default function ImageScanner() {
  const [isPending, startTransition] = useTransition();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { addThreatToHistory } = useThreatHistory();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { ref: fileRef, ...fileRest } = form.register("image");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setAnalysisResult(null);
    const file = values.image[0];
    if (!file) return;

    startTransition(async () => {
        try {
            const imageDataUri = await fileToDataUri(file);
            const result = await analyzeImageAction({ imageDataUri });

            if (result.error) {
                toast({ variant: "destructive", title: "Analysis Failed", description: result.error });
                setAnalysisResult(null);
            } else if (result.success) {
                setAnalysisResult(result.success);
                addThreatToHistory({
                    id: crypto.randomUUID(),
                    type: "Image",
                    content: `Image: ${file.name}`,
                    result: result.success,
                    timestamp: new Date().toISOString(),
                });
            }
        } catch (error) {
             toast({ variant: "destructive", title: "Error", description: "Could not process image file." });
        }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Image</CardTitle>
          <CardDescription>
            Upload a screenshot of a suspicious message (e.g., from SMS, social media).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image File</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input 
                                type="file" 
                                accept={ACCEPTED_IMAGE_TYPES.join(",")}
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
                <div className="mt-4 relative w-full aspect-video rounded-md overflow-hidden border">
                    <Image src={preview} alt="Image preview" fill style={{ objectFit: 'contain' }} />
                </div>
              )}

              <Button type="submit" disabled={isPending || !preview} className="w-full gap-2">
                {isPending ? <Loader2 className="animate-spin" /> : <ImageUp />}
                Analyze Image
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AnalysisResultCard 
        isLoading={isPending} 
        result={analysisResult} 
        messageContent={analysisResult && "transcribedText" in analysisResult ? analysisResult.transcribedText : "Image Analysis"}
      />
    </div>
  );
}
