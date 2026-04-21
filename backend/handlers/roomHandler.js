const shortId = require("shortid");
const Room   = require("../models/Room");
const Player = require("../models/Player");

module.exports = function roomHandler(io, socket, rooms) {

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function findRoom(roomId) {
    return rooms[roomId] ?? null;
  }

  function broadcast(room) {
    io.to(room.roomId).emit("room:update", room.toSnapshot());
  }

  // ── room:create ──────────────────────────────────────────────────────────────

  socket.on("room:create", ({ username, avatar, private: isPrivate } = {}, cb) => {
    const roomId = shortId.generate();
    const room   = new Room(roomId, !!isPrivate);
    const player = new Player(socket.id, username, avatar);

    room.addPlayer(player);
    rooms[roomId] = room;

    socket.join(roomId);

    const snap = room.toSnapshot();
    if (cb) cb(null, roomId, snap);
    broadcast(room);

    console.log(`[room:create] ${roomId} by ${username}`);
  });

  // ── room:join ────────────────────────────────────────────────────────────────
  // Used when arriving via shared link (/room/:id)

  socket.on("room:join", ({ roomId, username, avatar } = {}, cb) => {
    const room = findRoom(roomId);
    if (!room) {
      if (cb) cb("Room not found");
      return;
    }

    // Already in room (e.g. creator navigating back) — just re-sync
    if (room.players[socket.id]) {
      socket.join(roomId);
      if (cb) cb(null, roomId, room.toSnapshot());
      return;
    }

    const player = new Player(socket.id, username, avatar);
    room.addPlayer(player);
    socket.join(roomId);

    const snap = room.toSnapshot();
    if (cb) cb(null, roomId, snap);
    broadcast(room);

    console.log(`[room:join] ${username} joined ${roomId}`);
  });

  // ── room:join-random ─────────────────────────────────────────────────────────

  socket.on("room:join-random", ({ username, avatar } = {}, cb) => {
    // Find an open public lobby
    let room = Object.values(rooms).find(
      (r) => !r.private &&
             Object.keys(r.players).length < 8 &&
             r.quiz.status === "lobby"
    );

    if (!room) {
      const roomId = shortId.generate();
      room = new Room(roomId, false);
      rooms[roomId] = room;
    }

    const player = new Player(socket.id, username, avatar);
    room.addPlayer(player);
    socket.join(room.roomId);

    const snap = room.toSnapshot();
    if (cb) cb(null, room.roomId, snap);
    broadcast(room);

    console.log(`[room:join-random] ${username} -> ${room.roomId}`);
  });

  // ── room:sync ────────────────────────────────────────────────────────────────
  // Called by creator after React navigation (they're already in the room
  // on the server but need to re-join the socket.io channel after remount)

  socket.on("room:sync", ({ roomId } = {}, cb) => {
    const room = findRoom(roomId);
    if (!room) {
      if (cb) cb("Room not found");
      return;
    }
    socket.join(roomId);
    if (cb) cb(null, room.toSnapshot());
  });

  // ── disconnect ───────────────────────────────────────────────────────────────

  socket.on("disconnect", () => {
    Object.values(rooms).forEach((room) => {
      if (!room.players[socket.id]) return;

      const isEmpty = room.removePlayer(socket.id);
      if (isEmpty) {
        delete rooms[room.roomId];
        console.log(`[disconnect] Room ${room.roomId} deleted (empty)`);
      } else {
        broadcast(room);
        console.log(`[disconnect] ${socket.id} left ${room.roomId}`);
      }
    });
  });

  // ── chat:send ────────────────────────────────────────────────────────────────

  socket.on("chat:send", ({ roomId, text } = {}) => {
    const room = findRoom(roomId);
    if (!room) return;
    const player = room.getPlayer(socket.id);
    if (!player) return;

    const message = {
      id:        shortId.generate(),
      username:  player.username,
      avatar:    player.avatar,
      text:      String(text).slice(0, 200),
      timestamp: Date.now(),
    };
    room.addMessage(message);
    io.to(roomId).emit("chat:message", message);
  });
};