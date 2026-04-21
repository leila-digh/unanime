const allQuestions = require("../data/questions.json");

const STATUS = {
  LOBBY:     "lobby",      // waiting to start
  ANSWERING: "answering",  // active player is typing
  REVEALING: "revealing",  // answers submitted, others can object
  FINISHED:  "finished",
};

class Quiz {
  constructor(numQuestions = 5, numSeconds = 30) {
    this.numQuestions = numQuestions;
    this.numSeconds   = numSeconds;
    this.status       = STATUS.LOBBY;
    this.currentIndex = 0;
    this.questions    = [];

    // Turn state — resets each question
    this.turn = {
      answers:          [],   // strings submitted by active player
      objections:       {},   // socketId -> answerIndex
      answersSubmitted: false,
    };
  }

  // ── Setup ───────────────────────────────────────────────────────────────────

  setNumQuestions(n) { this.numQuestions = n; }
  setNumSeconds(s)   { this.numSeconds   = s; }

  // ── Start ───────────────────────────────────────────────────────────────────

  start() {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    this.questions    = shuffled.slice(0, this.numQuestions);
    this.currentIndex = 0;
    this.status       = STATUS.ANSWERING;
    this._resetTurn();
  }

  // ── Advance ─────────────────────────────────────────────────────────────────
  // Returns true if there is a next question, false if the quiz is done.

  next() {
    if (this.status === STATUS.ANSWERING) {
      // Move to reveal phase for this question
      this.status = STATUS.REVEALING;
      return true;
    }

    if (this.status === STATUS.REVEALING) {
      if (this.currentIndex + 1 < this.questions.length) {
        this.currentIndex += 1;
        this.status = STATUS.ANSWERING;
        this._resetTurn();
        return true;
      } else {
        this.status = STATUS.FINISHED;
        return false;
      }
    }

    return false;
  }

  // ── Reset ───────────────────────────────────────────────────────────────────

  restart() {
    this.status       = STATUS.LOBBY;
    this.currentIndex = 0;
    this.questions    = [];
    this._resetTurn();
  }

  // ── Turn helpers ─────────────────────────────────────────────────────────────

  submitAnswers(answers) {
    this.turn.answers          = answers.map((a) => a.trim()).filter(Boolean).slice(0, 5);
    this.turn.objections       = {};
    this.turn.answersSubmitted = true;
    this.status                = STATUS.REVEALING;
  }

  addObjection(socketId, answerIndex) {
    // One objection per person, only during REVEALING
    if (this.status !== STATUS.REVEALING) return false;
    if (this.turn.objections[socketId] !== undefined) return false;
    this.turn.objections[socketId] = answerIndex;
    return true;
  }

  // Returns points awarded
  finalizeObjections(activePlayerId) {
    const objCount = Object.keys(this.turn.objections).length;
    const points   = Math.max(0, 5 - objCount);
    this.turn.answersSubmitted = false; // close window, keep answers visible
    return points;
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex] ?? null;
  }

  // ── Serialise ────────────────────────────────────────────────────────────────

  toJSON() {
    return {
      status:          this.status,
      currentIndex:    this.currentIndex,
      numQuestions:    this.numQuestions,
      numSeconds:      this.numSeconds,
      questions:       this.questions,
      currentQuestion: this.getCurrentQuestion(),
      turn:            { ...this.turn },
    };
  }

  // ── Private ──────────────────────────────────────────────────────────────────

  _resetTurn() {
    this.turn = { answers: [], objections: {}, answersSubmitted: false };
  }
}

Quiz.STATUS = STATUS;
module.exports = Quiz;