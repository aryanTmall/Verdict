"use client";

import { useEffect, useState } from "react";

interface NumberReelProps {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
  formatInr?: boolean;
}

export function NumberReel({
  value,
  prefix = "",
  suffix = "",
  durationMs = 400,
  className = "",
  formatInr = false,
}: NumberReelProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const startValue = displayValue;
    const diff = value - startValue;
    if (diff === 0) return;

    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startValue + diff * ease);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    const rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value, durationMs]);

  const formatted = formatInr
    ? displayValue.toLocaleString("en-IN")
    : displayValue.toString();

  return (
    <span className={`tabular-nums font-mono ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
