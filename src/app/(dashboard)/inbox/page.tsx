
'use client';

import { useState, useTransition } from 'react';
import { getAuth, signInWithPopup, User, signOut } from 'firebase/auth';
import { googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, Loader2, LogOut } from 'lucide-react';
import { analyzeMessageAction } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { AnalyzeMessageForPhishingOutput } from '@/ai/flows/analyze-message-for-phishing';

type EmailAnalysis = {
  email: SampleEmail;
  result: AnalyzeMessageForPhishingOutput | null;
  isAnalyzing: boolean;
};

type SampleEmail = {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  content: string;
};

const sampleEmails: SampleEmail[] = [
  {
    id: '1',
    sender: 'HR Department',
    senderEmail: 'hr@company-updates.com',
    subject: 'Urgent: New Company Policy on Remote Work',
    content: 'All employees must sign the new remote work agreement by EOD Friday. Please review and sign the document attached to this email immediately to ensure compliance. Link: http://bit.ly/company-policy-update',
  },
  {
    id: '2',
    sender: 'IT Support',
    senderEmail: 'it.support@microsft-security.net',
    subject: 'Action Required: Your password expires in 24 hours',
    content: 'Your network password will expire soon. To avoid losing access, please reset your password now by clicking here: https://microsft-security.net/reset-password',
  },
  {
    id: '3',
    sender: 'Marketing Team',
    senderEmail: 'newsletter@get-your-prize.org',
    subject: 'Congratulations! You have been selected!',
    content: 'You have won a free vacation! Click here to claim your prize. This is a limited time offer, so act fast!',
  },
  {
    id: '4',
    sender: 'Alice',
    senderEmail: 'alice@example.com',
    subject: 'Project Update',
    content: 'Hi team, here is the update for our Q3 project. The document is attached. Please review it before our meeting tomorrow. Thanks!',
  },
];


const RiskBadge = ({ riskLevel }: { riskLevel: 'low' | 'medium' | 'high' }) => {
  const variant = {
    high: "destructive",
    medium: "secondary",
    low: "default",
  }[riskLevel] as "destructive" | "secondary" | "default";

  const className = {
    high: "",
    medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50 hover:bg-yellow-500/30",
    low: "bg-green-500/20 text-green-300 border-green-500/50 hover:bg-green-500/30",
  }[riskLevel];

  return <Badge variant={variant} className={cn('capitalize', className)}>{riskLevel} Risk</Badge>;
};


export default function InboxPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthPending, startAuthTransition] = useTransition();
  const [isScanning, startScanTransition] = useTransition();
  const [analysis, setAnalysis] = useState<EmailAnalysis[]>([]);

  const handleSignIn = () => {
    const auth = getAuth();
    startAuthTransition(async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        setUser(result.user);
      } catch (error) {
        console.error('Authentication failed:', error);
      }
    });
  };

  const handleSignOut = () => {
    const auth = getAuth();
    startAuthTransition(async () => {
      await signOut(auth);
      setUser(null);
      setAnalysis([]);
    });
  };

  const handleScanInbox = () => {
    startScanTransition(() => {
        // Initialize analysis state
        const initialAnalysis = sampleEmails.map(email => ({
            email,
            result: null,
            isAnalyzing: true
        }));
        setAnalysis(initialAnalysis);

        // Analyze each email
        initialAnalysis.forEach((item, index) => {
            setTimeout(async () => {
                const actionResult = await analyzeMessageAction({
                    messageContent: item.email.content,
                    context: `From: ${item.email.senderEmail}, Subject: ${item.email.subject}`
                });

                setAnalysis(prev => {
                    const newAnalysis = [...prev];
                    newAnalysis[index] = {
                        ...newAnalysis[index],
                        result: actionResult.success || null,
                        isAnalyzing: false,
                    };
                    return newAnalysis;
                });
            }, index * 1000); // Stagger the API calls
        });
    });
  };


  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Automated Inbox Scanner
        </h1>
        <p className="text-muted-foreground">
          Connect your Gmail to automatically scan for phishing and malware threats.
        </p>
      </header>

      {!user ? (
        <Card className="max-w-lg mx-auto text-center">
            <CardHeader>
                <CardTitle>Connect Your Inbox</CardTitle>
                <CardDescription>Sign in with Google to allow SecureChat AI to scan your emails for threats.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleSignIn} disabled={isAuthPending}>
                    {isAuthPending ? <Loader2 className="animate-spin" /> : <Chrome />}
                    Connect to Gmail
                </Button>
            </CardContent>
        </Card>
      ) : (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                     <Avatar>
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>Welcome, {user.displayName}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                </div>
                <Button variant="outline" onClick={handleSignOut} disabled={isAuthPending}>
                    {isAuthPending ? <Loader2 className="animate-spin" /> : <LogOut />}
                    Sign Out
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={handleScanInbox} disabled={isScanning}>
                    {isScanning ? <Loader2 className="animate-spin" /> : 'Scan Inbox Now'}
                </Button>

                {analysis.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Scan Results:</h3>
                        <ul className="border rounded-md divide-y">
                            {analysis.map(({ email, result, isAnalyzing }) => (
                                <li key={email.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                                    <div className="flex-1">
                                        <p className="font-semibold">{email.sender}</p>
                                        <p className="text-sm font-medium">{email.subject}</p>
                                        <p className="text-sm text-muted-foreground truncate max-w-md">{email.content}</p>
                                    </div>
                                    <div>
                                        {isAnalyzing && <Loader2 className="animate-spin text-muted-foreground" />}
                                        {result && <RiskBadge riskLevel={result.riskLevel} />}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}

function cn(...arg0: string[]): string | undefined {
    return arg0.join(' ');
}
