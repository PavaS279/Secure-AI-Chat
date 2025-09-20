import MessageAnalyzer from "@/components/analysis/message-analyzer";
import UrlScanner from "@/components/analysis/url-scanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyzePage() {
  return (
    <div className="flex flex-col gap-6">
       <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Analysis Center
        </h1>
        <p className="text-muted-foreground">
          Scan messages and URLs for potential threats in real-time.
        </p>
      </header>
      <Tabs defaultValue="message" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="message">Message Analysis</TabsTrigger>
          <TabsTrigger value="url">URL Scanner</TabsTrigger>
        </TabsList>
        <TabsContent value="message">
          <MessageAnalyzer />
        </TabsContent>
        <TabsContent value="url">
          <UrlScanner />
        </TabsContent>
      </Tabs>
    </div>
  );
}
