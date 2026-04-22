import { createContext, useContext, useState } from "react";
import { generateName, getRandomEmoji } from "@constants/nameGenerator";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [username, setUsername] = useState(() => generateName());
  const [avatar, setAvatar] = useState(() =>  getRandomEmoji());
  // useState("🙂");

  const isReady = username.trim().length > 0;

  return (
    <PlayerContext.Provider value={{ username, setUsername, avatar, setAvatar, isReady }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}