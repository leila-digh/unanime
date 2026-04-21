class Player {
  constructor(socketId, username, avatar) {
    this.socketId = socketId;
    this.username = username || `Guest_${socketId.slice(0, 5)}`;
    this.avatar = avatar || "🙂";
    this.score = 0;
  }

  addScore(points) {
    this.score += points;
  }

  resetScore() {
    this.score = 0;
  }

  // Plain object safe to send over the socket
  toJSON() {
    return {
      socketId: this.socketId,
      username: this.username,
      avatar: this.avatar,
      score: this.score,
    };
  }
}

module.exports = Player;