import { useMemo } from "react";
import { getEslintAnalysis } from "@/formatter/config";
import Summary from "./summary";
import MostProblems from "./most-problems";
import TopErrorAndWarnings from "./top-error-and-warnings";
import Details from "./details";

export default function Component() {
  const eslintAnalysis = useMemo(() => getEslintAnalysis(), []);

  return (
    <div className="m-auto p-6 pb-32 max-w-screen-lg bg-[var(--color-canvas-default)] text-[var(--color-fg-default)]">
      <div className="mb-8">
        <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-sm">
          <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400"></span>
          <span className="text-white/90">ESLint Report</span>
        </div>
        <h1 className="mt-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          Code Quality Analysis
        </h1>
        <p className="mt-2 text-sm text-white/60">
          {`${eslintAnalysis.errorAndWarningCount} problems (${eslintAnalysis.errorCount} errors, ${eslintAnalysis.warningCount} warnings)`}
        </p>
      </div>

      <Summary
        errorAndWarningCount={eslintAnalysis.errorAndWarningCount}
        errorCount={eslintAnalysis.errorCount}
        warningCount={eslintAnalysis.warningCount}
        filesCount={eslintAnalysis.filesCount}
      />
      <TopErrorAndWarnings />
      <MostProblems />
      <Details />
    </div>
  );
}
