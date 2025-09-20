'use server';

/**
 * @fileOverview A flow to improve threat detection accuracy based on user feedback.
 *
 * - improveDetectionWithFeedback - A function that handles the feedback process.
 * - ImproveDetectionWithFeedbackInput - The input type for the improveDetectionWithFeedback function.
 * - ImproveDetectionWithFeedbackOutput - The return type for the improveDetectionWithFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveDetectionWithFeedbackInputSchema = z.object({
  messageContent: z.string().describe('The content of the message that was analyzed.'),
  isThreat: z.boolean().describe('Whether the message was actually a threat (true) or not (false).'),
  threatType: z.string().optional().describe('The type of threat detected, if any.'),
  feedbackText: z.string().optional().describe('Optional user feedback on the detection.'),
});
export type ImproveDetectionWithFeedbackInput = z.infer<typeof ImproveDetectionWithFeedbackInputSchema>;

const ImproveDetectionWithFeedbackOutputSchema = z.object({
  success: z.boolean().describe('Whether the feedback was successfully processed.'),
  message: z.string().describe('A message indicating the outcome of the feedback process.'),
});
export type ImproveDetectionWithFeedbackOutput = z.infer<typeof ImproveDetectionWithFeedbackOutputSchema>;

export async function improveDetectionWithFeedback(input: ImproveDetectionWithFeedbackInput): Promise<ImproveDetectionWithFeedbackOutput> {
  return improveDetectionWithFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveDetectionWithFeedbackPrompt',
  input: {schema: ImproveDetectionWithFeedbackInputSchema},
  output: {schema: ImproveDetectionWithFeedbackOutputSchema},
  prompt: `You are an AI assistant designed to improve threat detection based on user feedback.

  A message was analyzed, and the user has provided feedback on whether it was correctly identified as a threat.

  Message Content: {{{messageContent}}}
  Was it a threat? {{{isThreat}}}
  Threat Type (if any): {{{threatType}}}
  User Feedback: {{{feedbackText}}}

  Based on this information, update your understanding of threat patterns and improve future detections.

  Respond with a JSON object indicating whether the feedback was successfully processed and a message summarizing the outcome.
  `,
});

const improveDetectionWithFeedbackFlow = ai.defineFlow(
  {
    name: 'improveDetectionWithFeedbackFlow',
    inputSchema: ImproveDetectionWithFeedbackInputSchema,
    outputSchema: ImproveDetectionWithFeedbackOutputSchema,
  },
  async input => {
    try {
      // In a real implementation, you would likely store the feedback in a database
      // and use it to fine-tune the AI model.  For this example, we'll just log the feedback.
      console.log('Received feedback:', input);

      // Call the prompt to get a confirmation message.
      const {output} = await prompt(input);

      return {
        success: true,
        message: output?.message || 'Feedback processed successfully.',
      };
    } catch (error) {
      console.error('Error processing feedback:', error);
      return {
        success: false,
        message: 'Failed to process feedback. Please try again.',
      };
    }
  }
);
