module.exports = function quizHandler(io, socket, rooms) {

  function findRoom(roomId) {
    return rooms[roomId] ?? null;
  }

  function broadcast(room) {
    io.to(room.roomId).emit("room:update", room.toSnapshot());
  }

  function isHost(room) {
    return room.hostId === socket.id;
  }

  // ── quiz:start ───────────────────────────────────────────────────────────────

  socket.on("quiz:start", ({ roomId, numQuestions, numSeconds } = {}) => {
    const room = findRoom(roomId);
    if (!room || !isHost(room)) return;

    room.quiz.setNumQuestions(numQuestions || 5);
    room.quiz.setNumSeconds(numSeconds || 30);
    room.quiz.start();
    room.resetTurn();

    broadcast(room);
    console.log(`[quiz:start] ${roomId} — ${numQuestions}q ${numSeconds}s`);
  });

  // ── quiz:next ────────────────────────────────────────────────────────────────
  // Only the active player can advance.

  socket.on("quiz:next", ({ roomId } = {}) => {
    const room = findRoom(roomId);
    if (!room) return;
    if (socket.id !== room.getActivePlayerId()) return;

    const wasRevealing = room.quiz.status === "revealing";
    room.quiz.next();

    // If we just moved from revealing -> answering, rotate to next player
    if (wasRevealing && room.quiz.status === "answering") {
      room.advanceTurn();
    }

    broadcast(room);
  });

  // ── quiz:restart ─────────────────────────────────────────────────────────────

  socket.on("quiz:restart", ({ roomId } = {}) => {
    const room = findRoom(roomId);
    if (!room || !isHost(room)) return;

    room.quiz.restart();
    room.resetTurn();

    // Reset all scores
    Object.values(room.players).forEach((p) => p.resetScore());

    broadcast(room);
    console.log(`[quiz:restart] ${roomId}`);
  });
};