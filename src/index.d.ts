declare global {
  interface Window {
    EslintResults: import("eslint").ESLint.LintResult[];
    EslintRulesMeta: import("eslint").ESLint.LintResultData["rulesMeta"];
    EslintCwd: string;
    EslintCreateTime: number;
  }
}

import "./vite-env";
