import useQuiz from "@hooks/useQuiz";

import QuestionCard from "@components/quiz/QuestionCard";
import AnswerInput from "@components/quiz/AnswerInput";
import ResultsScreen from "@components/quiz/ResultsScreen";
import Button from "@components/ui/Button";

export default function Quiz() {
  const {
    status,
    currentQuestion,
    currentIndex,
    totalQuestions,
    numSeconds,
    answers,
    start,
    submitAnswers,
    skipToReveal,
    next,
    restart,
    questions,
  } = useQuiz();

  if (status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20">
        <p className="font-mono text-yale-blue animate-bounce">prêt ?</p>
        <Button onClick={start} variant="primary">démarrer</Button>
      </div>
    );
  }

  if (status === "finished") {
    return (
      <ResultsScreen
        questions={questions} // you should actually pass from hook if you care about recap accuracy
        onRestart={restart}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto py-10 px-4 w-full">
      <QuestionCard
        question={currentQuestion?.question}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        numSeconds={numSeconds}
        onTimeUp={() => skipToReveal([])}
        timerPaused={status !== "answering"}
      />

      {status === "answering" && (
        <AnswerInput
          currentIndex={currentIndex}
          onSubmit={submitAnswers}
        />
      )}

      {status === "revealing" && (
        <div className="flex flex-col gap-4">
          <div className="border border-yale-blue/20 p-4">
            <p className="font-mono text-xs text-yale-blue/50 uppercase mb-2">
              tes réponses
            </p>
            {answers.length ? (
              answers.map((a, i) => (
                <p key={i} className="text-yale-blue">
                  {a}
                </p>
              ))
            ) : (
              <p className="text-yale-blue/40 italic">aucune réponse</p>
            )}
          </div>

          <Button onClick={next}>
            suivant →
          </Button>
        </div>
      )}
    </div>
  );
}