import { usePlayer } from "@context/PlayerContext";
import { generateName } from "@constants/nameGenerator";
import { FiRefreshCcw } from "react-icons/fi";

export default function UsernameInput() {
  const { username, setUsername } = usePlayer();

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="username"
        className="font-roboto-mono text-xs tracking-widest text-yale-blue/50 uppercase"
      >
        {/* Nom */}
      </label>
      <div className="flex items-center gap-2">
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
          placeholder="ton nom…"
          className="
            flex-1 bg-transparent border-2 border-yale-blue/30
            rounded-sm
            focus:border-spicy-orange outline-none
            py-2 px-2 font-roboto-mono text-base text-yale-blue
            placeholder:text-yale-blue/25 transition-colors
            text-center
          "
        />
        <button
          type="button"
          onClick={() => setUsername(generateName())}
          title="Nom aléatoire"
          className="text-yale-blue/40 hover:text-spicy-orange transition-colors text-lg leading-none pb-1 cursor-pointer"
        >
          <FiRefreshCcw/>
        </button>
      </div>
    </div>
  );
}