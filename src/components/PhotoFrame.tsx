"use client";

import { useRef, useState } from "react";

// 포토존 인증샷. 카메라 라이브 프리뷰(getUserMedia) 대신 파일 input의 capture 속성을
// 써서 기기 기본 카메라를 그대로 띄운다 — 권한 처리가 단순하고 iOS/Android 모두 안정적이다.
// 찍은 사진 위에 canvas로 "원곡 보더리스" 프레임을 합성해 공유용 이미지를 만든다.
export default function PhotoFrame({ placeName }: { placeName: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);

    try {
      const bitmap = await createImageBitmap(file);
      // 정사각형으로 중앙 크롭 — SNS 공유에 가장 무난한 비율
      const size = Math.min(bitmap.width, bitmap.height);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(
        bitmap,
        (bitmap.width - size) / 2,
        (bitmap.height - size) / 2,
        size,
        size,
        0,
        0,
        size,
        size
      );

      // 하단 그라데이션 + 브랜드 라벨
      const barHeight = size * 0.18;
      const grad = ctx.createLinearGradient(0, size - barHeight * 1.6, 0, size);
      grad.addColorStop(0, "rgba(27,42,74,0)");
      grad.addColorStop(1, "rgba(27,42,74,0.92)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, size - barHeight * 1.6, size, barHeight * 1.6);

      ctx.fillStyle = "#c9a227";
      ctx.font = `600 ${size * 0.032}px sans-serif`;
      ctx.fillText("WONGOK BORDERLESS", size * 0.06, size - barHeight * 0.62);

      ctx.fillStyle = "#ffffff";
      ctx.font = `700 ${size * 0.055}px sans-serif`;
      ctx.fillText(placeName, size * 0.06, size - barHeight * 0.24);

      // 우측 하단 포인트 바
      ctx.fillStyle = "#e8630a";
      ctx.fillRect(size * 0.06, size - barHeight * 0.94, size * 0.08, size * 0.008);

      setResult(canvas.toDataURL("image/jpeg", 0.9));
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-navy/10 p-3">
      <p className="text-xs font-semibold text-navy">📸 인증샷 남기기</p>
      <p className="mt-1 text-[11px] leading-relaxed text-navy/50">
        사진을 찍으면 원곡 보더리스 프레임이 자동으로 합성돼요. SNS에 공유해보세요.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />

      {result && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={result}
          alt={`${placeName} 인증샷`}
          className="mt-3 w-full rounded-lg"
        />
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex-1 rounded-full border border-navy/15 py-2.5 text-xs font-medium text-navy transition duration-150 hover:border-orange hover:text-orange active:scale-[0.98] disabled:opacity-50"
        >
          {busy ? "합성 중..." : result ? "다시 찍기" : "카메라로 촬영"}
        </button>
        {result && (
          <a
            href={result}
            download={`wongok-${placeName}.jpg`}
            className="flex-1 rounded-full bg-navy py-2.5 text-center text-xs font-medium text-white transition duration-150 active:scale-[0.98]"
          >
            저장하기
          </a>
        )}
      </div>
    </div>
  );
}
