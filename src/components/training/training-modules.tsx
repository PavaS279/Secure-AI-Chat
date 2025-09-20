import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const trainingData = [
  {
    question: "What is Phishing?",
    answer: "Phishing is a type of social engineering attack where an attacker sends a fraudulent message designed to trick a person into revealing sensitive information to the attacker or to deploy malicious software on the victim's infrastructure like ransomware. Phishing attacks have become increasingly sophisticated."
  },
  {
    question: "How to Recognize a Phishing Email?",
    answer: "Look for several key signs: 1. The message creates a sense of urgency. 2. It contains suspicious links or attachments. 3. The sender's email address is slightly different from a legitimate one. 4. The email has spelling and grammar mistakes. 5. It asks for personal information."
  },
  {
    question: "What is Social Engineering?",
    answer: "Social engineering is the art of manipulating people so they give up confidential information. The types of information these criminals are seeking can vary, but when individuals are targeted the criminals are usually trying to trick you into giving them your passwords or bank information, or access your computer to secretly install malicious software."
  },
  {
    question: "Common Social Engineering Tactics",
    answer: "Common tactics include: 1. Baiting (luring with a false promise). 2. Scareware (tricking you with false alarms). 3. Pretexting (creating a fabricated scenario to steal information). 4. Vishing (voice phishing over the phone). 5. Smishing (SMS phishing via text messages)."
  },
  {
    question: "What to Do If You Suspect a Threat?",
    answer: "Do not click any links or download attachments. Do not reply to the message. Use SecureChat AI to analyze the message or URL. Report the message to your IT department or email provider. Delete the suspicious message."
  }
];

export default function TrainingModules() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {trainingData.map((item, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger className="text-lg font-headline hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
