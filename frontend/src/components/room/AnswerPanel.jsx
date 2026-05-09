import { useState, useRef, useEffect } from "react";
import { socket } from "@lib/socket";
import Button from "@components/ui/Button";

// AnswerPanel has two modes depending on whose turn it is:
//
//   My turn    → I see input fields to type answers, then submit
//   Their turn → I see the submitted answers and can object to one
//
// After the active player finalizes, everyone sees the result.

export default function AnswerPanel({ roomId, amActiveTurn, quiz, players, mySocketId }) {
  const turn = quiz?.turn;
  const [tags, setTags]       = useState([]);
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);

  // Reset inputs when a new answering phase starts
  useEffect(() => {
    if (quiz?.status === "answering") {
      setTags([]);
      setInputVal("");
      if (amActiveTurn) inputRef.current?.focus();
    }
  }, [quiz?.status, quiz?.currentIndex]);

  // ── Active player: typing phase ───────────────────────────────────────────

  if (quiz?.status === "answering" && amActiveTurn) {
    const addTag = () => {
      const t = inputVal.trim();
      if (!t || tags.length >= 5 || tags.find((x) => x.text === t)) return;
      setTags((prev) => [...prev, { id: Date.now(), text: t }]);
      setInputVal("");
      inputRef.current?.focus();
    };

    const removeTag = (id) => setTags((prev) => prev.filter((x) => x.id !== id));

    const handleSubmit = () => {
      if (!tags.length) return;
      socket.emit("answers:submit", { roomId, answers: tags.map((t) => t.text) });
    };

    return (
      <div className="flex flex-col gap-4">
        <p className="font-roboto-mono text-xs tracking-widest text-yale-blue/50 uppercase">
          Tes réponses (max 5) — appuie sur Entrée pour ajouter
        </p>

        {/* Tag display */}
        <div className="flex flex-wrap gap-2 border-2 border-yale-blue/20 rounded-lg p-3 min-h-[56px]">
          {!tags.length && <span className="text-yale-blue/30 text-sm">tes réponses apparaîtront ici…</span>}
          {tags.map((tag) => (
            <span key={tag.id} className="flex items-center gap-1 bg-yale-blue text-ivory px-3 py-1 rounded-full text-sm">
              {tag.text}
              <button onClick={() => removeTag(tag.id)} className="text-ivory/60 hover:text-ivory ml-1">×</button>
            </span>
          ))}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          placeholder="tapez puis appuyez sur Entrée…"
          maxLength={80}
          className="bg-transparent border-b-2 border-yale-blue/30 focus:border-spicy-orange outline-none py-2 px-1 font-roboto-mono text-base text-yale-blue placeholder:text-yale-blue/25 transition-colors"
        />

        <Button onClick={handleSubmit} disabled={!tags.length} className="self-end">
          Soumettre →
        </Button>
      </div>
    );
  }

  // ── Non-active player: waiting ────────────────────────────────────────────

  if (quiz?.status === "answering" && !amActiveTurn) {
    const activeName = players.find((p) => p.socketId === quiz?.activePlayerId)?.username ?? "…";
    return (
      <p className="font-roboto-mono text-sm text-yale-blue/50 italic">
        ⏳ En attente des réponses de {activeName}…
      </p>
    );
  }

  // ── Revealing phase: show answers + objection buttons ─────────────────────

  if (quiz?.status === "revealing" && turn) {
    const myObjIndex  = turn.objections?.[mySocketId];
    // const hasObjected = myObjIndex !== undefined;

    const handleObject = (answerIndex, isObjectingThis) => {
      socket.emit("answers:objection:set", {
        roomId,
        answerIndex,
        action: isObjectingThis ? "remove" : "add",
      });
    };

    const handleFinalize = () => {
      socket.emit("answers:finalize", { roomId });
    };

    const objCount = Object.keys(turn.objections ?? {}).length;
    const points   = Math.max(0, turn.answers.length - objCount);
    

    return (
      <div className="flex flex-col gap-4">
        <p className="font-roboto-mono text-xs tracking-widest text-yale-blue/50 uppercase">
          {amActiveTurn ? "Tes réponses — les autres peuvent objecter" : "Objecter à une réponse ?"}
        </p>

        <ul className="flex flex-col gap-2">
          {turn.answers.map((ans, i) => {
            const objCountForThis = Object.values(turn.objections ?? {}).filter((v) => v === i).length;
            const isObjectingThis = myObjIndex === i;

            return (
              <li
                key={i}
                className={`flex items-center gap-3 px-4 py-2 border rounded-lg
                  ${isObjectingThis ? "border-spicy-orange bg-spicy-orange/5" : "border-yale-blue/15"}`}
              >
                <span className="flex-1 text-sm text-yale-blue">{ans}</span>
                {objCountForThis > 0 && (
                  <span className="font-roboto-mono text-xs text-spicy-orange">✕{objCountForThis}</span>
                )}
                {/* Object button — only for non-active players who haven't objected yet */}
                {!amActiveTurn && (
                  
                  <button
                    onClick={() => handleObject(i, isObjectingThis)}
                    className={`font-roboto-mono text-xs border px-2 py-0.5 rounded transition-colors
    ${
      isObjectingThis
        ? "border-spicy-orange bg-spicy-orange text-ivory"
        : "border-spicy-orange text-spicy-orange hover:bg-spicy-orange hover:text-ivory"
    }`}
                  >
                     {isObjectingThis ? "Annuler" : "Objecter"}
                  </button>
                )}
                {isObjectingThis && (
                  <span className="font-roboto-mono text-xs text-spicy-orange/60 italic">objecté</span>
                )}
              </li>
            );
          })}
        </ul>

        {/* Score preview */}
        <p className="font-roboto-mono text-xs text-yale-blue/40">
          {objCount} objection{objCount !== 1 ? "s" : ""} → <strong className="text-yale-blue">{points} pt{points !== 1 ? "s" : ""}</strong>
        </p>

        {/* Active player closes the window */}
        {amActiveTurn && turn.answersSubmitted &&  (
          <Button onClick={handleFinalize} className="self-end">
            Valider & scorer →
          </Button>
        )}

        {!amActiveTurn && (
          <p className="font-roboto-mono text-xs text-yale-blue/40 italic">
            ✓ Objection envoyée — en attente de la validation…
          </p>
        )}
      </div>
    );
  }

  return null;
}