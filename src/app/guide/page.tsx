"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DISTRICT_EMOJI } from "@/lib/constants";
import { SAMPLE_PLACES } from "@/lib/sampleData";
import { Place } from "@/types";
import { SendIcon, SparkleIcon } from "@/components/icons";
import PageAtmosphere from "@/components/PageAtmosphere";
import { useT } from "@/lib/i18n/useT";
import { localizeDistrictName, localizePlace } from "@/lib/i18n/places";
import { useFavoriteStore } from "@/store/useFavoriteStore";

interface GuideMessage {
  role: "user" | "assistant";
  content: string;
  /** 저장 용량을 줄이려 장소는 id만 담고, 그릴 때 데이터에서 찾아 쓴다 */
  placeIds?: string[];
}

// 탭을 옮겼다 돌아오거나 새로고침해도 대화가 남아있게 세션에 보관한다.
// 방문 기록이라기보다 진행 중인 대화라서 sessionStorage가 적절하다.
const HISTORY_KEY = "wongok-guide-history";
const MAX_HISTORY = 40;

function loadHistory(): GuideMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is GuideMessage =>
        typeof m === "object" &&
        m !== null &&
        typeof (m as GuideMessage).content === "string"
    );
  } catch {
    return [];
  }
}

export default function GuidePage() {
  const { t, lang } = useT();
  const router = useRouter();
  const addFavorite = useFavoriteStore((s) => s.add);
  const [messages, setMessages] = useState<GuideMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 언마운트 시 진행 중인 요청 응답을 상태에 반영하지 않도록
  const cancelledRef = useRef(false);
  useEffect(() => {
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  // 저장된 대화 복원.
  // sessionStorage는 서버에서 읽을 수 없어 useState 초기값으로 넣으면 서버가
  // 그린 빈 화면과 클라이언트가 그린 대화 화면이 어긋나 하이드레이션이 깨진다.
  // 그래서 마운트 후 한 번 읽어 채우는 방식이 맞고, 이 경우에 한해 규칙을 끈다.
  useEffect(() => {
    const saved = loadHistory();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved.length) setMessages(saved);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (messages.length === 0) {
        sessionStorage.removeItem(HISTORY_KEY);
      } else {
        sessionStorage.setItem(
          HISTORY_KEY,
          JSON.stringify(messages.slice(-MAX_HISTORY))
        );
      }
    } catch {
      // 용량 초과 등으로 저장이 안 돼도 대화 자체는 계속 쓸 수 있게 무시한다
    }
  }, [messages]);

  const findPlaces = (ids?: string[]): Place[] =>
    (ids ?? [])
      .map((id) => SAMPLE_PLACES.find((p) => p.id === id))
      .filter((p): p is Place => Boolean(p));

  // 새 말풍선이 생기면 항상 마지막이 보이도록
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, thinking]);

  async function ask(question: string) {
    if (thinking) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, lang }),
      });

      if (cancelledRef.current) return;

      if (res.status === 503) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "AI 가이드가 아직 준비 중이에요. OPENAI_API_KEY가 설정되면 실제 답변을 드릴 수 있어요.",
          },
        ]);
        return;
      }

      if (!res.ok) throw new Error("응답 실패");

      const data: { reply: string; placeIds: string[] } = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, placeIds: data.placeIds },
      ]);
    } catch {
      if (cancelledRef.current) return;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "답변을 가져오지 못했어요. 잠시 후 다시 시도해주세요.",
        },
      ]);
    } finally {
      if (!cancelledRef.current) setThinking(false);
    }
  }

  return (
    <div className="page-shell min-h-[calc(100dvh-9rem)] w-full md:min-h-[calc(100dvh-4rem)]">
      <PageAtmosphere variant="guide" />
      <div className="mx-auto flex min-h-[calc(100dvh-9rem)] w-full max-w-2xl flex-col p-4 pt-5 md:min-h-[calc(100dvh-4rem)] md:max-w-3xl md:px-8 md:pt-10 md:pb-16">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <div className="guide-spark-orbit fade-up">
            <span className="guide-spark-core">
              <SparkleIcon className="h-8 w-8" />
            </span>
            <i />
            <i />
          </div>
          <div className="fade-up text-center" style={{ animationDelay: "80ms" }}>
            <p className="page-kicker justify-center">
              <span className="page-kicker-dot" />
              AI LOCAL GUIDE
            </p>
            <h1 className="text-xl font-bold">{t.guide.title}</h1>
            <p className="mt-1 text-xs text-navy/45">{t.guide.subtitle}</p>
          </div>
          <div className="flex max-w-sm flex-wrap justify-center gap-2">
            {t.guide.quickQuestions.map((q, i) => (
              <button
                key={q}
                onClick={() => ask(q)}
                disabled={thinking}
                style={{ animationDelay: `${160 + i * 60}ms` }}
                className="guide-quick-chip interactive-panel fade-up rounded-full border border-navy/10 bg-white/85 px-3.5 py-2 text-xs font-medium text-navy/70 shadow-sm backdrop-blur transition duration-150 hover:border-orange hover:text-orange active:scale-95 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
          {/* 이어지는 대화라는 걸 알려주고, 처음부터 다시 시작할 방법을 준다 */}
          <div className="sticky top-0 z-10 -mx-1 flex items-center justify-between gap-2 bg-background/85 px-1 py-1.5 backdrop-blur">
            <p className="text-[11px] text-navy/40">{t.guide.continuing}</p>
            <button
              onClick={() => setMessages([])}
              className="shrink-0 rounded-full border border-navy/10 bg-white px-3 py-1 text-[11px] text-navy/55 transition-colors hover:border-orange hover:text-orange"
            >
              {t.guide.newChat}
            </button>
          </div>
          {messages.map((m, i) =>
            m.role === "user" ? (
              <p
                key={i}
                className="fade-up max-w-[80%] self-end rounded-2xl rounded-br-md bg-orange px-4 py-2.5 text-sm text-white"
              >
                {m.content}
              </p>
            ) : (
              <div
                key={i}
                className="fade-up flex max-w-[90%] flex-col gap-2 self-start"
              >
                <p className="rounded-2xl rounded-bl-md border border-navy/5 bg-white px-4 py-2.5 text-sm shadow-sm">
                  {m.content}
                </p>
                {findPlaces(m.placeIds).map((p) => {
                  const pLoc = localizePlace(p, lang);
                  return (
                    <div
                      key={p.id}
                      className="interactive-panel flex w-72 gap-3 rounded-2xl border border-navy/5 bg-white/90 p-3 shadow-sm backdrop-blur hover:shadow-md"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-soft text-xl">
                        {DISTRICT_EMOJI[p.district]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-semibold">
                            {pLoc.name}
                            {pLoc.signName && (
                              <span lang="ko" className="ml-1 text-[11px] font-normal text-navy/40">
                                {pLoc.signName}
                              </span>
                            )}
                          </p>
                          <span className="shrink-0 rounded bg-navy px-1.5 py-0.5 text-[9px] font-medium text-white">
                            {localizeDistrictName(p.district, lang)}
                          </span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-navy/50">
                          {pLoc.description}
                        </p>
                        <div className="mt-1.5 flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              addFavorite(p.id);
                              router.push("/map");
                            }}
                            className="rounded-full bg-orange px-2.5 py-1 text-[10px] font-medium text-white transition duration-150 hover:bg-orange/90 active:scale-95"
                          >
                            {t.guide.addToCourse}
                          </button>
                          <Link
                            href={`/place/${p.id}`}
                            className="rounded-full border border-navy/15 px-2.5 py-1 text-[10px] text-navy/60 transition duration-150 hover:border-orange hover:text-orange active:scale-95"
                          >
                            {t.guide.viewDetail}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {thinking && (
            <div
              className="fade-up flex items-center gap-1.5 self-start rounded-2xl rounded-bl-md border border-navy/5 bg-white px-4 py-3 shadow-sm"
              role="status"
              aria-label={t.guide.inputThinking}
            >
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="typing-dot h-1.5 w-1.5 rounded-full bg-navy/40"
                  style={{ animationDelay: `${d * 0.16}s` }}
                />
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) ask(input.trim());
        }}
        className="guide-composer interactive-panel fade-up mt-4 flex items-center gap-2 rounded-full border border-navy/10 bg-white/90 p-1.5 pl-4 shadow-sm backdrop-blur transition duration-200 focus-within:border-orange focus-within:shadow-md focus-within:ring-4 focus-within:ring-orange/10"
        style={{ animationDelay: "360ms" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={thinking ? t.guide.inputThinking : t.guide.inputPlaceholder}
          disabled={thinking}
          maxLength={300}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-navy/30"
        />
        <button
          type="submit"
          aria-label={t.guide.send}
          disabled={thinking || !input.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange text-white transition duration-150 active:scale-90 disabled:opacity-40"
        >
          <SendIcon className="h-4 w-4" />
        </button>
      </form>
      </div>
    </div>
  );
}
