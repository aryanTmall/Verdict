"use client";

import { useEffect, useState } from "react";

const TARGET = "Before you buy, cross-examine it.";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export function LetterReelHeadline() {
  const [displayText, setDisplayText] = useState(TARGET);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayText(TARGET);
      setIsResolved(true);
      return;
    }

    let frame = 0;
    const totalFrames = 30; // ~600ms total animation (<= 1.4s)
    const interval = setInterval(() => {
      frame++;
      const current = TARGET.split("")
        .map((char, index) => {
          if (char === " " || char === "," || char === ".") return char;
          const resolveThreshold = (index / TARGET.length) * totalFrames;
          if (frame >= resolveThreshold + 8) {
            return char;
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplayText(current);

      if (frame >= totalFrames + 8) {
        clearInterval(interval);
        setDisplayText(TARGET);
        setIsResolved(true);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1B1A17] font-display leading-[1.08] max-w-4xl">
      {displayText}
      {!isResolved && <span className="inline-block w-3 h-8 bg-[#2540D9] ml-1 animate-pulse" />}
    </h1>
  );
}
