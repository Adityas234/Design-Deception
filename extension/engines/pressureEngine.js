const urgencyWords = [
  "act now",
  "limited",
  "only",
  "hurry",
  "last chance"
];

function runPressureEngine(banner) {

  if (!banner) {
    return {
      active: false,
      score: 0,
      confidence: 0,
      evidence: {}
    };
  }

  const text = banner.innerText.toLowerCase();

  const matches = urgencyWords.filter(w => text.includes(w));

  let score = matches.length > 0 ? 0.6 : 0;

  return {
    active: score > 0.5,
    score,
    confidence: score,
    evidence: {
      matches
    }
  };
}
