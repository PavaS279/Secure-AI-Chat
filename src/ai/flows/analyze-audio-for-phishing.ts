'use server';
/**
 * @fileOverview Analyzes an audio file for phishing and social engineering tactics (vishing).
 *
 * - analyzeAudioForPhishing - Transcribes and analyzes audio for potential threats.
 * - AnalyzeAudioForPhishingInput - The input type for the function.
 * - AnalyzeAudioForPhishingOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAudioForPhishingInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio recording of a message, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeAudioForPhishingInput = z.infer<
  typeof AnalyzeAudioForPhishingInputSchema
>;

const AnalyzeAudioForPhishingOutputSchema = z.object({
    transcribedText: z.string().describe("The text transcribed from the audio."),
    riskLevel: z
        .enum(['low', 'medium', 'high'])
        .describe('The risk level of the message (low, medium, or high).'),
    specificThreats: z
        .array(z.string())
        .describe('An array of specific threats identified in the message.'),
    explanation: z.string().describe('An explanation of why the message is considered risky.'),
    safetyTips: z.array(z.string()).describe('Safety tips for handling the message.'),
});

export type AnalyzeAudioForPhishingOutput = z.infer<typeof AnalyzeAudioForPhishingOutputSchema>;

export async function analyzeAudioForPhishing(
  input: AnalyzeAudioForPhishingInput
): Promise<AnalyzeAudioForPhishingOutput> {
  return analyzeAudioForPhishingFlow(input);
}

const analyzeAudioForPhishingPrompt = ai.definePrompt({
  name: 'analyzeAudioForPhishingPrompt',
  input: {schema: AnalyzeAudioForPhishingInputSchema},
  output: {schema: AnalyzeAudioForPhishingOutputSchema},
  prompt: `You are a cybersecurity expert specializing in voice phishing (vishing) detection.
  
  1. Transcribe the speech from the provided audio file.
  2. Analyze the transcribed text for vishing and social engineering tactics.
  3. Provide a risk assessment, explanation, and safety tips based on the text.

  Evaluate for:
  - Urgency and pressure tactics
  - Impersonation of authority (e.g., bank, IRS, tech support)
  - Requests for sensitive information (passwords, PINs, social security numbers)
  - Threats or warnings of dire consequences
  - Promises of unrealistic rewards or prizes

  Return a JSON object with the results.

  Audio: {{media url=audioDataUri}}`,
});

const analyzeAudioForPhishingFlow = ai.defineFlow(
  {
    name: 'analyzeAudioForPhishingFlow',
    inputSchema: AnalyzeAudioForPhishingInputSchema,
    outputSchema: AnalyzeAudioForPhishingOutputSchema,
  },
  async input => {
    const {output} = await analyzeAudioForPhishingPrompt(input);
    return output!;
  }
);
