import { useState } from "react";
import { useEffect } from "react";
import ProgressBar from "./ProgressBar";

/**
 * QuestionCard
 *
 * Props:
 *   question        — string
 *   currentIndex    — 0-based
 *   totalQuestions  — number
 *   numSeconds      — timer duration
 *   onTimeUp        — called when timer expires
 *   timerPaused     — freeze the bar (during reveal phase)
 */
export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  numSeconds,
  onTimeUp,
  timerPaused = false,
}) {
  const [timeLeft, setTimeLeft] = useState(numSeconds)

  // reset when question changes
  useEffect(() => {
    setTimeLeft(numSeconds);
  }, [currentIndex, numSeconds]);

  // countdown logic
  useEffect(() => {
    if (timerPaused) return;

    if (timeLeft === 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, timerPaused, onTimeUp]);

  return (
    <div className="animate-slide-up border-2 border-yale-blue bg-ivory p-6 flex flex-col gap-4">
      {/* counter + timer label */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-yale-blue/50 tracking-widest uppercase">
          question {currentIndex + 1} / {totalQuestions}
        </span>

        {/* <span className="font-mono text-xs text-yale-blue/50 tracking-widest uppercase">
          {numSeconds}s
        </span> */}
        <span className="font-mono text-xs text-yale-blue/50 tracking-widest uppercase">
          {timeLeft}s
        </span>
      </div>

      {/* the question itself */}
      <p className="font-roboto-mono text-2xl md:text-3xl text-yale-blue leading-snug lowercase first-letter:uppercase">
        {question}
      </p>

      {/* progress bar — key forces remount on each new question */}
      <ProgressBar
        key={currentIndex}
        durationSeconds={numSeconds}
        onComplete={onTimeUp}
        paused={timerPaused}
      />
    </div>
  );
}