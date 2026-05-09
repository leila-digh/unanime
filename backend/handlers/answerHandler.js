module.exports = function answerHandler(io, socket, rooms) {

  function findRoom(roomId) {
    return rooms[roomId] ?? null;
  }

  function broadcast(room) {
    io.to(room.roomId).emit("room:update", room.toSnapshot());
  }

  // ── answers:submit ───────────────────────────────────────────────────────────
  // Only the active player can submit.

  socket.on("answers:submit", ({ roomId, answers } = {}) => {
    const room = findRoom(roomId);
    if (!room) return;
    if (socket.id !== room.getActivePlayerId()) return;
    if (!Array.isArray(answers)) return;

    room.quiz.submitAnswers(answers);
    broadcast(room);

    console.log(`[answers:submit] ${socket.id} submitted ${answers.length} answers in ${roomId}`);
  });

  // ── answers:object ───────────────────────────────────────────────────────────
  // Any non-active player can object to one answer.

  socket.on("answers:objection:set", ({ roomId, answerIndex, action } = {}) => {
    const room = findRoom(roomId);
    if (!room) return;
    if (socket.id === room.getActivePlayerId()) return; // can't object to own answers

    const ok = room.quiz.setObjection(socket.id, answerIndex, action);
    if (ok) broadcast(room);
  });

  // ── answers:finalize ─────────────────────────────────────────────────────────
  // Active player closes the objection window — scores are applied.

  socket.on("answers:finalize", ({ roomId } = {}) => {
    const room = findRoom(roomId);
    if (!room) return;

    const activeId = room.getActivePlayerId();
    if (socket.id !== activeId) return;
    if (!room.quiz.turn.answersSubmitted) return;

    const points       = room.quiz.finalizeObjections();
    const activePlayer = room.getPlayer(activeId);
    if (activePlayer) activePlayer.addScore(points);

    broadcast(room);

    // Also emit a dedicated event so the UI can show a "scored!" banner
    io.to(roomId).emit("answers:scored", {
      playerId:    activeId,
      points,
      objections:  Object.keys(room.quiz.turn.objections).length,
    });

    console.log(`[answers:finalize] ${activeId} scored ${points}pt in ${roomId}`);
  });
};