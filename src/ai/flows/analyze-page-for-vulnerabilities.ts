'use server';
/**
 * @fileOverview Analyzes a page's HTML content for potential security vulnerabilities.
 *
 * - analyzePageForVulnerabilities - Analyzes the HTML for security risks.
 * - AnalyzePageForVulnerabilitiesInput - The input type for the function.
 * - AnalyzePageForVulnerabilitiesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePageForVulnerabilitiesInputSchema = z.object({
  htmlContent: z.string().describe("The full HTML content of the web page to analyze."),
});
export type AnalyzePageForVulnerabilitiesInput = z.infer<
  typeof AnalyzePageForVulnerabilitiesInputSchema
>;

const VulnerabilitySchema = z.object({
    type: z.enum(["insecure-script", "insecure-form", "external-iframe", "dangerous-tag", "safe-link"]).describe("The type of element found."),
    description: z.string().describe("A brief description of the element or why it's a potential risk."),
    element: z.string().describe("The HTML tag or a snippet of the element."),
});

const AnalyzePageForVulnerabilitiesOutputSchema = z.object({
  riskLevel: z
    .enum(['low', 'medium', 'high'])
    .describe('The overall risk level of the page (low, medium, or high).'),
  summary: z.string().describe('A brief summary of the findings.'),
  vulnerabilities: z.array(VulnerabilitySchema).describe("A list of potential vulnerabilities or safe elements found."),
});
export type AnalyzePageForVulnerabilitiesOutput = z.infer<
  typeof AnalyzePageForVulnerabilitiesOutputSchema
>;

export async function analyzePageForVulnerabilities(
  input: AnalyzePageForVulnerabilitiesInput
): Promise<AnalyzePageForVulnerabilitiesOutput> {
  return analyzePageForVulnerabilitiesFlow(input);
}

const analyzePagePrompt = ai.definePrompt({
  name: 'analyzePageForVulnerabilitiesPrompt',
  input: {schema: AnalyzePageForVulnerabilitiesInputSchema},
  output: {schema: AnalyzePageForVulnerabilitiesOutputSchema},
  prompt: `You are a web security expert. Analyze the provided HTML content for potential security vulnerabilities.

Your task is to identify elements that could pose a security risk, such as:
1.  **Insecure <script> tags:** Scripts loaded over HTTP, or from untrusted third-party domains.
2.  **Insecure <form> tags:** Forms that submit to non-HTTPS endpoints.
3.  **External <iframe> tags:** Iframes that could be used for clickjacking.
4.  **Dangerous Tags:** Look for any other non-standard or potentially risky HTML tags.
5.  **Safe Links:** Count some of the safe, standard internal links.

Based on your analysis, provide a summary, an overall risk level, and a list of specific findings.

HTML Content:
\`\`\`html
{{{htmlContent}}}
\`\`\`

Return a valid JSON object.`,
});

const analyzePageForVulnerabilitiesFlow = ai.defineFlow(
  {
    name: 'analyzePageForVulnerabilitiesFlow',
    inputSchema: AnalyzePageForVulnerabilitiesInputSchema,
    outputSchema: AnalyzePageForVulnerabilitiesOutputSchema,
  },
  async input => {
    // For very large pages, you might truncate the input
    const truncatedHtml = input.htmlContent.substring(0, 30000);
    const {output} = await analyzePagePrompt({htmlContent: truncatedHtml});
    return output!;
  }
);
