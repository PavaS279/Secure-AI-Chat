'use server';
/**
 * @fileOverview Scans a URL for potential threats using Gemini to analyze the URL structure and compare it against threat intelligence.
 *
 * - scanURLForThreats - A function that scans a URL for threats.
 * - ScanURLForThreatsInput - The input type for the scanURLForThreats function.
 * - ScanURLForThreatsOutput - The return type for the scanURLForThreats function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanURLForThreatsInputSchema = z.object({
  url: z.string().describe('The URL to scan for threats.'),
});
export type ScanURLForThreatsInput = z.infer<typeof ScanURLForThreatsInputSchema>;

const ScanURLForThreatsOutputSchema = z.object({
  riskLevel: z.enum(['low', 'medium', 'high']).describe('The risk level of the URL.'),
  threats: z.array(z.string()).describe('Specific threats associated with the URL.'),
  explanation: z.string().describe('An explanation of why the URL is considered a threat.'),
  safetyTips: z.array(z.string()).describe('Safety tips for the user regarding the URL.'),
});
export type ScanURLForThreatsOutput = z.infer<typeof ScanURLForThreatsOutputSchema>;

export async function scanURLForThreats(input: ScanURLForThreatsInput): Promise<ScanURLForThreatsOutput> {
  return scanURLForThreatsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanURLForThreatsPrompt',
  input: {schema: ScanURLForThreatsInputSchema},
  output: {schema: ScanURLForThreatsOutputSchema},
  prompt: `Analyze the following URL for potential threats. Evaluate the URL structure, domain reputation, and content for phishing attempts, malware distribution, and other malicious activities. Cross-reference with known threat intelligence databases.

URL: {{{url}}}

Return a JSON object with the following fields:
- riskLevel (low, medium, or high)
- threats (an array of specific threats associated with the URL)
- explanation (a detailed explanation of why the URL is considered a threat)
- safetyTips (an array of safety tips for the user regarding the URL)`,
});

const scanURLForThreatsFlow = ai.defineFlow(
  {
    name: 'scanURLForThreatsFlow',
    inputSchema: ScanURLForThreatsInputSchema,
    outputSchema: ScanURLForThreatsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
