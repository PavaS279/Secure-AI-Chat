
# How I Built an AI-Powered Cybersecurity App in Just 3 Hours

### From a Simple Idea to a Deployed App with Firebase Studio and Gemini — A Hackathon Story

---

A few days ago, I walked into the "Vibe Coding Hackathon," an event buzzing with energy, sponsored by Google for Developers and hosted by Deep Tech Stars. The challenge was simple yet daunting: build and launch a fully functional product from scratch in just three hours. No teams, just one person, one idea, and a powerful new set of tools.

By the time I walked out, I had a working proof-of-concept for **SecureChat AI**, an intelligent application designed to combat online phishing and social engineering attacks.

This is the story of how I did it, and how modern AI tools are fundamentally changing the speed at which we can bring ideas to life.

### The Problem: The Ever-Growing Threat of Phishing

We've all seen them: the urgent email from your "bank," the suspicious text message with a strange link, or the fake login page that looks almost identical to the real one. Phishing and social engineering attacks are becoming more sophisticated every day, using text, images, and even audio (vishing) to deceive victims.

My idea was to build a "secure chat" platform where users could get an instant, AI-powered second opinion on any content they find suspicious. A digital guardian angel that could analyze multiple formats and provide a clear, actionable risk assessment.

### The Tools: An AI-Native Tech Stack

To build something this ambitious in three hours, the right tools are everything. Our stack for the hackathon was a powerful combination of a streamlined frontend and a deeply integrated AI backend:

*   **Frontend:** Next.js with React, TypeScript, and ShadCN/Tailwind CSS for beautiful, responsive components.
*   **AI Development Environment:** **Firebase Studio**, a new browser-based IDE designed for AI-native development.
*   **The AI Brain:** **Google's Gemini model**, accessed via **Genkit**, an open-source AI framework.

Firebase Studio was the star of the show. It wasn't just an editor; it was an AI-collaborator that understood the entire stack, helping generate code, scaffold the project, and manage the entire development lifecycle from within the browser.

### The 3-Hour Sprint: A Blow-by-Blow Account

#### **Hour 1: Laying the Foundation with Firebase Studio**

The first hour was all about speed. With a traditional setup, I would have spent this time configuring my local environment, setting up a Next.js project, and installing UI libraries.

With Firebase Studio, I just described my app's purpose. It immediately scaffolded a full-stack Next.js application, complete with a professional-looking UI using ShadCN components and Tailwind CSS. I asked it to create a dashboard layout with a sidebar for navigation and a main content area. Within minutes, I had:

*   A **Dashboard** page to display threat analytics.
*   An **Analysis Center** for submitting content.
*   Pages for future features like an **Inbox Scanner** and **Training**.

The initial UI was clean, responsive, and ready to be wired up. This wasn't just boilerplate; it was a thoughtfully designed starting point that saved me at least an hour of tedious setup.

#### **Hour 2: Building the Brain with Genkit and Gemini**

This was where the magic happened. The core of SecureChat AI is its ability to analyze different types of content. I used **Genkit**, an open-source framework from Google, to create the AI logic.

Genkit makes it incredibly easy to define "flows"—server-side functions that call AI models. I created a separate flow for each analysis type:

1.  **`analyzeMessageForPhishing`**: This flow took text content and context (like sender info) as input. I wrote a prompt instructing Gemini to act as a cybersecurity expert, evaluate the text for tactics like urgency and impersonation, and return a structured JSON object with a `riskLevel`, `explanation`, and `safetyTips`.

2.  **`scanUrlForThreats`**: Similar to the message analysis, but focused on URL structures, looking for signs of typosquatting or suspicious paths.

3.  **`analyzeImageForPhishing`**: This was the coolest part. The flow accepted a Base64-encoded image. The Gemini 2.5 Flash model's multi-modal capabilities allowed it to perform Optical Character Recognition (OCR) to extract text *from the image* and then analyze that text for threats in a single call. This is crucial for catching scams sent as screenshots.

4.  **`analyzeAudioForPhishing`**: For voice phishing ("vishing"), this flow took an audio file. Like with the image, Gemini transcribed the audio to text and then performed the security analysis on the transcription.

Defining these complex, multi-modal AI chains was surprisingly simple with Genkit. It handled the interaction with the Gemini API, data marshalling, and structured output parsing, letting me focus on the core prompt engineering.

#### **Hour 3: Integration, Polish, and Launch!**

With the frontend UI and the backend AI flows ready, the final hour was about connecting them. I used Next.js Server Actions to bridge the gap.

For example, on the "Analyze Message" page, the form's `onSubmit` function calls a Server Action named `analyzeMessageAction`. This action, running securely on the server, simply invokes the corresponding Genkit flow and returns the result to the client.

```typescript
// src/app/actions.ts - Simplified Example
export async function analyzeMessageAction(input: AnalyzeMessageForPhishingInput) {
    try {
        // Call the Genkit flow on the server
        const result = await analyzeMessageForPhishing(input);
        return { success: result };
    } catch (error) {
        return { error: 'Failed to analyze message.' };
    }
}
```

The frontend receives the structured JSON from the server action and displays it in a clean, user-friendly "Analysis Result" card. I added indicators for risk level (red for high, yellow for medium, green for low) and listed out the specific threats and safety tips provided by the AI.

In the final minutes, I added a Threat History table to the dashboard, which logged every scan, and a chart to visualize the distribution of risk levels. At the 2:30 PM mark, I submitted my project.

### The Final Product: SecureChat AI

In just three hours, SecureChat AI was a reality. It wasn't just a mock-up; it was a working application with real AI intelligence.

**Key Features Achieved:**
*   **Multi-Modal Analysis:** Users can analyze text, URLs, images (via OCR), and audio (via transcription).
*   **Real-Time Threat Detection:** Gemini provides a detailed analysis in seconds.
*   **Actionable Advice:** The app doesn't just flag threats; it explains *why* something is risky and tells the user what to do next.
*   **Threat Dashboard:** A central place to view analytics and review past scans.

### Final Thoughts: The Future is AI-Native

This hackathon was an eye-opener. Building a project of this complexity in such a short time would have been unthinkable just a year or two ago.

Tools like **Firebase Studio** act as a true pair-programmer, handling the boilerplate and allowing developers to focus on creative logic. When combined with the immense power of multi-modal models like **Gemini**, the barrier between idea and execution becomes incredibly thin. We're moving from a world where we use AI as a tool to one where we build applications *natively* with AI at their core.

I'm incredibly proud of what I was able to build and grateful to Deep Tech Stars and Google for Developers for the opportunity. If this is what can be done in three hours, I can't wait to see what the future of AI-native development holds.

---
*Feel free to connect with me on LinkedIn or check out the project code to learn more!*
