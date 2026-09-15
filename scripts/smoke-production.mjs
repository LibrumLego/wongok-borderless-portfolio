import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

/**
 * 배포된 서비스의 핵심 진입점과 공공관광 데이터 프록시를 빠르게 확인한다.
 *
 * 기본 대상은 Production URL이며, 스테이징·로컬 검증이 필요하면
 * SMOKE_BASE_URL=http://localhost:3000 npm run smoke:production 처럼 바꿀 수 있다.
 * AI 호출은 비용이 발생하므로 SMOKE_CHAT=1일 때만 별도로 점검한다.
 */
const baseUrl = new URL(
  process.env.SMOKE_BASE_URL ?? "https://wongok-borderless.vercel.app"
);

const pages = ["/", "/map", "/guide", "/course", "/stamp"];
const blockedUiLabels = [/한국관광공사/i, /korea tourism organization/i, /\bKTO\b/i, /TourAPI/i];
const results = [];

function urlFor(path) {
  return new URL(path, baseUrl).toString();
}

async function get(path) {
  const response = await fetch(urlFor(path), {
    redirect: "error",
    headers: { "user-agent": "wongok-borderless-production-smoke/1.0" },
  });
  assert.equal(response.status, 200, `${path} returned HTTP ${response.status}`);
  return response;
}

async function checkPage(path) {
  const response = await get(path);
  const html = await response.text();
  assert.match(html, /원곡 보더리스|Wongok Borderless/, `${path} has no application title`);
  for (const label of blockedUiLabels) {
    assert.doesNotMatch(html, label, `${path} exposes a prohibited provider label`);
  }
  results.push(`OK ${path}`);
}

for (const path of pages) await checkPage(path);

// 목록은 고쳤는데 특정 장소 상세 라우트만 깨지는 회귀를 막는다. TypeScript를
// 런타임에 불러들이지 않고, 등록 장소의 id 선언만 읽어 프로덕션 URL을 전수 점검한다.
const sampleData = await readFile(new URL("../src/lib/sampleData.ts", import.meta.url), "utf8");
const placeIds = [...sampleData.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]);
assert.ok(placeIds.length > 0, "No place ids found in sampleData.ts");

const PLACE_CONCURRENCY = 8;
for (let index = 0; index < placeIds.length; index += PLACE_CONCURRENCY) {
  await Promise.all(
    placeIds
      .slice(index, index + PLACE_CONCURRENCY)
      .map((id) => checkPage(`/place/${encodeURIComponent(id)}`))
  );
}
results.push(`OK /place/[id] (${placeIds.length} places)`);

const tour = await get("/api/tour?op=nearby&radius=3000");
const tourData = await tour.json();
assert.ok(Array.isArray(tourData.items), "Tour endpoint response has no items array");
assert.ok(tourData.items.length > 0, "Tour endpoint returned no nearby items");
results.push(`OK /api/tour nearby (${tourData.items.length} items)`);

if (process.env.SMOKE_CHAT === "1") {
  const response = await fetch(urlFor("/api/chat"), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: baseUrl.origin,
      "user-agent": "wongok-borderless-production-smoke/1.0",
    },
    body: JSON.stringify({ message: "Any halal places?", lang: "en" }),
  });
  assert.equal(response.status, 200, `AI endpoint returned HTTP ${response.status}`);
  const chat = await response.json();
  assert.equal(typeof chat.reply, "string", "AI endpoint returned no reply");
  assert.ok(Array.isArray(chat.placeIds), "AI endpoint returned no placeIds");
  results.push(`OK /api/chat (${chat.placeIds.length} recommendations)`);
}

console.log(`Production smoke passed for ${baseUrl.origin}`);
for (const result of results) console.log(result);
