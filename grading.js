const GRADES = [
  { min: 0, max: 15, emoji: '😊' },
  { min: 16, max: 50, emoji: '🙂' },
  { min: 51, max: 120, emoji: '😐' },
  { min: 121, max: 250, emoji: '😠' },
  { min: 251, max: 500, emoji: '😡' },
  { min: 501, max: Number.POSITIVE_INFINITY, emoji: '💀' },
];

function score(files) {
  const changes = files.reduce((sum, f) => sum + f.changes, 0);
  const exts = new Set(files.map((f) => f.filename.split('.').at(-1))).size;
  return Math.round(changes / 20 + files.length * 2 + exts * 4);
}

function emoji(score) {
  return GRADES.find((g) => score >= g.min && score <= g.max).emoji;
}

function stripEmoji(title) {
  const pattern = GRADES.map((g) =>
    g.emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  ).join('|');
  return title.replace(new RegExp(`^(${pattern})\\s*`), '').trim();
}

export { GRADES, score, emoji, stripEmoji };
