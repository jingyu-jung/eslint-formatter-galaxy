# Galaxy ESLint Formatter

<p align="center">
  <img src="https://raw.githubusercontent.com/jingyu-jung/eslint-formatter-galaxy/main/docs/logo.png" alt="Galaxy ESLint Formatter Logo" width="200"/>
</p>

**Galaxy ESLint Formatter**는 [eslint-formatter-html](https://www.npmjs.com/package/eslint-formatter-html)을 포크하여 개발된 Galaxy 테마의 HTML 포맷터입니다. 이 라이브러리는 코드 오류와 경고를 우주 테마에 맞게 시각적으로 매력적으로 출력하여, 개발자가 문제를 보다 쉽게 인식하고 수정할 수 있도록 돕습니다.

## 설치

이 포맷터를 설치하려면 다음 명령어를 실행하세요:

```bash
npm install eslint-formatter-galaxy
```

## 사용법

ESLint 설정 파일에서 Galaxy ESLint Formatter를 포맷터로 지정하여 사용할 수 있습니다. 아래의 명령어를 통해 ESLint를 실행하고, 포맷터를 적용하여 결과를 HTML 파일로 출력할 수 있습니다.

```bash
eslint file.js --format galaxy --output report.html
```

## 기능

- **Galaxy 테마에 맞춘 시각적 출력**: 코드 오류와 경고를 우주 테마에 맞게 스타일링하여, 개발자가 쉽게 인식할 수 있도록 합니다.
- **HTML 형식으로 오류 및 경고 표시**: 결과를 HTML 파일로 출력하여, 브라우저에서 쉽게 확인할 수 있습니다.

![example](https://raw.githubusercontent.com/jingyu-jung/eslint-formatter-galaxy/main/docs/example.png)
