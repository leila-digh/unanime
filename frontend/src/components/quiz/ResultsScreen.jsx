import Button from "@components/ui/Button";

/**
 * ResultsScreen
 *
 * Shown when status === "finished".
 *
 * Props:
 *   questions    — the full array of questions played
 *   onRestart()  — go back to idle/home
 */
export default function ResultsScreen({ questions, onRestart }) {
  return (
    <div className="animate-pop-in flex flex-col gap-8 max-w-lg mx-auto py-12 px-4">
      <div className="text-center">
        <p className="font-mono text-xs tracking-widest text-yale-blue/40 uppercase mb-2">
          fin de partie
        </p>
        <h2 className="font-display text-5xl text-spicy-orange">Bravo !</h2>
      </div>

      {/* question recap */}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs tracking-widest text-yale-blue/40 uppercase">
          sujets de la partie
        </p>
        <ul className="flex flex-col gap-2">
          {questions.map((q, i) => (
            <li
              key={i}
              className="border border-yale-blue/20 px-4 py-3 font-noto-sans text-sm text-yale-blue/70"
            >
              <span className="font-mono text-yale-blue/30 mr-2">{i + 1}.</span>
              {q.question}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center">
        <Button onClick={onRestart} variant="secondary">
          Rejouer
        </Button>
      </div>
    </div>
  );
}