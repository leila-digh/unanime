// Shows every player in the room.
// Rendered in join order (server sends them that way — don't re-sort here).

export default function PlayersPanel({ players, hostId, activePlayerId, mySocketId }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-roboto-mono text-xs tracking-widest text-yale-blue/40 uppercase mb-2">
        Joueurs
      </p>
      {players.map((p) => {
        const isMe     = p.socketId === mySocketId;
        const isHost   = p.socketId === hostId;
        const isActive = p.socketId === activePlayerId;

        return (
          <div
            key={p.socketId}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
              ${isActive ? "bg-spicy-orange/10 border border-spicy-orange/30" : "border border-transparent"}
            `}
          >
            <span className="text-lg leading-none">{p.avatar}</span>
            <span className={`flex-1 font-roboto-mono ${isMe ? "font-bold" : ""}`}>
              {p.username}
              {isMe && <span className="text-yale-blue/40 font-normal"> (toi)</span>}
            </span>
            {isHost   && <span className="text-xs bg-yale-blue text-ivory px-1.5 py-0.5 rounded">host</span>}
            {isActive && <span className="text-xs bg-spicy-orange text-ivory px-1.5 py-0.5 rounded">tour</span>}
            <span className="font-roboto-mono text-xs text-yale-blue/50 min-w-[32px] text-right">
              {p.score}pt
            </span>
          </div>
        );
      })}
    </div>
  );
}