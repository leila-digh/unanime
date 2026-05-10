import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

// Debug logging - you can remove this later
console.log("=== Socket Configuration ===");
console.log("URL:", URL);
console.log("VITE_SOCKET_URL:", import.meta.env.VITE_SOCKET_URL);
console.log("MODE:", import.meta.env.MODE);
console.log("===========================");

export const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: false,
});

// Add connection event listeners
socket.on("connect", () => {
  console.log("✅ Socket connected!");
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error.message);
  console.error("Full error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Socket disconnected:", reason);
});