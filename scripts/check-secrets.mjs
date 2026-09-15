#!/usr/bin/env node
/**
 * 커밋 직전에 스테이징된 변경분만 훑어서 API 키가 섞여 들어갔는지 확인한다.
 * GitHub 시크릿 스캐닝은 비공개 저장소 유료 기능이라, 그 역할을 로컬에서 대신한다.
 *
 * 사용: npm run check:secrets  (git pre-commit 훅에서 자동 실행)
 */
import { execFileSync } from "node:child_process";

const PATTERNS = [
  { name: "OpenAI API 키", re: /\bsk-(proj|svcacct|admin)?-?[A-Za-z0-9_-]{20,}/ },
  { name: "AWS 액세스 키", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "Google/Firebase 키", re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: "GitHub 토큰", re: /\bgh[pousr]_[A-Za-z0-9]{36,}/ },
  { name: "Vercel 토큰", re: /\bvc[ar]_[A-Za-z0-9]{24,}/ },
  { name: "개인키 블록", re: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  // 우리 프로젝트에서 쓰는 키 형태: 32자/64자 hex가 KEY= 뒤에 바로 붙는 경우
  { name: "하드코딩된 API 키", re: /(?:API_KEY|SERVICE_KEY|SECRET|TOKEN)\s*[:=]\s*["'][A-Za-z0-9/+_-]{24,}["']/i },
];

// 예시·문서 파일은 자리표시자를 담고 있으므로 제외
const SKIP_FILES = /(\.env\.local\.example|check-secrets\.mjs|package-lock\.json)$/;

function staged() {
  const out = execFileSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACM", "-z"], {
    encoding: "utf8",
  });
  return out.split("\0").filter(Boolean).filter((f) => !SKIP_FILES.test(f));
}

let found = 0;
for (const file of staged()) {
  let content;
  try {
    content = execFileSync("git", ["show", `:${file}`], {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    });
  } catch {
    console.error(`검사할 파일을 읽지 못했습니다: ${file}`);
    process.exit(1);
  }

  content.split("\n").forEach((line, i) => {
    for (const { name, re } of PATTERNS) {
      if (re.test(line)) {
        console.error(
          `\n  ✖ ${file}:${i + 1} — ${name}로 보이는 값이 있습니다`
        );
        found++;
      }
    }
  });
}

if (found > 0) {
  console.error(
    `\n커밋을 중단했습니다. 키는 .env.local(깃 제외)에 두고 코드에는 process.env로 참조하세요.`
  );
  console.error(`오탐이면: git commit --no-verify\n`);
  process.exit(1);
}

console.log("✓ 스테이징된 변경분에서 키가 발견되지 않았습니다");
