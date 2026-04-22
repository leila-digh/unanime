import { useState } from "react";

// Shows the room code + a copy button.
// Only shown in private rooms (host decides when to share).

export default function ShareLink({ roomId }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Copy the full URL so the friend can just paste it in the browser
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="font-roboto-mono text-xs tracking-widest text-yale-blue/40 uppercase">
        Inviter des amis
      </p>
      <div className="flex items-center gap-2 border border-yale-blue/20 rounded px-3 py-2">
        <span className="font-roboto-mono text-sm text-yale-blue/60 flex-1 truncate">
          {roomId}
        </span>
        <button
          onClick={handleCopy}
          className="font-roboto-mono text-xs text-spicy-orange hover:text-dark-wine transition-colors shrink-0"
        >
          {copied ? "✓ Copié !" : "Copier"}
        </button>
      </div>
    </div>
  );
}