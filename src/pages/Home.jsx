import { useNavigate } from "react-router";
import useQuiz from "@hooks/useQuiz";
import Button from "@components/ui/Button";
import { APP_NAME } from "@data/constants";


export default function Home() {
  const navigate = useNavigate();
  const {
    numQuestions,
    numSeconds,
    handleNumQuestionsChange,
    handleNumSecondsChange,
    start,
  } = useQuiz();

  const handleStart = () => {
    start();
    navigate("/quiz");
  };

  return (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-12">
    <div className="w-full max-w-md rounded-2xl border-2 border-yale-blue p-8 flex flex-col gap-6 font-roboto-mono">
      
      <div>
        <div className="flex justify-between text-sm text-yale-blue mb-2">
          <span>Questions</span>
          <span className="font-semibold">{numQuestions}</span>
        </div>
        <input
          type="range"
          min="3"
          max="15"
          value={numQuestions}
          onChange={(e) => handleNumQuestionsChange(e.target.value)}
          className="slider w-full"
        />
      </div>

      <div>
        <div className="flex justify-between text-sm text-yale-blue mb-2">
          <span>Time</span>
          <span className="font-semibold">{numSeconds}s</span>
        </div>
        <input
          type="range"
          min="10"
          max="120"
          value={numSeconds}
          onChange={(e) => handleNumSecondsChange(e.target.value)}
          className="slider w-full"
        />
      </div>

      <Button onClick={handleStart} className="mt-4 w-full font-roboto-mono">
        Commencer
      </Button>
    </div>
  </div>
  );
}