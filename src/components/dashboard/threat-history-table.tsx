"use client";

import { useThreatHistory } from "@/contexts/threat-history-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

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

  return <Badge variant={variant} className={className}>{riskLevel}</Badge>;
};


export default function ThreatHistoryTable() {
  const { threatHistory } = useThreatHistory();

  if (threatHistory.length === 0) {
    return (
      <div className="flex h-[250px] w-full items-center justify-center rounded-lg border-2 border-dashed bg-card/50">
        <p className="text-muted-foreground">Scan history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Content</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {threatHistory.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium truncate max-w-xs">{item.content}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>
                <RiskBadge riskLevel={item.result.riskLevel} />
              </TableCell>
              <TableCell className="text-right">
                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
