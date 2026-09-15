"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

// 현재 페이지 URL을 QR로 그려서, PC로 보던 화면을 폰으로 그대로 이어보게 해준다.
export default function PageQrCode({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, window.location.href, {
      width: 128,
      margin: 1,
      color: { dark: "#1b2a4a", light: "#ffffff" },
    }).catch(() => {});
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
