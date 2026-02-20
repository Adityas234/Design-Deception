function runEffortEngine(banner) {

  if (!banner) {
    return {
      active: false,
      score: 0,
      confidence: 0,
      evidence: {}
    };
  }

  const buttons = banner.querySelectorAll("button, a");

  let acceptSteps = 1;
  let rejectSteps = 1;

  buttons.forEach(btn => {

    const text = btn.innerText.toLowerCase();

    if (/manage|settings|preferences/.test(text)) {
      rejectSteps += 1;
    }

    if (/accept|agree|allow/.test(text)) {
      acceptSteps = 1;
    }
  });

  const effortGap = rejectSteps - acceptSteps;

  let score = effortGap > 0 ? 0.7 : 0;

  return {
    active: score > 0.5,
    score,
    confidence: score,
    evidence: {
      acceptSteps,
      rejectSteps,
      effortGap
    }
  };
}