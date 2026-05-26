"use client";

import { useEffect, useRef, useState } from "react";

const TARGET_VOLUME = 0.35;
const FADE_STEP_MS = 40;
const FADE_DURATION_MS = 1400;

type Props = {
  src: string;
};

/**
 * Floating ambient music player. Music is ON by default — we attempt to start
 * playback as soon as the audio element is mounted. If the browser blocks
 * autoplay (Safari iOS does this without a prior gesture), we listen for the
 * first user interaction anywhere on the page and start there. The floating
 * button is purely a manual override so the listener can pause or re-start.
 */
export function MusicToggle({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  // Once the user manually toggles, we stop attempting to auto-start so we
  // never re-play right after they paused.
  const userOverrodeRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  const clearFade = () => {
    if (fadeIntervalRef.current !== null) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const fadeTo = (
    audio: HTMLAudioElement,
    target: number,
    onDone?: () => void,
  ) => {
    clearFade();
    const steps = Math.max(1, Math.round(FADE_DURATION_MS / FADE_STEP_MS));
    const start = audio.volume;
    const delta = (target - start) / steps;
    let i = 0;
    fadeIntervalRef.current = window.setInterval(() => {
      i += 1;
      const next = i >= steps ? target : start + delta * i;
      audio.volume = Math.min(1, Math.max(0, next));
      if (i >= steps) {
        clearFade();
        onDone?.();
      }
    }, FADE_STEP_MS);
  };

  // Auto-start on mount; fall back to first-user-gesture listener if the
  // browser blocks autoplay (Safari iOS, some Chrome configurations).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let cancelled = false;
    let removeGestureListeners: (() => void) | null = null;

    const startWithFadeIn = () => {
      if (cancelled || userOverrodeRef.current) return;
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          if (cancelled || userOverrodeRef.current) return;
          setPlaying(true);
          fadeTo(audio, TARGET_VOLUME);
        })
        .catch(() => {
          /* still blocked — let the gesture listener handle it */
        });
    };

    const attachGestureListeners = () => {
      const events = ["pointerdown", "touchstart", "keydown"] as const;
      const handler = () => {
        events.forEach((e) =>
          document.removeEventListener(e, handler, true),
        );
        removeGestureListeners = null;
        startWithFadeIn();
      };
      events.forEach((e) =>
        document.addEventListener(e, handler, { once: true, capture: true }),
      );
      removeGestureListeners = () => {
        events.forEach((e) =>
          document.removeEventListener(e, handler, true),
        );
      };
    };

    // First attempt: try to autoplay immediately.
    audio.volume = 0;
    audio
      .play()
      .then(() => {
        if (cancelled || userOverrodeRef.current) return;
        setPlaying(true);
        fadeTo(audio, TARGET_VOLUME);
      })
      .catch(() => {
        // Autoplay blocked. Wait for the first user gesture to retry.
        if (!cancelled && !userOverrodeRef.current) {
          attachGestureListeners();
        }
      });

    return () => {
      cancelled = true;
      removeGestureListeners?.();
      clearFade();
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    userOverrodeRef.current = true;

    if (playing) {
      fadeTo(audio, 0, () => audio.pause());
      setPlaying(false);
      return;
    }

    audio.volume = 0;
    try {
      await audio.play();
      setPlaying(true);
      fadeTo(audio, TARGET_VOLUME);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Reproducir música"}
        aria-pressed={playing}
        className={`fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 flex h-11 w-11 items-center justify-center rounded-full border border-forest/15 bg-paper/85 text-forest shadow-[0_8px_20px_-12px_rgba(47,74,56,0.35)] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-paper active:scale-95 ${
          playing ? "ring-1 ring-champagne-deep/40" : ""
        }`}
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {playing ? <PlayingIcon /> : <PausedIcon />}
      </button>
    </>
  );
}

function PlayingIcon() {
  // Three little vertical bars that gently pulse, evoking an equalizer.
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect
        className="music-bar music-bar-1"
        x="3"
        y="6"
        width="2.2"
        height="6"
        rx="1.1"
        fill="currentColor"
      />
      <rect
        className="music-bar music-bar-2"
        x="7.9"
        y="3"
        width="2.2"
        height="12"
        rx="1.1"
        fill="currentColor"
      />
      <rect
        className="music-bar music-bar-3"
        x="12.8"
        y="5"
        width="2.2"
        height="8"
        rx="1.1"
        fill="currentColor"
      />
    </svg>
  );
}

function PausedIcon() {
  // A simple eighth note — invites the user to re-start the music.
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M13.5 3.2v7.5a2.6 2.6 0 1 1-1.3-2.25V4.7L7.4 6v6.2a2.6 2.6 0 1 1-1.3-2.25V5.05l7.4-1.85Z"
        fill="currentColor"
      />
    </svg>
  );
}
