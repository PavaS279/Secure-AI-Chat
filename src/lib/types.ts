import type { AnalyzeMessageForPhishingOutput as MsgOutput } from '@/ai/flows/analyze-message-for-phishing';
import type { ScanURLForThreatsOutput as UrlOutput } from '@/ai/flows/scan-url-for-threats';

export type AnalysisResult = MsgOutput | UrlOutput;

export type ThreatHistoryItem = {
  id: string;
  type: 'Message' | 'URL';
  content: string;
  result: AnalysisResult;
  timestamp: string;
};
