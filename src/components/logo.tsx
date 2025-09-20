import { Shield } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Shield className="h-7 w-7 text-primary" />
      <h1 className="text-xl font-bold font-headline text-foreground">
        SecureChat AI
      </h1>
    </div>
  );
}
