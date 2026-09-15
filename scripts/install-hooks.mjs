#!/usr/bin/env node
/**
 * npm install 시 자동 실행되어 git pre-commit 훅을 설치한다.
 * 팀원이 클론 후 npm install만 하면 키 유출 방지 훅이 함께 걸리도록 하는 목적.
 */
import { writeFileSync, mkdirSync, existsSync, chmodSync } from "node:fs";
import { join } from "node:path";

const hookDir = join(process.cwd(), ".git", "hooks");

// CI나 .git이 없는 환경(예: Vercel 빌드)에서는 조용히 건너뛴다
if (!existsSync(join(process.cwd(), ".git"))) {
  process.exit(0);
}

const hookPath = join(hookDir, "pre-commit");
const hook = `#!/bin/sh
# 자동 생성됨 (scripts/install-hooks.mjs)
node scripts/check-secrets.mjs || exit 1
`;

try {
  mkdirSync(hookDir, { recursive: true });
  writeFileSync(hookPath, hook, "utf8");
  try {
    chmodSync(hookPath, 0o755);
  } catch {
    // Windows에서는 실행 권한 개념이 없어 무시
  }
  console.log("✓ git pre-commit 훅 설치 완료 (커밋 전 키 유출 검사)");
} catch (e) {
  console.warn("git 훅 설치를 건너뜁니다:", e.message);
}
