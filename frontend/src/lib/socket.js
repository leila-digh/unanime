import { io } from "socket.io-client";

// Use VITE_API_URL instead of VITE_SOCKET_URL
const URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: false, // we connect manually when the user enters a room
});