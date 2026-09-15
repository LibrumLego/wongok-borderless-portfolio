import type { NextConfig } from "next";

// 카카오맵 SDK와 관광공사 이미지 CDN을 허용하면서, 그 외 출처는 막는다.
// 'unsafe-inline'/'unsafe-eval'은 Next.js 런타임과 카카오맵 SDK가 요구해서 남긴다.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.kakao.com https://*.daumcdn.net",
  "style-src 'self' 'unsafe-inline'",
  // 관광공사 이미지(tong.visitkorea.or.kr)와 카카오 지도 타일, canvas용 blob/data
  "img-src 'self' data: blob: https://*.visitkorea.or.kr http://*.visitkorea.or.kr https://*.daumcdn.net https://*.kakaocdn.net https://*.kakao.com",
  "font-src 'self' data:",
  // OpenAI·관광공사 호출은 전부 서버(라우트 핸들러)에서 하므로 브라우저는 자기 자신과 카카오만
  "connect-src 'self' https://*.kakao.com https://*.daumcdn.net",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // 카카오맵 SDK가 2차 번들(t1.daumcdn.net)을 http로 요청하는 구간이 있어,
  // 허용 목록을 http로 넓히는 대신 브라우저가 https로 승격하도록 한다.
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // 클릭재킹 방지 (CSP frame-ancestors의 구형 브라우저 대응)
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 지도·스탬프에 필요한 위치만 자기 출처에 허용하고 나머지 민감 권한은 차단
  {
    key: "Permissions-Policy",
    value: "geolocation=(self), camera=(self), microphone=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
