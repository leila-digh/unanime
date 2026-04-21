// import { useState, useRef, useEffect } from "react";
// import Button from "@components/ui/Button";

// /**
//  * AnswerInput
//  *
//  * Shown during the "answering" phase.
//  * Player types up to 5 answers and submits.
//  *
//  * Props:
//  *   onSubmit(answers: string[]) — called with the array of filled answers
//  *   currentIndex — used to reset the fields on new question
//  */
// export default function AnswerInput({ onSubmit, currentIndex }) {
//   const [values, setValues] = useState(["", "", "", "", ""]);
//   const firstRef = useRef(null);

//   // Reset fields when question changes
//   useEffect(() => {
//     setValues(["", "", "", "", ""]);
//     firstRef.current?.focus();
//   }, [currentIndex]);

//   const handleChange = (i, val) => {
//     setValues((prev) => {
//       const next = [...prev];
//       next[i] = val;
//       return next;
//     });
//   };

//   const handleKeyDown = (e, i) => {
//     // Enter on a field jumps to the next, or submits on the last
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const nextInput = document.getElementById(`answer-${i + 1}`);
//       if (nextInput) {
//         nextInput.focus();
//       } else {
//         handleSubmit();
//       }
//     }
//   };

//   const handleSubmit = () => {
//     const filled = values.filter((v) => v.trim());
//     if (!filled.length) return;
//     onSubmit(values);
//   };

//   const hasAny = values.some((v) => v.trim());

//   return (
//     <div className="animate-slide-up flex flex-col gap-3">
//       <p className="font-mono text-xs text-yale-blue/50 tracking-widest uppercase">
//         vos réponses (jusqu'à 5)
//       </p>

//       <div className="flex flex-col gap-2">
//         {values.map((val, i) => (
//           <div key={i} className="flex items-center gap-3">
//             <span className="font-mono text-sm text-yale-blue/40 w-4 shrink-0 text-right">
//               {i + 1}
//             </span>
//             <input
//               id={`answer-${i}`}
//               ref={i === 0 ? firstRef : null}
//               type="text"
//               value={val}
//               onChange={(e) => handleChange(i, e.target.value)}
//               onKeyDown={(e) => handleKeyDown(e, i)}
//               maxLength={80}
//               placeholder={i === 0 ? "première réponse…" : ""}
//               className="flex-1 bg-transparent border-b-2 border-yale-blue/30 focus:border-spicy-orange outline-none py-2 px-1 font-noto-sans text-base text-yale-blue placeholder:text-yale-blue/25 transition-colors"
//             />
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-end pt-2">
//         <Button onClick={handleSubmit} disabled={!hasAny}>
//           Soumettre →
//         </Button>
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";
import Button from "@components/ui/Button";

export default function AnswerInput({ onSubmit, currentIndex }) {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setTags([]);
    setInputValue("");
    inputRef.current?.focus();
  }, [currentIndex]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const trimmed = inputValue.trim();
      if (!trimmed) return;
      if (tags.length >= 5) return;
      if (tags.includes(trimmed)) return; // basic duplicate guard

      setTags((prev) => [...prev, { id: Date.now(), text: trimmed }]);
      setInputValue("");
    }
  };

  const removeTag = (id) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    if (!tags.length) return;
    onSubmit(tags.map(t => t.text));
  };

  return (
    <div className="animate-slide-up flex flex-col gap-4">
      <p className="font-mono text-xs text-yale-blue/50 tracking-widest uppercase">
        vos réponses (max 5)
      </p>

      {/* TAG DISPLAY BOX */}
      <div className="flex flex-wrap gap-2 border-2 border-yale-blue/30 rounded p-3 min-h-[60px]">
        {tags.length === 0 && (
          <span className="text-yale-blue/30 text-sm">
            réponses apparaîtront ici…
          </span>
        )}

        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-2 bg-yale-blue text-white px-3 py-1 rounded-full text-sm"
          >
            <span>{tag.text}</span>
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="text-white/70 hover:text-white"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* INPUT FIELD (SEPARATE) */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="tapez puis appuyez sur entrée…"
        className="w-full bg-transparent border-b-2 border-yale-blue/30 focus:border-spicy-orange outline-none py-2 px-1 font-noto-sans text-base text-yale-blue placeholder:text-yale-blue/25 transition-colors"
      />

      <div className="flex justify-end pt-2">
        <Button onClick={handleSubmit} disabled={!tags.length}>
          Soumettre →
        </Button>
      </div>
    </div>
  );
}