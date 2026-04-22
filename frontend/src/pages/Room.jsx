import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { socket } from "@lib/socket";
import useRoom from "@hooks/useRoom";
import { usePlayer } from "@context/PlayerContext";
import PlayersPanel from "@components/room/PlayersPanel";
import ChatPanel from "@components/room/ChatPanel";
import ShareLink from "@components/room/ShareLink";
import RoomQuiz from "@components/room/RoomQuiz";

// Room.jsx is the multiplayer page, mounted at /room/:id
// It handles two cases:
//   A) Creator — they just made the room on Home.jsx, socket is already connected
//   B) Joiner  — they arrived via a shared link, need to join now

export default function Room() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { username, avatar } = usePlayer();
  const {
    room, players, hostId, activePlayerId, quiz,
    messages, loading, error,
    amHost, amActiveTurn,
    joinRoom, leaveRoom, sendMessage,
  } = useRoom();

  const joined = useRef(false);

  useEffect(() => {
    if (joined.current) return;
    joined.current = true;

    // If socket already has a room (creator path), nothing to do —
    // the room:update listener in useRoom will keep state fresh.
    // If no room yet (joiner path), emit room:join now.
    if (!room) {
      joinRoom({ roomId, username, avatar }).catch(() => {
        alert("Salle introuvable.");
        navigate("/");
      });
    }
  }, []);

  const handleLeave = () => {
    leaveRoom();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] font-roboto-mono text-yale-blue/50">
        Connexion…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="font-roboto-mono text-spicy-orange">{error}</p>
        <button onClick={() => navigate("/")} className="underline text-sm">
          Retour
        </button>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto w-full p-4 min-h-[80vh]">

      {/* ── Left sidebar ─────────────────────────────────────────────── */}
      <aside className="w-full md:w-64 flex flex-col gap-4 shrink-0">
        <PlayersPanel
          players={players}
          hostId={hostId}
          activePlayerId={activePlayerId}
          mySocketId={socket.id}
        />

        {/* Share link only for private rooms */}
        {room.private && <ShareLink roomId={roomId} />}

        {/* Chat takes up remaining space */}
        <div className="flex-1 border border-yale-blue/15 rounded-xl p-4 flex flex-col min-h-[260px]">
          <ChatPanel messages={messages} onSend={sendMessage} />
        </div>

        <button
          onClick={handleLeave}
          className="font-roboto-mono text-xs text-yale-blue/30 hover:text-spicy-orange transition-colors text-left"
        >
          ← Quitter la salle
        </button>
      </aside>

      {/* ── Main quiz area ────────────────────────────────────────────── */}
      <main className="flex-1 border-2 border-yale-blue rounded-2xl p-6">
        <RoomQuiz
          quiz={quiz}
          roomId={roomId}
          amHost={amHost}
          amActiveTurn={amActiveTurn}
          activePlayerId={activePlayerId}
          players={players}
          mySocketId={socket.id}
        />
      </main>

    </div>
  );
}