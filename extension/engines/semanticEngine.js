const directWords = [
  "accept", "agree", "allow", "continue", "subscribe"
];

const indirectWords = [
  "manage", "settings", "preferences", "learn", "customize"
];

function classify(text) {
  text = text.toLowerCase();

  if (directWords.some(w => text.includes(w))) return "direct";
  if (indirectWords.some(w => text.includes(w))) return "indirect";

  return "unknown";
}

function runSemanticEngine(acceptBtn, rejectBtn) {

  if (!acceptBtn || !rejectBtn) {
    return {
      active: false,
      score: 0,
      confidence: 0,
      evidence: {}
    };
  }

  const acceptType = classify(acceptBtn.innerText || acceptBtn.value);
  const rejectType = classify(rejectBtn.innerText || rejectBtn.value);

  let score = 0;

  if (acceptType === "direct" && rejectType === "indirect") {
    score = 0.8;
  }

  return {
    active: score > 0.5,
    score,
    confidence: score,
    evidence: {
      acceptType,
      rejectType
    }
  };
}
