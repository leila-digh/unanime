import { IoIosListBox } from "react-icons/io";

export function Instructions() {
  return (
    <div className="rules-section">
      <div className="card-header">
        <IoIosListBox className="w-6 h-6 text-dark-blue" />
        <h1>How to Play</h1>
      </div>
      <ol className="list-decimal pl-6">
        <li>Enter words that fit the prompt</li>
        <li>Object to words that don’t belong</li>
        <li>Unchallenged words earn points</li>
        <li>Highest score wins</li>
      </ol>
    </div>
  );
}