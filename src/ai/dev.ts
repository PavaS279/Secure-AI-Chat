import { config } from 'dotenv';
config();

import '@/ai/flows/scan-url-for-threats.ts';
import '@/ai/flows/improve-detection-with-feedback.ts';
import '@/ai/flows/analyze-message-for-phishing.ts';
import '@/ai/flows/analyze-page-for-vulnerabilities.ts';
