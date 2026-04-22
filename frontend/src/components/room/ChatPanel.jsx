import { useState, useEffect, useRef } from "react";

export default function ChatPanel({ messages, onSend }) {
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <p className="font-roboto-mono text-xs tracking-widest text-yale-blue/40 uppercase mb-2">
        Chat
      </p>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1 min-h-0">
        {messages.length === 0 && (
          <p className="text-yale-blue/30 text-xs italic">Aucun message…</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="text-sm leading-snug">
            <span className="mr-1">{m.avatar}</span>
            <span className="font-semibold text-yale-blue/70">{m.username}: </span>
            <span className="text-yale-blue">{m.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-2 pt-2 border-t border-yale-blue/10">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          maxLength={200}
          placeholder="Message…"
          className="flex-1 bg-transparent border-b border-yale-blue/20 focus:border-spicy-orange outline-none py-1 px-1 font-roboto-mono text-sm text-yale-blue placeholder:text-yale-blue/25 transition-colors"
        />
        <button
          onClick={handleSend}
          className="font-roboto-mono text-xs text-spicy-orange hover:text-dark-wine transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}