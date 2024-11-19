const fs = require("fs");
const path = require("path");
const { deflateRaw } = require("pako");
const stripAnsi = require("strip-ansi");

/**
 * @param {import('eslint').ESLint.LintResult[]} results
 * @param {import('eslint').ESLint.LintResultData} context
 */
const formatEslintData = (results, context) => {
  const { cwd, rulesMeta } = context;
  /**
   * @type {Record<string, import('eslint').Rule.RuleMetaData>}
   */
  const EslintRulesMeta = {};
  results.forEach((result) => {
    const { filePath } = result;
    result.filePath = path.relative(cwd, filePath);
    result.messages = result.messages.map((messageInfo) => {
      const { ruleId, message } = messageInfo;
      if (ruleId && !(ruleId in EslintRulesMeta)) {
        EslintRulesMeta[ruleId] = rulesMeta[ruleId];

        if (EslintRulesMeta?.[ruleId]?.schema) {
          delete EslintRulesMeta[ruleId].schema;
        }
      }
      return {
        ...messageInfo,
        message: stripAnsi(message),
      };
    });

    delete result.output;
    delete result.usedDeprecatedRules;
    delete result.suppressedMessages;
  });

  return { EslintResults: results, EslintRulesMeta };
};

/**
 * @param {string} fileName
 */
const getFileContent = (fileName) => {
  return fs.readFileSync(path.resolve(__dirname, fileName), "utf-8");
};

const deflateData = (data) => {
  return deflateRaw(JSON.stringify(data).toString());
};

/**
 * @param {import('eslint').ESLint.LintResult[]} results
 * @param {import('eslint').ESLint.LintResultData} context
 */
module.exports = (results, context) => {
  const { cwd: EslintCwd } = context;
  const EslintCreateTime = Date.now();
  const { EslintResults, EslintRulesMeta } = formatEslintData(results, context);

  const scriptContent = `
        <script> 
            window.EslintCwd = '${EslintCwd}';
            window.EslintCreateTime = ${EslintCreateTime};
            window.EslintResults = '${deflateData(EslintResults)}';
            window.EslintRulesMeta = '${deflateData(EslintRulesMeta)}';
        </script>
    `;

  const template = getFileContent("./index.html");
  return template.replace(
    '<script src="./EslintResults.js"></script>',
    scriptContent
  );
};
