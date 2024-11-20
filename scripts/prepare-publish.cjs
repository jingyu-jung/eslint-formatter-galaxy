// prepare-publish.cjs
const fs = require("fs-extra");
const path = require("path");

const sourceDir = process.cwd(); // 현재 디렉토리
const distDir = path.join(sourceDir, "dist"); // dist 디렉토리 경로

// 복사할 파일 목록
const filesToCopy = ["index.js", "package.json", "README.md"];

// dist 디렉토리 생성
fs.ensureDirSync(distDir);

// 파일 복사 및 package.json 수정
filesToCopy.forEach((file) => {
  const sourceFile = path.join(sourceDir, file);
  const targetFile = path.join(distDir, file);

  // package.json 파일일 경우 type 필드 제거
  if (file === "package.json") {
    const packageJson = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
    delete packageJson.type; // type 필드 제거
    delete packageJson.scripts;
    fs.writeFileSync(targetFile, JSON.stringify(packageJson, null, 2) + "\n");
  } else {
    // 나머지 파일은 단순 복사
    fs.copyFileSync(sourceFile, targetFile);
  }
});

// docs 폴더 복사
const docsSourceDir = path.join(sourceDir, "docs");
const docsTargetDir = path.join(distDir, "docs");
fs.copySync(docsSourceDir, docsTargetDir);

console.log(
  "Files copied to dist directory, package.json modified, and docs folder copied."
);
