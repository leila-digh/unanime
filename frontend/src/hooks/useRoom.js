import { useState, useEffect, useCallback } from "react";
import { socket } from "@lib/socket";

// useRoom handles everything about the multiplayer room:
//   - connecting/disconnecting the socket
//   - joining or creating a room
//   - keeping the room snapshot (players, host, turn, quiz state) fresh
//   - sending/receiving chat messages

export default function useRoom() {
  const [room, setRoom]       = useState(null);   // the full snapshot from the server
  const [messages, setMessages] = useState([]);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  // Derived helpers so components don't need to dig into the snapshot
  const players        = room?.players        ?? [];
  const hostId         = room?.hostId         ?? null;
  const activePlayerId = room?.activePlayerId ?? null;
  const quiz           = room?.quiz           ?? null;
  const roomId         = room?.roomId         ?? null;

  // ── Socket listeners ────────────────────────────────────────────────────────
  // These run once on mount and clean up on unmount.
  // Every time the server calls broadcast(room), we get "room:update"
  // with the entire room snapshot — we just set it and re-render.

  useEffect(() => {
    function onRoomUpdate(snapshot) {
      setRoom(snapshot);
      setLoading(false);
    }

    function onChatMessage(msg) {
      setMessages((prev) => [...prev, msg]);
    }

    function onConnect() {
      console.log("[socket] connected", socket.id);
    }

    function onDisconnect() {
      console.log("[socket] disconnected");
      setRoom(null);
    }

    socket.on("connect",      onConnect);
    socket.on("disconnect",   onDisconnect);
    socket.on("room:update",  onRoomUpdate);
    socket.on("chat:message", onChatMessage);

    return () => {
      socket.off("connect",      onConnect);
      socket.off("disconnect",   onDisconnect);
      socket.off("room:update",  onRoomUpdate);
      socket.off("chat:message", onChatMessage);
    };
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────────

  // createRoom — called from the Home page "Private Game" button
  const createRoom = useCallback(({ username, avatar }) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setError(null);
      socket.connect();
      socket.emit(
        "room:create",
        { username, avatar, private: true },
        (err, newRoomId, snapshot) => {
          if (err) {
            setError(err);
            setLoading(false);
            reject(err);
          } else {
            setRoom(snapshot);
            setLoading(false);
            resolve(newRoomId);
          }
        }
      );
    });
  }, []);

  // joinRoom — called when arriving at /room/:id via shared link
  const joinRoom = useCallback(({ roomId, username, avatar }) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setError(null);
      socket.connect();
      socket.emit(
        "room:join",
        { roomId, username, avatar },
        (err, confirmedRoomId, snapshot) => {
          if (err) {
            setError(err);
            setLoading(false);
            reject(err);
          } else {
            setRoom(snapshot);
            setLoading(false);
            resolve(confirmedRoomId);
          }
        }
      );
    });
  }, []);

  // joinRandom — "Random Game" button
  const joinRandom = useCallback(({ username, avatar }) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setError(null);
      socket.connect();
      socket.emit(
        "room:join-random",
        { username, avatar },
        (err, newRoomId, snapshot) => {
          if (err) {
            setError(err);
            setLoading(false);
            reject(err);
          } else {
            setRoom(snapshot);
            setLoading(false);
            resolve(newRoomId);
          }
        }
      );
    });
  }, []);

  // leave — disconnect cleanly
  const leaveRoom = useCallback(() => {
    socket.disconnect();
    setRoom(null);
    setMessages([]);
  }, []);

  // sendMessage — chat
  const sendMessage = useCallback((text) => {
    if (!roomId || !text.trim()) return;
    socket.emit("chat:send", { roomId, text });
  }, [roomId]);

  // ── Convenience booleans ─────────────────────────────────────────────────────

  const amHost        = socket.id === hostId;
  const amActiveTurn  = socket.id === activePlayerId;

  return {
    // state
    room, roomId, players, hostId, activePlayerId, quiz,
    messages, error, loading,
    // booleans
    amHost, amActiveTurn,
    // actions
    createRoom, joinRoom, joinRandom, leaveRoom, sendMessage,
  };
}