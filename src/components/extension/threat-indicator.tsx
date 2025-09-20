"use client"

import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const ThreatIndicator = () => {
    const [status, setStatus] = useState<'safe' | 'warning' | 'danger'>('safe');
    const [key, setKey] = useState(0);

    useEffect(() => {
        const statuses: ('safe' | 'warning' | 'danger')[] = ['safe', 'warning', 'danger'];
        const interval = setInterval(() => {
            // Cycle through statuses for demo purposes
            setStatus(prev => {
                const nextIndex = (statuses.indexOf(prev) + 1) % statuses.length;
                return statuses[nextIndex];
            });
            setKey(prev => prev + 1); // Re-trigger animation
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const indicatorColor = {
        safe: 'text-green-400',
        warning: 'text-yellow-400',
        danger: 'text-red-400',
    }[status];

    const glowColor = {
        safe: 'shadow-[0_0_20px_0px_rgba(74,222,128,0.5)]',
        warning: 'shadow-[0_0_20px_0px_rgba(250,204,21,0.5)]',
        danger: 'shadow-[0_0_20px_0px_rgba(248,113,113,0.5)]',
    }[status];

    return (
        <div key={key} className="relative flex items-center justify-center h-40 w-40">
            <div className={cn("absolute inset-0 rounded-full bg-current opacity-20 animate-pulse", indicatorColor)}></div>
            <div className={cn("absolute inset-2 rounded-full bg-current opacity-20 animate-pulse delay-500", indicatorColor)}></div>
             <div className={cn("relative z-10 flex items-center justify-center h-28 w-28 rounded-full bg-card border-2", indicatorColor, glowColor)}>
                <ShieldCheck className="h-16 w-16" />
            </div>
        </div>
    );
};

export default ThreatIndicator;
