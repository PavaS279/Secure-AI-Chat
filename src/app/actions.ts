
'use server';

import { analyzeMessageForPhishing, type AnalyzeMessageForPhishingInput } from '@/ai/flows/analyze-message-for-phishing';
import { improveDetectionWithFeedback, type ImproveDetectionWithFeedbackInput } from '@/ai/flows/improve-detection-with-feedback';
import { scanURLForThreats, type ScanURLForThreatsInput } from '@/ai/flows/scan-url-for-threats';
import { analyzePageForVulnerabilities, type AnalyzePageForVulnerabilitiesInput } from '@/ai/flows/analyze-page-for-vulnerabilities';

export async function analyzeMessageAction(input: AnalyzeMessageForPhishingInput) {
    try {
        const result = await analyzeMessageForPhishing(input);
        return { success: result };
    } catch (error) {
        console.error("Error in analyzeMessageAction:", error);
        return { error: 'Failed to analyze message. Please try again.' };
    }
}

export async function scanUrlAction(input: ScanURLForThreatsInput) {
    try {
        const result = await scanURLForThreats(input);
        return { success: result };
    } catch (error) {
        console.error("Error in scanUrlAction:", error);
        return { error: 'Failed to scan URL. Please try again.' };
    }
}

export async function submitFeedbackAction(input: ImproveDetectionWithFeedbackInput) {
    try {
        const result = await improveDetectionWithFeedback(input);
        return { success: result.message };
    } catch (error) {
        console.error("Error in submitFeedbackAction:", error);
        return { error: 'Failed to submit feedback.' };
    }
}

export async function analyzePageAction(input: AnalyzePageForVulnerabilitiesInput) {
    try {
        const result = await analyzePageForVulnerabilities(input);
        return { success: result };
    } catch (error) {
        console.error("Error in analyzePageAction:", error);
        return { error: 'Failed to analyze page. Please try again.' };
    }
}
