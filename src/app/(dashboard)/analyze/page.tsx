import MessageAnalyzer from "@/components/analysis/message-analyzer";
import UrlScanner from "@/components/analysis/url-scanner";
import ImageScanner from "@/components/analysis/image-scanner";
import AudioScanner from "@/components/analysis/audio-scanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyzePage() {
  return (
    <div className="flex flex-col gap-6">
       <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Analysis Center
        </h1>
        <p className="text-muted-foreground">
          Scan messages, URLs, images, and audio for potential threats in real-time.
        </p>
      </header>
      <Tabs defaultValue="message" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4">
          <TabsTrigger value="message">Message</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>
        <TabsContent value="message">
          <MessageAnalyzer />
        </TabsContent>
        <TabsContent value="url">
          <UrlScanner />
        </TabsContent>
         <TabsContent value="image">
          <ImageScanner />
        </TabsContent>
         <TabsContent value="audio">
          <AudioScanner />
        </TabsContent>
      </Tabs>
    </div>
  );
}
