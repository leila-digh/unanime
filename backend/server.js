const express     = require("express");
const http        = require("http");
const { Server }  = require("socket.io");
const roomHandler   = require("./handlers/roomHandler");
const quizHandler   = require("./handlers/quizHandler");
const answerHandler = require("./handlers/answerHandler");

const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  transports: ["websocket"],    // skip long-polling — required for Railway
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// In-memory room store — plain object, roomId -> Room instance
const rooms = {};

// ── Socket connection ─────────────────────────────────────────────────────────

io.on("connection", (socket) => {
  console.log(`[connect] ${socket.id}`);

  // Each handler registers its own socket.on() listeners
  roomHandler(io, socket, rooms);
  quizHandler(io, socket, rooms);
  answerHandler(io, socket, rooms);

  socket.on("disconnect", () => {
    console.log(`[disconnect] ${socket.id}`);
  });
});

// ── Health check ──────────────────────────────────────────────────────────────

app.get("/health", (req, res) => res.json({ ok: true, rooms: Object.keys(rooms).length }));

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Unanime backend running on http://localhost:${PORT}`);
});