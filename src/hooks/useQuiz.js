import { useState, useCallback } from "react";
import allQuestions from "@data/questions.json";

// Quiz status machine
// idle → playing → finished
// playing has a sub-status: answering | revealing

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

export default function useQuiz() {
  const [status, setStatus] = useState("idle"); // idle | answering | revealing | finished
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numQuestions, setNumQuestions] = useState(5);
  const [numSeconds, setNumSeconds] = useState(30);
  const [answers, setAnswers] = useState([]); // player's submitted answers for current q
  const [score, setScore] = useState(0);      // total correct answers this game

  // Derived
  const currentQuestion = questions[currentIndex] ?? null;
  const isLastQuestion = currentIndex === questions.length - 1;

  // ── start ──────────────────────────────────────────────────────────────────
  const start = useCallback(() => {
    const picked = pickRandom(allQuestions, numQuestions);
    setQuestions(picked);
    setCurrentIndex(0);
    setAnswers([]);
    setScore(0);
    setStatus("answering");
  }, [numQuestions]);

  // ── submitAnswers ──────────────────────────────────────────────────────────
  // Player submits their answers — move to revealing phase
  const submitAnswers = useCallback((playerAnswers) => {
    const trimmed = playerAnswers.map((a) => a.trim()).filter(Boolean);
    setAnswers(trimmed);
    setStatus("revealing");
  }, []);

  // ── skipToReveal ───────────────────────────────────────────────────────────
  // Timer ran out — reveal with whatever was typed (even empty)
  const skipToReveal = useCallback((playerAnswers) => {
    const trimmed = (playerAnswers || []).map((a) => a.trim()).filter(Boolean);
    setAnswers(trimmed);
    setStatus("revealing");
  }, []);

  // ── next ───────────────────────────────────────────────────────────────────
  // Move to next question or finish
  const next = useCallback(() => {
    if (isLastQuestion) {
      setStatus("finished");
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswers([]);
      setStatus("answering");
    }
  }, [isLastQuestion]);

  // ── restart ────────────────────────────────────────────────────────────────
  const restart = useCallback(() => {
    setStatus("idle");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setScore(0);
  }, []);

  // ── settings handlers ──────────────────────────────────────────────────────
  const handleNumQuestionsChange = useCallback((val) => {
    const n = Math.min(Math.max(parseInt(val) || 3, 3), allQuestions.length);
    setNumQuestions(n);
  }, []);

  const handleNumSecondsChange = useCallback((val) => {
    const s = Math.min(Math.max(parseInt(val) || 10, 10), 120);
    setNumSeconds(s);
  }, []);

  return {
    // state
    status,
    questions,
    currentIndex,
    currentQuestion,
    numQuestions,
    numSeconds,
    answers,
    score,
    isLastQuestion,
    totalQuestions: questions.length,
    // actions
    start,
    submitAnswers,
    skipToReveal,
    next,
    restart,
    // settings
    handleNumQuestionsChange,
    handleNumSecondsChange,
  };
}