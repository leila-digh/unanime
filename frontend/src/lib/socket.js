import { io } from "socket.io-client";

// The URL comes from your .env file:
//   VITE_SOCKET_URL=http://localhost:3001   (development)
//   VITE_SOCKET_URL=https://your-app.railway.app  (production)
const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: false, // we connect manually when the user enters a room
});