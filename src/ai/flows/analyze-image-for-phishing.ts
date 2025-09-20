'use server';
/**
 * @fileOverview Analyzes an image for phishing and social engineering tactics using OCR.
 *
 * - analyzeImageForPhishing - Analyzes the image content for potential threats.
 * - AnalyzeImageForPhishingInput - The input type for the function.
 * - AnalyzeImageForPhishingOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { AnalyzeMessageForPhishingOutput } from './analyze-message-for-phishing';

const AnalyzeImageForPhishingInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A screenshot of a message, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageForPhishingInput = z.infer<
  typeof AnalyzeImageForPhishingInputSchema
>;

const AnalyzeImageForPhishingOutputSchema = z.object({
    transcribedText: z.string().describe("The text transcribed from the image."),
    riskLevel: z
        .enum(['low', 'medium', 'high'])
        .describe('The risk level of the message (low, medium, or high).'),
    specificThreats: z
        .array(z.string())
        .describe('An array of specific threats identified in the message.'),
    explanation: z.string().describe('An explanation of why the message is considered risky.'),
    safetyTips: z.array(z.string()).describe('Safety tips for handling the message.'),
});

export type AnalyzeImageForPhishingOutput = z.infer<typeof AnalyzeImageForPhishingOutputSchema>;

export async function analyzeImageForPhishing(
  input: AnalyzeImageForPhishingInput
): Promise<AnalyzeImageForPhishingOutput> {
  return analyzeImageForPhishingFlow(input);
}

const analyzeImageForPhishingPrompt = ai.definePrompt({
  name: 'analyzeImageForPhishingPrompt',
  input: {schema: AnalyzeImageForPhishingInputSchema},
  output: {schema: AnalyzeImageForPhishingOutputSchema},
  prompt: `You are a cybersecurity expert specializing in Optical Character Recognition (OCR) and phishing detection.
  
  1. Transcribe the text from the provided image.
  2. Analyze the transcribed text for phishing and social engineering tactics.
  3. Provide a risk assessment, explanation, and safety tips based on the text.

  Evaluate for:
  - Urgency manipulation
  - Authority impersonation
  - Suspicious links or contact details
  - Emotional manipulation
  - Information harvesting attempts

  Return a JSON object with the results.

  Image: {{media url=imageDataUri}}`,
});

const analyzeImageForPhishingFlow = ai.defineFlow(
  {
    name: 'analyzeImageForPhishingFlow',
    inputSchema: AnalyzeImageForPhishingInputSchema,
    outputSchema: AnalyzeImageForPhishingOutputSchema,
  },
  async input => {
    const {output} = await analyzeImageForPhishingPrompt(input);
    return output!;
  }
);
