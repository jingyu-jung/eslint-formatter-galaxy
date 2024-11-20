# Galaxy ESLint Formatter

**Galaxy ESLint Formatter**는 [eslint-formatter-html](https://www.npmjs.com/package/eslint-formatter-html)을 포크하여 개발된 Galaxy 테마의 HTML 포맷터입니다. 이 라이브러리는 코드 오류와 경고를 우주 테마에 맞게 시각적으로 매력적으로 출력하여, 개발자가 문제를 보다 쉽게 인식하고 수정할 수 있도록 돕습니다.

## 설치

이 포맷터를 설치하려면 다음 명령어를 실행하세요:

```bash
npm install eslint-formatter-galaxy
```

## 사용법

ESLint 설정 파일에서 Galaxy ESLint Formatter를 포맷터로 지정하여 사용할 수 있습니다. 아래의 명령어를 통해 ESLint를 실행하고, 포맷터를 적용하여 결과를 HTML 파일로 출력할 수 있습니다.

```bash
# npm, pnpm, yarn (PnP 사용하지 않을 경우)
eslint file.js --format node_modules/eslint-formatter-galaxy/index.js --output report.html
```

### Yarn PnP 사용 시

Yarn PnP를 사용하는 경우, 다음과 같은 코드를 통해 ESLint 리포트를 생성할 수 있습니다:

```javascript
// generate-eslint-report.js
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const pnpApi = require("pnpapi");

const getPackagePath = (packageName) => {
  return pnpApi.resolveToUnqualified(packageName, process.cwd());
};

const generateEslintReport = () => {
  const outputFilePath = path.resolve(process.cwd(), CONFIG.OUTPUT_FILE);
  try {
    const eslintFormatterPath = path.resolve(
      getPackagePath(CONFIG.REPORTER.PACKAGE_NAME),
      "./index.js"
    );

    exec(
      `yarn eslint file.js --format ${eslintFormatterPath} --output report.html`,
      { cwd: path.resolve(process.cwd()) }
    );
  } catch (error) {
    console.error("Error generating ESLint report:", error);
  }
};

generateEslintReport();
```

```bash
# 스크립트를 실행합니다.
node generate-eslint-report.js
```

## 기능

- **Galaxy 테마에 맞춘 시각적 출력**: 코드 오류와 경고를 우주 테마에 맞게 스타일링하여, 개발자가 쉽게 인식할 수 있도록 합니다.
- **HTML 형식으로 오류 및 경고 표시**: 결과를 HTML 파일로 출력하여, 브라우저에서 쉽게 확인할 수 있습니다.

이 포맷터를 사용하여 코드 품질을 높이고, 개발 과정에서 발생하는 문제를 보다 효과적으로 관리해 보세요!
