const Quiz = require("./Quiz");

class Room {
  constructor(roomId, isPrivate = false) {
    this.roomId      = roomId;
    this.private     = isPrivate;
    this.hostId      = null;        // first player; passes on disconnect
    this.playerOrder = [];          // stable insertion-order array of socketIds
    this.players     = {};          // socketId -> Player instance
    this.messages    = [];
    this.quiz        = new Quiz();
  }

  // ── Players ──────────────────────────────────────────────────────────────────

  addPlayer(player) {
    this.players[player.socketId] = player;
    if (!this.playerOrder.includes(player.socketId)) {
      this.playerOrder.push(player.socketId);
    }
    // First player becomes host
    if (!this.hostId) this.hostId = player.socketId;
  }

  removePlayer(socketId) {
    delete this.players[socketId];
    this.playerOrder = this.playerOrder.filter((id) => id !== socketId);

    // Pass host to next in line
    if (this.hostId === socketId) {
      this.hostId = this.playerOrder[0] ?? null;
    }

    // Keep turn index in bounds
    const count = this.playerOrder.length;
    if (count > 0) {
      this.quiz.currentTurnIndex =
        (this.quiz.currentTurnIndex || 0) % count;
    }

    return this.playerOrder.length === 0; // returns true if room is now empty
  }

  getPlayer(socketId) {
    return this.players[socketId] ?? null;
  }

  // Players in stable join order — what gets sent to the client
  getPlayerList() {
    return this.playerOrder.map((id) => this.players[id]?.toJSON()).filter(Boolean);
  }

  // ── Turn ─────────────────────────────────────────────────────────────────────

  getActivePlayerId() {
    if (!this.playerOrder.length) return null;
    const idx = (this.currentTurnIndex || 0) % this.playerOrder.length;
    return this.playerOrder[idx];
  }

  advanceTurn() {
    const count = this.playerOrder.length;
    if (count === 0) return;
    this.currentTurnIndex = ((this.currentTurnIndex || 0) + 1) % count;
  }

  resetTurn() {
    this.currentTurnIndex = 0;
  }

  // ── Chat ─────────────────────────────────────────────────────────────────────

  addMessage(message) {
    this.messages.push(message);
  }

  // ── Serialise ────────────────────────────────────────────────────────────────
  // This is the full snapshot sent to all clients on every state change.

  toSnapshot() {
    return {
      roomId:          this.roomId,
      private:         this.private,
      hostId:          this.hostId,
      players:         this.getPlayerList(),
      activePlayerId:  this.getActivePlayerId(),
      quiz:            this.quiz.toJSON(),
    };
  }
}

module.exports = Room;