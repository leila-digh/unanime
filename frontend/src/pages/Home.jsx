import { useNavigate } from "react-router";
import useQuiz from "@hooks/useQuiz";
import useRoom from "@hooks/useRoom";
import Button from "@components/ui/Button";
import UsernameInput from "@components/setup/UsernameInput";
import AvatarPicker from "@components/setup/AvatarPicker";
import { usePlayer } from "@context/PlayerContext";
import { socket } from "@lib/socket";

export default function Home() {
  const navigate = useNavigate();
  const { username, avatar, isReady } = usePlayer();

  // Solo quiz (unchanged from Phase 1 & 2)
  const { numQuestions, numSeconds, handleNumQuestionsChange, handleNumSecondsChange, start } =
    useQuiz();

  // Multiplayer
  const { createRoom, joinRandom, loading } = useRoom();

  const handleSoloStart = () => {
    start();
    navigate("/quiz");
  };

  const handlePrivateRoom = async () => {
    try {
      const roomId = await createRoom({ username, avatar });
      navigate(`/room/${roomId}`);
    } catch (err) {
      alert("Impossible de créer la salle : " + err);
    }
  };

  const handleRandomRoom = async () => {
    try {
      const roomId = await joinRandom({ username, avatar });
      navigate(`/room/${roomId}`);
    } catch (err) {
      alert("Impossible de rejoindre : " + err);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 gap-4">
      <div className="w-full max-w-md flex flex-col gap-4 font-roboto-mono">
        <p className="text-xs">
          Socket: {socket.connected ? "connected" : "disconnected"}
        </p>

        {/* ── Player setup ───────────────────────────────────────────── */}
        <div className="rounded-2xl border-2 border-yale-blue p-6 flex flex-col gap-5 items-center">
          <AvatarPicker />
          <UsernameInput />
        </div>

        {/* ── Solo settings ──────────────────────────────────────────── */}
        <div className="rounded-2xl border-2 border-yale-blue p-6 flex flex-col gap-5">
          <div>
            <div className="flex justify-between text-sm text-yale-blue mb-2">
              <span>Questions</span>
              <span className="font-semibold">{numQuestions}</span>
            </div>
            <input
              type="range" min="5" max="20" value={numQuestions}
              onChange={(e) => handleNumQuestionsChange(e.target.value)}
              className="slider w-full"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm text-yale-blue mb-2">
              <span>Temps</span>
              <span className="font-semibold">{numSeconds}s</span>
            </div>
            <input
              type="range" min="10" max="120" value={numSeconds}
              onChange={(e) => handleNumSecondsChange(e.target.value)}
              className="slider w-full"
            />
          </div>
          <Button onClick={handleSoloStart} disabled={!isReady} className="w-full">
            🎮 Solo — Commencer
          </Button>
        </div>

        {/* ── Multiplayer ────────────────────────────────────────────── */}
        <div className="rounded-2xl border-2 border-spicy-orange p-6 flex flex-col gap-3">
          <p className="font-roboto-mono text-xs tracking-widest text-spicy-orange/70 uppercase">
            Multijoueur
          </p>
          <Button
            onClick={handlePrivateRoom}
            disabled={!isReady || loading}
            variant="primary"
            className="w-full"
          >
            {loading ? "Création…" : "🔒 Partie privée"}
          </Button>
          <Button
            onClick={handleRandomRoom}
            disabled={!isReady || loading}
            variant="secondary"
            className="w-full"
          >
            {loading ? "Recherche…" : "🎲 Partie aléatoire"}
          </Button>
        </div>

      </div>
    </div>
  );
}