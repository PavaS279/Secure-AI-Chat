# SecureChat AI - High-Level Architecture

This document provides a high-level overview of the SecureChat AI application architecture and its core AI analysis flows.

---

## 1. Application Architecture

This diagram illustrates the main components of the application and how they interact. The system is built with a Next.js frontend, uses Firebase for user authentication, and leverages a Genkit backend to run AI-powered analysis flows with Google's Gemini models.

```
+--------------------------------+
|          User's Browser        |
+--------------------------------+
|   Next.js/React Frontend       |
|   (SecureChat AI UI)           |
|   - Dashboard                  |
|   - Analysis Center (Tabs)     |
|   - Inbox Scanner              |
|   - Extension Simulator        |
|   - Training Modules           |
+--------------------------------+
      |         |                |
      | (1)     | (2)            | (3)
      | HTTPS   | Firebase Auth  | Server Actions
      | Request | (Google OAuth) |
      |         |                |
      v         v                v
+----------------+  +----------------------+
|   Firebase     |  |   Next.js Server     |
+----------------+  +----------------------+
| - Authentication |  |   Genkit AI Backend  |
+----------------+  +----------------------+
                         |
                         | (4) API Call to Gemini
                         v
                +-------------------+
                | Google AI         |
                | (Gemini Models)   |
                +-------------------+

```

### Flow Description:

1.  **User Interaction**: The user interacts with the application through the Next.js frontend, for example, by submitting a message to be analyzed.
2.  **Authentication**: For features like the Inbox Scanner, the user authenticates using Google Sign-In, which is securely managed by **Firebase Authentication**. The app receives a token to confirm the user's identity but never sees their password.
3.  **AI Analysis Request**: When the user requests an analysis (e.g., of a message, URL, image, or audio), the frontend calls a Next.js Server Action.
4.  **Genkit Backend Processing**: The Server Action invokes the appropriate **Genkit AI flow**. This flow formats the request and calls a **Google Gemini model** (e.g., Gemini 2.5 Flash) to perform the actual analysis. The result is structured and sent back to the frontend.

---

## 2. AI Analysis Flows Architecture

This diagram details how different types of analysis requests are routed to specialized AI flows. Each flow is designed to handle a specific data type and threat vector.

```
+--------------------------------+
|     Analysis Center (UI)       |
+--------------------------------+
|  [Message] [URL] [Image] [Audio] |
+--|-----------|-------|-------|--+
   |           |       |       |
   |           |       |       |
 (Message)   (URL)   (Image)  (Audio)
   |           |       |       |
   v           v       v       v
+-------------------------------------------------+
|              Next.js Server Actions             |
|                (src/app/actions.ts)             |
+--|----------------|---------------|------------|--+
   |                |               |            |
   v                v               v            v
+----------------+ +-------------+ +----------------+ +----------------+
| analyzeMessage | | scanUrl     | | analyzeImage   | | analyzeAudio   |
| ForPhishing    | | ForThreats  | | ForPhishing    | | ForPhishing    |
| (Genkit Flow)  | | (Genkit Flow) | | (Genkit Flow)  | | (Genkit Flow)  |
+----------------+ +-------------+ +----------------+ +----------------+
   | (Text)           | (URL)         | (Image+OCR)    | (Audio+Speech-to-Text)
   |                  |               |                |
   |                  |               |                |
   v                  v               v                v
+-------------------------------------------------------------+
|                      Google AI (Gemini Model)                 |
+-------------------------------------------------------------+
   |                  |               |                |
   v                  v               v                v
+-------------------------------------------------------------+
|                     Structured JSON Output                    |
| (Risk Level, Explanation, Threats, Safety Tips, Transcription)|
+-------------------------------------------------------------+
      |                     ^
      |                     |
      +---------------------+
      (Response is returned to the UI)

```

### Flow Description:

1.  **User Input**: The user selects a tab in the Analysis Center and provides input (e.g., pasting text, uploading an image).
2.  **Server Action**: The UI calls the relevant Server Action, passing the user's data.
3.  **Genkit Flow Invocation**: Each action invokes a specialized Genkit flow designed for that specific data type:
    *   `analyzeMessageForPhishing`: Handles plain text.
    *   `scanUrlForThreats`: Analyzes URLs.
    *   `analyzeImageForPhishing`: Performs OCR on images to extract and analyze text.
    *   `analyzeAudioForPhishing`: Transcribes audio to text and analyzes the content.
4.  **AI Model Analysis**: The Genkit flow communicates with the Gemini model, providing the data and a prompt that instructs the model on how to perform the security analysis. For images and audio, this includes OCR and speech-to-text processing.
5.  **Structured Output**: The Gemini model returns a structured JSON object containing the detailed analysis results, which is then passed back through the flow and Server Action to be displayed in the UI.
