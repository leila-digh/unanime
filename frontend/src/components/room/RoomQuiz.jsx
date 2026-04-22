import { socket } from "@lib/socket";
import Button from "@components/ui/Button";
import QuestionCard from "@components/quiz/QuestionCard";
import AnswerPanel from "@components/room/AnswerPanel";

// RoomQuiz is the multiplayer equivalent of the solo Quiz page.
// The difference: instead of calling local hook functions,
// everything emits a socket event to the server.
// The server updates state and broadcasts back — useRoom picks it up.

export default function RoomQuiz({ quiz, roomId, amHost, amActiveTurn, activePlayerId, players, mySocketId }) {

  if (!quiz) return null;

  // ── Lobby (waiting to start) ───────────────────────────────────────────────

  if (quiz.status === "lobby") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
        <h2 className="font-display text-3xl text-yale-blue">En attente…</h2>
        <p className="font-roboto-mono text-sm text-yale-blue/50">
          {players.length} joueur{players.length !== 1 ? "s" : ""} dans la salle
        </p>

        {amHost ? (
          // Only the host sees the start button
          <Button onClick={() => socket.emit("quiz:start", { roomId, numQuestions: 5, numSeconds: 30 })}>
            Lancer la partie →
          </Button>
        ) : (
          <p className="font-roboto-mono text-xs text-yale-blue/40 italic">
            En attente que l'hôte lance la partie…
          </p>
        )}
      </div>
    );
  }

  // ── Finished ───────────────────────────────────────────────────────────────

  if (quiz.status === "finished") {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <h2 className="font-display text-4xl text-spicy-orange">Résultats</h2>
        <ul className="w-full max-w-xs flex flex-col gap-2">
          {sorted.map((p, i) => (
            <li key={p.socketId} className="flex items-center gap-3 px-4 py-2 border border-yale-blue/15 rounded-lg">
              <span className="font-roboto-mono text-yale-blue/40 w-4">{i + 1}</span>
              <span className="text-lg">{p.avatar}</span>
              <span className="flex-1 font-roboto-mono text-sm text-yale-blue">
                {p.username}{p.socketId === mySocketId ? " 👈" : ""}
              </span>
              <span className="font-roboto-mono font-bold text-yale-blue">{p.score}pt</span>
            </li>
          ))}
        </ul>
        {amHost && (
          <Button variant="secondary" onClick={() => socket.emit("quiz:restart", { roomId })}>
            Rejouer
          </Button>
        )}
      </div>
    );
  }

  // ── Question / Revealing ───────────────────────────────────────────────────

  const activeName = players.find((p) => p.socketId === activePlayerId)?.username ?? "…";

  return (
    <div className="flex flex-col gap-6">
      <QuestionCard
        question={quiz.currentQuestion?.question}
        currentIndex={quiz.currentIndex}
        totalQuestions={quiz.numQuestions}
        numSeconds={quiz.numSeconds}
        // Timer pauses during revealing phase
        timerPaused={quiz.status === "revealing"}
        // When time's up, auto-submit empty answers if it's your turn
        onTimeUp={() => {
          if (amActiveTurn && quiz.status === "answering") {
            socket.emit("answers:submit", { roomId, answers: [] });
          }
        }}
      />

      <AnswerPanel
        roomId={roomId}
        amActiveTurn={amActiveTurn}
        quiz={quiz}
        players={players}
        mySocketId={mySocketId}
      />

      {/* Next button — only active player, only during revealing */}
      {quiz.status === "revealing" && amActiveTurn && !quiz.turn?.answersSubmitted && (
        <div className="flex justify-end mt-2">
          <Button onClick={() => socket.emit("quiz:next", { roomId })}>
            Question suivante →
          </Button>
        </div>
      )}
    </div>
  );
}