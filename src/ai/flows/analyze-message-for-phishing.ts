'use server';
/**
 * @fileOverview Analyzes a message for phishing and social engineering tactics.
 *
 * - analyzeMessageForPhishing - Analyzes the message content and context for potential threats.
 * - AnalyzeMessageForPhishingInput - The input type for the analyzeMessageForPhishing function.
 * - AnalyzeMessageForPhishingOutput - The return type for the analyzeMessageForPhishing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMessageForPhishingInputSchema = z.object({
  messageContent: z.string().describe('The content of the message to analyze.'),
  context: z.string().describe('The context of the message, such as sender and subject.'),
});
export type AnalyzeMessageForPhishingInput = z.infer<
  typeof AnalyzeMessageForPhishingInputSchema
>;

const AnalyzeMessageForPhishingOutputSchema = z.object({
  riskLevel: z
    .enum(['low', 'medium', 'high'])
    .describe('The risk level of the message (low, medium, or high).'),
  specificThreats: z
    .array(z.string())
    .describe('An array of specific threats identified in the message.'),
  explanation: z.string().describe('An explanation of why the message is considered risky.'),
  safetyTips: z.array(z.string()).describe('Safety tips for handling the message.'),
});
export type AnalyzeMessageForPhishingOutput = z.infer<
  typeof AnalyzeMessageForPhishingOutputSchema
>;

export async function analyzeMessageForPhishing(
  input: AnalyzeMessageForPhishingInput
): Promise<AnalyzeMessageForPhishingOutput> {
  return analyzeMessageForPhishingFlow(input);
}

const analyzeMessageForPhishingPrompt = ai.definePrompt({
  name: 'analyzeMessageForPhishingPrompt',
  input: {schema: AnalyzeMessageForPhishingInputSchema},
  output: {schema: AnalyzeMessageForPhishingOutputSchema},
  prompt: `Analyze the following message for phishing and social engineering tactics. Provide a risk assessment and safety tips.

Message: """{messageContent}"""
Context: {{context}}

Evaluate for:
1.  Urgency manipulation tactics
2.  Authority impersonation
3.  Suspicious links/attachments
4.  Emotional manipulation
5.  Information harvesting attempts

Return a JSON object with the following keys:
- riskLevel: (low, medium, or high)
- specificThreats: (array of strings)
- explanation: (string)
- safetyTips: (array of strings)

Ensure that the returned JSON is valid and parsable.`,
});

const analyzeMessageForPhishingFlow = ai.defineFlow(
  {
    name: 'analyzeMessageForPhishingFlow',
    inputSchema: AnalyzeMessageForPhishingInputSchema,
    outputSchema: AnalyzeMessageForPhishingOutputSchema,
  },
  async input => {
    const {output} = await analyzeMessageForPhishingPrompt(input);
    return output!;
  }
);
