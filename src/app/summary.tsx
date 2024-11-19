import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryProps {
  errorAndWarningCount: number;
  errorCount: number;
  warningCount: number;
  filesCount: number;
}

const Summary = ({
  errorAndWarningCount,
  errorCount,
  warningCount,
  filesCount,
}: SummaryProps) => {
  return (
    <div className="grid gap-6 mb-8 md:grid-cols-4" id="summary">
      <Card className="bg-[var(--color-canvas-subtle)] border-[var(--color-border-default)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[var(--color-fg-default)]">
            Total Issues
          </CardTitle>
          <Info className="h-4 w-4 text-[var(--color-fg-muted)]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[var(--color-fg-default)]">
            {errorAndWarningCount}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-[var(--color-canvas-subtle)] border-[var(--color-border-default)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[var(--color-fg-default)]">
            Errors
          </CardTitle>
          <div className="h-4 w-4 rounded-full bg-[var(--color-danger-fg)]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[var(--color-fg-default)]">
            {errorCount}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-[var(--color-canvas-subtle)] border-[var(--color-border-default)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[var(--color-fg-default)]">
            Warnings
          </CardTitle>
          <div className="h-4 w-4 rounded-full bg-[var(--color-attention-fg)]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[var(--color-fg-default)]">
            {warningCount}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-[var(--color-canvas-subtle)] border-[var(--color-border-default)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[var(--color-fg-default)]">
            Files
          </CardTitle>
          <Info className="h-4 w-4 text-[var(--color-fg-muted)]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[var(--color-fg-default)]">
            {filesCount}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Summary;
