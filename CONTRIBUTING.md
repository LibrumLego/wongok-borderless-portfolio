# 개발 환경 세팅 가이드

팀원용 문서입니다. 처음부터 순서대로 따라 하면 로컬에서 서비스를 띄울 수 있습니다.

---

## 1. 클론 & 설치

```bash
git clone https://github.com/LibrumLego/wongok-borderless-portfolio.git
cd wongok-borderless-portfolio
npm install
```

Node.js는 20 이상 권장 (개발 환경 기준 v24).

## 2. 환경 변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local`을 열어 키 3개를 채웁니다. **실제 키 값은 팀 채팅으로 공유**받으세요 (git에 올라가지 않습니다).

| 변수 | 필수 | 없으면 |
|---|---|---|
| `NEXT_PUBLIC_KAKAO_MAP_KEY` | ✅ | 지도 자리에 "연동 대기 중" 안내만 표시 |
| `TOUR_API_KEY` | ✅ | 홈의 안산 관광지 섹션이 안내 문구로 대체 |
| `OPENAI_API_KEY` | ⬜ | AI 가이드가 "준비 중" 응답만 반환 |

> 키가 없어도 앱은 정상 실행됩니다. 각 기능이 안내 문구로 대체될 뿐이라, 다른 부분 작업은 문제없이 가능합니다.

## 3. 실행

```bash
npm run dev
```

http://localhost:3000

### ⚠️ 알려진 이슈 — `/map`이 빈 화면으로 보일 때

개발 서버(`npm run dev`)에서 **지도 페이지만 간헐적으로 빈 화면**이 됩니다. React 스트리밍이 마무리되지 않아 생기는 현상으로, **코드 문제가 아니고 프로덕션에서는 정상**입니다.

지도 페이지를 확인해야 할 때는 프로덕션 빌드로 띄우세요:

```bash
npm run build
npm start
```

## 4. 배포

GitHub 저장소는 Vercel 프로젝트에 연결되어 있습니다.

- `master` 브랜치 push와 pull request에서는 GitHub Actions가 자동으로 품질 검사를 실행합니다.
- Vercel Hobby 플랜은 Git 커밋 작성자가 Vercel 프로젝트 소유자일 때만 자동 배포합니다. 작성자가 다르면 Git 자동 배포가 차단될 수 있습니다. 프로젝트 소유자는 아래 명령으로 직접 프로덕션 배포할 수 있습니다.

```bash
npx vercel --prod --yes
```

- `.git` 폴더를 옮기거나 숨길 필요가 없습니다. Vercel CLI 로그인 계정이 프로젝트 소유자여야 합니다. CLI 배포도 `BLOCKED`로 끝나면 로컬 우회 명령을 반복하지 말고 Vercel 대시보드 알림·이메일·계정 상태를 먼저 확인하세요.
- Vercel 환경 변수는 대시보드에 등록되어 있으며, 배포 환경에 맞춰 자동 적용됩니다.
- Vercel의 빌드 명령은 `npm run verify`입니다. 린트·타입 검사·프로덕션 빌드 중 하나라도 실패하면 배포가 완료되지 않습니다.

## 5. 커밋 전 체크

```bash
npm run check:secrets
npm run verify
```

`npm run verify`는 린트, 타입 검사, 프로덕션 빌드를 순서대로 실행합니다. [GitHub Actions 검증 워크플로](.github/workflows/verify.yml)는 모든 push와 pull request에서 `npm ci` 후 같은 검증을 실행합니다. 병합 자체를 막으려면 GitHub 저장소 설정에서 이 워크플로의 상태 검사를 `master` 브랜치의 필수 검사로 지정하세요.

---

## 프로젝트 구조

```
src/
  app/
    page.tsx              홈 (히어로/구역/코스/영업중/관광공사 API)
    map/                  지도·검색 (카카오맵 + 2단 필터)
    guide/                 AI 챗봇 가이드
    course/                 추천 코스 3종
    stamp/                   스탬프 여권 + 단계별 배지
    place/[id]/               장소 상세 (문화 스토리·GPS 인증·퀴즈·인증샷)
    api/tour/                  관광공사 OpenAPI 프록시 (서버 전용, 키 보호)
    api/chat/                   OpenAI 챗봇 프록시 (서버 전용, 키 보호)
  components/               공용 UI (지도, 카드, 아이콘, QR, 포토프레임 등)
  lib/
    constants.ts            구역·카테고리·코스·스탬프·배지 정의
    sampleData.ts           원곡동 장소 데이터 (실제 상호 기반) + 문화 퀴즈
    tourApi.ts              관광공사 API 클라이언트
  store/                     zustand 스탬프 상태 (localStorage 영속)
  types/                      공용 타입
```

### 데이터 수정은 어디서?

- **장소 추가·수정**: `src/lib/sampleData.ts`
- **코스·스탬프·배지 문구**: `src/lib/constants.ts`
- 좌표·영업시간은 현재 근사값이라 **현장 확인 후 보정 필요**합니다.

---

## 보안 — 작업 시 지켜야 할 것

**절대 하지 말 것**
- API 키를 코드에 직접 쓰거나 `NEXT_PUBLIC_` 접두어를 붙이지 마세요. `NEXT_PUBLIC_`은 **브라우저에 그대로 노출**됩니다. 카카오 JS 키만 예외인데, 이건 도메인 제한으로 보호되는 키라 노출이 전제된 방식입니다.
- 관광공사·OpenAI 키는 **서버 라우트(`src/app/api/`)에서만** 사용하세요. 클라이언트에서 직접 외부 API를 부르면 키가 새어나갑니다.
- 사용자 입력을 `dangerouslySetInnerHTML`에 넣지 마세요. React는 기본적으로 이스케이프하니 그냥 쓰면 안전합니다.

**적용돼 있는 보호 장치**
| 항목 | 내용 |
|---|---|
| 레이트 리밋 | `/api/chat`은 IP당 분당 6회와 10분당 전체 120회, `/api/tour`는 IP당 분당 30회. 초과 시 429 |
| 응답 캐시 | 관광공사 호출은 30분 캐시(`revalidate: 1800`)라, 같은 요청이 몰려도 외부 API는 30분에 한 번만 호출됨 → 일일 할당량 보호의 핵심 |
| 입력 검증 | 챗봇은 같은 출처 JSON·4KB 요청·300자 메시지만 허용하고 OpenAI 호출은 12초 후 취소. 검색어 40자 제한, `op`·`contentTypeId` 화이트리스트, 날짜 형식 검사 |
| 에러 처리 | 내부 에러 원문은 서버 로그에만, 클라이언트에는 일반 문구만 |
| 보안 헤더 | CSP, X-Frame-Options, HSTS, Permissions-Policy 등 (`next.config.ts`) |
| 프롬프트 방어 | 챗봇 역할 고정, 프롬프트 추출·역할 변경 시도 거부 |

**API 라우트를 새로 만들 때**는 `src/lib/rateLimit.ts`의 `checkRateLimit`을 꼭 붙이세요. 공개 엔드포인트라 인증이 없어서, 없으면 누구나 무한정 호출할 수 있습니다.

**분산 레이트 리밋 설정(운영 권장)**: Vercel 서버리스는 메모리를 공유하지 않습니다. Vercel Production 환경 변수에 아래 두 값을 함께 넣으면 기존 `rateLimit.ts`가 자동으로 Upstash Redis를 사용해 모든 인스턴스의 제한을 공유합니다. Redis를 설정한 뒤 연결이 실패하면 비용 발생 API는 60초간 차단됩니다.

```dotenv
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

- **관광공사 할당량**은 30분 응답 캐시와 분산 레이트 리밋을 함께 적용해 보호합니다.
- **OpenAI 비용**은 분산 레이트 리밋과 호출 시간 제한을 적용했더라도 월 사용 한도(Budget)·사용량 알림을 반드시 설정하세요. 이것이 최종 비용 안전장치입니다.

**CSP 관련 주의**: 외부 스크립트·이미지·API를 새로 추가하면 `next.config.ts`의 CSP에 해당 도메인을 등록해야 합니다. 안 하면 브라우저가 조용히 차단합니다 (콘솔에 CSP 위반으로 표시).

## 주의사항 (공모전 규정)

- 서비스 화면 안에 **"한국관광공사", "KTO" 단어·로고 사용 금지** (OT자료 명시)
- 관광공사 OpenAPI는 **실시간 호출 필수** — 응답을 DB에 저장해 쓰는 방식은 비권장
- 1차 심사 제출 마감: **2026년 9월 21일(월) 16:00**
