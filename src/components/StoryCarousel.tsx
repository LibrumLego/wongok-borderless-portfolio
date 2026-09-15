"use client";

import { useEffect, useRef, useState } from "react";

const AUTO_PLAY_DELAY = 4200;

export interface StoryCarouselItem {
  kicker: string;
  title: string;
  body: string;
  mark: string;
}

interface StoryCarouselProps {
  stories: StoryCarouselItem[];
  ariaLabel: string;
}

export default function StoryCarousel({
  stories,
  ariaLabel,
}: StoryCarouselProps) {
  const total = stories.length;
  const loopedStories = [stories[total - 1], ...stories, stories[0]];
  const [position, setPosition] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const animatingRef = useRef(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.hidden || animatingRef.current) return;

      animatingRef.current = true;
      setTransitionEnabled(true);
      setPosition((current) => current + 1);
    }, AUTO_PLAY_DELAY);

    return () => window.clearInterval(timer);
  }, []);

  if (total === 0) return null;

  const activeIndex = (position - 1 + total) % total;

  const move = (direction: -1 | 1) => {
    if (animatingRef.current) return;

    animatingRef.current = true;
    setTransitionEnabled(true);
    setPosition((current) => current + direction);
  };

  const finishTransition = () => {
    animatingRef.current = false;

    if (position !== 0 && position !== total + 1) return;

    setTransitionEnabled(false);
    setPosition(position === 0 ? total : 1);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransitionEnabled(true));
    });
  };

  return (
    <div className="wongok-story-carousel" aria-label={ariaLabel}>
      <div
        className="wongok-story-viewport"
        role="region"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
        onPointerDown={(event) => {
          if (!event.isPrimary) return;
          pointerStartRef.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const start = pointerStartRef.current;
          pointerStartRef.current = null;
          if (!start) return;

          const deltaX = event.clientX - start.x;
          const deltaY = event.clientY - start.y;
          if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) {
            return;
          }

          move(deltaX < 0 ? 1 : -1);
        }}
        onPointerCancel={() => {
          pointerStartRef.current = null;
        }}
      >
        <div
          className="wongok-story-track"
          style={{
            transform: `translate3d(-${position * 100}%, 0, 0)`,
            transition: transitionEnabled ? undefined : "none",
          }}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget) finishTransition();
          }}
        >
          {loopedStories.map((story, loopIndex) => (
            <article
              key={`${story.mark}-${loopIndex}`}
              className={`wongok-story-card wongok-story-card-${Number(story.mark)}`}
              aria-hidden={loopIndex !== position}
            >
              <div className="wongok-story-pattern" aria-hidden="true" />
              <span className="wongok-story-number" aria-hidden="true">
                {story.mark}
              </span>
              <div className="relative z-10">
                <p className="section-kicker">{story.kicker}</p>
                <h2 className="section-title max-w-xl break-keep">
                  {story.title}
                </h2>
                <p className="mt-3 max-w-2xl break-keep text-sm leading-7 text-navy/60 md:mt-4 md:text-base md:leading-8">
                  {story.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="wongok-story-controls">
        <button
          type="button"
          className="wongok-story-arrow"
          onClick={() => move(-1)}
          aria-label="이전 소개 카드"
        >
          <span aria-hidden="true">←</span>
        </button>
        <div className="wongok-story-dots" aria-label="소개 카드 선택">
          {stories.map((story, index) => (
            <button
              key={story.mark}
              type="button"
              className={`wongok-story-dot ${index === activeIndex ? "is-active" : ""}`}
              aria-label={`${index + 1}번 소개 카드`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => {
                if (animatingRef.current || index === activeIndex) return;
                animatingRef.current = true;
                setTransitionEnabled(true);
                setPosition(index + 1);
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className="wongok-story-arrow"
          onClick={() => move(1)}
          aria-label="다음 소개 카드"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
