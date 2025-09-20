'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/scan-url-for-threats.ts';
import '@/ai/flows/improve-detection-with-feedback.ts';
import '@/ai/flows/analyze-message-for-phishing.ts';
import '@/ai/flows/analyze-page-for-vulnerabilities.ts';
import '@/ai/flows/analyze-image-for-phishing.ts';
import '@/ai/flows/analyze-audio-for-phishing.ts';
