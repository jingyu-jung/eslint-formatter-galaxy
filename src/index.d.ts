declare global {
  interface Window {
    EslintResults: import("eslint").ESLint.LintResult[];
    EslintRulesMeta: import("eslint").ESLint.LintResultData;
    EslintCwd: string;
    EslintCreateTime: number;
  }
}

import "./vite-env";
