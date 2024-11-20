#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { deflateRaw } = require("pako");
const { result, rulesMeta } = require("./mock.cjs");

// ESLint 결과를 압축된 문자열로 변환
const deflateData = (data) => {
  return deflateRaw(JSON.stringify(data)).toString();
};

// ESLint 결과 생성
const cwd = process.cwd();
const createTime = Date.now();
const compressedEsLintResults = deflateData(result);
const compressedEsLintRulesMeta = deflateData(rulesMeta);

// 결과를 ESLintResults.js 파일에 저장
const outputPath = path.join(__dirname, "../", "EslintResults.js");
const content = `
  // This file is auto-generated
  window.EslintCwd = "${cwd}";
  window.EslintCreateTime = ${createTime};
  window.EslintResults = '${compressedEsLintResults}';
  window.EslintRulesMeta = '${compressedEsLintRulesMeta}';
`;

if (fs.existsSync(outputPath)) {
  fs.unlinkSync(outputPath);
  console.log("ESLintResults.js has been deleted.");
}

fs.writeFileSync(outputPath, content.trim());
console.log("ESLintResults.js has been generated.");
