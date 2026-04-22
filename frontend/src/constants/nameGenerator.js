const adjectives = [
  "Swift", "Brave", "Mighty", "Clever", "Sneaky",
  "Crazy", "Wild", "Epic", "Silly", "Lucky",
  "Fierce", "Calm", "Silent", "Loud", "Shadowy",
  "Golden", "Crimson", "Frozen", "Electric", "Blazing",
  "Cosmic", "Mystic", "Ancient", "Nimble", "Bold",
  "Savage", "Radiant", "Hidden", "Restless", "Witty",
  "Chaotic", "Jolly", "Grim", "Vivid", "Glitched"
];

const nouns = [
  "Lion", "Tiger", "Eagle", "Dragon", "Wizard",
  "Ninja", "Pirate", "Samurai", "Bear", "Fox",
  "Wolf", "Panther", "Hawk", "Shark", "Viper",
  "Phoenix", "Golem", "Knight", "Archer", "Monk",
  "Ranger", "Sorcerer", "Gladiator", "Nomad", "Hunter",
  "Rogue", "Oracle", "Specter", "Titan", "Wanderer",
  "Machine", "Comet", "Storm", "Blade", "Cipher"
];

const EMOJIS = ["😀","😄","😁","😆","😅","😂","🙂","🙃","😉","😊",
  "😎","😍","🤩","🤖","👻","🐶","🐱","🦊","🐸","🐵",
  "🦁","🐼","🐧","🐙","🌈","🔥","⭐","⚡"];

export function getRandomEmoji() {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

export function generateName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
}
