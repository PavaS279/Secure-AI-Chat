
# SecureChat AI - Demo Script

## 1. Introduction (Start on the Dashboard Page)

"Welcome! This is SecureChat AI, an intelligent application designed to protect users from online threats like phishing and social engineering attacks.

It’s built with a modern tech stack using Next.js for the frontend, and it's powered by Google's Gemini AI model on the backend to provide real-time threat analysis.

Let's walk through its core features."

---

## 2. The Threat Dashboard (Main Page)

"When you first open the app, you land on the **Threat Dashboard**. This is your command center for security awareness.

*   **Top Cards:** At the top, you see key metrics at a glance: **Total Scans** performed in the current session, the number of **High-Risk Threats**, and **Medium-Risk Threats** detected. This gives you an immediate sense of your security posture.

*   **Threat History:** On the left, we have the **Threat History** table. It logs every scan you perform, showing the content, whether it was a message or URL, the detected risk level, and when it was scanned. This is great for tracking and reviewing past analyses.

*   **Risk Level Distribution:** On the right, the **Risk Level Distribution** chart provides a visual breakdown of the threats you've encountered, categorized into low, medium, and high risk.

Right now, it's empty, so let's generate some data by analyzing a potential threat."

---

## 3. The Analysis Center (Navigate to "Analyze" Page)

"Next, we'll move to the **Analysis Center**, the core of our defense system. Here you can proactively check suspicious content. It has two main tools: Message Analysis and URL Scanning."

### a. Message Analysis

"Let's start with **Message Analysis**. Imagine you've received a suspicious email that's pressuring you to act quickly.

I'll paste the content of the email here. I can also add context, like the sender or subject line, to improve the analysis. For example, let's say the subject is 'Urgent: Your account is suspended'."

**(Paste the following into the Message Content field):**
> `URGENT: Your account has been flagged for suspicious activity. To avoid permanent suspension, you must verify your identity immediately by clicking here: http://bit.ly/update-acct-info. Failure to do so within 24 hours will result in account closure.`

**(Type the following into the Context field):**
> `From: security@yourbank.co, Subject: Urgent Action Required`

"Now, I'll click **Analyze Message**."

"The AI gets to work instantly. On the right, you see the results.
*   **Risk Level:** It's flagged as **High Risk**.
*   **Explanation:** The AI explains *why* it's risky, pointing out the urgency and the suspicious link.
*   **Specific Threats:** It lists the tactics used, like 'Urgency manipulation' and 'Suspicious links'.
*   **Safety Tips:** Most importantly, it gives clear, actionable advice, like 'Do not click the link' and 'Verify through official channels'.

This empowers any user to make a safe decision, even if they aren't a security expert."

### b. URL Scanner

"Now, let's try the **URL Scanner**. This is useful if you just have a link you're unsure about."

**(Click on the "URL Scanner" tab).**

"Let's test it with a URL that might look legitimate but has suspicious characteristics."

**(Paste the following into the URL field):**
> `http://login-microsft.com/auth/secure-login`

"And click **Scan URL**."

"Again, the AI provides a detailed analysis. It identifies this as high risk because the domain is typosquatted—it's 'microsft' not 'microsoft'—a classic phishing technique. It gives a clear explanation and the same kind of safety tips we saw before."

---

## 4. Real-time Protection (Navigate to "Extension" Page)

"SecureChat AI isn't just for manual scans. It's designed to provide proactive, real-time protection through a **browser extension**.

This page simulates what that extension's popup would look like.

*   **Threat Indicator:** At the center, you see the **Threat Indicator**. This animated shield gives you an immediate visual cue about the safety of the current web page. It cycles through 'Safe', 'Warning', and 'Danger' states to show how it would react to different threats.

*   **Real-time Detections:** Below, the extension provides a live summary of what it's doing in the background—counting safe links, blocking trackers, and identifying malicious scripts.

This feature ensures you are protected automatically as you browse, without having to manually copy and paste content into the app. It's seamless, always-on security."

---

## 5. Improving the AI with Feedback

(Navigate back to the "Analyze" page and show a previous result)

"A key feature of SecureChat AI is its ability to learn. Notice these **feedback buttons** (thumbs up/down) at the bottom of the analysis card.

If a user feels the analysis was correct or incorrect, they can provide feedback. This information is sent back to an AI flow that can be used to fine-tune the detection model over time, making the system smarter with every interaction. It's a closed-loop learning system."

---

## 6. Security Awareness Training (Navigate to "Training" Page)

"Finally, prevention is just as important as detection. The **Security Awareness Training** page is a resource for users to educate themselves.

It contains an accordion of frequently asked questions about common threats like phishing and social engineering. This provides users with the fundamental knowledge they need to stay safe online, directly within the app."

---

## 7. Conclusion

"So, to summarize, SecureChat AI is not just a tool—it's a complete defense system.

*   It **Detects** threats in real-time with both manual and automated analysis.
*   It **Informs** users with clear, easy-to-understand results.
*   It **Educates** them on how to recognize and avoid threats.
*   And it **Improves** over time with user feedback.

This creates a smarter, more secure environment for everyone. Thank you."
