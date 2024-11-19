import {
  // flat,
  sum,
} from "remeda";
import { inflateRaw } from "pako";

// For Debug :/
// import { deflateRaw } from "pako";
// import { result, context } from "./mock";
// console.log("result", `${deflateRaw(JSON.stringify(result).toString())}`);
// console.log("rulesMeta", `${deflateRaw(JSON.stringify(context).toString())}`);

const inflateData = (str: string) => {
  return JSON.parse(
    inflateRaw(new Uint8Array(str.split(",") as unknown as ArrayBuffer), {
      to: "string",
    })
  );
};

window.EslintResults = inflateData(window.EslintResults as unknown as string);
window.EslintRulesMeta = inflateData(
  window.EslintRulesMeta as unknown as string
);

const {
  EslintResults,
  // EslintRulesMeta,
  EslintCwd = window.name,
  EslintCreateTime = Date.now(),
} = window;

export { EslintCreateTime, EslintCwd };

// export const FatalErrorEslintResults = EslintResults.filter(
//   (result) => result.fatalErrorCount > 0
// );

export const ProblematicEslintResults = EslintResults.filter((result) => {
  return result.errorCount > 0 || result.warningCount > 0;
});

export const ErrorEslintResults = EslintResults.filter(
  (result) => result.errorCount > 0
);

export const WarningEslintResults = EslintResults.filter(
  (result) => result.warningCount > 0
);

export const NoProblematicEslintResults = EslintResults.filter(
  (result) => result.errorCount === 0 && result.warningCount === 0
);

// const RankMessages = flat(ProblematicEslintResults.map((v) => v.messages));

// export const hasNoError =
//   !RankMessages.some((v) => v.severity === 2) &&
//   FatalErrorEslintResults.length === 0;

export const getEslintAnalysis = () => {
  const errorCount = sum(
    ProblematicEslintResults.map((result) => {
      return result.errorCount;
    })
  );

  const warningCount = sum(
    ProblematicEslintResults.map((result) => {
      return result.warningCount;
    })
  );

  const fixableCount = sum(
    ProblematicEslintResults.map((result) => {
      return result.fixableErrorCount + result.fixableWarningCount;
    })
  );

  const { length: filesCount } = EslintResults;

  const { length: successFileCount } = NoProblematicEslintResults;

  return {
    errorAndWarningCount: errorCount + warningCount,
    errorCount,
    warningCount,
    fixableCount,
    filesCount,
    successFileCount,
  };
};

export const getEslintTopErrorsAndWarnings = (maxCount: number = 10) => {
  const errorCounts: Record<string, number> = {};
  const warningCounts: Record<string, number> = {};

  ProblematicEslintResults.forEach((result) => {
    result.messages.forEach((message) => {
      if (!message.ruleId) {
        return;
      }

      if (message.severity === 2) {
        if (errorCounts[message.ruleId]) {
          errorCounts[message.ruleId]++;
        } else {
          errorCounts[message.ruleId] = 1;
        }
      } else if (message.severity === 1) {
        if (warningCounts[message.ruleId]) {
          warningCounts[message.ruleId]++;
        } else {
          warningCounts[message.ruleId] = 1;
        }
      }
    });
  });

  const sortedErrorCounts = Object.entries(errorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxCount);

  const sortedWarningCounts = Object.entries(warningCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxCount);

  return { sortedErrorCounts, sortedWarningCounts };
};

export const getSortedFilesByErrorAndWarningCount = () => {
  const fileErrorAndWarningCounts: Record<
    string,
    { errors: number; warnings: number }
  > = {};

  ProblematicEslintResults.forEach((result) => {
    const { errorCount, warningCount } = result;

    fileErrorAndWarningCounts[result.filePath] = {
      errors: errorCount,
      warnings: warningCount,
    };
  });

  const sortedFiles = Object.entries(fileErrorAndWarningCounts).sort(
    (a, b) => b[1].errors + b[1].warnings - (a[1].errors + a[1].warnings)
  );

  return sortedFiles;
};
