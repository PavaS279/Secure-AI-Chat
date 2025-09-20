import type { AnalyzeMessageForPhishingOutput as MsgOutput } from '@/ai/flows/analyze-message-for-phishing';
import type { ScanURLForThreatsOutput as UrlOutput } from '@/ai/flows/scan-url-for-threats';
import type { AnalyzeImageForPhishingOutput as ImgOutput } from '@/ai/flows/analyze-image-for-phishing';
import type { AnalyzeAudioForPhishingOutput as AudOutput } from '@/ai/flows/analyze-audio-for-phishing';

export type AnalysisResult = MsgOutput | UrlOutput | ImgOutput | AudOutput;

export type ThreatHistoryItem = {
  id: string;
  type: 'Message' | 'URL' | 'Image' | 'Audio';
  content: string;
  result: AnalysisResult;
  timestamp: string;
};
