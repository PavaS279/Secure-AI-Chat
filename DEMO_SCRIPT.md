# SecureChat AI - Demo Script

## 1. Introduction (Start on the Dashboard Page)

"Welcome! This is SecureChat AI, an intelligent application designed to protect users from online threats like phishing and social engineering attacks.

It’s built with a modern tech stack using Next.js for the frontend, and it's powered by Google's Gemini AI model on the backend to provide real-time threat analysis.

Let's walk through its core features."

---

## 2. The Threat Dashboard (Main Page)

"When you first open the app, you land on the **Threat Dashboard**. This is your command center for security awareness.

*   **Top Cards:** At the top, you see key metrics at a glance: **Total Scans** performed in the current session, the number of **High-Risk Threats**, and **Medium-Risk Threats** detected. This gives you an immediate sense of your security posture.

*   **Threat History:** On the left, we have the **Threat History** table. It logs every scan you perform, showing the content, its type (like message, URL, image, or audio), the detected risk level, and when it was scanned. This is great for tracking and reviewing past analyses.

*   **Risk Level Distribution:** On the right, the **Risk Level Distribution** chart provides a visual breakdown of the threats you've encountered, categorized into low, medium, and high risk.

Right now, it's empty, so let's generate some data by analyzing a few potential threats."

---

## 3. The Analysis Center (Navigate to "Analyze" Page)

"Next, we'll move to the **Analysis Center**, the core of our defense system. Here you can proactively check suspicious content across multiple formats."

### a. Message Analysis

"Let's start with **Message Analysis**. Imagine you've received a suspicious email that's pressuring you to act quickly. I'll paste the content of the email here and add some context."

**(Paste the following into the Message Content field):**
> `URGENT: Your account has been flagged for suspicious activity. To avoid permanent suspension, you must verify your identity immediately by clicking here: http://bit.ly/update-acct-info. Failure to do so within 24 hours will result in account closure.`

**(Type the following into the Context field):**
> `From: security@yourbank.co, Subject: Urgent Action Required`

"Now, I'll click **Analyze Message**."

"The AI gets to work instantly. On the right, you see the results.
*   **Risk Level:** It's flagged as **High Risk**.
*   **Explanation:** The AI explains *why* it's risky, pointing out the urgency and the suspicious link.
*   **Specific Threats:** It lists the tactics used, like 'Urgency manipulation' and 'Suspicious links'.
*   **Safety Tips:** Most importantly, it gives clear, actionable advice, like 'Do not click the link' and 'Verify through official channels'."

### b. URL Scanner

"Now, let's try the **URL Scanner**. This is for when you just have a link you're unsure about."

**(Click on the "URL" tab).**

**(Paste the following into the URL field):**
> `http://login-microsft.com/auth/secure-login`

"And click **Scan URL**."

"Again, the AI identifies this as high risk because the domain is typosquatted—it's 'microsft' not 'microsoft'—a classic phishing technique."

### c. Image Analysis (OCR)

"Scammers are smart; they often send malicious text as images to evade spam filters. Let's see how SecureChat AI handles this. We'll go to the **Image** tab."

**(Upload a screenshot of a phishing text message. You can create one with text like: "Your Apple ID has been locked due to suspicious activity. Click here to unlock: apple-support-login.web.app").**

"I'm uploading an image that looks like a text message from a scammer."

"When I click **Analyze Image**, the AI performs Optical Character Recognition (OCR) to extract the text from the image. It then analyzes that text."

"As you can see, it has transcribed the text and flagged it as **High Risk**, identifying the suspicious link and the impersonation tactic. This is a powerful feature against modern scam techniques."

### d. Audio Analysis (Vishing)

"The threats don't just come through text; they also come through voice calls, a technique known as 'vishing'. Let's test this on the **Audio** tab."

"Here, we can either upload a suspicious voicemail file or record audio directly in the browser. For this example, let's record a message."

**(Click "Record Audio"). Your browser will ask for microphone permission. Allow it.**

**(Record yourself saying something like: "This is an urgent message from the IRS. A lawsuit has been filed against you. To avoid legal action, call us back immediately at this number...").**

**(Click "Stop Recording").**

"Now that we have the recording, I'll click **Analyze Audio**. The app transcribes my speech to text and then runs the same security analysis."

"The AI transcribes the message and correctly identifies it as a **High-Risk** threat, pointing out the impersonation of a government authority (IRS) and the use of fear and urgency. This is crucial for protecting against phone-based scams."

---

## 4. Automated Inbox Scanning (Navigate to "Inbox" Page)

"Manually checking every message can be tedious. That's why we've built the **Automated Inbox Scanner**. This feature connects directly to your email provider to scan your inbox proactively."

"First, I'll connect my Google account. This uses a secure OAuth flow, so the app never sees my password."

**(Click "Connect to Gmail" and complete the sign-in process).**

"Now that my account is connected, I can click **Scan Inbox Now**."

"The system begins to scan a sample of my recent emails in the background. It analyzes each one for the same threats we saw earlier. As the results come in, you can see them categorized by risk level right here. This demonstrates how SecureChat AI can provide continuous, automated protection for your most critical communication channel, flagging threats before you even open them."

---

## 5. Real-time Protection Simulation (Navigate to "Extension" Page)

"SecureChat AI is also designed to provide proactive protection through a **browser extension**. This page simulates what that extension's popup would look like."

"When I click **Scan Current Page**, the app sends the page's HTML to our AI for analysis. It's not just looking at the URL, but the actual code of the page."

"The AI returns a real-time analysis, identifying potential risks like insecure scripts, dangerous forms, or external iframes that could be used for clickjacking. It provides a summary and breaks down the specific elements it found, giving you a deep-dive into the page's security posture. This is proactive, in-the-moment protection."

---

## 6. Improving the AI with Feedback

(Navigate back to the "Analyze" page and show a previous result)

"A key feature of SecureChat AI is its ability to learn. Notice these **feedback buttons** (thumbs up/down) at the bottom of the analysis card. If a user feels the analysis was correct or incorrect, they can provide feedback. This information is sent back to an AI flow that can be used to fine-tune the detection model over time, making the system smarter with every interaction."

---

## 7. Security Awareness Training (Navigate to "Training" Page)

"Finally, prevention is just as important as detection. The **Security Awareness Training** page is a resource for users to educate themselves. It contains an accordion of frequently asked questions about common threats like phishing and social engineering. This provides users with the fundamental knowledge they need to stay safe online."

---

## 8. Conclusion

"So, to summarize, SecureChat AI is not just a tool—it's a complete, multi-layered defense system.

*   It **Detects** threats across text, URLs, images, and audio.
*   It **Automates** protection by scanning your inbox directly.
*   It **Protects** proactively by scanning web page content in real-time.
*   It **Educates** users on how to recognize and avoid threats.
*   And it **Improves** over time with user feedback.

This creates a smarter, more secure environment for everyone. Thank you."
