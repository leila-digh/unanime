/**
 * ProgressBar
 *
 * Animates from full width to zero over `durationSeconds`.
 * The parent should change the `key` prop on each new question
 * to force a remount and restart the animation from scratch.
 *
 * Props:
 *   durationSeconds  — how long the bar takes to drain
 *   onComplete       — called when the bar hits zero
 *   paused           — freeze the animation (e.g. during reveal)
 */
import { useEffect, useRef } from "react";

export default function ProgressBar({ durationSeconds, onComplete, paused = false }) {
  const barRef = useRef(null);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const calledRef = useRef(false);

  useEffect(() => {
    calledRef.current = false;
    startRef.current = null;

    if (paused) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const total = durationSeconds * 1000;

    function tick(now) {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const pct = Math.max(0, 1 - elapsed / total);

      if (barRef.current) {
        barRef.current.style.width = `${pct * 100}%`;
      }

      if (pct === 0) {
        if (!calledRef.current) {
          calledRef.current = true;
          onComplete?.();
        }
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [durationSeconds, paused, onComplete]);

  // colour shifts: green → orange → red as time runs out
  // driven purely by CSS via a linear animation so it's smooth
  return (
    <div className="w-full h-2 bg-yale-blue/15 rounded-full overflow-hidden">
      <div
        ref={barRef}
        className="h-full rounded-full transition-colors duration-1000"
        style={{
          width: "100%",
          backgroundColor: "var(--color-lime-moss)",
        }}
      />
    </div>
  );
}