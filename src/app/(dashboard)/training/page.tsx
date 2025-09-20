import TrainingModules from "@/components/training/training-modules";

export default function TrainingPage() {
  return (
    <div className="flex flex-col gap-6">
       <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Security Awareness Training
        </h1>
        <p className="text-muted-foreground">
          Learn to identify and protect yourself from online threats.
        </p>
      </header>
      <TrainingModules />
    </div>
  );
}
